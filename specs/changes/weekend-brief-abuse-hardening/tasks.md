# Tasks

- [x] Require an approved Origin for POST requests.
- [x] Add 60 requests/minute per-IP in-memory throttling.
- [x] Return 429 + Retry-After when limited.
- [x] Preserve existing signup consent/idempotency behavior.
- [ ] Run repository QA and integration QA.
- [ ] Deploy the function and verify approved-origin success plus missing-origin/rate-limit rejection in production.