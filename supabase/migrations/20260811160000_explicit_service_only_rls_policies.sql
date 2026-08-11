create policy "service_only_beta_feedback" on public.beta_feedback
  for all to anon, authenticated using (false) with check (false);

create policy "service_only_mission_contributions" on public.mission_contributions
  for all to anon, authenticated using (false) with check (false);

create policy "service_only_mission_contributors" on public.mission_contributors
  for all to anon, authenticated using (false) with check (false);

create policy "service_only_mission_reward_redemptions" on public.mission_reward_redemptions
  for all to anon, authenticated using (false) with check (false);

create policy "service_only_mission_star_ledger" on public.mission_star_ledger
  for all to anon, authenticated using (false) with check (false);
