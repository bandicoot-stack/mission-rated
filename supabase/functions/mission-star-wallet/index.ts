import { createClient } from 'npm:@supabase/supabase-js@2.95.0'
import { corsHeaders } from 'npm:@supabase/supabase-js@2.95.0/cors'

// CORS: wildcard access is intentional because this read-only endpoint returns device-scoped, non-identifying progress and uses no browser credentials.
const WINDOW_MS = 60_000
const MAX_REQUESTS = 60
const buckets = new Map<string, { count: number; resetAt: number }>()

function clientKey(req: Request) {
  return req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

function rateLimited(req: Request) {
  const now = Date.now()
  const key = clientKey(req)
  const current = buckets.get(key)
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  current.count += 1
  if (buckets.size > 5000) {
    for (const [bucketKey, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(bucketKey)
  }
  return current.count > MAX_REQUESTS
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const headers = { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  if (req.method !== 'GET') return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405, headers: { ...headers, Allow: 'GET, OPTIONS' } })
  if (rateLimited(req)) return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429, headers: { ...headers, 'Retry-After': '60' } })

  try {
    const url = new URL(req.url)
    const deviceId = String(url.searchParams.get('device_id') || '').slice(0, 120)
    if (deviceId.length < 12) return new Response(JSON.stringify({ earned: 0, pending: 0 }), { status: 200, headers })

    const secrets = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}')
    const secret = secrets.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!secret) throw new Error('missing_secret')
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, secret, { auth: { persistSession: false } })

    const [{ data: contributor }, { data: contributions }, { data: feedback }] = await Promise.all([
      supabase.from('mission_contributors').select('mission_stars,approved_contributions,rank_name').eq('device_id', deviceId).maybeSingle(),
      supabase.from('mission_contributions').select('contribution_type').eq('device_id', deviceId).eq('status', 'pending'),
      supabase.from('beta_feedback').select('id').eq('device_id', deviceId).eq('status', 'new')
    ])

    const pendingMap: Record<string, number> = { restaurant: 1, realtor: 2, business: 1, review: 1, discount: 1, other: 1 }
    const contributionPending = (contributions || []).reduce((sum: number, row: any) => sum + (pendingMap[row.contribution_type] || 0), 0)
    const feedbackPending = (feedback || []).length

    return new Response(JSON.stringify({
      earned: Number(contributor?.mission_stars || 0),
      pending: contributionPending + feedbackPending,
      approved_contributions: Number(contributor?.approved_contributions || 0),
      rank: contributor?.rank_name || 'Scout'
    }), { status: 200, headers })
  } catch (error) {
    console.error('mission-star-wallet', error)
    return new Response(JSON.stringify({ earned: 0, pending: 0 }), { status: 200, headers })
  }
})
