create table if not exists public.outreach_prospects (
  id uuid primary key default gen_random_uuid(),
  prospect_type text not null check (prospect_type in ('business','creator','community_org','military_spouse_business','veteran_business')),
  business_id uuid references public.businesses(id) on delete set null,
  name text not null,
  category text,
  city text,
  website_url text,
  contact_channel text,
  contact_value text,
  status text not null default 'researched' check (status in ('researched','ready','contacted','follow_up','interested','partner','not_interested','paused')),
  priority smallint not null default 3 check (priority between 1 and 5),
  owner_lane text not null default 'business' check (owner_lane in ('business','community','creator','lead')),
  source_url text,
  rationale text,
  last_contacted_at timestamptz,
  next_follow_up_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id)
);

create table if not exists public.outreach_activities (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.outreach_prospects(id) on delete cascade,
  activity_type text not null check (activity_type in ('research','draft','email','dm','call','follow_up','reply','meeting','note','status_change')),
  outcome text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.outreach_templates (
  id uuid primary key default gen_random_uuid(),
  lane text not null check (lane in ('business','spouse_veteran','creator','community')),
  name text not null,
  subject text,
  body text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(lane,name)
);

alter table public.outreach_prospects enable row level security;
alter table public.outreach_activities enable row level security;
alter table public.outreach_templates enable row level security;

revoke all on public.outreach_prospects from anon, authenticated;
revoke all on public.outreach_activities from anon, authenticated;
revoke all on public.outreach_templates from anon, authenticated;
grant all on public.outreach_prospects to service_role;
grant all on public.outreach_activities to service_role;
grant all on public.outreach_templates to service_role;

insert into public.outreach_templates(lane,name,subject,body) values
('business','military_value_intro','Mission Rated + {{business_name}}','Hi {{business_name}} team — Mission Rated helps military families in Hampton Roads find local businesses, verified military value, and useful community information. We already have a listing for {{business_name}} and would like to make sure the information is accurate. If you offer a military discount or have something especially useful for military families, send us the official details/source and we’ll review it for inclusion. Ratings are earned and never sold.'),
('spouse_veteran','founder_story','Feature your military-connected business on Mission Rated','Hi {{business_name}} — we are building Mission Rated for military families in Hampton Roads and are prioritizing veteran- and military-spouse-owned businesses. We would like to verify your listing, highlight your military connection accurately, and learn what military families should know about your business. There is no charge to participate in the core platform.'),
('creator','local_intel','Mission Rated local creator collaboration','Hi {{creator_name}} — Mission Rated is building a source-backed local guide for military families in Hampton Roads. We would like to feature useful local content with clear attribution and permission, especially deals, events, family activities, and military-life tips. Interested in being part of the local intel network?'),
('community','community_partner','Mission Rated community resource partnership','Hi {{organization_name}} — Mission Rated helps military families find verified local resources, events, benefits, schools, and community support around Hampton Roads. We would like to make sure your resources are represented accurately and explore ways to point military families to the right official information.')
on conflict(lane,name) do update set subject=excluded.subject, body=excluded.body, updated_at=now();

insert into public.outreach_prospects(prospect_type,business_id,name,category,city,website_url,status,priority,owner_lane,source_url,rationale)
select
  case when coalesce(b.military_spouse_owned,false) then 'military_spouse_business'
       when coalesce(b.veteran_owned,false) then 'veteran_business'
       else 'business' end,
  b.id,b.name,b.category,b.city,b.website_url,
  'ready',
  case when coalesce(b.military_spouse_owned,false) or coalesce(b.veteran_owned,false) then 1
       when coalesce(b.claimed,false)=false then 2 else 3 end,
  case when coalesce(b.military_spouse_owned,false) or coalesce(b.veteran_owned,false) then 'community' else 'business' end,
  b.source_url,
  case when coalesce(b.military_spouse_owned,false) then 'Military-spouse-owned; prioritize verification and founder story.'
       when coalesce(b.veteran_owned,false) then 'Veteran-owned; prioritize verification and founder story.'
       when coalesce(b.claimed,false)=false then 'Existing unclaimed Mission Rated listing; verify details and military value.'
       else 'Existing Mission Rated business; verify current military-family value.' end
from public.businesses b
where coalesce(b.active,true)=true
on conflict (business_id) do nothing;

insert into public.outreach_prospects(prospect_type,name,category,city,website_url,status,priority,owner_lane,source_url,rationale)
select 'creator', coalesce(c.display_name,c.handle), c.category, c.city, c.profile_url, 'ready',
       case when coalesce(c.priority,3) <= 2 then 1 else 2 end,
       'creator', c.source_url,
       'Existing Hampton Roads Local Intel creator candidate; request permission/participation before featuring or reusing content.'
from public.local_intel_creators c
where coalesce(c.active,true)=true
  and not exists (
    select 1 from public.outreach_prospects p
    where p.prospect_type='creator'
      and (p.website_url=c.profile_url or lower(p.name)=lower(coalesce(c.display_name,c.handle)))
  );

insert into public.outreach_activities(prospect_id,activity_type,outcome,notes)
select p.id,'research','queued','Seeded from existing Mission Rated data and queued for personalized outreach.'
from public.outreach_prospects p
where not exists (select 1 from public.outreach_activities a where a.prospect_id=p.id);

create index if not exists outreach_prospects_status_priority_idx on public.outreach_prospects(status,priority,created_at);
create index if not exists outreach_prospects_follow_up_idx on public.outreach_prospects(next_follow_up_at) where next_follow_up_at is not null;
create index if not exists outreach_activities_prospect_idx on public.outreach_activities(prospect_id,created_at desc);
