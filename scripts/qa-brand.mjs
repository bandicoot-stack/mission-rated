import { existsSync, readFileSync, readdirSync } from 'node:fs';

const errors=[];
const requireFile=(path)=>{if(!existsSync(path))errors.push(`missing ${path}`)};
const read=(path)=>existsSync(path)?readFileSync(path,'utf8'):'';
const requireTokens=(text,tokens,label)=>{for(const token of tokens)if(!text.includes(token))errors.push(`${label} missing ${token}`)};
const operationalSurfaces=new Set(['mission-control.html']);

for(const path of ['assets/mission-rated-logo.svg','brand.js','dist/assets/mission-rated-logo.svg','dist/brand.js'])requireFile(path);

const brand=read('brand.js');
requireTokens(brand,['/assets/mission-rated-logo.svg','Mission Rated home','data-mr-brand-logo','.brand'],'brand.js');

if(existsSync('dist')){
  for(const file of readdirSync('dist').filter(name=>name.endsWith('.html')).sort()){
    const html=read(`dist/${file}`);
    if(operationalSurfaces.has(file)){
      if(html.includes('/brand.js'))errors.push(`dist/${file} must not load /brand.js`);
      continue;
    }
    if(!html.includes('/brand.js'))errors.push(`dist/${file} missing /brand.js`);
  }
}

if(errors.length){
  console.error('Mission Rated brand QA failed:');
  for(const error of [...new Set(errors)].sort())console.error(` - ${error}`);
  process.exit(1);
}

console.log('Mission Rated brand QA passed: canonical logo, automatic built asset, shared renderer, consumer-page wiring, and founder-surface isolation verified.');
