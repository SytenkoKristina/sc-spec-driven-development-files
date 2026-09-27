# Plan — Polish Pass (Roadmap Phase 4)

Numbered task groups, intended to be worked roughly in order.

## 1. Resolve deployment (tech-stack.md)

1.1. Set up a Vercel project pointed at this repo (or document the
     manual steps if that requires an account/dashboard action
     outside this repo).
1.2. Confirm SQLite's file-based DB behavior under the chosen deploy
     path — Vercel's filesystem is ephemeral per-deploy, so either
     document that the demo DB resets on redeploy (acceptable for a
     demo artifact) or note it as a known constraint. Don't silently
     paper over it.
1.3. Update `tech-stack.md`'s "Deployment" section from "not yet
     decided" to Vercel, with the constraint from 1.2 noted.

## 2. Resolve formatting (tech-stack.md)

2.1. Add `prettier` as a dev dependency with a default/minimal
     config (e.g. `.prettierrc`), compatible with
     `eslint-config-next` (no conflicting rules).
2.2. Add `format` (write) and `format:check` (CI-friendly check)
     scripts to `package.json`.
2.3. Run `format` once across the repo; review the resulting diff
     for anything unexpected before committing it as its own,
     clearly-labeled formatting commit.
2.4. Update `tech-stack.md`'s "Tooling" section to mention Prettier.

## 3. Responsive pass

3.1. Walk every route (landing; `/dashboard`; sign-in; `/dashboard/
     book`; `/dashboard/bookings`; ailment/therapy detail; search) at
     ~375px, ~768px, and ~1024px+ widths.
3.2. Fix page-specific overflow/wrapping issues (tables on narrow
     viewports, long therapy names, nav wrapping) with minimal,
     targeted CSS — PicoCSS's own responsiveness should handle most
     of this already.

## 4. Accessibility pass

4.1. Keyboard-only walkthrough of sign-in, booking, cancel/
     reschedule, and search — confirm every control is reachable and
     has a visible focus state.
4.2. Check form labels and `aria-*` attributes where PicoCSS's
     semantic defaults don't already provide them (e.g. custom
     radio/role pickers from Phase 3).
4.3. Spot-check color contrast on custom (non-PicoCSS-default)
     styling, if any was introduced in earlier phases.

## 5. Visual consistency pass

5.1. Compare spacing/typography across the landing page, dashboard
     shell, sign-in, and extended-features pages; adjust `layout.css`/
     page-specific CSS so they read as one product.
5.2. Confirm the notification/confirmation banners (from
     `specs/2026-09-27-extended-features/`) share one visual style
     rather than three ad hoc ones.

## 6. Wrap up

6.1. Update `README.md`/setup docs if deployment or formatting
     changes affect the documented steps.
6.2. Review `git status`/`git diff`, especially after the formatting
     commit — confirm it's isolated from functional changes.
6.3. Run through `validation.md` end to end.
6.4. Commit with a message describing this phase's work (formatting
     as its own commit per 2.3, polish/a11y/responsive as another).
