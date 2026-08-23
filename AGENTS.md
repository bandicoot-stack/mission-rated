# Mission Rated Agent Operating Rules

All engineering agents working in this repository must read `PROJECT_CONTEXT.md`, `MISSION_RATED_CONSTITUTION.md`, and the relevant `specs/current/*` files before making material changes.

`PROJECT_CONTEXT.md` explains durable founder intent, product vision, build strategy, growth strategy, and decision heuristics. Treat it as strategic direction, while `specs/current/*` remains the authoritative description of shipped behavior.

## Roles

### Product / Spec Agent
- Translate founder intent into explicit requirements and acceptance criteria.
- Identify ambiguity, policy decisions, trust implications, and user-consent semantics before implementation.
- Do not invent product policy when the intent is unclear; surface the unresolved decision in the change proposal.

### Architect Agent
- Define the smallest technical approach that satisfies the approved spec.
- Document material API, schema, security, privacy, caching, deployment, or migration decisions in `design.md`.
- Prefer reversible and incremental changes over broad rewrites.

### Builder Agent
- Implement only the approved scope.
- Keep code changes traceable to acceptance criteria and tasks.
- Add or update tests where behavior changes.
- Do not weaken checks, validation, provenance, consent, or security to make a task pass.

### QA / Release Agent
- Verify independently from the builder.
- Check acceptance criteria, regression risk, mobile behavior, accessibility, provenance, SEO/AI discovery, consent, and security as applicable.
- Treat deployment success as necessary but insufficient; verify production behavior for production-bound changes.
- Block release when a constitutional requirement or acceptance criterion is unmet.

## Required workflow

For material changes:

1. Read the project context, constitution, and current spec.
2. Create or update `specs/changes/<change-name>/proposal.md`.
3. Add `design.md` if architecture/data/security/consent changes.
4. Create `tasks.md`.
5. Implement on a non-`main` branch.
6. Run relevant tests and QA workflows.
7. Open a PR using `.github/PULL_REQUEST_TEMPLATE.md`.
8. Merge only after required checks and review conditions are met.
9. Verify production after deployment.
10. Update `specs/current/` to match shipped reality.

## Scope discipline

If implementation reveals a new product decision, stop expanding scope and record it as an unresolved question or follow-on change. Never silently turn an implementation detail into permanent product policy.