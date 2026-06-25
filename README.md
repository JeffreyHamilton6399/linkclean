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

LinkClean removes **46** tracking parameters across ad networks, social
platforms, email tools and analytics suites:

**Google / UTM** — `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`,
`utm_content`, `utm_id`, `utm_referrer`

**Facebook** — `fbclid`, `fb_action_ids`, `fb_action_types`, `fb_ref`,
`fb_source`

**Google Ads** — `gclid`, `gclsrc`, `dclid`

**Mailchimp** — `mc_cid`, `mc_eid`

**Microsoft** — `msclkid`

**Twitter / X** — `twclid`, `t`

**TikTok** — `ttclid`

**LinkedIn** — `li_fat_id`

**Pinterest** — `pinned_ct`

**Yandex** — `yclid`

**Amazon Associates** — `tag`, `linkCode`, `linkId`, `camp`, `creative`,
`creativeASIN`

**Generic / HubSpot / Branch / Vero / Instagram** — `ref`, `ref_src`,
`ref_url`, `referrer`, `source`, `campaign`, `_hsenc`, `_hsmi`, `hsCtaTracking`,
`igshid`, `sjid`, `cn-reloaded`, `sr_share`, `vero_id`, `wickedid`,
`_branch_match_id`

The full list lives in [`src/lib/params.ts`](src/lib/params.ts) and the
cleaning logic in [`src/lib/clean.ts`](src/lib/clean.ts).

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui (New York style)
- next-themes for dark mode
- Client-side only — no backend, no database, no API routes
- Zero runtime dependencies for URL parsing (native `URL` API)

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
