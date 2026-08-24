# Change Proposal: Instagram Connect

## Summary
Add a focused Mission Rated `Instagram Connect` control surface for curating public Instagram Reels/posts into the existing Local Intel experience.

## Founder intent
Mission Rated should be able to follow local creators, find useful public content, paste an Instagram URL, review the original Instagram-hosted content, and publish it to Local Intel without downloading, re-uploading, or scraping creator media.

## Scope
- Add `/instagram-connect` as a focused curation tool (not a general admin console).
- Allow founder/operator access via a private access key validated server-side.
- Show existing Local Intel candidates and their status.
- Accept a public Instagram Reel/post URL and immediately render the native Instagram embed for review.
- Make creator handle, category/topic, place/entity hint, and Mission Rated summary optional intake fields.
- Publish or archive candidates.
- Reuse the existing `local_intel_discovery_candidates` table and existing public Local Intel renderer.

## Non-goals
- No scraping of the Instagram Following feed.
- No downloading, copying, editing, or re-uploading creator media.
- No persistent metadata harvesting from Instagram oEmbed.
- No automatic publishing without operator review.
- No change to Mission Rated ratings or ranking.

## Acceptance criteria
1. `/instagram-connect` is mobile-first and branded as Instagram Connect.
2. Mutation/list management calls require a server-validated private key; no service-role secret is exposed client-side.
3. Only valid `instagram.com` post/reel/tv URLs can be added.
4. Pasting a supported public Instagram URL renders the Instagram-hosted post/reel preview when Instagram permits embedding.
5. New items enter a reviewable state and can be explicitly published or archived without requiring copied Instagram metadata.
6. Review cards render the original Instagram content so creator attribution, caption, and media remain visible during review.
7. Published items continue to appear through the existing `public-local-intel-candidates` endpoint and Instagram embed renderer.
8. Missing manually supplied creator-handle metadata does not fabricate an Instagram username; the original embed remains the attribution source.
9. `npm run qa` passes before merge.
