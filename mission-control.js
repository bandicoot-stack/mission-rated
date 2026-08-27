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
      const [registry, state, queue] = await Promise.all([
        fetchJson('/agent-system/registry.json'),
        fetchJson('/agent-system/state.json'),
        fetchJson('/agent-system/work-queue.json')
      ]);

      renderState(state);
      renderAgents(registry, queue);
      renderQueue(queue);
      renderMetrics(registry, queue);
      renderDecisions(state);
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
      const assigned = items.filter((item) => item.owner_role === role.id && ['in_progress', 'ongoing', 'blocked'].includes(item.status));
      const active = assigned.length > 0;
      return `
        <article class="agent-card">
          <div class="agent-top">
            <div>
              <div class="agent-name">${esc(role.name)}</div>
              <div class="agent-role">${esc(role.id)}</div>
            </div>
            <span class="agent-state ${active ? 'active' : ''}">${active ? `${assigned.length} active` : 'standing by'}</span>
          </div>
          <div class="owns">${(role.owns || []).slice(0, 5).map((capability) => `<span class="tag">${esc(capability)}</span>`).join('')}</div>
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

    const rank = { blocked: 0, in_progress: 1, ongoing: 2, ready: 3, queued: 4, done: 5 };
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
    const active = items.filter((item) => ['in_progress', 'ongoing'].includes(item.status));
    const blocked = items.filter((item) => item.status === 'blocked');
    const gates = items.filter((item) => item.approval_gate && item.status !== 'done');

    $('agentCount').textContent = roles.length;
    $('activeWorkCount').textContent = active.length;
    $('blockedCount').textContent = blocked.length;
    $('attentionCount').textContent = gates.length;
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
