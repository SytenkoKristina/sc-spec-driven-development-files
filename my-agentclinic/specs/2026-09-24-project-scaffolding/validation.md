# Validation — Project Scaffolding (Roadmap Phase 0)

This phase is done when all of the following hold:

## Build & run

- [ ] `npm install` completes cleanly from a fresh clone/checkout.
- [ ] `npm run dev` starts the Next.js dev server without errors.
- [ ] Visiting the app in a modern browser renders a page — no build
      errors, no console errors.
- [ ] `npm run build` completes successfully (no type errors, no
      lint-blocking errors) and produces a production build.
- [ ] `npm run lint` passes.

## Structure

- [ ] App Router code lives under `src/app`, not a root-level `app/`.
- [ ] `tsconfig.json` still has `strict: true`.
- [ ] `package.json` reflects Next.js's `dev`/`build`/`start`/`lint`
      scripts; the old `tsc`-only `build` script and `main` field
      pointing at `src/index.ts` are gone.
- [ ] `src/index.ts` no longer exists.

## Scope discipline

- [ ] No marketing copy, dashboard routes, domain model, auth, or
      styling decisions were introduced — this phase is scaffolding
      only, per `roadmap.md` Phase 0 and `requirements.md`'s "out of
      scope" list.
- [ ] `tech-stack.md`'s open decisions (data layer, styling,
      deployment, linting-beyond-defaults) are left as-is unless
      scaffolding forced a concrete, worth-recording choice.

## Sign-off

- [ ] A reviewer (or the demo/course use case) can clone the branch,
      run `npm install && npm run dev`, and see a working hello-world
      page within a couple of minutes — this is the bar for "ready to
      merge and build Phase 1 (marketing landing page) on top of."
