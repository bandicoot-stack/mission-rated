# Mission Rated Engineering Constitution

This document defines non-negotiable product and engineering rules for Mission Rated. Feature specs, implementation plans, agent work, pull requests, QA, and releases must conform to it.

## 1. Mission and trust

Mission Rated exists to help military members, veterans, spouses, families, and military-connected communities make better local decisions.

- Ratings are earned, never sold.
- Sponsored or paid visibility must be clearly labeled.
- Sponsorship must never affect ratings, verification, or organic ranking.
- AI must not fabricate reviews, rankings, endorsements, verification, sources, or business facts.
- Source provenance must remain visible anywhere Mission Rated presents researched facts, offers, events, or recommendations.

## 2. User experience

- Design for mobile first and verify desktop second.
- Keep core journeys simple: Today’s Deals, Labor Day/special-event experiences, Local Deals, Everyday Deals, Places, Businesses, Schools, and Buy a Car.
- Avoid duplicate instructions, duplicated sourcing language, unnecessary controls, and visual clutter.
- Accessibility is a release requirement, not polish.
- Important actions must have clear labels, keyboard accessibility, focus states, and usable touch targets.

## 3. Discovery and content quality

- Pages intended for public discovery must preserve valid canonical URLs, indexability, structured metadata, and useful semantic content.
- Optimize for both conventional search engines and AI discovery without keyword stuffing or fabricated authority.
- Facts with time sensitivity must have a source and freshness signal appropriate to the claim.
- Special events and high-value seasonal content may receive prominent placement, but must still follow provenance and trust rules.

## 4. Data, consent, and privacy

- User consent state must never be silently broadened or reactivated.
- Unsubscribed users may not be reactivated without an explicit re-subscribe action whose semantics are defined in the feature spec.
- Collect only data needed for the user-facing feature or a defined operational purpose.
- Never expose secrets, tokens, private user data, or internal-only identifiers in client code or logs.

## 5. Engineering discipline

Every material change follows this path:

1. Define or update the current product spec.
2. Create a proposed change with acceptance criteria.
3. Clarify ambiguity before implementation.
4. Record an implementation plan when architecture or data behavior changes.
5. Break implementation into testable tasks.
6. Implement on a branch.
7. Run QA and integration QA.
8. Open a pull request that references the spec/change.
9. Merge only after required checks pass.
10. Verify production behavior after deployment.

Small typo/content-only changes may use a lightweight change note, but they do not bypass trust, accessibility, provenance, consent, or release rules.

## 6. Agent roles and authority

- Founder intent is the highest product input.
- Product/spec agents translate intent into explicit requirements; they do not invent business policy.
- Architect agents may propose technical approaches but must preserve the constitution and acceptance criteria.
- Builder agents implement the approved change and must not silently expand scope.
- QA/release agents verify independently from the builder and may block release.
- No agent may waive a constitutional requirement merely because implementation is difficult.

## 7. Release integrity

- `main` is production-bound and must be treated as a protected release branch.
- Normal production changes require a pull request.
- Mission Rated QA and Mission Rated Integration QA must pass before merge once repository rules permit enforcement.
- Force pushes and branch deletion on `main` should be disabled.
- Emergency/admin bypass, if retained, must be deliberate and followed by retrospective verification.
- A successful deployment is not equivalent to a healthy release; production behavior must be checked.

## 8. Definition of done

A change is done only when:

- requirements and acceptance criteria are satisfied;
- relevant automated checks pass;
- mobile behavior is verified;
- accessibility, SEO/AI discovery, provenance, consent, and security implications are considered where applicable;
- production behavior is verified for production-bound changes;
- the living spec reflects the system that now exists.

## 9. Change control

If a proposed feature conflicts with this constitution, the conflict must be surfaced explicitly. The constitution may be amended only as an intentional product/governance change, never implicitly as a side effect of implementation.