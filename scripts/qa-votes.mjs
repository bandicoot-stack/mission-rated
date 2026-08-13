import { existsSync, readFileSync } from 'node:fs';
const read=p=>existsSync(p)?readFileSync(p,'utf8'):'';
const errors=[];
const need=(text,tokens,label)=>{for(const token of tokens)if(!text.includes(token))errors.push(`${label} missing ${token}`)};
const quick=read('quick-vote.js');
const neighborhood=read('neighborhood-votes.js');
const auto=read('auto-votes.js');
need(quick,['quick-rank-vote','public-quick-rank-votes','mr_vote_','business|school|installation','Community signal only','aria-pressed','▲','▼'],'quick-vote.js');
need(neighborhood,['public-neighborhoods','quick-rank-vote','public-quick-rank-votes','neighborhood','Community signal only','aria-pressed','▲','▼'],'neighborhood-votes.js');
need(auto,['quick-rank-vote','public-quick-rank-votes','dealer','salesperson','Community signal only','aria-pressed','▲','▼'],'auto-votes.js');
for(const page of ['index.html','military-value.html','schools.html','bases.html','business.html','school.html','installation.html']){
  const built=read(`dist/${page}`);
  if(!built)errors.push(`missing dist/${page}`);
  else if(!built.includes('/quick-vote.js')&&!built.includes('src="quick-vote.js"'))errors.push(`dist/${page} missing quick-vote.js`);
}
{
  const built=read('dist/neighborhoods.html');
  if(!built)errors.push('missing dist/neighborhoods.html');
  else if(!built.includes('/neighborhood-votes.js')&&!built.includes('src="neighborhood-votes.js"'))errors.push('dist/neighborhoods.html missing neighborhood-votes.js');
}
for(const page of ['buy-a-car.html','auto.html']){
  const built=read(`dist/${page}`);
  if(!built)errors.push(`missing dist/${page}`);
  else if(!built.includes('/auto-votes.js')&&!built.includes('src="auto-votes.js"'))errors.push(`dist/${page} missing auto-votes.js`);
}
if(errors.length){console.error('Mission Rated vote QA failed:');for(const e of errors)console.error(` - ${e}`);process.exit(1)}
console.log('Mission Rated vote QA passed: business, school, installation, neighborhood, dealer and salesperson voting surfaces are protected.');
