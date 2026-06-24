/**
 * Tracking parameters stripped by LinkClean.
 *
 * These query-string parameters are used by ad networks, social platforms,
 * email marketing tools and analytics suites to follow users across the web.
 * They carry zero value for the destination page — only surveillance value —
 * so they are safe to remove before sharing a link.
 */
export const TRACKING_PARAMS: readonly string[] = [
  // Google Analytics / UTM
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "utm_referrer",

  // Facebook
  "fbclid",
  "fb_action_ids",
  "fb_action_types",
  "fb_ref",
  "fb_source",

  // Google Ads
  "gclid",
  "gclsrc",
  "dclid",

  // Mailchimp
  "mc_cid",
  "mc_eid",

  // Microsoft Ads
  "msclkid",

  // Twitter / X
  "twclid",
  "t",

  // TikTok
  "ttclid",

  // LinkedIn
  "li_fat_id",

  // Pinterest
  "pinned_ct",

  // Yandex
  "yclid",

  // Amazon Associates
  "tag",
  "linkCode",
  "linkId",
  "camp",
  "creative",
  "creativeASIN",

  // Generic / HubSpot / Branch / Vero / Instagram / SR / Wicked
  "ref",
  "ref_src",
  "ref_url",
  "referrer",
  "source",
  "campaign",
  "_hsenc",
  "_hsmi",
  "hsCtaTracking",
  "igshid",
  "sjid",
  "cn-reloaded",
  "sr_share",
  "vero_id",
  "wickedid",
  "_branch_match_id",
] as const;

/** Fast O(1) lookup set used by the cleaning logic. */
export const TRACKING_PARAM_SET: ReadonlySet<string> = new Set(
  TRACKING_PARAMS,
);

/** Total number of tracked parameters — used in copy/UI copy. */
export const TRACKING_PARAM_COUNT = TRACKING_PARAMS.length;
