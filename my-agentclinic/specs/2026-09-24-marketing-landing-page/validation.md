# Validation — Marketing Landing Page (Roadmap Phase 1)

This phase is done when all of the following hold:

## Build & run

- [ ] `npm run dev` starts the app without errors.
- [ ] Visiting `/` in a modern browser renders the landing page — no
      build errors, no console errors.
- [ ] `npm run build` completes successfully (no type errors, no
      lint-blocking errors) and produces a production build.
- [ ] `npm run lint` passes.

## Content

- [ ] The page shows a headline and a short, one-line pitch
      explaining what AgentClinic is — a first-time visitor can tell
      what the site is for without scrolling.
- [ ] A single CTA element is present and uses a placeholder target
      (`mailto:` or an in-page anchor) — it does not link to a
      not-yet-built booking/dashboard route.
- [ ] `<title>` and meta description reflect AgentClinic, not
      `create-next-app`'s default "Create Next App" text.
- [ ] No leftover `create-next-app` boilerplate remains: no Next.js
      or Vercel logos, no "Deploy now" / "Read our docs" / template
      links.

## Styling

- [ ] Tailwind CSS is installed and its utility classes are what
      style the page (not the old `page.module.css`, which is
      deleted).
- [ ] `public/` no longer contains SVGs the page doesn't reference.
- [ ] Manually checked at a mobile width and a desktop width: no
      broken layout, no horizontal overflow, the CTA is reachable and
      legible at both.

## Scope discipline

- [ ] No dashboard routes, domain model, auth, or working
      booking/appointment flow were introduced — this phase is the
      static marketing page only, per `roadmap.md` Phase 1 and
      `requirements.md`'s "out of scope" list.
- [ ] `tech-stack.md`'s Styling / UI section records Tailwind as the
      chosen approach and no longer lists styling as an open
      decision; the remaining open decisions (data layer, deployment,
      formatting) are untouched.

## Sign-off

- [ ] A reviewer (or the demo/course use case) can clone the branch,
      run `npm install && npm run dev`, and see an attractive,
      on-brand landing page within a couple of minutes — this is the
      bar for "ready to merge and build Phase 2 (dashboard shell) on
      top of."
