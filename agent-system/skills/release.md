# Skill: Release

## Use when
A production-bound code or content change is ready to ship.

## Procedure
1. Confirm the change proposal/tasks match implementation.
2. Confirm branch is current enough to merge safely.
3. Run repository QA and relevant integration checks.
4. Open PR using the repository template and attach evidence.
5. Merge only after required checks pass.
6. Verify the exact merged SHA is deployed to production.
7. Perform route/smoke/visual checks required by the change.
8. Update current spec and durable control-plane state when shipped reality changed.

## Output contract
- branch/PR
- head and merged SHA
- QA/integration results
- production deployment evidence
- production verification result
- follow-on work

## Guardrails
Deployment success alone is not release success. Never waive failed acceptance criteria or production verification because CI/deployment completed.