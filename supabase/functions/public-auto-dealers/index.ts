import {createClient} from 'npm:@supabase/supabase-js@2.95.0';
import {corsHeaders} from 'npm:@supabase/supabase-js@2.95.0/cors';
const headers={...corsHeaders,'Content-Type':'application/json','Cache-Control':'public, max-age=60, s-maxage=300, stale-while-revalidate=3600'};
const https=(v:unknown)=>typeof v==='string'&&/^https:\/\//i.test(v);
const host=(v:unknown)=>{try{return https(v)?new URL(String(v)).hostname.replace(/^www\./,''):''}catch{return''}};
const sameHost=(a:unknown,b:unknown)=>{const ah=host(a),bh=host(b);return !!ah&&!!bh&&(ah===bh||ah.endsWith('.'+bh)||bh.endsWith('.'+ah))};
Deno.serve(async req=>{
 if(req.method==='OPTIONS') return new Response('ok',{headers:corsHeaders});
 if(req.method!=='GET') return new Response(JSON.stringify({error:'method_not_allowed'}),{status:405,headers});
 try{
  const secrets=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}'),secret=secrets.default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if(!secret) throw new Error('missing_secret');
  const s=createClient(Deno.env.get('SUPABASE_URL')!,secret,{auth:{persistSession:false}});
  const [d,p,g]=await Promise.all([
   s.from('auto_dealers').select('id,name,slug,city,state,address,website_url,brands,public_rating,public_review_count,public_rating_source,public_rating_url,public_rating_observed_at,military_signal,evidence_url,mr_status').eq('active',true),
   s.from('auto_salespeople').select('id,dealer_id,name,source_url,source_kind,mention_count,evidence_note,observed_at,mr_status').eq('active',true),
   s.from('auto_dealer_signals').select('*').order('observed_at',{ascending:false})
  ]);
  if(d.error) throw d.error;if(p.error) throw p.error;if(g.error) throw g.error;
  const raw=d.data||[];
  const dealerBy=new Map(raw.map((x:any)=>[x.id,x]));
  const salespeople=(p.data||[]).map((x:any)=>{const dealer:any=dealerBy.get(x.dealer_id);const officialSource=!!dealer&&https(x.source_url)&&https(dealer.website_url)&&sameHost(x.source_url,dealer.website_url);return {...x,source_url:https(x.source_url)?x.source_url:null,dealer:dealer?{name:dealer.name,city:dealer.city,website_url:https(dealer.website_url)?dealer.website_url:null}:null,official_verified:officialSource,user_verified:false}});
  const signalsBy=new Map<string,any[]>();for(const x of g.data||[]){const a=signalsBy.get(x.dealer_id)||[];a.push(x);signalsBy.set(x.dealer_id,a)}
  const dealers=raw.map((x:any)=>{
    const sourcedRating=https(x.public_rating_url)&&x.public_rating!=null;
    const websiteVerified=https(x.website_url);
    const officialMilitaryEvidence=websiteVerified&&https(x.evidence_url)&&sameHost(x.website_url,x.evidence_url);
    const sourcedSignals=(signalsBy.get(x.id)||[]).filter((s:any)=>https(s.source_url)).slice(0,5);
    return {...x,
      website_url:websiteVerified?x.website_url:null,
      public_rating:sourcedRating?Number(x.public_rating):null,
      public_review_count:sourcedRating?x.public_review_count:null,
      public_rating_source:sourcedRating?x.public_rating_source:null,
      public_rating_url:sourcedRating?x.public_rating_url:null,
      website_verified:websiteVerified,
      official_verified:officialMilitaryEvidence,
      official_military_evidence:officialMilitaryEvidence,
      user_verified:false,
      signals:sourcedSignals,
      salespeople:salespeople.filter((p:any)=>p.dealer_id===x.id)
    }
  }).sort((a:any,b:any)=>((b.official_military_evidence?1:0)-(a.official_military_evidence?1:0))||((b.public_review_count||0)-(a.public_review_count||0))||((b.public_rating||0)-(a.public_rating||0))||String(a.name).localeCompare(String(b.name)));
  return new Response(JSON.stringify({dealers,salespeople,meta:{generated_at:new Date().toISOString(),dealer_count:dealers.length,salesperson_count:salespeople.length,sourced_rating_count:dealers.filter((x:any)=>x.public_rating!=null).length,official_website_count:dealers.filter((x:any)=>x.website_verified).length,official_military_evidence_count:dealers.filter((x:any)=>x.official_military_evidence).length}}),{headers});
 }catch(e){console.error('public-auto-dealers',e);return new Response(JSON.stringify({dealers:[],salespeople:[],meta:{degraded:true}}),{status:503,headers});}
});