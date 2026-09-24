# Requirements — Project Scaffolding (Roadmap Phase 0)

## Scope

Confirm a working Next.js application on top of this repo's existing
TypeScript configuration. This phase is intentionally
product-agnostic: no marketing content, no dashboard, no domain
model. Success is a running "hello world" page plus working dev/build
scripts — the foundation later phases build on.

In scope:
- Scaffold a Next.js app (App Router) using `create-next-app`.
- Reconcile the generated config with what's already committed
  (`tsconfig.json`, `package.json`).
- App code lives under `src/app`, consistent with the repo's existing
  `src/` directory.
- `npm run dev` and `npm run build` work end to end.
- ESLint (and Prettier, if bundled with the standard setup) configured
  as part of this phase, using `create-next-app`'s defaults.
- A single bare hello-world route (`/`) — no styling decisions, no
  additional pages.

Out of scope (deferred to later phases per `roadmap.md`):
- Marketing landing page content (Phase 1).
- Dashboard shell/navigation (Phase 2).
- Data layer / domain model (Phase 3).
- Styling system decisions beyond whatever `create-next-app` defaults
  to (tech-stack.md still lists styling as unresolved).
- Deployment target (tech-stack.md still lists deployment as
  unresolved).
- Auth (Phase 6).

## Decisions

Made via stakeholder Q&A before writing this spec:

1. **Scaffolding method** — Run `create-next-app` fresh rather than
   hand-adding Next.js to the existing `package.json`/`tsconfig.json`.
   Reconcile the CLI's output with what's already committed (repo
   name, strict mode, etc.) rather than accepting it uncritically.
2. **Directory layout** — Use `src/app` (App Router nested inside the
   existing `src/` directory), not a root-level `app/`. This matches
   the repo's current structure and keeps a single top-level source
   root.
3. **Linting** — Set up ESLint (`create-next-app`'s default) now, in
   Phase 0, rather than deferring to the Phase 7 polish pass. Avoids
   configuring it twice.
4. **Legacy scaffold** — Remove the pre-existing `src/index.ts`
   ("Happy developing ✨") and the `tsc`-only `build` script / `main`
   field in `package.json`. Next.js's own dev/build scripts fully
   replace them; keeping both would leave two unrelated entry points.

## Context

- This repo starts from a minimal TypeScript scaffold: `tsconfig.json`,
  `package.json` with only a `build: tsc` script, and `src/index.ts`
  logging a placeholder string. No framework is wired up yet.
- `tech-stack.md` already commits to Next.js (App Router by default)
  as the framework, TypeScript everywhere with strict mode, and npm
  as the package manager — those choices are inherited, not re-decided
  here.
- `tech-stack.md` still lists styling, data layer, and deployment as
  open decisions. This phase does not resolve them; whatever
  `create-next-app` needs as a baseline (e.g. its default CSS
  approach) is treated as scaffolding plumbing, not a styling
  decision — Phase 1 is where styling gets decided deliberately.
- This project doubles as a teaching/demo artifact (see
  `mission.md`), so keep the scaffold clean and legible — a student or
  conference-demo audience should be able to look at the repo
  immediately after this phase and understand what's here and why.
