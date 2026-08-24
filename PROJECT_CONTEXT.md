# Mission Rated Project Context

> Durable founder intent and build strategy for humans, coding agents, and LLMs.

## How to use this file

Read this file when you need to understand **why Mission Rated exists, what it is trying to become, how product decisions should be made, and how the founder wants the system built**.

This file is not a substitute for repository truth.

Before making a material change, also read:

1. `AGENTS.md` — operating rules and required engineering workflow.
2. `MISSION_RATED_CONSTITUTION.md` — non-negotiable product, trust, privacy, and engineering rules.
3. `specs/README.md` — how living specifications work.
4. Relevant files under `specs/current/` — authoritative description of behavior that exists today.
5. Relevant active change under `specs/changes/` — approved or proposed behavior that has not yet become current truth.

When this document expresses a future ambition that is not present in `specs/current/`, treat it as **direction, not shipped functionality**.

---

# 1. Founder intent

Mission Rated should become the **trusted decision and savings platform for the military community**.

The product should help military members, veterans, spouses, families, and military-connected communities quickly answer questions such as:

- What is worth doing today?
- Where can I save money because of military service?
- Which local businesses are genuinely military-friendly?
- Which businesses are veteran-owned or military-family owned?
- What places, schools, activities, services, and businesses can I trust?
- What local events or seasonal activities are worth my time?
- What deal is real, current, and actually useful?

The long-term goal is not to become another generic coupon site, review site, directory, or affiliate blog.

Mission Rated should combine **trusted discovery + verified savings + local intelligence + community signal** in one place built specifically for military families.

---

# 2. North-star mission

The core mission is:

> **Save military families money and make their local decisions easier.**

A key business and impact metric is **dollars saved for the military community**.

When Mission Rated negotiates a discount, surfaces an existing military discount, helps a user find a better offer, or directs a family toward a valuable benefit, that savings should eventually be measurable.

Growth, revenue, traffic, email subscriptions, partner count, and affiliate conversions matter, but they should support this mission rather than replace it.

A useful product decision test is:

> Does this make Mission Rated more useful, more trusted, or more capable of saving a military family money?

If the answer is no, the feature should have a very strong reason to exist.

---

# 3. Trust is the moat

Mission Rated wins only if users trust it.

Trust should compound over time through:

- Accurate and current deal information.
- Clear source provenance.
- Honest military-discount information.
- Transparent sponsored placements.
- Ratings that cannot be purchased.
- Clear differentiation between verified facts, researched information, community input, and commercial relationships.
- Fast correction of stale or incorrect information.
- A product experience that feels curated rather than cluttered.

Never trade long-term trust for short-term monetization.

Mission Rated should be comfortable saying that no military discount was found rather than inventing one or making a weak offer appear stronger than it is.

---

# 4. Product thesis

Mission Rated is best understood as several connected layers.

## Layer 1 — Daily utility

Give users an immediate reason to open Mission Rated.

Examples include:

- Today's Deals
- Local Deals
- Everyday Deals
- Seasonal and event-driven deal hubs
- Things to do
- Timely local opportunities

The homepage should prioritize **useful information now**, not explain the product repeatedly.

## Layer 2 — Trusted local discovery

Help users make decisions about:

- Places
- Businesses
- Schools
- Family activities
- Services
- Military-friendly destinations
- Veteran-owned and military-family-owned businesses

Mission Rated attributes, ratings, verification, sources, and military-discount information should make listings meaningfully more useful than a generic directory.

## Layer 3 — Savings network

Develop direct relationships with businesses and organizations to create discounts or offers specifically for the Mission Rated community.

Priority should generally favor:

- Strong consumer savings.
- Veteran-owned businesses.
- Military-friendly businesses.
- Local partners with strong community relevance.
- Partners willing to create an exclusive or clearly differentiated benefit.

## Layer 4 — Community and trusted content

Mission Rated should eventually become a place where useful military-community content can be discovered alongside deals and places.

This can include creator content, public social content where usage is permitted, local recommendations, guides, newsletters, and community contributions.

Content should increase usefulness and trust rather than become an engagement feed for its own sake.

## Layer 5 — Decision intelligence

Over time, Mission Rated should make fragmented information easier to understand by organizing it around actual decisions.

The destination is not simply "more listings." It is a system that helps a military family confidently decide **where to go, what to buy, what to do, and where they can save**.

---

# 5. Current product hierarchy

Unless a newer approved spec says otherwise, think about the main user journeys in roughly this order:

1. Today's Deals
2. Timely seasonal/special-event experiences
3. Local Deals
4. Everyday Deals
5. Places
6. Businesses
7. Schools
8. Other high-value decision tools such as vehicle buying

This hierarchy reflects a preference for **immediate usefulness first**, with deeper discovery available as the user explores.

Do not duplicate these concepts across multiple confusing navigation paths merely to expose more content.

---

# 6. Build strategy

## Ship useful slices, not giant rewrites

Prefer small, production-ready improvements that can be independently tested and released.

Refactor when it reduces fragility or duplication, but preserve user-facing behavior unless a product change has explicitly been approved.

Do not rewrite the application simply because a cleaner architecture could exist.

## Build reusable primitives

When the same product concept appears repeatedly, prefer a shared model or component rather than hardcoded one-off implementations.

Likely reusable concepts include:

- Business/place identity
- Military discount
- Offer/deal
- Source/provenance
- Verification state
- Mission Rated attributes
- Rating signals
- Geographic relevance
- Seasonal/event tags
- Partner status
- Affiliate/commercial relationship
- Content freshness

The goal is to make each new city, deal category, seasonal experience, or partner cheaper to launch than the one before it.

## Automate repetitive work

Mission Rated should increasingly automate the repetitive parts of:

- Deal discovery
- Freshness checks
- Source validation
- Partner research
- Outreach preparation
- Content ingestion
- Structured metadata
- Newsletter preparation
- QA
- Production verification

Automation must not manufacture trust. Human judgment or explicit product rules should remain where accuracy, partnership claims, rankings, verification, consent, or editorial judgment require them.

## Preserve reversibility

Favor changes that can be rolled back, migrated incrementally, and understood by another engineer or agent.

Avoid hidden coupling and unexplained magic.

---

# 7. AI and agent strategy

AI should make Mission Rated faster to build and operate, but not less trustworthy.

Agents can be used aggressively for:

- Research
- Classification
- Deduplication
- Drafting
- Data cleanup
- QA
- Code generation
- Refactoring
- Testing
- Operational analysis
- Partner discovery
- Content organization

Agents must not silently decide permanent product policy.

When an agent encounters ambiguity involving trust, sponsorship, ratings, user consent, verification, or what Mission Rated publicly claims, it should surface the decision rather than invent an answer.

A useful mental model is:

> **Agents accelerate execution. Specs preserve intent. The constitution protects trust.**

---

# 8. Multi-agent / multi-LLM interoperability

This repository should remain understandable to different capable models and engineering tools, including ChatGPT/Codex-style agents, Claude, Gemini, and future systems.

Do not depend on undocumented behavior unique to one model.

Important context should live in the repository in plain text or code, not only inside a chat history.

Prefer:

- Markdown instructions
- Explicit acceptance criteria
- Small scoped tasks
- Standard repository conventions
- Repeatable commands
- Machine-readable data where useful
- Clear source-of-truth boundaries

An incoming agent should be able to reconstruct product intent and current system behavior from the repository without access to the founder's previous AI conversations.

---

# 9. Product experience principles

## Mobile first

Military families are likely to discover deals, places, and activities from a phone. Mobile usability is primary.

## Useful before clever

The user should not need to understand Mission Rated's internal taxonomy to get value.

## Reduce clutter

Do not repeat source explanations, instructions, buttons, or cards merely because data exists.

## Make the valuable thing obvious

For a deal or listing, users should quickly understand the most important information:

- What is it?
- Why should I care?
- What is the military benefit or discount?
- Is it current?
- Where is it?
- How do I get it?
- Why should I trust this information?

## Preserve provenance without overwhelming the page

Sources matter, but source UI should support the decision rather than dominate the experience.

---

# 10. Discovery strategy

Mission Rated should be built to be discoverable by both conventional search engines and AI systems.

Public content should favor:

- Stable canonical URLs
- Semantic HTML
- Useful page titles and descriptions
- Structured data where appropriate
- Clear entity names and locations
- Freshness signals
- Source-backed factual content
- Internal links that reflect meaningful relationships
- Pages that directly answer a user need

Do not generate low-quality pages solely to increase index count.

The goal is to become a source that search engines and AI assistants can confidently reference for military-family local decisions and savings.

---

# 11. Growth strategy

Growth should come from usefulness and trusted distribution.

Important channels include:

- Search and AI discovery
- Email / recurring briefings
- Military and spouse communities
- Local partnerships
- Veteran-owned and military-friendly businesses
- Creators and influencers who already serve the military community
- Seasonal and local-interest content that people naturally share
- Direct partner promotion

When working with creators, the initial posture should be collaborative rather than transactional: Mission Rated can help distribute useful creator content while creators can help introduce Mission Rated to communities they have already earned trust with.

As audience and economics grow, more formal commercial arrangements can be evaluated.

---

# 12. Partnership strategy

Mission Rated should seek partnerships that make the product more useful, not merely increase logo count.

Good partnerships can provide one or more of:

- A meaningful military discount
- An exclusive Mission Rated offer
- Better local information
- Community credibility
- Valuable content
- Distribution
- Measurable user savings

A direct discount that saves users money is strategically valuable even when it produces no immediate revenue.

The relationship can become monetizable later if Mission Rated first earns user and partner trust.

---

# 13. Monetization philosophy

Mission Rated should maintain a valuable free core experience.

Potential revenue can include:

- Affiliate revenue
- Clearly labeled sponsorships
- Paid promotional placement that does not affect ratings
- Partner campaigns
- Qualified referrals or lead generation where appropriate
- Future premium business tools or services
- Other models that align Mission Rated's economics with measurable user value

Do not make monetization decisions that undermine rating independence, provenance, or user trust.

Revenue should ideally scale when Mission Rated creates measurable value.

---

# 14. Geographic strategy

Build locally enough to become genuinely useful, then make the operating model repeatable.

A new geography should not require recreating the product manually from scratch.

Architecture, content models, automation, and operations should make geographic expansion increasingly repeatable while preserving local relevance.

Avoid pretending national breadth is valuable if the underlying local information is shallow or stale.

Depth and trust in a market are more valuable than a large but weak directory.

---

# 15. Data strategy

Treat high-quality structured data as a strategic asset.

The system should increasingly be able to answer:

- What entity is this?
- Where is it?
- What military benefit exists?
- What is the source?
- When was it last checked?
- What Mission Rated attributes apply?
- Is there a partner relationship?
- Is there commercial compensation?
- What content is connected to it?
- What geographic and seasonal contexts apply?

Prefer one canonical entity with relationships over repeated copies of the same business or place scattered across features.

Deduplication is important. A business appearing in multiple experiences should normally remain one underlying entity, not become multiple conflicting records.

---

# 16. What not to optimize for

Do not optimize Mission Rated primarily for:

- Raw page count
- Maximum ad inventory
- Vanity partner counts
- Engagement for engagement's sake
- Complex architecture before it is needed
- AI-generated content volume
- Features copied from competitors without a Mission Rated use case
- Rewrites that do not improve user value or maintainability

Do not let a technically interesting solution distract from the mission.

---

# 17. Decision hierarchy for agents

When deciding what to do, use this priority order:

1. **Safety, legality, privacy, security, and user consent**
2. **Mission Rated Constitution**
3. **Explicit founder intent**
4. **Approved current/change specifications**
5. **User trust and factual provenance**
6. **User value and measurable savings**
7. **Reliability and maintainability**
8. **Speed of delivery**
9. **Growth and monetization optimization**
10. **Technical elegance**

If two instructions conflict, do not silently choose. Surface the conflict in the proposal or PR.

---

# 18. Default engineering behavior

Unless the task says otherwise:

- Read before editing.
- Preserve existing behavior during refactors.
- Prefer the smallest coherent change.
- Avoid unrelated cleanup inside scoped work.
- Centralize duplicated configuration and behavior when doing so reduces drift.
- Keep external service boundaries explicit.
- Never put secrets in client code.
- Preserve source and verification metadata.
- Add tests for behavior changes and meaningful regression risks.
- Treat production verification as part of release work.
- Maintain mobile quality.
- Preserve accessibility.
- Preserve SEO and AI discoverability.
- Document new product decisions in specs rather than leaving them implicit in code.

---

# 19. Definition of a strong Mission Rated feature

A strong feature usually does several of these things:

- Solves a clear military-family problem.
- Saves the user money, time, or uncertainty.
- Uses trustworthy, source-backed information.
- Feels simple on mobile.
- Reuses existing platform concepts rather than creating a parallel system.
- Improves structured data or operational leverage.
- Is discoverable outside the product.
- Creates a reason to return.
- Can scale to more partners, categories, or geographies.
- Does not compromise rating independence or trust.

---

# 20. Questions an agent should ask itself before shipping

1. What user problem is this solving?
2. How does it support the Mission Rated mission?
3. What is the authoritative spec for the behavior?
4. Am I changing product behavior or only implementation?
5. Could this affect ratings, sponsorship, provenance, verification, privacy, or consent?
6. Is there a simpler implementation that preserves the same value?
7. Am I creating duplicated data, configuration, UI, or policy?
8. Does this work well on mobile?
9. Will search engines and AI systems still understand the public page?
10. How will this be tested?
11. How will production behavior be verified?
12. If another agent opens the repository tomorrow, will the reasoning behind this change be understandable?

---

# 21. One-sentence orientation for a new LLM

> **Build Mission Rated as a trusted, mobile-first military-family decision and savings platform; use structured, source-backed local intelligence and partner discounts to create measurable value, automate repetitive operations aggressively without fabricating trust, ship incremental changes through the repository's spec-driven workflow, and never let monetization influence ratings or verification.**
