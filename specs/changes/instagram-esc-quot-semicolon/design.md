# Design

No architecture change. Preserve the existing local `esc()` helper and correct only the malformed HTML entity for double quotes from `&quot` to `&quot;`.

A shared DOM utility is intentionally out of scope and will be handled as its own refactor change.
