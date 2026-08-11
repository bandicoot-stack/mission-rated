import { createClient } from 'npm:@supabase/supabase-js@2.95.0'
import { corsHeaders } from 'npm:@supabase/supabase-js@2.95.0/cors'
const day=(v:string|null)=>v?new Date(v).toISOString().slice(0,10):null
const hasHttpsSource=(v:unknown)=>typeof v==='string'&&/^https:\/\//i.test(v)
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders})
 const headers={...corsHeaders,'Content-Type':'application/json','Cache-Control':'public, max-age=60'}
 try{
  const secrets=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');const secret=secrets.default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');if(!secret)throw new Error('missing_secret')
  const s=createClient(Deno.env.get('SUPABASE_URL')!,secret,{auth:{persistSession:false}});const nowIso=new Date().toISOString()
  const [b,d,sc,i,ss,isig]=await Promise.all([
   s.from('businesses').select('id,name,category,description,website_url,city,state,veteran_owned,military_spouse_owned,source_url,source_checked_at').eq('active',true).order('name').limit(120),
   s.from('deals').select('id,business_id,title,description,offer_value_text,source_url,verified_at,ends_at,businesses(name,city)').eq('active',true).not('verified_at','is',null).or(`ends_at.is.null,ends_at.gte.${nowIso}`).order('verified_at',{ascending:false}).limit(30),
   s.from('school_districts').select('id,name,locality,official_profile_url,summary,confidence,observed_at').order('name').limit(30),
   s.from('installations').select('id,name,branch,city,state').eq('active',true).order('name').limit(30),
   s.from('school_district_signals').select('school_district_id,signal_key,signal_label,numeric_value,text_value,unit,source_name,source_url,observed_at,confidence').order('observed_at',{ascending:false}),
   s.from('installation_signals').select('installation_id,signal_key,signal_label,numeric_value,text_value,unit,source_name,source_url,source_type,observed_at,confidence').order('observed_at',{ascending:false})])
  for(const x of[b,d,sc,i,ss,isig])if(x.error)throw x.error
  const sb=new Map<string,any[]>();for(const x of ss.data||[]){const a=sb.get(x.school_district_id)||[];a.push(x);sb.set(x.school_district_id,a)}
  const ib=new Map<string,any[]>();for(const x of isig.data||[]){const a=ib.get(x.installation_id)||[];a.push(x);ib.set(x.installation_id,a)}
  const rawDeals=d.data||[];const sourceBackedDeals=rawDeals.filter((x:any)=>hasHttpsSource(x.source_url))
  const activeDealIds=new Set(sourceBackedDeals.map((x:any)=>x.business_id).filter(Boolean))
  const schools=(sc.data||[]).map((x:any)=>{const a=sb.get(x.id)||[],sig=a[0],purple=a.find((y:any)=>/purple/i.test(String(y.signal_key)+' '+String(y.signal_label)));const signalParts=[purple?.text_value,sig&&sig!==purple?sig.text_value:null,sig?.numeric_value!=null?`${sig.numeric_value}${sig.unit?` ${sig.unit}`:''}`:null,x.summary].filter(Boolean);const base={...x,signal_count:a.length,purple_star:purple?{label:purple.signal_label,text:purple.text_value,value:purple.numeric_value,source_name:purple.source_name,source_url:purple.source_url,observed_at:purple.observed_at,confidence:purple.confidence}:null,summary:signalParts.join(' ')};if(!sig)return base;return{...base,latest_signal:{key:sig.signal_key,label:sig.signal_label,value:sig.numeric_value,text:sig.text_value,unit:sig.unit,source_name:sig.source_name,source_url:sig.source_url,observed_at:sig.observed_at,confidence:sig.confidence}}})
  const compact=(x:any)=>x?{key:x.signal_key,label:x.signal_label,value:x.numeric_value,text:x.text_value,unit:x.unit,source_name:x.source_name,source_url:x.source_url,source_type:x.source_type,observed_at:x.observed_at,confidence:x.confidence}:null
  const installations=(i.data||[]).map((x:any)=>{const a=ib.get(x.id)||[],latest=a[0],school=a.find((y:any)=>/school_liaison/i.test(String(y.signal_key))),pcs=a.find((y:any)=>/pcs|relocation/i.test(String(y.signal_key)+' '+String(y.signal_label))),preferred=school||pcs||latest;return{...x,signal_count:a.length,source_url:preferred?.source_url||null,latest_signal:compact(latest),school_liaison:compact(school),pcs_support:compact(pcs)}})
  const deals=sourceBackedDeals.map((x:any)=>({...x,description:[x.description,`Verified ${day(x.verified_at)}.`,x.ends_at?`Listed end date ${day(x.ends_at)}.`:null].filter(Boolean).join(' ')}))
  let suppressedOwnershipClaims=0
  const businesses=(b.data||[]).map((x:any)=>{const hs=hasHttpsSource(x.source_url);const unsupportedOwnership=!hs&&(x.veteran_owned||x.military_spouse_owned);if(unsupportedOwnership)suppressedOwnershipClaims++;return{...x,veteran_owned:hs?x.veteran_owned:false,military_spouse_owned:hs?x.military_spouse_owned:false,has_active_military_offer:activeDealIds.has(x.id),provenance_status:hs?'sourced':'source_pending',source_freshness:hs&&x.source_checked_at?`Source checked ${day(x.source_checked_at)}`:null,description:[x.description,activeDealIds.has(x.id)?'Verified military offer currently tracked in Military Value.':null,hs&&x.source_checked_at?`Source checked ${day(x.source_checked_at)}.`:null].filter(Boolean).join(' ')}});const sourced=businesses.filter((x:any)=>x.provenance_status==='sourced').length
  return new Response(JSON.stringify({businesses,deals,schools,installations,meta:{generated_at:new Date().toISOString(),school_signals:(ss.data||[]).length,installation_signals:(isig.data||[]).length,purple_star_districts:schools.filter((x:any)=>x.purple_star).length,sourced_businesses:sourced,source_pending_businesses:businesses.length-sourced,suppressed_deals_without_https_source:rawDeals.length-sourceBackedDeals.length,suppressed_ownership_claims_without_https_source:suppressedOwnershipClaims}}),{headers})
 }catch(e){console.error('public-explore',e);return new Response(JSON.stringify({businesses:[],deals:[],schools:[],installations:[]}),{status:500,headers})}
})