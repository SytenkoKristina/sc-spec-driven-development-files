# Requirements — Marketing Landing Page (Roadmap Phase 1)

## Scope

Build the public-facing `/` landing page: what AgentClinic is, and a
clear call to action. This phase replaces `create-next-app`'s
boilerplate homepage content with real (if minimal) marketing copy,
and resolves `tech-stack.md`'s open styling decision along the way.

In scope:
- Replace the boilerplate hero on `src/app/page.tsx` with a minimal
  landing page: a headline plus a short, one-line pitch explaining
  what AgentClinic is.
- Add Tailwind CSS to the project and use it to style the page.
- A single call-to-action element, using a placeholder target (see
  Decisions) since no real booking/dashboard flow exists yet.
- Update the page's `<title>`/meta description (`src/app/layout.tsx`)
  to reflect AgentClinic instead of the "Create Next App" default.
- Remove `create-next-app`'s leftover boilerplate: the Next.js/Vercel
  logos, template/learn links, and the now-unused
  `src/app/page.module.css` plus any `public/*.svg` assets the
  boilerplate referenced that the new page doesn't use.
- Manual visual/responsive check in a browser at mobile and desktop
  widths.
- Automated component/page tests (Vitest) for the Header, Main,
  Footer, and Layout components, and for the `Home` page — covering
  what renders (wordmark, hero heading, pitch copy, CTA target),
  not visual/style regressions.

Out of scope (deferred to later phases per `roadmap.md`):
- A working booking/appointment flow (Phase 4) — the CTA does not
  link to a real flow.
- Dashboard shell/navigation (Phase 2).
- Data layer / domain model (Phase 3) — content is static, hardcoded
  copy.
- Auth (Phase 6).
- Sections beyond hero + pitch + CTA (e.g. a dedicated audiences
  breakdown, features, or "how it works" section) — deferred to a
  later pass if the roadmap calls for expanding the landing page.
- Automated performance/accessibility scoring (e.g. Lighthouse
  thresholds) — manual visual/responsive check is the bar for this
  phase.
- Any further tech-stack.md open decisions (data layer, deployment).

## Decisions

Made via stakeholder Q&A before writing this spec:

1. **Styling approach** — Tailwind CSS. Resolves `tech-stack.md`'s
   open styling decision now that the landing page phase has started,
   per that file's own note that styling would be "finalized when the
   landing page phase starts." Chosen over a component library
   (more setup than a single minimal page needs) and over keeping
   plain CSS Modules (utility-first CSS is faster to iterate with for
   an attractive single page, and is a widely-known default for
   live demos).
2. **CTA target** — A placeholder action (e.g. a `mailto:` link or an
   in-page anchor), not a disabled button or a link to a stub route.
   Reasoning: the CTA should do *something* real (no fake "Coming
   soon" dead button), but must not imply a booking/dashboard flow
   exists yet — that's Phase 2/4 work.
3. **Content scope** — Minimal: a hero headline plus a short one-line
   pitch, no separate audiences/features/how-it-works sections.
   Keeps this phase small and demoable, consistent with
   `mission.md`'s emphasis on small, incremental, live-demoable
   phases.
4. **Metadata** — Update `<title>`/meta description to AgentClinic
   branding as part of this phase, rather than deferring to the
   Phase 7 polish pass. Minimal SEO hygiene, and directly serves
   mission.md's "visitors should immediately understand what
   AgentClinic does."
5. **Copy process** — Copy is drafted and implemented in a single
   pass (no separate draft-then-approve checkpoint); reviewed via the
   final diff like the rest of the change.
6. **Validation bar** — Manual visual + responsive check (mobile and
   desktop widths, no console/build errors) satisfies "attractive and
   works well on modern browsers" for this phase. No automated
   Lighthouse/accessibility score threshold.
7. **Testing** — Vitest (already added to `tech-stack.md`'s Tooling
   section as the project's test runner) is used here for its first
   real tests: rendering checks on the Header/Main/Footer/Layout
   components and the `Home` page, via
   `@testing-library/react` + `jsdom`. These are unit/render tests,
   not a replacement for the manual visual/responsive check in
   Decision 6 — Vitest doesn't assert on layout/visual appearance.

## Context

- This repo starts from Phase 0's Next.js scaffold (App Router,
  `src/app`, ESLint, ESM/strict TypeScript) — see
  `specs/2026-09-24-project-scaffolding/`. That scaffold's default
  `create-next-app` homepage is what this phase replaces.
- `mission.md` frames AgentClinic as playful in copy/branding but
  production-grade underneath, and names visitors as one of three
  audiences who should "immediately understand what AgentClinic does
  and want to explore further" — this phase is squarely about that
  audience.
- `roadmap.md` Phase 1 explicitly prioritizes looking attractive and
  working well on modern browsers (Steve's ask), and explicitly scopes
  this phase to static content only, no data layer.
- `tech-stack.md` listed styling as an open decision, flagged to be
  "finalized when the landing page phase starts" — this phase is that
  moment; the decision (Tailwind) should be recorded back into
  `tech-stack.md` as part of wrap-up.
- This project doubles as a teaching/demo artifact (see
  `mission.md`), so the landing page should read as a clean, small,
  live-demoable step — not a fully fleshed-out marketing site.
