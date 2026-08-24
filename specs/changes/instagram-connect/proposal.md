# Change Proposal: Instagram Connect

## Summary
Add a focused Mission Rated `Instagram Connect` control surface for curating public Instagram Reels/posts into the existing Local Intel experience.

## Founder intent
Mission Rated should be able to follow local creators, find useful public content, paste an Instagram URL, review it, and publish the original Instagram embed to Local Intel without downloading or re-uploading creator media.

## Scope
- Add `/instagram-connect` as a focused curation tool (not a general admin console).
- Allow founder/operator access via a private access key validated server-side.
- Show existing Local Intel candidates and their status.
- Add a public Instagram Reel/post URL with creator handle, category/topic, place/entity hint, and Mission Rated summary.
- Publish or archive candidates.
- Reuse the existing `local_intel_discovery_candidates` table and existing public Local Intel renderer.

## Non-goals
- No scraping of the Instagram Following feed.
- No downloading, copying, editing, or re-uploading creator media.
- No automatic publishing without operator review.
- No change to Mission Rated ratings or ranking.

## Acceptance criteria
1. `/instagram-connect` is mobile-first and branded as Instagram Connect.
2. Mutation/list management calls require a server-validated private key; no service-role secret is exposed client-side.
3. Only valid `instagram.com` post/reel URLs can be added.
4. New items enter a reviewable state and can be explicitly published or archived.
5. Published items continue to appear through the existing `public-local-intel-candidates` endpoint and Instagram embed renderer.
6. Creator attribution and original Instagram URL remain attached to published content.
7. `npm run qa` passes before merge.
