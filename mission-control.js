(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const fmtDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(date);
  };
  const ageLabel = (value) => {
    const ts = new Date(value).getTime(); if (!ts) return '—';
    const mins = Math.max(0, Math.round((Date.now()-ts)/60000));
    if (mins < 60) return `${mins}m`;
    const hrs = Math.round(mins/60); if (hrs < 48) return `${hrs}h`;
    return `${Math.round(hrs/24)}d`;
  };
  const fetchJson = async (path) => {
    const r = await fetch(`${path}?t=${Date.now()}`,{cache:'no-store'});
    if (!r.ok) throw new Error(`${path} returned ${r.status}`);
    return r.json();
  };
  const activeStatuses = new Set(['in_progress','ongoing','review']);
  const attentionItems = (queue) => (queue.items||[]).filter(i=>i.status!=='done'&&(i.approval_gate||i.status==='blocked'));

  async function load(){
    $('errorBox').innerHTML=''; $('refreshButton').disabled=true; $('refreshButton').textContent='Refreshing…';
    try{
      const [registry,state,queue,release]=await Promise.all([
        fetchJson('/agent-system/registry.json'),fetchJson('/agent-system/state.json'),fetchJson('/agent-system/work-queue.json'),fetchJson('/release.json')
      ]);
      renderState(state,release); renderMetrics(registry,queue,release); renderInbox(queue); renderQueue(queue); renderAgents(registry,queue); renderCockpit(queue,release); renderSystems(release); renderDecisions(state);
    }catch(error){
      console.error('[mission-control] load failed',error);
      $('errorBox').innerHTML=`<div class="error"><strong>Dashboard data could not load.</strong> ${esc(error.message)}.</div>`;
    }finally{$('refreshButton').disabled=false;$('refreshButton').textContent='Refresh';}
  }

  function renderState(state,release){
    $('currentFocus').textContent=state.current_focus||'No current focus recorded.';
    $('nextAction').textContent=state.operator_next_action||'No operator next action recorded.';
    $('stateUpdated').textContent=`State ${fmtDate(state.updated_at)}`;
    $('activeChange').textContent=state.active_change?`Change: ${state.active_change}`:'No active change';
    $('releasePill').textContent=`Release ${String(release.git_sha||'unknown').slice(0,8)}`;
  }

  function renderMetrics(registry,queue,release){
    const items=queue.items||[]; const roles=registry.roles||[];
    const active=items.filter(i=>activeStatuses.has(i.status)); const blocked=items.filter(i=>i.status==='blocked');
    const engaged=new Set(items.filter(i=>activeStatuses.has(i.status)||i.status==='blocked').map(i=>i.owner_role));
    $('activeWorkCount').textContent=active.length; $('blockedCount').textContent=blocked.length; $('engagedAgentCount').textContent=engaged.size; $('agentCount').textContent=roles.length; $('attentionCount').textContent=attentionItems(queue).length; $('releaseAge').textContent=ageLabel(release.generated_at);
  }

  function renderInbox(queue){
    const attention=attentionItems(queue); $('inboxCount').textContent=`${attention.length} item${attention.length===1?'':'s'}`;
    $('inboxList').innerHTML=attention.length?attention.map(i=>`<article class="inbox-item"><div class="work-top"><div><div class="work-id">${esc(i.id)}</div><div class="work-title">${esc(i.title)}</div></div><span class="badge ${esc(i.status)}">${esc(i.status.replaceAll('_',' '))}</span></div><div class="work-meta">Owner <strong>${esc(i.owner_role)}</strong></div><div class="work-next">${esc(i.next_action||'No next action recorded.')}</div><div class="gate">${i.approval_gate?`Decision boundary: ${esc(i.approval_gate)}`:'Blocked: operator recovery required.'}</div></article>`).join(''):'<div class="inbox-item" style="border-left-color:var(--green)"><div class="work-title">Nothing needs founder action.</div><div class="work-next">Agents can continue inside their existing boundaries.</div></div>';
  }

  function renderQueue(queue){
    const rank={blocked:0,review:1,in_progress:2,ongoing:3,not_started:4,done:5};
    const items=[...(queue.items||[])].sort((a,b)=>(rank[a.status]??9)-(rank[b.status]??9));
    $('queueUpdated').textContent=`Updated ${fmtDate(queue.updated_at)}`;
    $('workQueue').innerHTML=items.length?items.map(i=>`<article class="work-item"><div class="work-top"><div><div class="work-id">${esc(i.id)}</div><div class="work-title">${esc(i.title)}</div></div><span class="badge ${esc(i.status)}">${esc(i.status.replaceAll('_',' '))}</span></div><div class="work-meta">Owner <strong>${esc(i.owner_role)}</strong> · ${esc(fmtDate(i.updated_at))}</div><div class="work-next"><strong>Next:</strong> ${esc(i.next_action||'No next action recorded.')}</div>${i.approval_gate?`<div class="gate">⚠ ${esc(i.approval_gate)}</div>`:''}</article>`).join(''):'<div class="work-item"><div class="work-title">Queue clear.</div></div>';
  }

  function renderAgents(registry,queue){
    const items=queue.items||[];
    $('agentGrid').innerHTML=(registry.roles||[]).map(role=>{
      const assigned=items.filter(i=>i.owner_role===role.id&&(activeStatuses.has(i.status)||i.status==='blocked'));
      const primary=assigned[0];
      return `<article class="agent-card"><div class="agent-top"><div><div class="agent-name">${esc(role.name)}</div><div class="agent-role">${esc(role.id)}</div></div><span class="agent-state ${assigned.length?'active':''}">${assigned.length?`${assigned.length} engaged`:'standing by'}</span></div><div class="work-next">${primary?`<strong>${esc(primary.title)}</strong><br>${esc(primary.next_action||'No next action recorded.')}`:'Available for bounded work.'}</div><div class="tags">${(role.owns||[]).slice(0,4).map(c=>`<span class="tag">${esc(c)}</span>`).join('')}</div></article>`;
    }).join('');
  }

  function renderCockpit(queue,release){
    const partner=(queue.items||[]).filter(i=>i.owner_role==='partner'&&i.status!=='done');
    $('savingsValue').textContent='Not posted'; $('savingsNote').textContent='Ledger policy is ready; display stays blank until documented-dollar records are connected.';
    $('audienceValue').textContent='Instrumented'; $('audienceNote').textContent='Page views, return visits, referrals, deal clicks, and Weekend Brief events exist. Aggregate reporting is the next connection.';
    $('partnerValue').textContent=String(partner.length); $('partnerNote').textContent=`active partner workstream${partner.length===1?'':'s'} represented in the durable queue.`;
    $('releaseValue').textContent=String(release.git_sha||'').slice(0,8)||'unknown'; $('releaseNote').textContent=`${release.source||'build'} · ${fmtDate(release.generated_at)}`;
  }

  function renderSystems(release){
    const set=(name,note,status,good=false)=>{const row=document.querySelector(`[data-system="${name}"]`);if(!row)return;row.querySelector('.system-note').textContent=note;const s=row.querySelector('.system-status');s.textContent=status;s.classList.toggle('good',good);};
    set('GitHub','durable state · work queue · decisions','repo-backed',true);
    set('Vercel',`${String(release.git_sha||'').slice(0,8)} · ${fmtDate(release.generated_at)}`,'release-known',true);
    set('Gmail','outreach · replies · drafts','auth next');
    set('Automations','scheduled routines · recurring checks','auth next');
  }

  function renderDecisions(state){
    const d=state.recent_settled_decisions||[]; $('decisionList').innerHTML=d.length?d.map(x=>`<div class="decision">${esc(x)}</div>`).join(''):'<div class="decision">No settled decisions recorded.</div>';
  }

  $('refreshButton').addEventListener('click',load); load();
})();
