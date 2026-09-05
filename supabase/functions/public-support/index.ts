import { createClient } from 'npm:@supabase/supabase-js@2.95.0'
import { corsHeaders } from 'npm:@supabase/supabase-js@2.95.0/cors'
const headers={...corsHeaders,'Content-Type':'application/json','Cache-Control':'public, max-age=60, s-maxage=300, stale-while-revalidate=86400'}
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders})
 if(req.method!=='GET')return new Response(JSON.stringify({error:'method_not_allowed'}),{status:405,headers})
 try{
  const secrets=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');const secret=secrets.default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');if(!secret)throw new Error('missing_secret')
  const s=createClient(Deno.env.get('SUPABASE_URL')!,secret,{auth:{persistSession:false}})
  const {data,error}=await s.from('support_resources').select('id,slug,name,provider,resource_type,description,tags,city,state,phone,source_name,source_url,source_type,observed_at').eq('active',true).order('name');if(error)throw error
  const resources=(data||[]).map((x:any)=>({...x,mission_score:null,mission_score_status:'building',official_verified:['official','government'].includes(x.source_type),community_verified:false}))
  return new Response(JSON.stringify({resources,meta:{generated_at:new Date().toISOString(),count:resources.length}}),{headers})
 }catch(e){console.error('public-support',e);return new Response(JSON.stringify({resources:[],meta:{degraded:true}}),{status:503,headers})}
})