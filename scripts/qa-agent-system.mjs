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
const statuses=new Set(['not_started','in_progress','blocked','review','done','ongoing']);
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