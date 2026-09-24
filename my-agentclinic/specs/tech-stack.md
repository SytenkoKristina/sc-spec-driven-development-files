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

- Not yet decided. The domain (agents, ailments, therapies,
  appointments) is small and relational, so a lightweight embedded or
  managed SQL database is the likely direction — to be finalized in a
  follow-up decision and recorded here when chosen.

## Styling / UI

- Not yet decided. Should support an "attractive, modern-browser"
  site (Steve's ask) without slowing down the small-phases roadmap —
  a utility-first CSS approach or a small component library are the
  leading candidates, to be finalized when the landing page phase
  starts.

## Tooling

- Next.js's own scripts (`dev`/`build`/`start`) handle
  type-checking/build; `tsc` is no longer invoked directly.
- Package manager: npm (matches the committed `package-lock.json`).
- Linting: ESLint via `eslint-config-next` (Phase 0), using
  `create-next-app`'s defaults. Formatting (e.g. Prettier) is still
  not configured.

## Deployment

- Not yet decided. Next.js's own hosting target (e.g. a
  Vercel-compatible platform) is the path of least resistance given
  the framework choice, but this is not finalized.

## Open decisions

This file intentionally leaves some choices unresolved (database,
styling, deployment, formatting) rather than guessing. Each should be
settled — and this file updated — when its roadmap phase starts.
