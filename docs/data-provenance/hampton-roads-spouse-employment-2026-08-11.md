# Hampton Roads spouse employment intelligence

Verified: 2026-08-11

## Product opportunity
Add a **Spouse Employment** signal to installation/PCS readiness. Keep it informational and source-linked; do not convert it into a Mission Rated numeric score until a scoring policy is approved.

Useful UI fields:
- installation
- family-support/employment resource URL
- employment-assistance availability
- named programs/resources (SECO, MyCAA, MSEP when the authoritative installation source names them)
- local labor-market snapshot + as-of date
- on-base employment channels
- source verification date

## Authoritative findings

### NAS Oceana / Dam Neck
MilitaryINSTALLATIONS says relocation commonly changes military-spouse employment and directs families to employment assistance including SECO, MyCAA and MSEP. Its current Hampton Roads snapshot reports a 3.5% unemployment rate as of June 2026 and identifies on-base opportunities through MWR, Non-Appropriated Funds, Navy Exchange and the Commissary.

Source: https://installations.militaryonesource.mil/military-installation/naval-air-station-oceana-dam-neck-annex/military-and-family-support-center/employment

### Naval Station Norfolk
MilitaryINSTALLATIONS describes Hampton Roads as a diverse military/maritime/healthcare/education/local-government economy and reports approximately 3.9% unemployment in early 2026. Treat this separately from Oceana's June figure because the source dates differ.

Source: https://installations.militaryonesource.mil/military-installation/naval-station-norfolk/military-and-family-support-center/employment

### NSA Hampton Roads
MilitaryINSTALLATIONS says the Military and Family Support Center should be one of a family's first stops after arrival and describes it as part of the Military Family Readiness System.

Source: https://installations.militaryonesource.mil/military-installation/naval-support-activity-hampton-roads/military-and-family-support-center/military-and-family-support-center

### Navy-wide family readiness
MyNavyHR states Fleet and Family Support Centers support Sailor and family readiness and adaptation to Navy life; the page was updated/verified April 27, 2026.

Source: https://www.mynavyhr.navy.mil/Support-Services/Culture-Resilience/Family-Readiness/Fleet-Family-Support/

## Integration guidance
- Show these as **Official Source Verified** only when the displayed claim maps to the authoritative source above.
- Do not mark them User Verified without a real user submission.
- Preserve each labor statistic's `as_of` date; never blend 3.5% (June 2026 Oceana source) and ~3.9% (early-2026 Norfolk source) into one regional value.
- A useful installation card CTA is `Spouse employment resources`, alongside childcare, schools, EFMP, housing and relocation.
- Prefer the installation-specific MilitaryINSTALLATIONS page over generic summaries because it is immediately actionable for PCS users.
