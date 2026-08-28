const SUPABASE_URL = process.env.SUPABASE_URL || 'https://vquwdypidgjmxnhhdbol.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req,res){
  if(req.method!=='GET'){
    res.setHeader('Allow','GET');
    return res.status(405).json({ok:false});
  }
  if(!SERVICE_KEY){
    res.setHeader('Cache-Control','no-store');
    return res.status(503).json({ok:false,error:'partner_pipeline_not_configured'});
  }
  if(!sameOrigin(req)) return res.status(403).json({ok:false});

  try{
    const url=new URL('/rest/v1/outreach_prospects',SUPABASE_URL);
    url.searchParams.set('select','name,status,priority,last_contacted_at,next_follow_up_at,rationale');
    url.searchParams.set('or','(status.eq.partner,status.eq.contacted,status.eq.interested,status.eq.follow_up)');
    url.searchParams.set('order','priority.asc,name.asc');
    const response=await fetch(url,{headers:{apikey:SERVICE_KEY,authorization:`Bearer ${SERVICE_KEY}`}});
    if(!response.ok) throw new Error(`supabase_${response.status}`);
    const prospects=await response.json();
    const summary=prospects.reduce((acc,row)=>{acc[row.status]=(acc[row.status]||0)+1;return acc;},{});
    res.setHeader('Cache-Control','no-store');
    return res.status(200).json({ok:true,generated_at:new Date().toISOString(),summary,prospects});
  }catch(error){
    console.error('partner_pipeline_read_failed',error);
    res.setHeader('Cache-Control','no-store');
    return res.status(500).json({ok:false});
  }
}

function sameOrigin(req){
  const host=String(req.headers['x-forwarded-host']||req.headers.host||'').toLowerCase();
  const referer=String(req.headers.referer||'');
  if(!host||!referer)return false;
  try{return new URL(referer).host.toLowerCase()===host;}catch{return false;}
}
