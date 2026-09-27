# Plan — Extended Features (Roadmap "Later" bucket)

Numbered task groups, intended to be worked roughly in order.

## 1. Schema changes

1.1. In `schema.prisma`, add `longDescription` (String) to `Ailment`
     and `Therapy`.
1.2. Add a `cancelledAt` (DateTime, nullable) field to `Appointment`
     rather than hard-deleting — keeps history for staff, and lets
     "past/cancelled" filtering stay a simple query. Update all
     existing "upcoming appointments" queries to exclude
     cancelled rows.
1.3. Run `prisma migrate dev`; extend `prisma/seed.ts` with
     `longDescription` values for the existing seeded
     ailments/therapies.

## 2. Cancel & reschedule (agent-facing)

2.1. Add a "my bookings" view under `/dashboard/book` listing the
     signed-in agent's upcoming appointments (via the Phase 3
     session's linked `Agent`).
2.2. Add a cancel action (server action) that sets `cancelledAt`
     on the appointment, guarded by "belongs to the signed-in
     agent" and "is upcoming."
2.3. Add a reschedule action: same appointment, new `scheduledFor`
     time, same ailment/therapy — reuse the existing time-picker UI
     from the booking flow rather than building a new one.
2.4. Show a confirmation banner after cancel/reschedule (ties into
     task 5).

## 3. Cancel (staff-facing)

3.1. Add a cancel control per row in `/dashboard/bookings`.
3.2. Server action guarded by "signed in as Staff" (Phase 3 route
     gating already covers the page; re-check role in the action
     too, not just the page).
3.3. Cancelled appointments drop out of the default
     `/dashboard/bookings` list (still queryable/visible via a
     "show cancelled" toggle if that's a natural fit — otherwise
     skip it, this isn't required).

## 4. Richer therapy/ailment content

4.1. Add `/dashboard/ailments/[id]` and `/dashboard/therapies/[id]`
     detail pages rendering `longDescription`.
4.2. Link to them from the booking flow's ailment picker and
     matched-therapy display.
4.3. Link to them from search results (task 5) once that exists.

## 5. Search

5.1. Add a search input in the dashboard nav
     (`src/app/dashboard/layout.tsx`) posting to a
     `/dashboard/search` results view (or inline results — pick
     whichever fits the existing nav layout without crowding it).
5.2. Query `Ailment`/`Therapy` by name/description using Prisma
     `contains`; render results linking to the Phase 4.1 detail
     pages.
5.3. On `/dashboard/bookings`, add a separate agent-name filter
     input (staff-only, scoped to that page — not the global
     search box).

## 6. Notifications (in-app)

6.1. Extend the existing Phase 2 booking confirmation state to also
     cover cancel/reschedule outcomes (reuse the same
     confirmation/banner component rather than three bespoke ones).
6.2. On `/dashboard/bookings`, compute "new since this session
     started" by comparing each appointment's `createdAt` to the
     staff session's `createdAt` (Phase 3's `Session` row); render a
     simple visual marker (e.g. a badge) on newer rows — no polling.

## 7. Wrap up

7.1. Update tests: cancel/reschedule actions, search queries, the
     "new since session" marker, and the two new detail-page routes.
7.2. Review `git status`/`git diff` for the migration and seed
     changes.
7.3. Run through `validation.md` end to end.
7.4. Commit with a message describing this phase's work.
