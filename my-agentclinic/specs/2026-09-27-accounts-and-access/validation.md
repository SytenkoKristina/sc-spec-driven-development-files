# Validation — Accounts & Access (Roadmap Phase 3)

This phase is done when all of the following hold:

## Sign-in

- [ ] Visiting `/dashboard` while signed out shows a sign-in form
      (name + role picker), not the dashboard content.
- [ ] Signing in as `Agent` with a new name creates an `Agent` row
      and a `Session` row linked to it, and lands on
      `/dashboard/book`.
- [ ] Signing in as `Agent` with a name that already has an `Agent`
      row reuses it — no duplicate `Agent` rows.
- [ ] Signing in as `Staff` creates a `Session` row with no linked
      `Agent`, and lands on `/dashboard/bookings`.
- [ ] The session cookie is httpOnly and contains only an opaque
      token — inspecting it in devtools doesn't reveal the role or
      name directly.

## Route gating

- [ ] Visiting `/dashboard/book` while signed out redirects to
      sign-in.
- [ ] Visiting `/dashboard/bookings` while signed in as `Agent`
      redirects to sign-in (wrong role), and vice versa for
      `/dashboard/book` while signed in as `Staff`.
- [ ] Editing the session cookie value to a random string (no
      matching `Session` row) is treated as signed-out, not as a
      crash.

## Booking flow integration

- [ ] `/dashboard/book` no longer has a name field.
- [ ] Completing a booking while signed in as `Agent` creates the
      `Appointment` linked to that session's `Agent` — not a
      newly-typed name.
- [ ] The existing Phase 2 booking behavior (ailment → matched
      therapy → time → confirmation) still works end to end.

## Sign-out

- [ ] Signing out deletes the `Session` row and the cookie, and
      returns to the sign-in view.
- [ ] After signing out, `/dashboard/book` and `/dashboard/bookings`
      both redirect to sign-in again.

## Build & scope discipline

- [ ] `npm run build` completes with no type errors.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes, including new/updated tests for session
      creation, route gating, and the booking flow using the
      session's agent.
- [ ] No password, email, or credential field was introduced
      anywhere — per `requirements.md`.

## Sign-off

- [ ] A reviewer can clone the branch, run
      `npm install && npm run db:migrate && npm run db:seed && npm run dev`,
      sign in as an agent, complete a booking, sign out, sign back in
      as staff, and see that booking in `/dashboard/bookings` — all
      without hitting an open (ungated) route along the way.
