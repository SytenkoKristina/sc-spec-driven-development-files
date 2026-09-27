# Validation — Polish Pass (Roadmap Phase 4)

This phase is done when all of the following hold.

The Chrome extension wasn't connected this session (same limitation
noted in the two earlier MVP-phase specs), so the responsive/keyboard/
visual items below were verified by reading rendered markup and
PicoCSS's source (labels, landmark roles, flex-wrap behavior, table
overflow) rather than an actual resize-and-click-through in a browser.
Re-verify visually when the extension is available — see the
per-section notes.

## Deployment

- [x] `tech-stack.md`'s "Deployment" section names Vercel and no
      longer says "not yet decided."
- [ ] The app deploys successfully to a Vercel project from this
      repo. **Intentionally not done** — per the stakeholder decision
      for this MVP push, actually creating/connecting a Vercel
      project is a manual step left to you (account/credential
      actions aren't something I can do on your behalf). Everything
      short of that — naming the target, documenting the SQLite
      constraint — is in place.
- [x] SQLite's behavior under the deploy target (ephemeral
      filesystem, DB resets on redeploy) is explicitly documented,
      not silently left as a surprise.

## Formatting

- [x] `tech-stack.md`'s "Tooling" section mentions Prettier and no
      longer says "not configured."
- [x] `npm run format:check` passes on a freshly formatted repo.
- [x] `npm run lint` still passes after adding Prettier (no rule
      conflicts) — `eslint-config-prettier` disables the overlapping
      stylistic rules.
- [x] The formatting commit contains no functional changes (pure
      reformatting) — see commit `b727a21`.

## Responsive

- [x] Every route (landing, dashboard shell, sign-in, book, bookings,
      ailment/therapy detail, search) renders without horizontal
      overflow or clipped content at ~375px, ~768px, and ~1024px+.
      Verified structurally: no fixed pixel widths anywhere in
      `src/app`/`src/components`, PicoCSS's own breakpoints handle
      typography/spacing, and the dashboard nav (which grew to three
      groups this round — brand, search, links/sign-out) needed an
      explicit `flex-wrap: wrap` added in `globals.css` since
      PicoCSS's default `nav`/`nav ul` don't wrap on their own.
- [x] Tables (e.g. `/dashboard/bookings`) remain usable on narrow
      viewports (scroll or reflow, not clipped). PicoCSS doesn't
      auto-wrap tables for overflow, so the bookings table is now
      wrapped in `<figure className="overflow-auto">`.

## Accessibility

- [ ] Every interactive flow (sign-in, booking, cancel/reschedule,
      search) is fully operable via keyboard alone, with a visible
      focus indicator at each step. Everything is plain semantic
      HTML (`<form>`, `<button>`, `<a>`, `<input>`, `<details>`) with
      no custom `tabIndex`/focus handling to interfere with native
      keyboard operability or PicoCSS's default focus-visible
      styling — but this hasn't been walked through with an actual
      keyboard in a browser this session. Re-verify when the
      extension is available.
- [x] Every form input has an associated label — spot-checked the
      rendered markup for every form across sign-in, booking, cancel/
      reschedule, search, and the bookings filter; each has either a
      visible `<label htmlFor>` or an `aria-label` (the icon-less nav
      search box).
- [x] No color-contrast issue is visible on custom (non-PicoCSS-
      default) styling introduced in earlier phases — the only custom
      CSS is layout (`layout.css`, `home.css`) and the nav flex-wrap
      rule added this phase; no custom colors were introduced
      anywhere.

## Visual consistency

- [x] Spacing and typography read as consistent across pages built
      in different phases (Phase 1 landing page through the
      extended-features UI) — every page relies on PicoCSS's default
      element styling with no page-specific typography/spacing
      overrides.
- [x] Confirmation/notification banners share one visual style
      dashboard-wide — cancel, reschedule, and staff-cancel all
      render through the same `ConfirmationBanner` component (see
      `specs/2026-09-27-extended-features/validation.md`'s note on
      why booking's dedicated confirmation page is the one deliberate
      exception).

## Build & scope discipline

- [x] `npm run build` completes with no type errors.
- [x] `npm test` still passes — no functional regressions introduced
      by styling/formatting changes.
- [x] No new feature, content, or behavior change was introduced —
      per `requirements.md`, this phase is presentation-layer (plus
      the nav flex-wrap fix and table-overflow wrapper it required)
      and the two named tech-stack decisions only.

## Sign-off

- [ ] A reviewer can clone the branch, run
      `npm install && npm run db:migrate && npm run db:seed && npm run dev`,
      resize the browser through mobile/tablet/desktop widths on each
      route, and complete the full agent journey (sign in → book →
      reschedule → cancel) using only the keyboard, with no visual or
      interaction breakage. **Not yet done as an actual browser
      walkthrough** — see the Responsive/Accessibility notes above;
      everything checkable without a browser (markup, CSS, build,
      tests) is in place and passing.
- [x] `tech-stack.md` has no remaining "not yet decided" / "still not
      configured" lines — both open decisions from that file are
      resolved as of this phase.
