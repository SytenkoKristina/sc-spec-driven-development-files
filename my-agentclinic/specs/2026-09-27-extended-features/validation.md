# Validation — Extended Features (Roadmap "Later" bucket)

This phase is done when all of the following hold.

Verified via `npm test`/`npm run lint`/`npm run build`, plus a manual
walkthrough replicating Next's Server Action wire protocol with `curl`
(the Chrome extension wasn't connected this session either) — booked,
rescheduled, and cancelled an appointment as an agent; signed in as
staff and confirmed the new-booking badge, agent-name filter, and staff
cancel; confirmed an agent cannot cancel another agent's appointment.
Re-verify in an actual browser when the extension is available.

## Cancel & reschedule (agent-facing)

- [x] A signed-in agent can see a list of their own upcoming
      appointments.
- [x] Cancelling one sets `cancelledAt` (not a hard delete) and it
      no longer appears in "upcoming."
- [x] Rescheduling one changes `scheduledFor` and keeps
      ailment/therapy unchanged.
- [x] An agent cannot cancel/reschedule another agent's appointment
      (e.g. by guessing/crafting an appointment id). (Verified: a
      second agent's attempt to cancel a first agent's appointment
      threw "That appointment can't be changed." and left
      `cancelledAt` unset.)
- [x] Past appointments have no cancel/reschedule controls.
      (`getOwnUpcomingAppointment` in `book/actions.ts` rejects both
      the UI query — `listUpcomingAppointmentsForAgent` excludes them
      — and the action itself, as defense in depth.)

## Cancel (staff-facing)

- [x] Staff can cancel any upcoming appointment from
      `/dashboard/bookings`.
- [x] A non-staff session cannot hit the cancel action directly
      (server-side role check, not just a hidden UI control) —
      `cancelBookingAsStaff` calls `requireStaffSession()` itself.
- [x] Cancelled appointments drop out of the default bookings list.

## Richer content

- [x] `/dashboard/ailments/[id]` and `/dashboard/therapies/[id]`
      render the new `longDescription` field.
- [x] The booking flow's ailment picker and matched-therapy display
      link to these detail pages.
- [x] The booking flow itself still works using only the short
      `description` — no new required step.

## Search

- [x] Searching a term matching an ailment or therapy name/
      description returns it, dashboard-wide.
- [x] Searching a term matching nothing shows an empty state, not
      an error.
- [x] Staff can filter `/dashboard/bookings` by agent name.
- [x] The agent-name filter on bookings doesn't affect or get
      confused with the global search box (separate `agent` vs. `q`
      query params, separate forms).

## Notifications

- [x] Cancelling and rescheduling (both agent- and staff-facing) show
      a confirmation banner via the shared `ConfirmationBanner`
      component. Booking itself keeps Phase 2's existing dedicated
      confirmation *page* (`book/confirmation`) rather than switching
      to the banner — that's a deliberately richer, pre-existing
      flow, not a gap; the shared banner covers every *new* outcome
      this phase adds.
- [x] `/dashboard/bookings` visually marks appointments created
      after the current staff session started.
- [x] No polling/websocket/email/SMS code was introduced — the
      marker is computed from data already loaded on the page.

## Build & scope discipline

- [x] `npm run build` completes with no type errors.
- [x] `npm run lint` passes.
- [x] `npm test` passes, including new coverage for cancel,
      reschedule, search, and the "new since session" marker.
- [x] The fixed ailment→therapy matching from Phase 2 is unchanged.
- [x] No admin UI for editing ailment/therapy content was added —
      `longDescription` is still seeded, per `requirements.md`.

## Sign-off

- [x] A reviewer can clone the branch, run
      `npm install && npm run db:migrate && npm run db:seed && npm run dev`,
      and: book an appointment, reschedule it, cancel it as the
      agent, then sign in as staff, search for another agent's
      booking by name, and cancel it from the staff view — all in
      one sitting, without errors.
