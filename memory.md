# Project Memory

Last updated: 2026-10-04 (Asia/Taipei)

## Product intent and current content

- SPX Setups is a bilingual collection of personal SPX 0DTE market observations. Every setup is experimental and unbacktested; there is no formal/informal setup distinction.
- The homepage currently presents six setups together. The cover sequence is `Risk → Location → Confirmation` / `风险 → 位置 → 确认`.
- The former homepage “Hard rules / 硬规则” teaching section was intentionally removed.
- Setup 06 is **Magic 13–21 Turn / 神奇 13–21 转**:
  - In a choppy 1-minute decline, observe the 13 turn.
  - In a one-way 1-minute selloff, observe the 21 turn.
  - In extreme conditions, observe the 5-minute 9 turn (about 45 one-minute candles), then the 5-minute 13 turn (about 65 one-minute candles).
  - The dedicated route is `/playbook/magic-13-21-turn`; it includes 1m and 5m example charts and repeatedly states that a completed count is not a guaranteed bottom or direct entry signal.

## Recent changes and features

- `25c61bd` added Setup 06, its chart data, dedicated page, unified experimental wording, six-setup navigation, and the updated homepage case matrix.
- `17cdbe7` changed the cover thesis to emphasize waiting for location rather than guessing direction and updated the social preview artwork.
- `d4b2e37` configured the canonical production domain at `https://setups.myspx.trade`; the Workers preview remains available at `https://spx-setups.mmoptions.workers.dev`.
- `209b894` added a quiet footer page-view counter:
  - The client sends one cached `POST /api/page-views` request per page load.
  - A Cloudflare Durable Object named `PageViewCounter` stores the site-wide total under `pageViews`.
  - `GET` reads the total, `POST` increments it, cross-origin POSTs are rejected, and failures return 503 without breaking the site UI.
- `1e73d53` simplified the page-view counter styling by removing decorative dots.
- `2b03a92` added a `Lab` link to the Setups header and footer; `66da055` made the footer mark visibly read `Lab`.

## Architecture and deployment notes

- Stack: Next.js 16 + React 19, built through Vinext/Vite for Cloudflare Workers.
- Production build output is `dist/server` and `dist/client`; this is not an OpenNext project and does not use `.next` as its deployment artifact.
- `wrangler.jsonc` owns the custom domain route, static asset binding, Durable Object binding/migration, and observability configuration.
- Metadata and Open Graph URLs use `https://setups.myspx.trade` as the canonical site.

## Verification status

Checks run on 2026-10-04:

- `npm run lint`: completed with **0 errors and 2 warnings**. Both warnings are the existing Next.js `no-img-element` warnings in `app/components/site-shell.tsx` and `app/playbook/[slug]/page.tsx`.
- `./node_modules/.bin/vinext build`: **passed**. Routes built include `/`, `/playbook`, `/playbook/:slug`, and `/playbook/magic-13-21-turn`.
- `node --test tests/*.test.mjs`: **3 passed, 2 failed**.
  - `renders development preview metadata` fails under the plain Node ESM loader because the built Worker imports the `cloudflare:` URL scheme.
  - `emits the catalog's animation and scrolling utilities` fails because the current compiled CSS no longer contains the asserted `scrollbar-width: thin` utility (and the test stops at that first missing assertion).
  - Progress semantics, chart dark-mode output, and deterministic sidebar skeleton tests pass.
- On macOS, `npm run build` uses `scripts/build-verified.sh`, which expects GNU `timeout`. When GNU `timeout` is unavailable, run the Vinext binary directly for local verification as above; CI should continue using the repository scripts in their intended Linux environment.

## Git and contribution requirements

- Primary branch and push target: `main` → `origin/main`.
- Before every new commit, verify both effective identities with:
  - `git var GIT_AUTHOR_IDENT`
  - `git var GIT_COMMITTER_IDENT`
- Required author and committer identity: `kain26 <xpengkang@outlook.com>`.
- If either identity differs, correct the repository configuration or environment before committing. Do not rely on the machine-generated local identity and do not rewrite historical commits unless explicitly requested.
