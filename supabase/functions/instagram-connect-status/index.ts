import { corsHeaders } from 'npm:@supabase/supabase-js@2.95.0/cors'
const headers={...corsHeaders,'Content-Type':'application/json','Cache-Control':'no-store'}
Deno.serve((req)=>{
 if(req.method==='OPTIONS') return new Response('ok',{headers:corsHeaders})
 if(req.method!=='GET') return new Response(JSON.stringify({error:'method_not_allowed'}),{status:405,headers})
 const clientId=Deno.env.get('META_INSTAGRAM_CLIENT_ID')||''
 return new Response(JSON.stringify({configured:Boolean(clientId),redirect_uri:`${Deno.env.get('SUPABASE_URL')}/functions/v1/instagram-connect-callback`,scopes:(Deno.env.get('META_INSTAGRAM_SCOPES')||'instagram_business_basic').split(',').filter(Boolean)}),{headers})
})