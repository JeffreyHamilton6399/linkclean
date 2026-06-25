/**
 * Tracking parameters stripped by LinkClean.
 *
 * These query-string (and fragment) parameters are used by ad networks, social
 * platforms, email marketing tools and analytics suites to follow users across
 * the web. They carry zero value for the destination page — only surveillance
 * value — so they are safe to remove before sharing a link.
 *
 * Matching is case-insensitive (e.g. `UTM_SOURCE`, `FbClid` are caught).
 */
export const TRACKING_PARAMS: readonly string[] = [
  // Google Analytics / Urchin Tracking Module (utm_* also covered by the
  // prefix glob below — these are the canonical, most-common members).
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "utm_referrer",

  // Google Analytics linker / cross-domain
  "_gl",

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
  "gbraid", // iOS cross-device
  "wbraid", // Android cross-device

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

  // LinkedIn / Salesforce
  "li_fat_id",
  "trk",
  "trkInfo",
  "trkCampaign",

  // Pinterest
  "pinned_ct",
  "epik", // enhanced match click id

  // Yandex
  "yclid",

  // Amazon Associates
  "tag",
  "linkCode",
  "linkId",
  "camp",
  "creative",
  "creativeASIN",

  // Marketo
  "mkt_tok",

  // Piwik / Matomo (legacy pk_*)
  "pk_campaign",
  "pk_kwd",
  "pk_source",
  "pk_medium",
  "pk_content",

  // Matomo (new mtm_*)
  "mtm_source",
  "mtm_medium",
  "mtm_campaign",
  "mtm_keyword",
  "mtm_content",
  "mtm_group",
  "mtm_placement",

  // HubSpot (also covered by the _hs prefix glob)
  "_hsenc",
  "_hsmi",
  "_hsfp",
  "_hssc",
  "hsCtaTracking",

  // Webtrends
  "wt_mc",
  "wt_nv",
  "wt_ti",
  "wt_cg_n",
  "wt_cg_s",
  "wt_cv",
  "wt_cv_t",

  // Eloqua
  "elqTrackId",
  "elqTrack",

  // Adobe SiteCatalyst / Omniture
  "sc_campaign",
  "sc_channel",
  "sc_media",
  "sc_outcome",
  "sc_geo",
  "sc_country",

  // Adobe Target
  "at_preview",
  "at_preview_token",

  // Silverpop / IBM
  "spJobID",
  "spMailingID",
  "spReportId",
  "spUserID",

  // Olytics
  "oly_enc_id",
  "oly_anon_id",

  // IBM Digital Analytics
  "ito",

  // Alibaba (Super Position Model)
  "spm",

  // Redbubble
  "rb_clickid",

  // Generic / Branch / Vero / Instagram / SR / Wicked
  "ref",
  "ref_src",
  "ref_url",
  "referrer",
  "source",
  "campaign",
  "igshid",
  "sjid",
  "cn-reloaded",
  "sr_share",
  "vero_id",
  "wickedid",
  "_branch_match_id",
] as const;

/**
 * Prefix globs — any parameter whose name (lowercased) starts with one of these
 * is treated as tracking. These are dedicated tracking namespaces where the
 * prefix unambiguously identifies a tracker, so globbing is safe:
 *
 *  - `utm_`  — Urchin Tracking Module (Google). Every `utm_*` is a tracker.
 *  - `_hs`   — HubSpot analytics namespace.
 *
 * Piwik (`pk_`) and Matomo (`mtm_`) are also dedicated namespaces, but their
 * common members are listed explicitly above to keep the "removed" report
 * readable; the globs below intentionally stay conservative.
 */
export const TRACKING_PREFIXES: readonly string[] = ["utm_", "_hs"] as const;

/** Fast O(1) lookup set (lowercased) used by the cleaning logic. */
export const TRACKING_PARAM_SET: ReadonlySet<string> = new Set(
  TRACKING_PARAMS.map((p) => p.toLowerCase()),
);

/** Total number of explicitly-listed tracking parameters. */
export const TRACKING_PARAM_COUNT = TRACKING_PARAMS.length;
