import { createClient } from 'npm:@supabase/supabase-js@2.95.0'
import { corsHeaders } from 'npm:@supabase/supabase-js@2.95.0/cors'
const headers={...corsHeaders,'Content-Type':'application/json','Cache-Control':'public, max-age=60, s-maxage=300, stale-while-revalidate=1800'}
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS') return new Response('ok',{headers:corsHeaders})
 if(req.method!=='GET') return new Response(JSON.stringify({error:'method_not_allowed'}),{status:405,headers})
 try{
  const secrets=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}'); const secret=secrets.default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'); if(!secret) throw new Error('missing_secret')
  const s=createClient(Deno.env.get('SUPABASE_URL')!,secret,{auth:{persistSession:false}})
  const {data,error}=await s.from('local_intel_creators').select('handle,display_name,category,market,city,profile_url,priority,notes,source_name,source_url,source_checked_at').eq('active',true).order('priority',{ascending:false}).order('handle')
  if(error) throw error
  return new Response(JSON.stringify({creators:data||[],meta:{count:(data||[]).length,generated_at:new Date().toISOString()}}),{headers})
 }catch(e){console.error(e);return new Response(JSON.stringify({creators:[],meta:{degraded:true}}),{status:503,headers})}
})