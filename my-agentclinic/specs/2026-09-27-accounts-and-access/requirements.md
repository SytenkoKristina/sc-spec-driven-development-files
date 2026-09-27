# Requirements — Accounts & Access (Roadmap Phase 3)

## Scope

Give agents and staff role-appropriate access to the dashboard, so
`/dashboard/book` and `/dashboard/bookings` are no longer open to
anyone who navigates there. Per the stakeholder Q&A for this MVP
push, this stays a lightweight, no-real-credentials sign-in — not a
production auth system — consistent with `mission.md`'s framing of
this repo as a teaching/demo artifact.

In scope:
- A sign-in view (e.g. `/dashboard` when signed out) collecting a
  name and a role (`Agent` or `Staff`) — no password, no email.
- A server-side `Session` record (Prisma model) keyed by a random
  token, referenced by an httpOnly cookie. The cookie holds only the
  opaque token; name and role live in the DB row, not in a
  client-editable value.
- Signing in as `Agent` finds-or-creates the underlying `Agent` row
  by name (reusing the existing dedupe behavior from
  `/dashboard/book`'s booking flow), and links the session to it.
- Signing in as `Staff` creates a session with role `Staff` and no
  linked `Agent` row (staff aren't agents).
- Route gating: `/dashboard/book` requires an active `Agent`
  session; `/dashboard/bookings` requires an active `Staff` session.
  Visiting either while signed out (or signed in as the wrong role)
  redirects to the sign-in view.
- The booking flow (`/dashboard/book`) drops its own name field and
  uses the signed-in agent's name from the session instead — sign-in
  now owns "who are you," so the flow doesn't ask twice.
- A sign-out control (in the dashboard nav) that deletes the
  `Session` row and clears the cookie.

Out of scope (deferred beyond this MVP push):
- Passwords, email verification, magic links, or any real credential
  check — explicitly rejected in favor of the role-picker approach
  (see Decisions).
- Password reset / account recovery flows (moot without passwords).
- A user being both an agent and staff, or holding multiple
  concurrent sessions/roles.
- An admin UI for managing accounts — there's no "account" beyond
  the `Agent` row and the ephemeral `Session`.
- Rate limiting, CSRF tokens beyond framework defaults, or other
  hardening a production credential system would need — proportional
  to the "no real credentials" decision, not an oversight.

## Decisions

Made via stakeholder Q&A before writing this spec:

1. **Auth mechanism** — A lightweight role-picker: name + role
   (`Agent`/`Staff`), no password. Chosen over credential-based
   (email+password) or magic-link auth because this repo is a
   teaching/demo artifact (`mission.md`) with no external infra
   (email provider, deployment target) committed yet — a real
   credential system would add implementation surface Phase 3 was
   explicitly scoped to avoid (`roadmap.md` calls Phase 3 "basic
   auth"), without making the demo more legible.
2. **Session storage** — A server-side `Session` table with an
   opaque token in an httpOnly cookie, rather than putting
   name/role directly in a client-readable or client-signed cookie.
   Chosen so a session can't be forged or role-escalated by editing
   a cookie value in devtools — cheap insurance that doesn't add
   real auth complexity, since the lookup is a single indexed query.
3. **Booking flow's name field** — Removed from `/dashboard/book`
   now that sign-in collects the agent's name. The session (via the
   linked `Agent` row) is the source of truth for "who's booking,"
   so the flow no longer asks. This is a small simplification of the
   Phase 2 flow, not a re-scope of it.

## Context

- This is roadmap Phase 3, immediately following the Phase 2 booking
  flow and domain model (see
  `specs/2026-09-24-dashboard-domain-model-booking-flow/`). It reuses
  the `Agent` model as-is (id, name, createdAt) and adds one new
  model (`Session`) rather than reworking existing tables.
- Per the MVP scoping decision for this round of spec work, this
  phase is followed by `specs/2026-09-27-extended-features/`
  (covering the roadmap's deferred "Later" items — editing/
  cancelling appointments, richer therapy content, search,
  notifications) and then `specs/2026-09-27-polish-pass/`
  (roadmap Phase 4). Polish is sequenced last so it covers the
  sign-in UI and the extended-features UI too, not just what existed
  before this phase.
- No production credential system is anywhere in scope for this MVP
  push — if real accounts are ever needed, that's a distinct future
  phase, not an extension of this one.
- Per `mission.md`, keep the sign-in flow legible enough that a
  student or conference audience can follow it end to end without
  extra explanation — it should read as "obviously how a demo app
  does auth," not as a confusing half-measure.
