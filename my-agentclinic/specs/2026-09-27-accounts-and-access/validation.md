# Validation — Accounts & Access (Roadmap Phase 3)

This phase is done when all of the following hold.

Verified via `npm test`/`npm run lint`/`npm run build`, plus a manual
walkthrough replicating Next's Server Action wire protocol with `curl`
(multipart POST including the rendered `$ACTION_ID_...` hidden field) —
the Chrome extension wasn't connected this session, so this stood in for
a live browser click-through. Re-verify in an actual browser when the
extension is available.

## Sign-in

- [x] Visiting `/dashboard` while signed out shows a sign-in form
      (name + role picker), not the dashboard content.
- [x] Signing in as `Agent` with a new name creates an `Agent` row
      and a `Session` row linked to it, and lands on
      `/dashboard/book`.
- [x] Signing in as `Agent` with a name that already has an `Agent`
      row reuses it — no duplicate `Agent` rows. (Covered by
      `upsertAgentByName`'s existing dedupe behavior, reused as-is —
      see `src/lib/agents.test.ts`.)
- [x] Signing in as `Staff` creates a `Session` row with no linked
      `Agent`, and lands on `/dashboard/bookings`.
- [x] The session cookie is httpOnly and contains only an opaque
      token — inspecting it in devtools doesn't reveal the role or
      name directly. (Confirmed: `Set-Cookie: session_token=<cuid>;
      ...; HttpOnly`.)

## Route gating

- [x] Visiting `/dashboard/book` while signed out redirects to
      sign-in.
- [x] Visiting `/dashboard/bookings` while signed in as `Agent`
      redirects to sign-in (wrong role), and vice versa for
      `/dashboard/book` while signed in as `Staff`.
- [x] Editing the session cookie value to a random string (no
      matching `Session` row) is treated as signed-out, not as a
      crash. (Verified with `session_token=forged-nonexistent-token`
      → clean redirect, no 500.)

## Booking flow integration

- [x] `/dashboard/book` no longer has a name field.
- [x] Completing a booking while signed in as `Agent` creates the
      `Appointment` linked to that session's `Agent` — not a
      newly-typed name.
- [x] The existing Phase 2 booking behavior (ailment → matched
      therapy → time → confirmation) still works end to end.

## Sign-out

- [x] Signing out deletes the `Session` row and the cookie, and
      returns to the sign-in view.
- [x] After signing out, `/dashboard/book` and `/dashboard/bookings`
      both redirect to sign-in again.

## Build & scope discipline

- [x] `npm run build` completes with no type errors.
- [x] `npm run lint` passes.
- [x] `npm test` passes, including new/updated tests for session
      creation, route gating, and the booking flow using the
      session's agent.
- [x] No password, email, or credential field was introduced
      anywhere — per `requirements.md`.

## Sign-off

- [x] A reviewer can clone the branch, run
      `npm install && npm run db:migrate && npm run db:seed && npm run dev`,
      sign in as an agent, complete a booking, sign out, sign back in
      as staff, and see that booking in `/dashboard/bookings` — all
      without hitting an open (ungated) route along the way.
