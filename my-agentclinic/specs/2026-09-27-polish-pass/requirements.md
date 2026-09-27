# Requirements — Polish Pass (Roadmap Phase 4)

## Scope

Responsive/accessibility/visual polish across the whole app, and
resolving the remaining open `tech-stack.md` decisions (deployment,
formatting) — per `roadmap.md`'s Phase 4. Per the MVP scoping
decision for this round, this phase runs *last*, after
`specs/2026-09-27-accounts-and-access/` and
`specs/2026-09-27-extended-features/`, so it covers the sign-in UI,
cancel/reschedule controls, therapy/ailment detail pages, search box,
and notification banners those phases add — not just the Phase 1/2
surface that existed when `roadmap.md` was first written.

In scope:
- Responsive check of every route (landing page; dashboard shell;
  sign-in; book; bookings; ailment/therapy detail; search) at
  common breakpoints (mobile ~375px, tablet ~768px, desktop
  ~1024px+), relying on PicoCSS's responsive defaults and fixing any
  page-specific overflow/layout breakage.
- Accessibility pass: keyboard navigation through every interactive
  flow (sign-in, booking, cancel/reschedule, search), visible focus
  states, form labels/`aria-*` where PicoCSS's semantic defaults
  don't already cover it, and color-contrast spot checks.
- Visual polish: consistent spacing/typography across pages that were
  built in different phases (Phase 1 landing page, Phase 2 dashboard,
  Phase 3 sign-in, extended-features UI), so the app reads as one
  product rather than four phases stitched together.
- Resolve `tech-stack.md`'s open **deployment** decision: adopt
  Vercel as the deployment target (see Decisions), update
  `tech-stack.md` accordingly, and add whatever minimal config that
  requires (e.g. confirming SQLite's file-based DB works with the
  chosen deploy path, or documenting the constraint if it doesn't).
- Resolve `tech-stack.md`'s open **formatting** decision: add
  Prettier with a default config compatible with
  `eslint-config-next`, plus a `format`/`format:check` script.
- A pass over `README.md` / setup instructions if the deployment or
  formatting changes affect them.

Out of scope:
- New features or content changes — this phase touches styling,
  layout, accessibility, and the two named tech-stack decisions
  only. If a polish pass surfaces a functional bug, note it rather
  than fixing it inline unless it's trivial.
- Any change to auth (Phase 3) or the extended features' behavior —
  polish is presentation-layer only.
- A design-system rewrite or moving off PicoCSS — Phase 2 already
  settled styling; this phase polishes within that choice.
- Automated accessibility tooling/CI (e.g. axe-core in the test
  suite) unless it's trivial to add — a manual pass is the bar for
  this phase, per `roadmap.md`'s framing of Phase 4 as a "polish
  pass," not a hardening phase.

## Decisions

Made via stakeholder Q&A before writing this spec (see
`specs/2026-09-27-accounts-and-access/` for the related accounts
decisions from the same round) and via judgment calls made in
drafting this spec, noted as such:

1. **Sequencing: last, not third** — `roadmap.md` originally placed
   Phase 4 immediately after Phase 3. Since this MVP push also pulls
   the roadmap's "Later" bucket forward
   (`specs/2026-09-27-extended-features/`), polish is resequenced to
   run after *both*, so it covers all of the new UI in one pass
   instead of polishing Phase 3's UI now and the extended features'
   UI later.
2. **Deployment target: Vercel** *(judgment call, not asked directly
   — flagged here for visibility rather than left silently
   decided)*. Chosen because `tech-stack.md` already names it as
   "the path of least resistance given the framework choice"
   (Next.js), and this repo's demo/teaching purpose (`mission.md`)
   favors the zero-config option over evaluating alternatives. If
   this isn't the right call, it's a one-line change to
   `tech-stack.md` and this file before implementation starts.
3. **Formatting: Prettier, default config** *(judgment call)*. No
   stakeholder expressed an opinion on formatting; Prettier is the
   de facto standard for a TypeScript/Next.js repo and
   `tech-stack.md` already flags it as the likely candidate ("still
   not configured").
4. **Manual accessibility pass, not automated tooling** — Chosen to
   keep this phase's scope matching `roadmap.md`'s "polish pass"
   framing rather than growing into an accessibility-hardening
   phase; automated tooling can be a future addition if the manual
   pass finds recurring issues.

## Context

- Assumes `specs/2026-09-27-accounts-and-access/` and
  `specs/2026-09-27-extended-features/` are both complete —
  polishing UI that doesn't exist yet isn't meaningful. If either
  phase's scope changes before this one starts, revisit this file.
- `tech-stack.md` explicitly leaves deployment and formatting open
  "rather than guessing... each should be settled... when its
  roadmap phase starts" — this is that phase for both.
- Per `mission.md`'s "what success looks like": "the site is
  attractive and works well in modern browsers" and "the site is
  reliable" are the two success criteria this phase most directly
  targets, on top of the functional criteria the earlier phases
  cover.
