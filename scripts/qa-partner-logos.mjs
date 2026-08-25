import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import vm from 'node:vm';

const errors=[];
const supported=new Set(['.svg','.webp','.png']);
const dataPath='featured-partners.js';

const fail=(message)=>errors.push(message);
const readText=(path)=>existsSync(path)?readFileSync(path,'utf8'):'';

if(!existsSync(dataPath)) fail(`missing ${dataPath}`);
const sandbox={window:{},Object};
try{vm.runInNewContext(readText(dataPath),sandbox,{filename:dataPath});}catch(error){fail(`${dataPath} could not be evaluated: ${error.message}`);}
const partners=sandbox.window.MRFeaturedPartners?.all||[];
if(!partners.length) fail('featured partner data contains no partners');

function validAssetBytes(path,ext){
  const bytes=readFileSync(path);
  if(!bytes.length) return false;
  if(ext==='.webp') return bytes.length>=12&&bytes.subarray(0,4).toString('ascii')==='RIFF'&&bytes.subarray(8,12).toString('ascii')==='WEBP';
  if(ext==='.png') return bytes.length>=8&&bytes.subarray(0,8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]));
  if(ext==='.svg') return bytes.subarray(0,Math.min(bytes.length,2048)).toString('utf8').includes('<svg');
  return false;
}

for(const partner of partners){
  if(!partner.slug) fail('featured partner missing slug');
  if(!partner.name) fail(`${partner.slug||'unknown partner'} missing name`);
  if(!partner.logoAlt||!partner.logoAlt.toLowerCase().includes((partner.name||'').toLowerCase().split(' ')[0])) fail(`${partner.slug||'unknown partner'} missing useful logoAlt`);
  if(!partner.slug||!partner.logo) continue;

  const expectedPrefix=`/assets/partners/${partner.slug}/logo.`;
  if(!partner.logo.startsWith(expectedPrefix)) fail(`${partner.slug} logo is not canonical: ${partner.logo}`);
  const ext=extname(partner.logo).toLowerCase();
  if(!supported.has(ext)) fail(`${partner.slug} uses unsupported logo format ${ext||'(none)'}`);
  const sourcePath=partner.logo.replace(/^\//,'');
  if(!existsSync(sourcePath)) fail(`${partner.slug} logo file missing: ${sourcePath}`);
  else {
    if(statSync(sourcePath).size===0) fail(`${partner.slug} logo is zero bytes: ${sourcePath}`);
    else if(!validAssetBytes(sourcePath,ext)) fail(`${partner.slug} logo has invalid ${ext} bytes: ${sourcePath}`);
  }
  const builtPath=join('dist',sourcePath);
  if(!existsSync(builtPath)) fail(`${partner.slug} logo not published by build: ${builtPath}`);
  else if(statSync(builtPath).size===0||!validAssetBytes(builtPath,ext)) fail(`${partner.slug} built logo is invalid: ${builtPath}`);

  const dir=`assets/partners/${partner.slug}`;
  if(existsSync(dir)){
    const canonicalFiles=readdirSync(dir).filter(file=>file.startsWith('logo.'));
    if(canonicalFiles.length!==1) fail(`${partner.slug} must have exactly one canonical logo file; found ${canonicalFiles.join(', ')||'none'}`);
    for(const file of canonicalFiles){if(!supported.has(extname(file).toLowerCase()))fail(`${partner.slug} contains unsupported canonical logo ${file}`);}
  }
}

if(existsSync('assets')){
  const legacyRootLogos=readdirSync('assets').filter(file=>partners.some(partner=>file.toLowerCase().includes(partner.slug.split('-')[0].toLowerCase()))&&supported.has(extname(file).toLowerCase()));
  if(legacyRootLogos.length) fail(`legacy/conflicting partner logo files must move under assets/partners/<slug>/: ${legacyRootLogos.join(', ')}`);
}

const renderer=readText('partner-logo.js');
for(const token of ['dataset.partnerLogoState','naturalWidth','mr-partner-logo-fallback','object-fit:contain']){
  if(!renderer.includes(token)) fail(`partner-logo.js missing renderer contract: ${token}`);
}

for(const file of ['featured-landing-fix.js','featured.html']){
  const text=readText(file);
  if(!text.includes('MRPartnerLogo')) fail(`${file} does not use shared partner logo renderer`);
  if(!text.includes('MRFeaturedPartners')) fail(`${file} does not use shared featured partner data`);
  for(const legacy of ['yorktowntools.com/Yorktown.PNG','yorktown-patriot-approved.webp','yorktown-patriot-hd.webp','yorktown-primary.webp','yorktown-secondary.webp']){
    if(text.includes(legacy)) fail(`${file} contains legacy hard-coded logo reference: ${legacy}`);
  }
}

if(errors.length){
  console.error('Featured partner logo QA failed:');
  for(const error of [...new Set(errors)].sort()) console.error(` - ${error}`);
  process.exit(1);
}
const assetCount=partners.filter(partner=>partner.logo).length;
const fallbackCount=partners.length-assetCount;
console.log(`Featured partner logo QA passed for ${partners.length} partner(s): ${assetCount} canonical asset(s), ${fallbackCount} accessible fallback(s), valid bytes, shared renderer, and built paths verified.`);
