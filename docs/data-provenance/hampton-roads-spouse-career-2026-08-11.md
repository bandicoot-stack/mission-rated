# Hampton Roads military-spouse career intelligence — 2026-08-11

Purpose: provenance-ready discovery notes for Mission Rated. These are informational signals, not Mission Rated scores or user verification.

## High-value product signal: Spouse Career Support

### Naval Air Station Oceana / Dam Neck
- Source class: DoD / MilitaryINSTALLATIONS (authoritative government source)
- Source: https://installations.militaryonesource.mil/military-installation/naval-air-station-oceana/military-and-family-support-center/employment
- Current source facts: Family Employment Readiness Program supports eligible family members with job search/career planning; Hampton Roads unemployment reported at 3.5% as of June 2026; on-base opportunities include MWR, NAF, Navy Exchange and Commissary.
- UI candidate: installation card `Spouse Career Support` with official-source provenance and direct source link.

### Naval Station Norfolk
- Source class: DoD / MilitaryINSTALLATIONS
- Source: https://installations.militaryonesource.mil/military-installation/naval-station-norfolk/military-and-family-support-center/employment
- Current source facts: Fleet & Family Support Center Family Employment Readiness Program provides career counseling, resume/cover-letter help, interview preparation, job-search strategies and local labor-market resources.
- UI candidate: same installation-level `Spouse Career Support` signal.

### NSA Hampton Roads Northwest Annex
- Source class: DoD / MilitaryINSTALLATIONS
- Source: https://installations.militaryonesource.mil/military-installation/naval-support-activity-hampton-roads-northwest-annex/military-and-family-support-center/employment
- Current source facts: Family Member Employment Assistance Program at 4504 Relay Rd., Chesapeake; FFSC provides job leads, career planning and local college/job-search resources.
- UI candidate: support-center contact/service intelligence on installation detail pages.

### Joint Base Langley-Eustis
- Source class: DoD / MilitaryINSTALLATIONS
- Source: https://installations.militaryonesource.mil/military-installation/joint-base-langley-eustis/military-and-family-support-center/employment
- Current source facts: qualifying PCS/PCA spouse relicensing/recertification and qualified business-related expense reimbursement is capped at $2,000 total ($1,000 + $1,000), with documented exclusions and required proof.
- UI candidate: `PCS Money Saver` + `Spouse Career Support`; display eligibility/restrictions, never reduce this to an unconditional "$2,000 benefit."

## Region-wide free benefit
- Source class: DoD / Military OneSource
- Source: https://www.militaryonesource.mil/education-employment/for-spouses/career-during-pcs/
- Published: 2026-06-05
- Current source facts: eligible military spouses can access a free one-year FlexJobs membership; SpouseWorks provides career guidance; Military Spouse Employer Partnership has more than 1,000 employer partners.
- UI candidate: `PCS Toolkit` resource card, separate from local business rankings.

## Data rules
1. Treat DoD/Military OneSource/MilitaryINSTALLATIONS as authoritative government provenance, eligible for Official Source Verified when the displayed claim matches the cited source.
2. Do not create User Verified from these records.
3. Do not generate a Mission Rated score solely from existence of a support program.
4. Store dates/as-of language with labor-market statistics; do not present them as timeless facts.
5. Preserve eligibility, caps and exclusions for monetary benefits.
6. Prefer installation-specific service signals over duplicating the same regional labor statistic on every installation.

## Suggested schema mapping
- entity_type: installation or regional_resource
- signal_type: spouse_career_support | pcs_money_saver
- provenance_type: dod_official
- official_source_verified: true
- user_verified: false
- source_url: direct URL above
- observed_at: 2026-08-11
- mission_rated_score: pending/building unless independent scoring evidence exists
