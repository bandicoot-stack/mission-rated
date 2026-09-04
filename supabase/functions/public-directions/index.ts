import { createClient } from 'npm:@supabase/supabase-js@2.95.0'
const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=60, s-maxage=300, stale-while-revalidate=3600'}
const https=(v:unknown)=>typeof v==='string'&&/^https:\/\//i.test(v)
Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers})
 if(req.method!=='GET')return new Response(JSON.stringify({error:'method_not_allowed'}),{status:405,headers})
 try{
  const secrets=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');const secret=secrets.default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');if(!secret)throw new Error('missing_secret')
  const s=createClient(Deno.env.get('SUPABASE_URL')!,secret,{auth:{persistSession:false}})
  const [b,i]=await Promise.all([
   s.from('businesses').select('id,name,address_line1,city,state,postal_code,latitude,longitude,source_url').eq('active',true).order('name').limit(200),
   s.from('installations').select('id,name,city,state,latitude,longitude').eq('active',true).order('name').limit(80)
  ])
  if(b.error)throw b.error;if(i.error)throw i.error
  const businesses=(b.data||[]).filter((x:any)=>https(x.source_url)).map((x:any)=>({id:x.id,name:x.name,address_line1:x.address_line1||null,city:x.city||null,state:x.state||null,postal_code:x.postal_code||null,latitude:x.latitude==null?null:Number(x.latitude),longitude:x.longitude==null?null:Number(x.longitude)}))
  const installations=(i.data||[]).map((x:any)=>({id:x.id,name:x.name,city:x.city||null,state:x.state||null,latitude:x.latitude==null?null:Number(x.latitude),longitude:x.longitude==null?null:Number(x.longitude)}))
  return new Response(JSON.stringify({businesses,installations,meta:{generated_at:new Date().toISOString(),businesses_with_street_address:businesses.filter((x:any)=>x.address_line1).length,businesses_with_coordinates:businesses.filter((x:any)=>Number.isFinite(x.latitude)&&Number.isFinite(x.longitude)).length,installations_with_coordinates:installations.filter((x:any)=>Number.isFinite(x.latitude)&&Number.isFinite(x.longitude)).length}}),{headers})
 }catch(e){console.error('public-directions',e);return new Response(JSON.stringify({businesses:[],installations:[],meta:{degraded:true}}),{status:503,headers})}
})
