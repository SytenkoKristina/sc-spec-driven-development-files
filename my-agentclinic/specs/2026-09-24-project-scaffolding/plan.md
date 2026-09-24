# Plan — Project Scaffolding (Roadmap Phase 0)

Numbered task groups, intended to be worked roughly in order.

## 1. Scaffold Next.js

1.1. Run `create-next-app` into the repo (TypeScript, App Router,
     ESLint enabled, `src/` directory enabled so routes land in
     `src/app`).
1.2. Resolve any prompts/flags so generated output matches decisions
     in `requirements.md` (TypeScript, App Router, `src/app`, ESLint).

## 2. Reconcile generated config with existing repo files

2.1. Diff the generated `tsconfig.json` against the existing one;
     merge so strict mode and other existing compiler options survive,
     adopting Next.js's required additions (e.g. `plugins`, `paths`,
     `jsx`, module resolution settings).
2.2. Diff the generated `package.json` against the existing one;
     keep the project name/description/private fields, adopt Next.js's
     `dev`/`build`/`start`/`lint` scripts and dependencies.
2.3. Confirm `.gitignore` covers Next.js build artifacts (`.next/`,
     etc.) in addition to what's already listed.

## 3. Remove the legacy TypeScript-only scaffold

3.1. Delete `src/index.ts`.
3.2. Remove the old `tsc`-only `build` script and `main` field from
     `package.json` (superseded by Next.js's scripts).
3.3. Confirm no other file references the removed entry point.

## 4. Verify the hello-world page

4.1. Confirm `src/app/page.tsx` (or equivalent) renders without
     product-specific content — the default/minimal scaffold page is
     fine for this phase.
4.2. Run `npm run dev`, load the app in a browser, confirm the page
     renders with no console errors.
4.3. Run `npm run build`, confirm it completes without errors or
     type errors.
4.4. Run `npm run lint`, confirm it passes on the freshly generated
     code.

## 5. Wrap up

5.1. Update `tech-stack.md` only if scaffolding surfaced a concrete
     choice that should be recorded (e.g. Next.js version pinned) —
     do not resolve the still-open styling/data-layer/deployment
     decisions here.
5.2. Review `git status`/`git diff` for anything unexpected before
     committing.
5.3. Commit with a message describing the Phase 0 scaffold.
