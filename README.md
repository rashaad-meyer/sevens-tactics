# Sevens Tactics

Mobile-first viewer for the mixed 7-a-side team sheets. One sheet on screen at a
time, picked from a single "Game N | Half M" dropdown, drawn on a portrait pitch
with the position code inside each disc and the player's name beneath it.

Tuned for reading pitch-side in daylight: light chrome, saturated turf, white
name plates with near-black text.

## Run

```bash
pnpm install
pnpm dev          # local dev server
pnpm build        # production build in dist/
pnpm preview      # serve dist/ on http://localhost:4173
```

## Test

```bash
pnpm test             # unit + component tests (Vitest)
pnpm test:coverage    # with 80% thresholds enforced
pnpm e2e              # Playwright: behaviour, a11y, responsive, visual
pnpm e2e:update       # refresh visual baselines after an intentional change
pnpm lint
pnpm typecheck
```

Playwright browsers are installed once with `pnpm exec playwright install`.

## Deploy

Live site: https://d3rxl4s3ikuiak.cloudfront.net

Hosting is an S3 bucket (`sevens-tactics`, af-south-1) behind a CloudFront
distribution (`E11TFA5I1CL7FZ`). The bucket is private; CloudFront reads it
through an Origin Access Control. HTTP redirects to HTTPS, responses are
compressed, and any missing path falls back to `index.html` so hash routes
such as `/#/sheet/4/2` always resolve. Deploys are manual:

```bash
pnpm deploy:s3   # build, upload with cache headers, invalidate CloudFront
```

Requires the AWS CLI with credentials for the bucket's account. Hashed files
under `assets/` are uploaded as immutable for a year; `index.html` and the
favicon are uploaded with `max-age=0` so a new build is picked up as soon as
the invalidation completes (usually under a minute).

## Updating the team sheets

All data lives in `src/data/`:

- `players.ts` is the squad in bench order. Add `shortName` when a name is too
  long for the pitch (Laurie Ann shows as "LA").
- `teamSheets.ts` holds the eight line-ups keyed by slot (`ST`, `LM`, `CM`, `RM`,
  `LCB`, `RCB`, `GK`). The bench and the halves-played summary are derived from
  these, so there is nothing else to keep in sync.
- `formation.ts` holds the 2-3-1 slot coordinates in pitch units (100 wide by
  150 tall). The future tactics pages will animate the same slots.

`pnpm test` checks every sheet has seven unique players,
at least two girls (only ever at striker or wide midfield), and that pitch plus
bench equals the full squad.

## Structure

```text
src/
├── app/            router, layout shell
├── components/
│   ├── pitch/      SVG pitch, PositionMarker (no name), PlayerMarker, FormationLayer
│   ├── team-sheet/ TeamSheet, Bench, Legend, SheetNav
│   └── game-half-select/
├── data/           typed players, formation, sheets, selectors
├── hooks/          useSelectedSheet (URL is the source of truth)
├── pages/          TeamSheet, Summary, Tactics placeholder, NotFound
└── styles/         tokens.css, global.css
docs/reference/     original HTML team sheets
e2e/                Playwright specs and screenshot baselines
```
