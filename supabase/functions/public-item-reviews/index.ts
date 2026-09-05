import { createClient } from 'npm:@supabase/supabase-js@2.95.0'
import { corsHeaders } from 'npm:@supabase/supabase-js@2.95.0/cors'
const headers={...corsHeaders,'Content-Type':'application/json','Cache-Control':'public, max-age=30, s-maxage=120'}
let cache:any={reviews:[]},cachedAt=0
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders})
 if(req.method!=='GET')return new Response(JSON.stringify({error:'method_not_allowed'}),{status:405,headers})
 try{
  const secrets=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');const secret=secrets.default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');if(!secret)throw new Error('missing_secret')
  const s=createClient(Deno.env.get('SUPABASE_URL')!,secret,{auth:{persistSession:false}})
  const {data,error}=await s.from('item_reviews').select('id,item_type,item_id,overall_rating,military_family_fit,value_rating,convenience_rating,would_recommend,title,body,military_affiliation,pcs_year,verification_status,created_at').eq('status','published').order('created_at',{ascending:false}).limit(500);if(error)throw error
  const m=new Map<string,any[]>();for(const x of data||[]){const k=`${x.item_type}:${x.item_id}`,a=m.get(k)||[];a.push(x);m.set(k,a)}
  const reviews=[...m.entries()].map(([k,a])=>{const [item_type,item_id]=k.split(':');const avg=a.reduce((z:number,x:any)=>z+Number(x.overall_rating||0),0)/a.length;const entries=a.slice(0,10).map((x:any)=>({id:x.id,overall_rating:x.overall_rating,military_family_fit:x.military_family_fit,value_rating:x.value_rating,convenience_rating:x.convenience_rating,would_recommend:x.would_recommend,title:x.title,body:x.body,military_affiliation:x.military_affiliation,pcs_year:x.pcs_year,verification_status:x.verification_status,created_at:x.created_at}));return{item_type,item_id,count:a.length,average:Number(avg.toFixed(1)),recommend_count:a.filter((x:any)=>x.would_recommend===true).length,user_verified_count:a.filter((x:any)=>x.verification_status==='user_verified').length,entries}})
  cache={reviews};cachedAt=Date.now();return new Response(JSON.stringify(cache),{headers})
 }catch(e){console.error(e);return new Response(JSON.stringify({...cache,degraded:true,cached_at:cachedAt||null}),{status:200,headers:{...headers,'X-MR-Degraded':'1'}})}
})