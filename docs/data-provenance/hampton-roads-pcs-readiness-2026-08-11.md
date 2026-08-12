# Hampton Roads PCS Readiness Intelligence — 2026-08-11

Purpose: first-party/authoritative evidence package for Mission Rated ingestion and frontend planning. No Mission Rated score or User Verified state is implied by this file.

## Virginia Air & Space Science Center — verified military value

- Entity: Virginia Air & Space Science Center
- Location: 600 Settlers Landing Rd, Hampton, VA 23669
- Official website: https://vasc.org/
- Official ticket source: https://vasc.org/tickets/
- Current general admission: $23.50 adult; $20.50 Active Military. This is a $3.00 admission advantage versus the listed adult rate.
- IMAX-only: $10.50 adult; $9.50 Active Military.
- Official membership source: https://vasc.org/become-a-member/
- Active Duty Military membership discount: $10. Valid ID must be presented in person; discount is not available online.
- Provenance state appropriate for these facts: Official Source Verified.
- User Verified: false/unset unless a real user verification exists.
- Mission Rated score: Building/Pending unless sufficient scoring evidence exists elsewhere.

## Hampton Roads childcare readiness — authoritative DoD signals

### Region-wide constraint
MilitaryINSTALLATIONS currently states there are significant wait lists for on-base Child Development Centers in Hampton Roads and identifies nine CDCs in the area. This should be surfaced as a PCS planning warning rather than a business rating.

Source: https://installations.militaryonesource.mil/in-depth-overview/mccs-hampton-roads

### Action path
MilitaryINSTALLATIONS identifies MilitaryChildCare.com as the request-for-care starting point. For NSA Hampton Roads Northwest Annex, CDC care covers roughly 6 weeks through age 5, and School Age Care covers before/after-school care plus school-break camps. The listed support number is 855-696-2934.

Source: https://installations.militaryonesource.mil/military-installation/naval-support-activity-hampton-roads-northwest-annex/child-and-youth-services/child-care

Product implication: add a `PCS Childcare` readiness card with `Wait-list risk`, `Request care`, and `Care types` fields. Do not represent availability as real-time unless a real availability source is integrated.

## Family readiness / spouse employment

MilitaryINSTALLATIONS describes Hampton Roads Military and Family Support Center services as including relocation assistance, employment assistance for military spouse career/education goals, financial readiness, deployment support, counseling, and information/referral.

NSA Hampton Roads source: https://installations.militaryonesource.mil/military-installation/naval-support-activity-hampton-roads/military-and-family-support-center/military-and-family-support-center

Product implication: installation pages should expose a compact `Family Readiness` module with Relocation, Spouse Employment, EFMP, Childcare, School Liaison, and Housing links instead of burying these signals in prose.

## School assignment / liaison signal

MilitaryINSTALLATIONS states that in Virginia a family's physical address determines the public school children attend. For JEB Little Creek–Fort Story, the school liaison works with the NAS Oceana liaison to support military-connected students across Virginia Beach City Public Schools.

Source: https://installations.militaryonesource.mil/military-installation/joint-expeditionary-base-little-creek-fort-story/education/education

NSA Hampton Roads Northwest Annex also lists a School Liaison at 757-921-5876 and identifies Chesapeake Public Schools as serving the Northwest Annex.

Source: https://installations.militaryonesource.mil/military-installation/naval-support-activity-hampton-roads-northwest-annex/education/education

Product implication: show `Address determines school` prominently on PCS/school discovery and attach the appropriate School Liaison to each installation. Never infer a school assignment from installation alone.

## EFMP routing signal

MilitaryINSTALLATIONS exposes installation-specific EFMP enrollment contacts in Hampton Roads, including JEB Little Creek–Fort Story, NAS Oceana, NSA Hampton Roads, and MCCS Hampton Roads.

Source: https://installations.militaryonesource.mil/search?program-service=15%2Fzip%3D23456%2Fmiles%3D25

Product implication: add `EFMP support` as a first-class installation readiness signal with authoritative contact/source provenance; do not rate quality from contact existence alone.

## Safe ingestion rules

1. Preserve source URL and retrieval date with every imported fact.
2. `Official Source Verified` may be set only for the facts supported above; it is not a blanket endorsement of the entity.
3. Never create `User Verified` without an actual user verification event.
4. Do not calculate or publish a Mission Rated numeric score from this evidence alone.
5. Time-sensitive prices/discounts should be periodically rechecked against the first-party page.
