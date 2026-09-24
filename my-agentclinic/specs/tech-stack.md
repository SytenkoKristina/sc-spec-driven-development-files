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
  `create-next-app`'s defaults. Formatting (e.g. Prettier) is still
  not configured.
- Testing: **Vitest**, run via `npm test`. Chosen as a fast,
  TypeScript-native test runner that fits the existing Next.js/ESM
  setup without extra config.

## Deployment

- Not yet decided. Next.js's own hosting target (e.g. a
  Vercel-compatible platform) is the path of least resistance given
  the framework choice, but this is not finalized.

## Open decisions

This file intentionally leaves some choices unresolved (deployment,
formatting) rather than guessing. Each should be settled — and this
file updated — when its roadmap phase starts.
