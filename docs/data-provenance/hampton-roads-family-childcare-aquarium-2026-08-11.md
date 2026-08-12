# Hampton Roads family + military value discovery — 2026-08-11

Status: discovery evidence only. Do not infer a Mission Rated score or User Verified state from this file.

## Virginia Aquarium & Marine Science Center

Location: Virginia Beach, VA

First-party evidence checked 2026-08-11:
- General admission: active military and veterans receive $2 off adult and youth admission with valid military ID.
  Source: https://virginiaaquarium.com/admission-information
- Membership: 10% military discount; purchaser must show a valid U.S. Armed Forces ID. FAQ states membership must be purchased in person, cannot be combined with other discounts, and cannot be applied to gift certificates.
  Sources: https://virginiaaquarium.com/membership and https://virginiaaquarium.com/faq

Recommended data treatment:
- Two separate benefit records: `dollar_off` ($2 admission) and `percent_off` (10% membership).
- Official Source Verified may be true for these benefit claims because evidence is first-party.
- Preserve eligibility and redemption restrictions verbatim as structured fields; do not generalize active/veteran admission eligibility to the membership offer.
- No Mission Rated numeric score until the scoring evidence threshold is met.

## Hampton Roads child-care / PCS intelligence

Authoritative Military OneSource / MilitaryINSTALLATIONS evidence checked 2026-08-11:
- Naval Station Norfolk warns of a lengthy Hampton Roads childcare-center waiting list and recommends family home care or civilian childcare when immediate care is needed.
  Source: https://installations.militaryonesource.mil/in-depth-overview/naval-station-norfolk
- Northwest Annex child-care guidance says CDC care covers children 6 weeks–5 years; School Age Care provides before/after-school care and seasonal camps; applications start through MilitaryChildCare.com.
  Source: https://installations.militaryonesource.mil/military-installation/naval-support-activity-hampton-roads-northwest-annex/child-and-youth-services/child-care
- Military OneSource reports a DoD child-care expansion initiative with two new nonprofit-operated facilities planned near Norfolk/Virginia Beach installations, each adding 200 spaces, phased during calendar years 2025–2026. This is a planning signal, not proof that either Hampton Roads facility is open today.
  Source: https://www.militaryonesource.mil/resources/millife-guides/child-care/
- NSA Hampton Roads relocation assistance includes moving-with-children/pets resources, EFMP support, settling-in help, emergency assistance, housing-flexibility guidance, and spouse relicensure/certification reimbursement guidance up to $1,000 subject to service-specific eligibility.
  Source: https://installations.militaryonesource.mil/military-installation/naval-support-activity-hampton-roads/military-and-family-support-center/relocation-assistance

Recommended product feature: **PCS Childcare Readiness** on installation pages. Display authoritative signals such as known wait-list pressure, application link, care age bands, School Age Care availability, and expansion status. Use `Planned / verify opening` for announced facilities until an authoritative source confirms they are operational.

Recommended ranking rule: childcare intelligence must not affect a business's Mission Rated score. It is installation/PCS readiness evidence and should be timestamped independently.
