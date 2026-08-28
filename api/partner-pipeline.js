const SUPABASE_URL = process.env.SUPABASE_URL || 'https://vquwdypidgjmxnhhdbol.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPERATOR_KEY = process.env.MR_OPERATOR_KEY;

export default async function handler(req,res){
  if(req.method!=='GET'){
    res.setHeader('Allow','GET');
    return res.status(405).json({ok:false});
  }
  res.setHeader('Cache-Control','no-store');
  if(!SERVICE_KEY||!OPERATOR_KEY) return res.status(503).json({ok:false,error:'partner_pipeline_not_configured'});
  const supplied=String(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
  if(!supplied||!constantTimeEqual(supplied,OPERATOR_KEY)) return res.status(401).json({ok:false});

  try{
    const url=new URL('/rest/v1/outreach_prospects',SUPABASE_URL);
    url.searchParams.set('select','name,status,priority,last_contacted_at,next_follow_up_at,rationale');
    url.searchParams.set('or','(status.eq.partner,status.eq.contacted,status.eq.interested,status.eq.follow_up)');
    url.searchParams.set('order','priority.asc,name.asc');
    const response=await fetch(url,{headers:{apikey:SERVICE_KEY,authorization:`Bearer ${SERVICE_KEY}`}});
    if(!response.ok) throw new Error(`supabase_${response.status}`);
    const prospects=await response.json();
    const summary=prospects.reduce((acc,row)=>{acc[row.status]=(acc[row.status]||0)+1;return acc;},{});
    return res.status(200).json({ok:true,generated_at:new Date().toISOString(),summary,prospects});
  }catch(error){
    console.error('partner_pipeline_read_failed',error);
    return res.status(500).json({ok:false});
  }
}

function constantTimeEqual(a,b){
  const aa=Buffer.from(String(a));const bb=Buffer.from(String(b));
  if(aa.length!==bb.length)return false;
  let out=0;for(let i=0;i<aa.length;i++)out|=aa[i]^bb[i];return out===0;
}
