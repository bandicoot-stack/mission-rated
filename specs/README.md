# Mission Rated Living Specifications

This directory describes what Mission Rated does today. It is the durable product truth for humans and engineering agents.

## Structure

- `current/` — current production behavior and product contracts.
- `changes/` — proposed or active changes that have not yet been absorbed into the current specs.
- `templates/` — lightweight templates for consistent feature work.

## Workflow

1. Read `MISSION_RATED_CONSTITUTION.md`.
2. Read the relevant file in `current/`.
3. Create `changes/<change-name>/proposal.md` using the template.
4. Add `design.md` when architecture, APIs, storage, security, or consent semantics change.
5. Add `tasks.md` before implementation.
6. Implement on a branch and link the pull request to the change directory.
7. QA against acceptance criteria and the constitution.
8. After release, update `current/` to describe the shipped behavior and archive or remove the completed change package.

The current specs describe reality, not aspirations. Proposed behavior belongs in `changes/` until it ships.