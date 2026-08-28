# Growth event semantics

Mission Rated growth reporting must distinguish user intent from verified outcomes.

| Event | Meaning | May count as redemption? | May count as savings? |
| --- | --- | --- | --- |
| `deal_outbound_click` | User clicked from Mission Rated toward an offer | No | No |
| `claim_action` | Business/listing ownership claim CTA | No | No |
| `weekend_brief_signup_attempt` | User submitted a signup form | No | No |
| `weekend_brief_signup_confirmed` | Authoritative signup flow confirmed success | No | No |
| `share_action` | User initiated a share | No | No |
| `referral_visit` | Visit arrived with a Mission Rated referral token | No | No |

## Redemption and savings boundary

A deal redemption must not be inferred from a click, listing claim, share, referral visit, or page view. A future redemption event must come from an authoritative confirmation path (for example, a partner redemption callback, a Mission Rated redemption record, or another server-side source with equivalent evidence).

A savings ledger entry requires a confirmed redemption plus a defensible dollar value. Percentage offers without a known transaction amount, free-to-everyone admission, and unverified or estimated purchase values must not be counted as realized savings.

Paid status must never affect ratings, Mission Score, verification, or organic rank.
