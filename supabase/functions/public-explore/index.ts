import { createClient } from 'npm:@supabase/supabase-js@2.95.0'
import { corsHeaders } from 'npm:@supabase/supabase-js@2.95.0/cors'

const day = (v: string | null) => v ? new Date(v).toISOString().slice(0,10) : null

Deno.serve(async (req)=>{
 if(req.method==='OPTIONS') return new Response('ok',{headers:corsHeaders})
 const headers={...corsHeaders,'Content-Type':'application/json','Cache-Control':'public, max-age=60'}
 try{
  const secrets=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}')
  const secret=secrets.default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if(!secret) throw new Error('missing_secret')
  const s=createClient(Deno.env.get('SUPABASE_URL')!,secret,{auth:{persistSession:false}})
  const nowIso=new Date().toISOString()
  const [b,d,sc,i,ss,isig]=await Promise.all([
   s.from('businesses').select('id,name,category,description,website_url,city,state,veteran_owned,military_spouse_owned,source_url,source_checked_at').eq('active',true).order('name').limit(120),
   s.from('deals').select('id,business_id,title,description,offer_value_text,source_url,verified_at,ends_at,businesses(name,city)').eq('active',true).not('verified_at','is',null).or(`ends_at.is.null,ends_at.gte.${nowIso}`).order('verified_at',{ascending:false}).limit(30),
   s.from('school_districts').select('id,name,locality,official_profile_url,summary,confidence,observed_at').order('name').limit(30),
   s.from('installations').select('id,name,branch,city,state').eq('active',true).order('name').limit(30),
   s.from('school_district_signals').select('school_district_id,signal_key,signal_label,numeric_value,text_value,unit,source_name,source_url,observed_at,confidence').order('observed_at',{ascending:false}),
   s.from('installation_signals').select('installation_id,signal_key,signal_label,numeric_value,text_value,unit,source_name,source_url,source_type,observed_at,confidence').order('observed_at',{ascending:false})
  ])
  for(const x of [b,d,sc,i,ss,isig]) if(x.error) throw x.error

  const signalsBySchool = new Map<string, any[]>()
  for(const sig of ss.data||[]){ const arr=signalsBySchool.get(sig.school_district_id)||[]; arr.push(sig); signalsBySchool.set(sig.school_district_id,arr) }
  const latestInstallation = new Map<string, any>()
  const installationSignalCounts = new Map<string, number>()
  for(const sig of isig.data||[]){ installationSignalCounts.set(sig.installation_id,(installationSignalCounts.get(sig.installation_id)||0)+1); if(!latestInstallation.has(sig.installation_id)) latestInstallation.set(sig.installation_id,sig) }
  const activeDealBusinessIds = new Set((d.data||[]).map((deal:any)=>deal.business_id).filter(Boolean))

  const schools=(sc.data||[]).map((school:any)=>{
    const sigs=signalsBySchool.get(school.id)||[]
    const sig=sigs[0]
    const purple=sigs.find((x:any)=>String(x.signal_key||'').toLowerCase().includes('purple') || String(x.signal_label||'').toLowerCase().includes('purple star'))
    const base:any={...school,signal_count:sigs.length,purple_star:purple?{label:purple.signal_label,text:purple.text_value,value:purple.numeric_value,source_name:purple.source_name,source_url:purple.source_url,observed_at:purple.observed_at,confidence:purple.confidence}:null}
    if(!sig) return base
    const parts=[sig.text_value, sig.numeric_value!=null ? `${sig.numeric_value}${sig.unit?` ${sig.unit}`:''}` : null].filter(Boolean)
    return {...base,summary:parts.length?`${parts.join(' • ')}. ${school.summary||''}`.trim():school.summary,latest_signal:{key:sig.signal_key,label:sig.signal_label,value:sig.numeric_value,text:sig.text_value,unit:sig.unit,source_name:sig.source_name,source_url:sig.source_url,observed_at:sig.observed_at,confidence:sig.confidence}}
  })

  const installations=(i.data||[]).map((installation:any)=>{ const sig=latestInstallation.get(installation.id); return {...installation,signal_count:installationSignalCounts.get(installation.id)||0,latest_signal:sig?{key:sig.signal_key,label:sig.signal_label,value:sig.numeric_value,text:sig.text_value,unit:sig.unit,source_name:sig.source_name,source_url:sig.source_url,source_type:sig.source_type,observed_at:sig.observed_at,confidence:sig.confidence}:null} })
  const deals=(d.data||[]).map((deal:any)=>({...deal,description:[deal.description,`Verified ${day(deal.verified_at)}.`,deal.ends_at?`Listed end date ${day(deal.ends_at)}.`:null].filter(Boolean).join(' ')}))
  const businesses=(b.data||[]).map((biz:any)=>{
    const hasSource=typeof biz.source_url==='string' && /^https:\/\//i.test(biz.source_url)
    return {...biz,
      has_active_military_offer:activeDealBusinessIds.has(biz.id),
      provenance_status:hasSource?'sourced':'source_pending',
      source_freshness:hasSource&&biz.source_checked_at?`Source checked ${day(biz.source_checked_at)}`:null,
      description:[biz.description,activeDealBusinessIds.has(biz.id)?'Verified military offer currently tracked in Military Value.':null,hasSource&&biz.source_checked_at?`Source checked ${day(biz.source_checked_at)}.`:null].filter(Boolean).join(' ')
    }
  })
  const sourcedBusinesses=businesses.filter((biz:any)=>biz.provenance_status==='sourced').length

  return new Response(JSON.stringify({businesses,deals,schools,installations,meta:{generated_at:new Date().toISOString(),school_signals:(ss.data||[]).length,installation_signals:(isig.data||[]).length,purple_star_districts:schools.filter((x:any)=>x.purple_star).length,sourced_businesses:sourcedBusinesses,source_pending_businesses:businesses.length-sourcedBusinesses}}),{headers})
 }catch(e){ console.error('public-explore',e); return new Response(JSON.stringify({businesses:[],deals:[],schools:[],installations:[]}),{status:500,headers}) }
})
