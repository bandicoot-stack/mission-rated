import { createClient } from 'npm:@supabase/supabase-js@2.95.0'
import { corsHeaders } from 'npm:@supabase/supabase-js@2.95.0/cors'
const headers={...corsHeaders,'Content-Type':'application/json','Cache-Control':'public, max-age=60, s-maxage=300, stale-while-revalidate=86400'}
let cache:string|null=null
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders})
 if(req.method!=='GET')return new Response(JSON.stringify({error:'method_not_allowed'}),{status:405,headers})
 try{
  const secrets=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');const secret=secrets.default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');if(!secret)throw new Error('missing_secret')
  const s=createClient(Deno.env.get('SUPABASE_URL')!,secret,{auth:{persistSession:false}})
  const [n,sg,r]=await Promise.all([
   s.from('neighborhoods').select('id,slug,name,city,state,latitude,longitude').eq('active',true).order('city').order('name'),
   s.from('neighborhood_signals').select('neighborhood_id,signal_type,value_text,value_numeric,source_url,source_name,source_kind,observed_at,expires_at').order('observed_at',{ascending:false}),
   s.from('item_reviews').select('item_id,overall_rating,would_recommend,verification_status').eq('item_type','neighborhood').eq('status','published')])
  if(n.error)throw n.error;if(sg.error)throw sg.error;if(r.error)throw r.error
  const bySig=new Map<string,any[]>();for(const x of sg.data||[]){const a=bySig.get(x.neighborhood_id)||[];a.push(x);bySig.set(x.neighborhood_id,a)}
  const byRev=new Map<string,any[]>();for(const x of r.data||[]){const a=byRev.get(x.item_id)||[];a.push(x);byRev.set(x.item_id,a)}
  const neighborhoods=(n.data||[]).map((x:any)=>{const sig=bySig.get(x.id)||[],rev=byRev.get(x.id)||[],avg=rev.length?rev.reduce((a:number,y:any)=>a+Number(y.overall_rating||0),0)/rev.length:null;return{...x,signals:sig,mission_review_count:rev.length,mission_review_average:avg==null?null:Number(avg.toFixed(1)),verified_review_count:rev.filter((y:any)=>y.verification_status==='user_verified').length,mission_score:null,mission_score_status:'building'}})
  cache=JSON.stringify({neighborhoods,meta:{generated_at:new Date().toISOString(),count:neighborhoods.length}})
  return new Response(cache,{headers})
 }catch(e){console.error('public-neighborhoods',e);if(cache)return new Response(cache,{headers});return new Response(JSON.stringify({neighborhoods:[],meta:{degraded:true}}),{status:200,headers})}
})