# Design: Instagram Connect

## Approach
Use the existing static Mission Rated frontend and Supabase Edge Function architecture. Add a static `/instagram-connect` page plus a small browser controller. The page calls a new Edge Function for operator-only list/create/status-change operations.

## Security
- The browser never receives a Supabase service-role key.
- Operator access uses a high-entropy key entered into the page and held only in `sessionStorage`.
- The Edge Function stores only the SHA-256 digest of that key in source and compares the digest of the presented key using a constant-time comparison.
- The management Edge Function uses the existing server-side Supabase secret only after access-key validation.
- The endpoint keeps `verify_jwt=false` because it implements custom secret authentication; this avoids creating a broad user-auth policy solely for this founder tool.

This is intentionally an incremental control plane. A later change can replace the access key with Supabase Auth/role-based authorization without changing the content model.

## Data
Reuse `public.local_intel_discovery_candidates`. No schema change is required. New manually curated rows use:
- `evidence_source = 'instagram_manual'`
- `evidence_url = instagram_url`
- `status = 'pending'` until explicitly published

Existing statuses such as `needs_instagram_url` and `published` remain supported.

## Content safety / provenance
- Accept only HTTPS Instagram post/reel URLs.
- Store the creator handle and original URL.
- Mission Rated summary is separate from creator content.
- Public rendering remains the existing Instagram-hosted embed; no media is copied into Mission Rated storage.

## UI
`/instagram-connect` contains:
- access-key gate;
- Add Reel/Post form;
- Review Queue;
- Published content;
- Archive action.

The page is not linked from public primary navigation.
