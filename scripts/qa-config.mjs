import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { SUPABASE_PROJECT_URL, SUPABASE_FUNCTIONS_BASE, SUPABASE_FUNCTIONS_ROOT } from '../lib/config.js';

const HOST='vquwdypidgjmxnhhdbol.supabase.co';
const ROOT=process.cwd();
const SKIP=new Set(['.git','dist','node_modules']);
const offenders=[];

async function walk(dir){
  for(const entry of await readdir(dir,{withFileTypes:true})){
    if(SKIP.has(entry.name))continue;
    const path=join(dir,entry.name);
    if(entry.isDirectory())await walk(path);
    else if(entry.isFile()&&entry.name.endsWith('.js')){
      const rel=relative(ROOT,path).replaceAll('\\','/');
      if(rel==='lib/config.js')continue;
      const source=await readFile(path,'utf8');
      if(source.includes(HOST))offenders.push(rel);
    }
  }
}

await walk(ROOT);

if(SUPABASE_PROJECT_URL!==`https://${HOST}`)throw new Error('Supabase project URL changed unexpectedly.');
if(SUPABASE_FUNCTIONS_BASE!==`https://${HOST}/functions/v1`)throw new Error('Supabase function base changed unexpectedly.');
if(SUPABASE_FUNCTIONS_ROOT!==`https://${HOST}/functions/v1/`)throw new Error('Supabase function root changed unexpectedly.');
if(offenders.length)throw new Error(`Hardcoded Supabase hostname remains outside lib/config.js: ${offenders.join(', ')}`);

console.log('Supabase config centralization QA passed.');
