import { createClient } from 'npm:@supabase/supabase-js@2.95.0'
import { corsHeaders } from 'npm:@supabase/supabase-js@2.95.0/cors'

const headers={...corsHeaders,'Content-Type':'application/json'}
const clean=(v:any,n=1200)=>typeof v==='string'?v.trim().slice(0,n):null
const num=(v:any)=>{const n=Number(v);return Number.isInteger(n)&&n>=1&&n<=5?n:null}
const allowedTypes=new Set([
 'business','installation','school','school_district','neighborhood',
 'dealer','salesperson','deal','gas_station','event','resource',
 'support_resource','military_life_resource','medical_provider','service',
 'activity','venue','restaurant','hotel','housing','childcare','job'
])

Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders})
 if(req.method!=='POST')return new Response(JSON.stringify({error:'method_not_allowed'}),{status:405,headers})
 try{
  const b=await req.json();
  const type=clean(b.item_type,32),id=clean(b.item_id,80),overall=num(b.overall_rating)
  if(!type||!allowedTypes.has(type)||!id||!overall){
   return new Response(JSON.stringify({error:'invalid_review',allowed_item_types:[...allowedTypes]}),{status:400,headers})
  }
  const secrets=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');
  const secret=secrets.default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if(!secret)throw new Error('missing_secret')
  const s=createClient(Deno.env.get('SUPABASE_URL')!,secret,{auth:{persistSession:false}})
  const payload={
   item_type:type,item_id:id,user_id:null,overall_rating:overall,
   military_family_fit:num(b.military_family_fit),value_rating:num(b.value_rating),
   convenience_rating:num(b.convenience_rating),would_recommend:typeof b.would_recommend==='boolean'?b.would_recommend:null,
   title:clean(b.title,120),body:clean(b.body,1800),military_affiliation:clean(b.military_affiliation,80),
   pcs_year:Number.isInteger(Number(b.pcs_year))?Number(b.pcs_year):null,
   verification_status:'unverified',status:'pending'
  }
  const {data,error}=await s.from('item_reviews').insert(payload).select('id,item_type,item_id,overall_rating,status,verification_status,created_at').single();
  if(error)throw error
  return new Response(JSON.stringify({ok:true,review:data}),{status:201,headers})
 }catch(e){console.error(e);return new Response(JSON.stringify({error:'submit_failed'}),{status:500,headers})}
})