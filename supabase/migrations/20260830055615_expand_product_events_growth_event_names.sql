alter table public.product_events drop constraint if exists product_events_event_name_check;

alter table public.product_events
  add constraint product_events_event_name_check
  check (
    event_name = any (
      array[
        'page_view'::text,
        'search'::text,
        'installation_change'::text,
        'source_click'::text,
        'feedback_open'::text,
        'data_report_open'::text,
        'beta_invite_share'::text,
        'referral_visit'::text,
        'return_visit'::text,
        'deal_click'::text,
        'deal_outbound_click'::text,
        'share_action'::text,
        'claim_action'::text,
        'weekend_brief_signup_attempt'::text,
        'weekend_brief_signup_confirmed'::text,
        'family_pass_cta_clicked'::text,
        'family_pass_cta_dismissed'::text,
        'directions_click'::text,
        'review_action'::text,
        'feedback_action'::text,
        'offer_source_click'::text,
        'official_website_click'::text,
        'internal_navigation'::text,
        'homepage_intent_selected'::text,
        'helpfulness_response'::text
      ]
    )
  );
