# LinkClean

Strip tracking parameters from URLs — instantly, in your browser.

Paste a messy URL, get a clean one. No sign-up, no tracking, 100% client-side.
Stop sharing tracking data when you share links.

## What it does

- Paste a URL (or a batch of URLs, one per line)
- Instantly strips every known tracking parameter
- Shows the clean URL with one-click copy
- Shows exactly what was removed (transparency)
- Handles 100+ URLs instantly with zero async work

Everything runs in your browser. URLs **never** leave your device — there is
no backend, no API, no analytics.

## Tracking parameters stripped

LinkClean removes **90+ tracking parameters** (case-insensitive) across ad
networks, social platforms, email tools and analytics suites — from both the
query string **and** the URL fragment/hash:

**Google / UTM** — `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`,
`utm_content`, `utm_id`, `utm_referrer`, plus any other `utm_*` param (the
`utm_` prefix is globbed, so `utm_brand`, `utm_creative_format`, … are all
caught), and the GA linker `_gl`

**Facebook** — `fbclid`, `fb_action_ids`, `fb_action_types`, `fb_ref`,
`fb_source`

**Google Ads** — `gclid`, `gclsrc`, `dclid`, `gbraid`, `wbraid`

**Mailchimp** — `mc_cid`, `mc_eid`

**Microsoft** — `msclkid`

**Twitter / X** — `twclid`, `t`

**TikTok** — `ttclid`

**LinkedIn / Salesforce** — `li_fat_id`, `trk`, `trkInfo`, `trkCampaign`

**Pinterest** — `pinned_ct`, `epik`

**Yandex** — `yclid`

**Amazon Associates** — `tag`, `linkCode`, `linkId`, `camp`, `creative`,
`creativeASIN`

**Marketo** — `mkt_tok`

**Piwik / Matomo** — `pk_campaign`, `pk_kwd`, `pk_source`, `pk_medium`,
`pk_content`, `mtm_source`, `mtm_medium`, `mtm_campaign`, `mtm_keyword`,
`mtm_content`, `mtm_group`, `mtm_placement`

**HubSpot** — `_hsenc`, `_hsmi`, `_hsfp`, `_hssc`, `hsCtaTracking`, plus any
other `_hs*` param (globbed)

**Webtrends** — `wt_mc`, `wt_nv`, `wt_ti`, `wt_cg_n`, `wt_cg_s`, `wt_cv`,
`wt_cv_t`

**Eloqua** — `elqTrackId`, `elqTrack`

**Adobe (SiteCatalyst / Omniture / Target)** — `sc_campaign`, `sc_channel`,
`sc_media`, `sc_outcome`, `sc_geo`, `sc_country`, `at_preview`,
`at_preview_token`

**Silverpop / IBM** — `spJobID`, `spMailingID`, `spReportId`, `spUserID`,
`ito`

**Olytics** — `oly_enc_id`, `oly_anon_id`

**Other** — `spm` (Alibaba), `rb_clickid` (Redbubble)

**Generic / Branch / Vero / Instagram** — `ref`, `ref_src`, `ref_url`,
`referrer`, `source`, `campaign`, `igshid`, `sjid`, `cn-reloaded`, `sr_share`,
`vero_id`, `wickedid`, `_branch_match_id`

Matching is **case-insensitive** (`UTM_SOURCE`, `FbClid` are caught), and the
**URL fragment is cleaned too** — the GA linker `_gl` and `utm_*` params often
hide in `#` rather than `?`.

The full list lives in [`src/lib/params.ts`](src/lib/params.ts) and the
cleaning logic in [`src/lib/clean.ts`](src/lib/clean.ts).

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui (New York style)
- next-themes for dark mode
- Client-side only — no backend, no database, no API routes
- Zero runtime dependencies for URL parsing (native `URL` API)
- **Safe by design**: never follows redirects, never contacts any server,
  never touches the scheme/host/path — only tracking query/fragment params are
  removed. Non-web URLs (`mailto:`, `tel:`) are left untouched.

## Local development

```bash
bun install
bun run dev
```

Then open the app at `http://localhost:3000`.

```bash
bun run lint   # ESLint
bun run build  # production build
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Next.js — no environment variables are needed.
4. Deploy.

## Author

**Jeffrey Hamilton** — [@JeffreyHamilton6399](https://github.com/JeffreyHamilton6399)

Donate: <https://buymeacoffee.com/jeffreyscof>

## License

MIT
