const HOST='www.missionratedhq.com';
const BASE=`https://${HOST}`;
const KEY='99012cfad8c2e9d0d3cc9683bb7afaba';
const KEY_LOCATION=`${BASE}/${KEY}.txt`;
const urls=[
  `${BASE}/`,
  `${BASE}/labor-day`,
  `${BASE}/military-value`,
  `${BASE}/savings`,
  `${BASE}/gas`,
  `${BASE}/this-week`,
  `${BASE}/local-intel`,
  `${BASE}/business`,
  `${BASE}/schools`,
  `${BASE}/bases`,
  `${BASE}/neighborhoods`,
  `${BASE}/buy-a-car`,
  `${BASE}/auto`,
  `${BASE}/events`,
  `${BASE}/support`,
  `${BASE}/medical`,
  `${BASE}/sources`
];

async function verifyKey(){
  const r=await fetch(KEY_LOCATION,{redirect:'follow'});
  if(!r.ok) throw new Error(`IndexNow key file unavailable: ${r.status}`);
  const body=(await r.text()).trim();
  if(body!==KEY) throw new Error('IndexNow key file content mismatch');
}

async function submit(){
  await verifyKey();
  const r=await fetch('https://api.indexnow.org/indexnow',{
    method:'POST',
    headers:{'content-type':'application/json; charset=utf-8'},
    body:JSON.stringify({host:HOST,key:KEY,keyLocation:KEY_LOCATION,urlList:urls})
  });
  const text=await r.text();
  if(![200,202].includes(r.status)) throw new Error(`IndexNow submission failed: ${r.status} ${text}`);
  console.log(`IndexNow accepted ${urls.length} Mission Rated URLs with status ${r.status}`);
}

submit().catch(err=>{console.error(err);process.exit(1)});
