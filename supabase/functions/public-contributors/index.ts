import { createClient } from 'npm:@supabase/supabase-js@2.95.0'

const headers={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':'public, max-age=60, s-maxage=300, stale-while-revalidate=3600'
}
Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers})
  if(req.method!=='GET')return new Response(JSON.stringify({error:'method_not_allowed'}),{status:405,headers})
  try{
    const secrets=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}')
    const secret=secrets.default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if(!secret)throw new Error('missing_secret')
    const s=createClient(Deno.env.get('SUPABASE_URL')!,secret,{auth:{persistSession:false}})
    const [votes,feedback,contributors,reviews]=await Promise.all([
      s.from('quick_rank_votes').select('voter_key').not('voter_key','is',null),
      s.from('beta_feedback').select('device_id').not('device_id','is',null),
      s.from('mission_contributors').select('device_id,approved_contributions').gt('approved_contributions',0).not('device_id','is',null),
      s.from('reviews').select('user_id').not('user_id','is',null)
    ])
    for(const q of [votes,feedback,contributors,reviews])if(q.error)throw q.error
    const keys=new Set<string>()
    for(const x of votes.data||[]) if(x.voter_key) keys.add(String(x.voter_key))
    for(const x of feedback.data||[]) if(x.device_id) keys.add(String(x.device_id))
    for(const x of contributors.data||[]) if(x.device_id) keys.add(String(x.device_id))
    for(const x of reviews.data||[]) if(x.user_id) keys.add(`user:${x.user_id}`)
    const payload={contributors:keys.size,activity:{voters:new Set((votes.data||[]).map((x:any)=>x.voter_key).filter(Boolean)).size,feedback:new Set((feedback.data||[]).map((x:any)=>x.device_id).filter(Boolean)).size,approved_contributors:new Set((contributors.data||[]).map((x:any)=>x.device_id).filter(Boolean)).size,reviewers:new Set((reviews.data||[]).map((x:any)=>x.user_id).filter(Boolean)).size},meta:{generated_at:new Date().toISOString(),definition:'Distinct anonymous contributor keys with a vote, feedback submission, approved contribution, or review. No names or contact information are exposed.'}}
    return new Response(JSON.stringify(payload),{headers})
  }catch(e){console.error('public-contributors',e);return new Response(JSON.stringify({contributors:0,activity:{},meta:{degraded:true}}),{status:503,headers})}
})
