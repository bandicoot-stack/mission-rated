import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"content-type","Access-Control-Allow-Methods":"GET,OPTIONS","Content-Type":"application/json","Cache-Control":"public, max-age=15, s-maxage=15"};
let lastSafe:any={votes:[]};
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
 if(req.method!=="GET") return new Response(JSON.stringify({error:"method_not_allowed"}),{status:405,headers:cors});
 try{
  const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const {data,error}=await supabase.from("quick_rank_votes").select("item_type,item_id,vote");
  if(error) throw error;
  const m=new Map<string,{item_type:string,item_id:string,up:number,down:number}>();
  for(const x of data||[]){const k=`${x.item_type}:${x.item_id}`;const v=m.get(k)||{item_type:x.item_type,item_id:x.item_id,up:0,down:0};if(x.vote===1)v.up++;else if(x.vote===-1)v.down++;m.set(k,v)}
  const payload={votes:[...m.values()].map(v=>({...v,net:v.up-v.down,total:v.up+v.down}))};lastSafe=payload;
  return new Response(JSON.stringify(payload),{headers:cors});
 }catch(e){console.error('quick_rank_read_failed',e);return new Response(JSON.stringify({...lastSafe,degraded:true}),{status:200,headers:{...cors,"Cache-Control":"no-store"}});}
});