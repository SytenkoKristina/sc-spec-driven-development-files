# Validation — Extended Features (Roadmap "Later" bucket)

This phase is done when all of the following hold:

## Cancel & reschedule (agent-facing)

- [ ] A signed-in agent can see a list of their own upcoming
      appointments.
- [ ] Cancelling one sets `cancelledAt` (not a hard delete) and it
      no longer appears in "upcoming."
- [ ] Rescheduling one changes `scheduledFor` and keeps
      ailment/therapy unchanged.
- [ ] An agent cannot cancel/reschedule another agent's appointment
      (e.g. by guessing/crafting an appointment id).
- [ ] Past appointments have no cancel/reschedule controls.

## Cancel (staff-facing)

- [ ] Staff can cancel any upcoming appointment from
      `/dashboard/bookings`.
- [ ] A non-staff session cannot hit the cancel action directly
      (server-side role check, not just a hidden UI control).
- [ ] Cancelled appointments drop out of the default bookings list.

## Richer content

- [ ] `/dashboard/ailments/[id]` and `/dashboard/therapies/[id]`
      render the new `longDescription` field.
- [ ] The booking flow's ailment picker and matched-therapy display
      link to these detail pages.
- [ ] The booking flow itself still works using only the short
      `description` — no new required step.

## Search

- [ ] Searching a term matching an ailment or therapy name/
      description returns it, dashboard-wide.
- [ ] Searching a term matching nothing shows an empty state, not
      an error.
- [ ] Staff can filter `/dashboard/bookings` by agent name.
- [ ] The agent-name filter on bookings doesn't affect or get
      confused with the global search box.

## Notifications

- [ ] Booking, cancelling, and rescheduling each show a confirmation
      banner using the same shared component.
- [ ] `/dashboard/bookings` visually marks appointments created
      after the current staff session started.
- [ ] No polling/websocket/email/SMS code was introduced — the
      marker is computed from data already loaded on the page.

## Build & scope discipline

- [ ] `npm run build` completes with no type errors.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes, including new coverage for cancel,
      reschedule, search, and the "new since session" marker.
- [ ] The fixed ailment→therapy matching from Phase 2 is unchanged.
- [ ] No admin UI for editing ailment/therapy content was added —
      `longDescription` is still seeded, per `requirements.md`.

## Sign-off

- [ ] A reviewer can clone the branch, run
      `npm install && npm run db:migrate && npm run db:seed && npm run dev`,
      and: book an appointment, reschedule it, cancel it as the
      agent, then sign in as staff, search for another agent's
      booking by name, and cancel it from the staff view — all in
      one sitting, without errors.
