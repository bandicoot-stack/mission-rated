import { createClient } from 'npm:@supabase/supabase-js@2.95.0'
import { corsHeaders } from 'npm:@supabase/supabase-js@2.95.0/cors'
const headers={...corsHeaders,'Content-Type':'application/json','Cache-Control':'public, max-age=60, s-maxage=300, stale-while-revalidate=86400'}
let cache:string|null=null
const https=(v:unknown)=>/^https:\/\//i.test(String(v||''))
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS') return new Response('ok',{headers:corsHeaders})
 if(req.method!=='GET') return new Response(JSON.stringify({error:'method_not_allowed'}),{status:405,headers})
 try{
  const secrets=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');const secret=secrets.default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');if(!secret)throw new Error('missing_secret')
  const s=createClient(Deno.env.get('SUPABASE_URL')!,secret,{auth:{persistSession:false}})
  const {data,error}=await s.from('installation_signals').select('installation_id,signal_key,signal_label,numeric_value,unit,source_name,source_type,source_url,sample_size,observed_at,confidence').eq('source_type','public_review').not('numeric_value','is',null).order('observed_at',{ascending:false})
  if(error)throw error
  const valid=(data||[]).filter(x=>Number.isFinite(Number(x.numeric_value))&&https(x.source_url)&&Number(x.sample_size)>0)
  const by=new Map<string,any[]>();for(const x of valid){const a=by.get(x.installation_id)||[];a.push(x);by.set(x.installation_id,a)}
  const shape=(x:any)=>({rating:Number(x.numeric_value),scale:5,label:x.signal_label,source_name:x.source_name,source_url:x.source_url,sample_size:Number(x.sample_size),observed_at:x.observed_at,confidence:Number(x.confidence)||null})
  const installations=[...by.entries()].map(([installation_id,signals])=>{const ranked=[...signals].sort((a,b)=>(Number(b.confidence)||0)-(Number(a.confidence)||0)||(Number(b.sample_size)||0)-(Number(a.sample_size)||0));return {installation_id,public_ratings:signals.map(shape),best_public_rating:ranked[0]?shape(ranked[0]):null}})
  cache=JSON.stringify({installations,meta:{generated_at:new Date().toISOString(),count:installations.length,validation:'https_source_and_positive_sample_required'}})
  return new Response(cache,{headers})
 }catch(e){console.error('public-installation-ratings',e);if(cache)return new Response(cache,{headers});return new Response(JSON.stringify({installations:[],meta:{degraded:true}}),{status:200,headers})}
})