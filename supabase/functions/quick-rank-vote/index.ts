import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"content-type","Access-Control-Allow-Methods":"POST,OPTIONS","Content-Type":"application/json"};
const allowed=new Set(["business","school","installation","dealer","salesperson","neighborhood"]);
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
 if(req.method!=="POST") return new Response(JSON.stringify({error:"method_not_allowed"}),{status:405,headers:cors});
 try{
  const body=await req.json();
  const item_type=String(body.item_type||"");
  const item_id=String(body.item_id||"");
  const voter_key=String(body.voter_key||"");
  const vote=Number(body.vote);
  if(!allowed.has(item_type)||!/^[-0-9a-f]{36}$/i.test(item_id)||voter_key.length<8||voter_key.length>128||![1,-1].includes(vote)) return new Response(JSON.stringify({error:"invalid_vote"}),{status:400,headers:cors});
  const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const {error}=await supabase.from("quick_rank_votes").upsert({item_type,item_id,voter_key,vote,updated_at:new Date().toISOString()},{onConflict:"item_type,item_id,voter_key"});
  if(error) throw error;
  const {data,error:aggErr}=await supabase.from("quick_rank_votes").select("vote").eq("item_type",item_type).eq("item_id",item_id);
  if(aggErr) throw aggErr;
  const up=(data||[]).filter((x:any)=>x.vote===1).length,down=(data||[]).filter((x:any)=>x.vote===-1).length;
  return new Response(JSON.stringify({ok:true,item_type,item_id,up,down,net:up-down,total:up+down}),{headers:cors});
 }catch(e){console.error('quick_rank_vote_failed',e);return new Response(JSON.stringify({error:"vote_failed"}),{status:500,headers:cors});}
});