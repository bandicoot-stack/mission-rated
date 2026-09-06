# Design: Business Share Attribution Integrity

Keep the existing public, no-login Business Share Kit and current Mission Rated-only destination boundary. Do not add authentication or new persistence in this slice.

Treat the kit as a channel-level distribution tool only. `utm_source=business`, `utm_medium=business-share`, and fixed `utm_campaign=business-distribution` describe how the link was generated without asserting which business generated or distributed it. Business name stays in local presentation/share copy and is not sent through the supported Growth attribution contract.

This preserves useful distribution while preventing unauthenticated self-entered identity from becoming authoritative Growth attribution.
