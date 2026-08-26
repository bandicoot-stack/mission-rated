# QA

- Confirmed the implementation changes only the double-quote escape mapping in `instagram-connect-tool.js`: `&quot` → `&quot;`.
- No UI structure, API behavior, data behavior, provenance, consent, or security semantics changed.
- Repository CI is required before merge; production verification is required after deployment if this runtime file is released.
