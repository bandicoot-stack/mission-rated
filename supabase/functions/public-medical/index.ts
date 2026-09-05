import { createClient } from 'npm:@supabase/supabase-js@2.95.0'

const cors={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':'public, max-age=60, s-maxage=300, stale-while-revalidate=3600'
}
const host=(u:unknown)=>{try{return /^https:\/\//i.test(String(u||''))?new URL(String(u)).hostname.replace(/^www\./,''):''}catch{return''}}
const firstParty=(website:unknown,source:unknown)=>{const w=host(website),s=host(source);return !!w&&!!s&&(s===w||s.endsWith('.'+w)||w.endsWith('.'+s))}
Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors})
  if(req.method!=='GET')return new Response(JSON.stringify({error:'method_not_allowed'}),{status:405,headers:cors})
  try{
    const secrets=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}')
    const secret=secrets.default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if(!secret)throw new Error('missing_secret')
    const s=createClient(Deno.env.get('SUPABASE_URL')!,secret,{auth:{persistSession:false}})
    const ev=await s.from('business_health_plan_evidence').select('business_id,payer,plan_name,acceptance_status,network_status,source_url,checked_at,notes').ilike('payer','TRICARE').eq('acceptance_status','accepted').order('checked_at',{ascending:false})
    if(ev.error)throw ev.error
    const ids=[...new Set((ev.data||[]).map((x:any)=>x.business_id))]
    if(!ids.length)return new Response(JSON.stringify({providers:[],meta:{generated_at:new Date().toISOString(),tricare_note:'No current source-backed TRICARE acceptance evidence is stored.'}}),{headers:cors})
    const [b,bs,v]=await Promise.all([
      s.from('businesses').select('id,name,category,description,website_url,phone,address_line1,city,state,source_url,source_checked_at').in('id',ids).eq('active',true).order('name'),
      s.from('business_scores').select('business_id,review_count,mission_score').in('business_id',ids),
      s.from('item_verifications').select('target_id,verification_type,status').eq('target_type','business').in('target_id',ids).eq('status','verified')
    ])
    if(b.error)throw b.error
    const scoreBy=new Map((bs.data||[]).map((x:any)=>[x.business_id,x]))
    const verBy=new Map<string,any[]>();for(const x of v.data||[]){const a=verBy.get(x.target_id)||[];a.push(x);verBy.set(x.target_id,a)}
    const newest=new Map<string,any>();for(const x of ev.data||[])if(!newest.has(x.business_id))newest.set(x.business_id,x)
    const providers=(b.data||[]).map((x:any)=>{const e=newest.get(x.id),score=scoreBy.get(x.id),vv=verBy.get(x.id)||[],rated=(score?.review_count||0)>0&&score?.mission_score!=null;return{
      id:x.id,name:x.name,category:x.category||'Medical',city:x.city,state:x.state,address:x.address_line1,phone:x.phone,website_url:x.website_url,source_url:x.source_url,
      services:String(x.description||'').replace(/ with source-backed TRICARE acceptance evidence\.?$/i,'').split(' • ').filter(Boolean),
      tricare_accepted:true,tricare_source_url:e?.source_url||null,tricare_checked_at:e?.checked_at||null,network_status:e?.network_status||null,plan_name:e?.plan_name||null,
      mission_score_status:rated?'rated':'building',mission_score:rated?score.mission_score:null,
      official_verified:firstParty(x.website_url,x.source_url)&&firstParty(x.website_url,e?.source_url),
      user_verified:vv.some((z:any)=>z.verification_type==='community_user')
    }})
    return new Response(JSON.stringify({providers,meta:{generated_at:new Date().toISOString(),tricare_note:'Acceptance does not establish network status for every TRICARE plan. Confirm network status, referrals, and authorization in the official TRICARE directory.'}}),{headers:cors})
  }catch(e){console.error('public-medical',e);return new Response(JSON.stringify({providers:[],meta:{degraded:true}}),{status:503,headers:cors})}
})
