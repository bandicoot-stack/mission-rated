# Hampton Roads spouse-employment intelligence

Observed 2026-08-11. Source-backed discovery package; no Mission Rated scores implied.

## Product gap
Installation cards should expose a dedicated **Spouse Employment** PCS signal beside School Liaison, relocation, childcare and EFMP. This is high-value PCS intelligence and is currently not discoverable in the repo UI.

## Authoritative signals

### Naval Air Station Oceana
MilitaryINSTALLATIONS reports Hampton Roads unemployment at **3.5% as of June 2026** and directs relocating spouses/families to SECO/MyCAA/MSEP resources. It also identifies on-base employment channels including MWR, NAF, Navy Exchange and Commissary.
Source: https://installations.militaryonesource.mil/military-installation/naval-air-station-oceana/military-and-family-support-center/employment

### NAS Oceana Dam Neck Annex
MilitaryINSTALLATIONS reports the same 3.5% June 2026 regional unemployment signal and employment assistance through SECO/MyCAA/MSEP. It additionally reports a Virginia Beach–Norfolk–Newport News mean hourly wage of **$30.14 in May 2025**, citing BLS.
Source: https://installations.militaryonesource.mil/military-installation/naval-air-station-oceana-dam-neck-annex/military-and-family-support-center/employment

### Naval Station Norfolk
MilitaryINSTALLATIONS describes the regional economy as diverse across military, shipbuilding/maritime, healthcare, education, local government, transportation, finance, retail and tourism, and reports approximately **3.9% unemployment in early 2026**. Preserve its date/source separately rather than blending it with the Oceana June figure.
Source: https://installations.militaryonesource.mil/military-installation/naval-station-norfolk/military-and-family-support-center/employment

### NSA Hampton Roads / Northwest Annex
MilitaryINSTALLATIONS identifies employment assistance as an installation family-readiness service and Northwest Annex specifically points spouses to SECO/MyCAA/MSEP.
Sources:
- https://installations.militaryonesource.mil/military-installation/naval-support-activity-hampton-roads/military-and-family-support-center/military-and-family-support-center
- https://installations.militaryonesource.mil/military-installation/naval-support-activity-hampton-roads-northwest-annex/military-and-family-support-center/employment

### DoD-wide spouse employment
Military OneSource's Office of Spouse Employment provides free career support including resume/interview/job-search/networking help, education/training, licensing help, career coaching and employer access. This is a strong reusable PCS resource rather than an installation-specific rating input.
Source: https://www.militaryonesource.mil/programs/office-spouse-employment/

## Frontend/data recommendation
Add a structured installation signal type `spouse_employment` with fields for `label`, `summary`, `source_url`, `observed_at`, optional `stat_value`, `stat_unit`, `stat_period`, and `official_verified`. Do not turn regional unemployment/wage figures directly into an MR score. Surface them as dated context under the installation.

Suggested card treatment:
- `Spouse employment resources` capability chip when an authoritative resource exists.
- Compact dated regional context such as `3.5% regional unemployment • Jun 2026` only on records backed by that exact source/date.
- `Official Source Verified` only when the displayed claim maps to MilitaryINSTALLATIONS/Military OneSource or another authoritative first-party source.
- Never mark `User Verified` from these sources.

## Discovery pattern
A useful non-proprietary pattern from MilitaryINSTALLATIONS is organizing PCS information by **family task** (employment, moving, childcare, education, EFMP, housing) rather than forcing users to understand agency structure. Mission Rated can improve on this by presenting those task signals together on each installation card with provenance and freshness.
