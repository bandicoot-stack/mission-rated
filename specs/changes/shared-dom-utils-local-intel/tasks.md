# Tasks

- [x] Reconcile current main, open PRs, release audit, Vercel, Supabase, and durable agent state.
- [x] Confirm no overlapping shared DOM utility PR exists.
- [x] Add canonical `shared/dom-utils.js` escape helper.
- [x] Copy the shared directory into `dist` and load the utility before browser consumers.
- [x] Migrate `local-intel-embeds.js` without changing rendered behavior.
- [ ] Run Mission Rated QA and Integration QA on the exact PR head.
- [ ] Migrate remaining duplicate escape-helper consumers in later bounded slices after this pattern is proven.
