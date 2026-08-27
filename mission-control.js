(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const fmtDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(undefined, {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    }).format(date);
  };

  const fetchJson = async (path) => {
    const response = await fetch(`${path}?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${path} returned ${response.status}`);
    return response.json();
  };

  const load = async () => {
    $('errorBox').innerHTML = '';
    $('refreshButton').disabled = true;
    $('refreshButton').textContent = 'Refreshing…';

    try {
      const [registry, state, queue, release] = await Promise.all([
        fetchJson('/agent-system/registry.json'),
        fetchJson('/agent-system/state.json'),
        fetchJson('/agent-system/work-queue.json'),
        fetchJson('/release.json')
      ]);

      renderState(state);
      renderAgents(registry, queue);
      renderQueue(queue);
      renderMetrics(registry, queue);
      renderDecisions(state);
      renderFounderInbox(queue);
      renderBusinessCockpit(queue, release);
      renderSystemHealth(release);
    } catch (error) {
      console.error('[mission-control] load failed', error);
      $('errorBox').innerHTML = `<div class="error"><strong>Dashboard data could not load.</strong> ${esc(error.message)}. The page is intact; retry once the repo-backed JSON files are reachable.</div>`;
    } finally {
      $('refreshButton').disabled = false;
      $('refreshButton').textContent = 'Refresh';
    }
  };

  const renderState = (state) => {
    $('currentFocus').textContent = state.current_focus || 'No current focus recorded.';
    $('nextAction').textContent = state.operator_next_action || 'No operator next action recorded.';
    $('stateUpdated').textContent = `State updated ${fmtDate(state.updated_at)}`;
    $('activeChange').textContent = state.active_change ? `Active change: ${state.active_change}` : 'No active change';
  };

  const renderAgents = (registry, queue) => {
    const items = Array.isArray(queue.items) ? queue.items : [];
    const roles = Array.isArray(registry.roles) ? registry.roles : [];

    $('agentGrid').innerHTML = roles.map((role) => {
      const assigned = items.filter((item) => item.owner_role === role.id && ['in_progress', 'ongoing', 'blocked', 'review'].includes(item.status));
      const active = assigned.length > 0;
      const primary = assigned[0];
      const assignment = primary
        ? `<div class="work-next"><strong>Current:</strong> ${esc(primary.title)}<br><strong>Next:</strong> ${esc(primary.next_action || 'No next action recorded.')}</div>`
        : '<div class="work-next">No active assignment. Available for bounded work.</div>';
      return `
        <article class="agent-card">
          <div class="agent-top">
            <div>
              <div class="agent-name">${esc(role.name)}</div>
              <div class="agent-role">${esc(role.id)}</div>
            </div>
            <span class="agent-state ${active ? 'active' : ''}">${active ? `${assigned.length} active` : 'standing by'}</span>
          </div>
          ${assignment}
          <div class="owns">${(role.owns || []).slice(0, 4).map((capability) => `<span class="tag">${esc(capability)}</span>`).join('')}</div>
        </article>`;
    }).join('');
  };

  const renderQueue = (queue) => {
    const items = Array.isArray(queue.items) ? queue.items : [];
    $('queueUpdated').textContent = `Updated ${fmtDate(queue.updated_at)}`;

    if (!items.length) {
      $('workQueue').innerHTML = '<div class="work-item"><div class="work-title">Queue is clear.</div><div class="work-next">No durable work items are recorded.</div></div>';
      return;
    }

    const rank = { blocked: 0, review: 1, in_progress: 2, ongoing: 3, ready: 4, queued: 5, done: 6 };
    const sorted = [...items].sort((a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9));
    $('workQueue').innerHTML = sorted.map((item) => `
      <article class="work-item">
        <div class="work-top">
          <div>
            <div class="work-id">${esc(item.id)}</div>
            <div class="work-title">${esc(item.title)}</div>
          </div>
          <span class="badge ${esc(item.status)}">${esc(String(item.status || '').replaceAll('_', ' '))}</span>
        </div>
        <div class="work-owner">Owner: <strong>${esc(item.owner_role)}</strong> · updated ${esc(fmtDate(item.updated_at))}</div>
        <div class="work-next">Next: ${esc(item.next_action || 'No next action recorded.')}</div>
        ${item.approval_gate ? `<div class="gate">⚠ Founder gate: ${esc(item.approval_gate)}</div>` : ''}
      </article>`).join('');
  };

  const renderMetrics = (registry, queue) => {
    const roles = Array.isArray(registry.roles) ? registry.roles : [];
    const items = Array.isArray(queue.items) ? queue.items : [];
    const active = items.filter((item) => ['in_progress', 'ongoing', 'review'].includes(item.status));
    const blocked = items.filter((item) => item.status === 'blocked');
    const gates = items.filter((item) => item.approval_gate && item.status !== 'done');

    $('agentCount').textContent = roles.length;
    $('activeWorkCount').textContent = active.length;
    $('blockedCount').textContent = blocked.length;
    $('attentionCount').textContent = gates.length + blocked.filter((item) => !item.approval_gate).length;
  };

  const renderFounderInbox = (queue) => {
    const items = Array.isArray(queue.items) ? queue.items : [];
    const attention = items.filter((item) => item.status !== 'done' && (item.approval_gate || item.status === 'blocked'));
    let section = document.getElementById('founderInbox');
    if (!section) {
      section = document.createElement('section');
      section.id = 'founderInbox';
      section.className = 'panel section';
      const execution = document.getElementById('workQueue')?.closest('.panel.section');
      execution?.after(section);
    }
    section.innerHTML = `
      <div class="section-head">
        <div><div class="section-kicker">Founder inbox</div><h2 class="section-title">What needs you</h2><p>Only decisions or blockers that should not be silently auto-resolved.</p></div>
        <span class="pill">${attention.length} item${attention.length === 1 ? '' : 's'}</span>
      </div>
      <div class="queue">${attention.length ? attention.map((item) => `
        <article class="work-item">
          <div class="work-id">${esc(item.id)}</div>
          <div class="work-title">${esc(item.title)}</div>
          <div class="work-owner">Owner: <strong>${esc(item.owner_role)}</strong> · ${esc(item.status)}</div>
          <div class="work-next">${esc(item.next_action || 'No next action recorded.')}</div>
          ${item.approval_gate ? `<div class="gate">Decision boundary: ${esc(item.approval_gate)}</div>` : '<div class="gate">Blocked: operator recovery required.</div>'}
        </article>`).join('') : '<div class="work-item"><div class="work-title">Nothing needs founder action.</div><div class="work-next">Agents can continue within their current approval boundaries.</div></div>'}</div>`;
  };

  const renderBusinessCockpit = (queue, release) => {
    const cards = [...document.querySelectorAll('.business-card')];
    const byTitle = (title) => cards.find((card) => card.querySelector('strong')?.textContent?.trim() === title);
    const partnerItems = (queue.items || []).filter((item) => item.owner_role === 'partner' && item.status !== 'done');
    const releaseSha = String(release.git_sha || 'unknown');

    const savings = byTitle('Deals & savings');
    if (savings) savings.querySelector('span').innerHTML = '<strong style="font-size:13px">Policy ready</strong> · verified-dollar ledger is the next data source. No estimated savings are being presented as realized savings.';

    const audience = byTitle('Audience');
    if (audience) audience.querySelector('span').innerHTML = '<strong style="font-size:13px">Instrumented</strong> · page views, return visits, referrals, deal clicks, and Weekend Brief attempt/confirmed events exist. Rollup endpoint is next.';

    const partners = byTitle('Partners');
    if (partners) partners.querySelector('span').innerHTML = `<strong style="font-size:13px">${partnerItems.length} active workstream${partnerItems.length === 1 ? '' : 's'}</strong> · outreach queue is represented now; Gmail reply telemetry remains private until connector-backed auth is added.`;

    const health = byTitle('Release health');
    if (health) health.querySelector('span').innerHTML = `<strong style="font-size:13px">${esc(release.source || 'build')}</strong> · ${esc(releaseSha.slice(0, 8))} · built ${esc(fmtDate(release.generated_at))}`;
  };

  const renderSystemHealth = (release) => {
    const systems = [...document.querySelectorAll('.system')];
    const byName = (name) => systems.find((row) => row.querySelector('.system-name')?.textContent?.trim() === name);
    const set = (name, note, status) => {
      const row = byName(name); if (!row) return;
      const noteEl = row.querySelector('.system-note');
      const statusEl = row.querySelector('.system-status');
      if (noteEl) noteEl.textContent = note;
      if (statusEl) statusEl.textContent = status;
    };
    set('GitHub', 'repo state · work queue · durable decisions', 'repo-backed');
    set('Vercel', `release ${String(release.git_sha || '').slice(0, 8)} · ${fmtDate(release.generated_at)}`, release.source === 'vercel-git' ? 'deployed' : 'build-known');
    set('Gmail', 'outreach · replies · drafts', 'auth next');
    set('Automations', 'scheduled routines · recurring checks', 'auth next');
  };

  const renderDecisions = (state) => {
    const decisions = Array.isArray(state.recent_settled_decisions) ? state.recent_settled_decisions : [];
    $('decisionList').innerHTML = decisions.length
      ? decisions.map((decision) => `<div class="decision">${esc(decision)}</div>`).join('')
      : '<div class="decision">No settled decisions recorded in the current checkpoint.</div>';
  };

  $('refreshButton').addEventListener('click', load);
  load();
})();
