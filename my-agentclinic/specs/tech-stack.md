# Tech Stack

## Language

- **TypeScript** everywhere (server and client) — already scaffolded
  in this repo (`tsconfig.json`, `typescript` devDependency). Strict
  mode stays on.

## Framework

- **Next.js**, used full-stack: the app (marketing pages + dashboard)
  and the server-side API/route handlers live in one framework and
  one deploy. This satisfies Mary's ask for a popular, reliable
  TypeScript-based stack, and gives the dashboard and the public site
  a shared codebase instead of a separate frontend/backend split.
- The App Router is the default choice for new routes; React Server
  Components are used where they avoid unnecessary client JS
  (marketing pages especially), with client components reserved for
  interactive dashboard/booking UI.
- Scaffolded via `create-next-app` (Phase 0) on Next.js 16.3.6 /
  React 19.2.8, with the App Router under `src/app`.

## Data layer

- **SQLite** (embedded, file-based) via **Prisma** as the ORM (Phase
  2). Chosen over managed Postgres to keep the project demoable with
  zero external infra to provision, given this repo doubles as a
  teaching/conference-demo artifact (`mission.md`). Schema lives in
  `prisma/schema.prisma`; the Prisma Client is generated to
  `src/generated/prisma` (gitignored) and accessed through the
  singleton in `src/lib/db.ts`.
- Pinned to **Prisma 6.19.3** (both `prisma` and `@prisma/client`),
  not the `latest` dist-tag (8.0.0-rc at the time of writing) —
  Prisma 7+ requires Node 20.19+/22.12+/24+, which excludes this
  environment's Node 23.7.0 (an odd-numbered, non-LTS release).
  Prisma 6.x supports Node >=18.18. Revisit the pin once the
  environment is on an LTS Node version.

## Auth

- **Lightweight role-picker session** (Phase 3), not a credential
  system: an agent or staff member signs in with a name + role
  (`Agent`/`Staff`) at `/dashboard`, no password. A server-side
  `Session` row (`prisma/schema.prisma`) is created and its `id` is
  stored as an opaque token in an httpOnly cookie (`src/lib/session.ts`)
  — the cookie can't be read or forged client-side, but there's no
  encryption/JWT layer beyond that, since this repo has no real
  accounts to protect (`mission.md`'s teaching/demo framing). See
  `specs/2026-09-27-accounts-and-access/`.

## Styling / UI

- **PicoCSS** (superseded Tailwind CSS in Phase 2), a
  semantic-HTML-first CSS framework (the default build, not the
  classless variant — a `.container` class is still used for
  layout width, and `role="button"` styles link/button elements).
  Chosen so both the marketing site and the dashboard get sensible
  default styling (typography, forms, buttons, nav, tables) from
  minimal markup, without hand-rolling utility classes for
  dashboard/booking UI. Tailwind (Phase 1's original choice) is
  removed as part of the Phase 2 work — see
  `specs/2026-09-24-dashboard-domain-model-booking-flow/`; the
  Phase 1 landing page is migrated to PicoCSS rather than left on
  Tailwind, so the repo has one styling system.

## Tooling

- Next.js's own scripts (`dev`/`build`/`start`) handle
  type-checking/build; `tsc` is no longer invoked directly.
- Package manager: npm (matches the committed `package-lock.json`).
- Linting: ESLint via `eslint-config-next` (Phase 0), using
  `create-next-app`'s defaults, plus `eslint-config-prettier` (Phase
  4 polish pass) to disable the handful of stylistic ESLint rules
  that would otherwise fight Prettier.
- Formatting: **Prettier** (Phase 4), default config (`.prettierrc.json`
  is empty — no project-specific overrides needed). Scoped to source
  code only (`.prettierignore` excludes `*.md`): this repo's specs,
  changelog, and skill docs are hand-formatted prose, and Prettier's
  markdown reflow would produce noisy, unrelated diffs across them.
  `npm run format` writes, `npm run format:check` verifies in CI-like
  fashion.
- Testing: **Vitest**, run via `npm test`. Chosen as a fast,
  TypeScript-native test runner that fits the existing Next.js/ESM
  setup without extra config.

## Deployment

- **Vercel** (Phase 4), matching Next.js's own recommended hosting
  path and requiring no separate infra to provision — consistent
  with this repo's zero-external-infra, demo/teaching posture
  (`mission.md`). One constraint worth stating explicitly rather
  than leaving as a surprise: Vercel's filesystem is ephemeral
  per-deploy, so the SQLite `dev.db` file (and anything written to
  it in production) does not persist across deploys — acceptable for
  a demo, but a real production deployment would need a durable data
  layer (e.g. a hosted Postgres) instead. Connecting the actual
  Vercel project/account is a manual step, not automated here.

## Open decisions

Both decisions this file originally left open (deployment,
formatting) are now resolved, as of the Phase 4 polish pass
(`specs/2026-09-27-polish-pass/`).
