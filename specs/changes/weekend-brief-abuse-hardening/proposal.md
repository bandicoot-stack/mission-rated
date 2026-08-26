# Weekend Brief signup abuse hardening

## Problem
`weekend-brief-signup` currently accepts POST requests with no `Origin` header and has no request throttling. A direct non-browser client can therefore bypass the browser-origin check and repeatedly exercise the public insert path.

## Requirements
- Browser signup remains functional from approved Mission Rated origins.
- POST requests must present an approved `Origin`; missing or unapproved origins fail closed.
- Add a per-IP in-memory rate limit of 60 requests per 60 seconds, matching the existing `mission-star-wallet` pattern.
- Rate-limited requests return HTTP 429 with `Retry-After: 60`.
- Existing consent, duplicate, and unsubscribe semantics remain unchanged.
- No secrets or private data are exposed.