import { existsSync, readFileSync } from 'node:fs';

const errors=[];
const required=[
  'agent-system/README.md',
  'agent-system/registry.json',
  'agent-system/state.json',
  'agent-system/work-queue.json',
  'agent-system/decisions.md',
  'agent-system/HANDOFF_TEMPLATE.md',
  'agent-system/skills/public-research.md',
  'agent-system/skills/partner-outreach.md',
  'agent-system/skills/featured-partner.md',
  'agent-system/skills/release.md'
];
for(const path of required) if(!existsSync(path)) errors.push(`missing ${path}`);

function json(path){
  try{return JSON.parse(readFileSync(path,'utf8'));}
  catch(error){errors.push(`${path} invalid JSON: ${error.message}`);return null;}
}
const registry=json('agent-system/registry.json');
const state=json('agent-system/state.json');
const queue=json('agent-system/work-queue.json');
const roleIds=new Set((registry?.roles||[]).map(r=>r.id));
for(const id of ['operator','scout','partner','product','builder','qa']) if(!roleIds.has(id)) errors.push(`registry missing role ${id}`);
if(!Array.isArray(registry?.approval_gates)||!registry.approval_gates.length) errors.push('registry missing approval gates');
if(!state?.updated_at||Number.isNaN(Date.parse(state.updated_at))) errors.push('state.updated_at must be ISO-like timestamp');
if(!state?.current_focus||!state?.operator_next_action) errors.push('state missing current focus or next action');
if(state?.reconciliation?.semantics!=='external-state-snapshot') errors.push('state reconciliation must declare external-state-snapshot semantics');
if(state?.reconciliation?.authority!=='observational_only_reread_native_systems_before_material_work') errors.push('state reconciliation must declare native systems authoritative');
if(!state?.reconciliation?.observed_at||Number.isNaN(Date.parse(state.reconciliation.observed_at))) errors.push('state reconciliation observed_at must be ISO-like timestamp');
if(state?.updated_at&&state?.reconciliation?.observed_at&&Date.parse(state.updated_at)<Date.parse(state.reconciliation.observed_at)) errors.push('state.updated_at must not precede reconciliation.observed_at');
for(const [scope,field] of [
  ['github','observed_main_sha'],
  ['github','observed_open_pull_requests'],
  ['github','observed_verified_production_sha'],
  ['vercel','observed_production_state'],
  ['vercel','observed_verified_sha'],
  ['supabase','observed_project_status']
]) if(state?.reconciliation?.[scope]?.[field]===undefined) errors.push(`state reconciliation missing ${scope}.${field}`);
const gitSha=/^[0-9a-f]{40}$/;
for(const field of ['observed_main_sha','observed_verified_production_sha']){
  const value=state?.reconciliation?.github?.[field];
  if(value!==undefined&&!gitSha.test(value)) errors.push(`state reconciliation github.${field} must be a full lowercase 40-character SHA`);
}
const vercelSha=state?.reconciliation?.vercel?.observed_verified_sha;
if(vercelSha!==undefined&&!gitSha.test(vercelSha)) errors.push('state reconciliation vercel.observed_verified_sha must be a full lowercase 40-character SHA');
const openPrs=state?.reconciliation?.github?.observed_open_pull_requests;
if(openPrs!==undefined&&(!Number.isInteger(openPrs)||openPrs<0)) errors.push('state reconciliation github.observed_open_pull_requests must be a non-negative integer');
for(const legacy of ['latest_main_sha','open_pull_requests','latest_verified_production_sha']) if(state?.reconciliation?.github?.[legacy]!==undefined) errors.push(`state reconciliation must not use live-authority field github.${legacy}`);
for(const legacy of ['production_state','latest_verified_sha']) if(state?.reconciliation?.vercel?.[legacy]!==undefined) errors.push(`state reconciliation must not use live-authority field vercel.${legacy}`);
for(const legacy of ['project_status','mission_control_metrics_verify_jwt','mission_control_metrics_version','product_event_verify_jwt','product_event_version']) if(state?.reconciliation?.supabase?.[legacy]!==undefined) errors.push(`state reconciliation must not use live-authority field supabase.${legacy}`);
const statuses=new Set(['not_started','in_progress','blocked','review','done','ongoing','superseded']);
const ids=new Set();
for(const item of queue?.items||[]){
  if(!item.id||ids.has(item.id)) errors.push(`queue invalid/duplicate id ${item.id||'(missing)'}`); else ids.add(item.id);
  if(!statuses.has(item.status)) errors.push(`${item.id} invalid status ${item.status}`);
  if(!roleIds.has(item.owner_role)) errors.push(`${item.id} invalid owner_role ${item.owner_role}`);
  if(!item.created_at||Number.isNaN(Date.parse(item.created_at))) errors.push(`${item.id} invalid created_at`);
  if(!item.updated_at||Number.isNaN(Date.parse(item.updated_at))) errors.push(`${item.id} invalid updated_at`);
  if(!item.next_action) errors.push(`${item.id} missing next_action`);
  if(!Array.isArray(item.evidence)) errors.push(`${item.id} evidence must be array`);
}
const agents=existsSync('AGENTS.md')?readFileSync('AGENTS.md','utf8'):'';
for(const token of ['agent-system/README.md','agent-system/state.json','agent-system/work-queue.json','agent-system/registry.json']) if(!agents.includes(token)) errors.push(`AGENTS.md missing boot reference ${token}`);
if(errors.length){console.error('Agent control-plane QA failed:');for(const error of errors)console.error(` - ${error}`);process.exit(1);}
console.log(`Agent control-plane QA passed: ${roleIds.size} roles, ${(queue?.items||[]).length} queue items, ${required.length} required files.`);