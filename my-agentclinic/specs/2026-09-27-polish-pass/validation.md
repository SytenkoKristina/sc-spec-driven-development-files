# Validation — Polish Pass (Roadmap Phase 4)

This phase is done when all of the following hold:

## Deployment

- [ ] `tech-stack.md`'s "Deployment" section names Vercel and no
      longer says "not yet decided."
- [ ] The app deploys successfully to a Vercel project from this
      repo.
- [ ] SQLite's behavior under the deploy target (ephemeral
      filesystem, DB resets on redeploy) is explicitly documented,
      not silently left as a surprise.

## Formatting

- [ ] `tech-stack.md`'s "Tooling" section mentions Prettier and no
      longer says "not configured."
- [ ] `npm run format:check` passes on a freshly formatted repo.
- [ ] `npm run lint` still passes after adding Prettier (no rule
      conflicts).
- [ ] The formatting commit contains no functional changes (pure
      reformatting).

## Responsive

- [ ] Every route (landing, dashboard shell, sign-in, book, bookings,
      ailment/therapy detail, search) renders without horizontal
      overflow or clipped content at ~375px, ~768px, and ~1024px+.
- [ ] Tables (e.g. `/dashboard/bookings`) remain usable on narrow
      viewports (scroll or reflow, not clipped).

## Accessibility

- [ ] Every interactive flow (sign-in, booking, cancel/reschedule,
      search) is fully operable via keyboard alone, with a visible
      focus indicator at each step.
- [ ] Every form input has an associated label.
- [ ] No color-contrast issue is visible on custom (non-PicoCSS-
      default) styling introduced in earlier phases.

## Visual consistency

- [ ] Spacing and typography read as consistent across pages built
      in different phases (Phase 1 landing page through the
      extended-features UI) — no jarring style mismatch when
      navigating between them.
- [ ] Confirmation/notification banners share one visual style
      dashboard-wide.

## Build & scope discipline

- [ ] `npm run build` completes with no type errors.
- [ ] `npm test` still passes — no functional regressions introduced
      by styling/formatting changes.
- [ ] No new feature, content, or behavior change was introduced —
      per `requirements.md`, this phase is presentation-layer plus
      the two named tech-stack decisions only.

## Sign-off

- [ ] A reviewer can clone the branch, run
      `npm install && npm run db:migrate && npm run db:seed && npm run dev`,
      resize the browser through mobile/tablet/desktop widths on each
      route, and complete the full agent journey (sign in → book →
      reschedule → cancel) using only the keyboard, with no visual or
      interaction breakage.
- [ ] `tech-stack.md` has no remaining "not yet decided" / "still not
      configured" lines — both open decisions from that file are
      resolved as of this phase.
