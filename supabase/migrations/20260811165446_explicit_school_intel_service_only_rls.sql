create policy "school_districts_service_only" on public.school_districts
for all to anon, authenticated
using (false)
with check (false);

create policy "school_district_signals_service_only" on public.school_district_signals
for all to anon, authenticated
using (false)
with check (false);
