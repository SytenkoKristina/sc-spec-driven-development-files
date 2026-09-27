# Requirements — Post-therapy reviews

## Summary

After booking, an agent can leave a star rating + optional comment on
the therapy they booked. Ratings aggregate per therapy so agents can
see, before booking, how a therapy has fared for others.

## Context

`specs/roadmap.md` (Phases 0-4 plus the "Later" bucket) is fully
built. This phase isn't on the roadmap — it's a new addition, chosen
in this branch's kickoff interview as the next thing to build on top
of the existing booking flow.

Built on **main**, not **mvp**: main only has Phase 0-2 (scaffolding,
landing page, dashboard/domain model/booking). It does not have Phase
3 (accounts & access) or the extended features (cancel/reschedule,
richer content, search, notifications) that exist on `mvp`. This was
a deliberate choice made when starting this branch, not an oversight —
see the branch's base-branch decision. Concretely, this means:

- There is **no login/session** (`src/lib/session.ts` doesn't exist
  here). An agent is identified only by the appointment they hold,
  the same way `/dashboard/book` already works (typed name, no
  account).
- There is **no appointment status field** (booked/completed/
  cancelled). `Appointment` has no lifecycle beyond `scheduledFor`.

## Scope decisions (from interview)

1. **Feedback shape**: star rating (1-5, required) + free-text
   comment (optional). Not rating-only or comment-only.
2. **Review eligibility**: any agent can review any appointment they
   hold, at any time after booking it — no gate on the appointment
   having happened yet, and no new `status` field. Accepted tradeoff:
   an agent could review a therapy before their scheduled time. This
   keeps scope small; a completion gate is deferred (see Out of
   scope).
3. **Visibility**: dashboard only (`mission.md`'s primary audience —
   agents & staff). Not surfaced on the public marketing site
   (`src/app/page.tsx`) as testimonials/social proof.

## In scope

- One review per appointment (`Review.appointmentId` is unique) —
  natural cap given there's no account system to rate-limit by agent
  identity otherwise.
- A place to submit a review for a given appointment, reached from
  `/dashboard/bookings` (the existing staff-facing list of all
  appointments — the only place an appointment's id is currently
  surfaced in the UI).
- Aggregate rating (average + count) shown per therapy on
  `/dashboard/book`, where an agent already sees the matched therapy
  before confirming — so a bad or nonexistent rating is visible
  before booking, not just after.

## Out of scope (deferred)

- Editing or deleting a submitted review.
- Gating review submission on the appointment's scheduled time having
  passed, or on any "completed" status — both require a schema change
  this phase intentionally skips.
- Any auth/identity check on who submits a review (anyone with an
  appointment id can submit its one review) — consistent with this
  branch's no-accounts scope, not a new gap introduced by this
  feature.
- Public-site display of ratings/testimonials.
- Staff moderation (hiding/removing a review).

## Data model

New `Review` model (see `plan.md` for the actual migration):

- `id` — cuid, primary key.
- `appointmentId` — unique, one review per appointment,
  `onDelete: Cascade` from `Appointment`.
- `rating` — `Int`, 1-5, required.
- `comment` — `String?`, optional.
- `createdAt` — `DateTime @default(now())`.

Aggregation (average rating, count) is computed per therapy by
joining `Review` through `Appointment.therapyId` — no denormalized
average stored on `Therapy`, consistent with this codebase's existing
pattern of computing lists/aggregates in `src/lib/*.ts` rather than
maintaining derived columns.

## References

- `specs/mission.md` — primary audience (agents & staff) is why
  reviews stay dashboard-only in this phase.
- `specs/tech-stack.md` — SQLite/Prisma data layer, PicoCSS for the
  new form/table markup, no new dependencies needed.
