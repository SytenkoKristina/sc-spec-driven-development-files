# Requirements — Extended Features (Roadmap "Later" bucket)

## Scope

`roadmap.md` deferred four items to "Later / not yet scheduled":
editing/cancelling appointments, richer therapy content, search, and
notifications — "until the core loop above is proven out." Per the
stakeholder Q&A for this MVP push, all four are pulled forward into
MVP scope now that the core loop (Phase 2) and accounts/access
(Phase 3, `specs/2026-09-27-accounts-and-access/`) exist. This spec
covers all four as one phase, matching the granularity of the
roadmap's own "Later" heading rather than splitting each into its
own dated folder.

In scope:

**Editing/cancelling appointments**
- An agent can cancel their own upcoming appointment from
  `/dashboard/book` (or a new "my bookings" view under it).
- An agent can reschedule (change the time of) their own upcoming
  appointment — ailment/therapy stay fixed, per the Phase 2 decision
  that matching is a fixed 1:1 lookup.
- Staff can cancel any upcoming appointment from
  `/dashboard/bookings`.
- Cancelling deletes/marks the `Appointment`; it does not delete the
  `Agent` row.
- Past appointments are not editable/cancellable by anyone.

**Richer therapy content**
- `Therapy` and `Ailment` gain a longer-form description field (in
  addition to the existing short `description`) and a dedicated
  detail page (`/dashboard/therapies/[id]`,
  `/dashboard/ailments/[id]`) rendering it.
- The booking flow's ailment picker and matched-therapy display
  link out to these detail pages, but booking itself still uses only
  the existing short `description` — richer content is for browsing,
  not a new required step.

**Search**
- A single search input (dashboard-wide, e.g. in the shared nav)
  that matches ailments and therapies by name/description, using
  Prisma's `contains` (case-insensitive where SQLite supports it) —
  no external search service.
- Staff additionally get to search appointments by agent name from
  `/dashboard/bookings`.
- Search is read-only browsing; it doesn't feed back into the
  booking flow's ailment picker (that stays a plain list).

**Notifications**
- In-app only — no email/SMS/push, since no external provider is
  committed in `tech-stack.md` and deployment target is still open
  (see `specs/2026-09-27-polish-pass/`).
- A confirmation banner/toast after booking, cancelling, or
  rescheduling (extends the existing Phase 2 confirmation state
  rather than replacing it).
- A lightweight "new since you last looked" indicator on
  `/dashboard/bookings` for staff (e.g. highlighting appointments
  created after the staff session started), using data already on
  hand — no polling, no websockets.

Out of scope:
- Email/SMS/push notifications, or any external notification
  provider — no infra decision backs this yet.
- Full-text search infrastructure (e.g. a dedicated search index) —
  `contains` queries are sufficient at this data scale (a handful of
  ailments/therapies, per the Phase 2 seed).
- Editing ailment/therapy content through the dashboard UI — richer
  content is still seeded (see Phase 2's seed script decision), just
  with more fields; no admin UI is added here.
- Real-time updates (the notification indicator is computed on page
  load, not pushed).
- Any change to the fixed ailment→therapy matching decision from
  Phase 2.

## Decisions

Made via stakeholder Q&A before writing this spec:

1. **All four "Later" items in one MVP push** — Chosen because the
   stakeholder round for this MVP explicitly asked for the full
   "Later" bucket to be pulled forward, not a subset. Keeping them
   in one spec folder (rather than four) matches how `roadmap.md`
   itself groups them under a single heading.
2. **No new external infra** — Search stays a DB query; notifications
   stay in-app. Chosen because `tech-stack.md` still has an open
   deployment decision (being resolved in
   `specs/2026-09-27-polish-pass/`) and this repo's zero-external-infra
   posture (`mission.md`) shouldn't be broken by a "Later" feature
   sneaking in an email provider or search service.
3. **Sequencing after accounts, before polish** — This phase assumes
   Phase 3 (accounts & access) is done, since "an agent's own
   appointment" requires knowing who the agent is (the session from
   Phase 3). It's sequenced before the polish pass
   (`specs/2026-09-27-polish-pass/`) so polish covers this phase's
   new UI (detail pages, search box, cancel/reschedule controls,
   notification banners) too, rather than needing a second pass.

## Context

- Builds directly on the Phase 2 domain model
  (`specs/2026-09-24-dashboard-domain-model-booking-flow/`) — extends
  `Ailment`/`Therapy` with new fields and `Appointment` with
  cancel/reschedule behavior, rather than introducing new models
  beyond what's listed above.
- Depends on Phase 3 accounts (`specs/2026-09-27-accounts-and-access/`)
  for "which appointments belong to the signed-in agent" and for
  staff-only cancel access.
- Per `mission.md`, this repo is a teaching/demo artifact — the
  cancel/reschedule and search UI should stay simple enough to build
  and explain in a short session, not grow into a full CRUD admin
  panel.
