# Validation — Post-therapy reviews

How to know this phase succeeded and is ready to merge.

## Functional checks

- [x] `prisma/schema.prisma` has the `Review` model; migration
      `20260927132051_add_review` applies clean against a reset
      SQLite db (`prisma migrate reset` + `prisma migrate dev`).
- [x] From `/dashboard/bookings`, clicking "Leave a review" on an
      appointment with no review reaches a working form.
- [x] Submitting rating 1-5 with and without a comment both succeed
      (verified via direct `createReview` calls and unit tests;
      redirect to `/dashboard/bookings` verified by reading
      `actions.ts`, matching the existing `createBooking` redirect
      pattern).
- [x] Submitting a rating outside 1-5 is rejected server-side
      (`InvalidRatingError`, unit-tested for 0/6/3.5/-1); client
      `<select>` only offers 1-5 so this is a defense-in-depth check.
- [x] After submitting, the same appointment's row in
      `/dashboard/bookings` shows "★ {rating}/5" instead of "Leave a
      review", and visiting the review URL again shows the existing
      review, not a blank form. (Verified live: booked+reviewed an
      appointment, confirmed both states via curl.)
- [x] A second submission for the same `appointmentId` is rejected
      (unique constraint on `Review.appointmentId` holds — verified
      live, a duplicate `prisma.review.create` threw as expected).
- [x] `/dashboard/book`'s therapy-match screen shows the aggregate
      rating for the matched therapy, or "No reviews yet" when a
      therapy has none. (Verified live: "No reviews yet" before a
      review existed, "★ 5.0 average (1 review)" after.)
- [x] Reviews are not shown anywhere on the public marketing site
      (`src/app/page.tsx` is untouched by this phase).

## Test suite

- [x] `npm test` passes (38 tests), including new tests for
      `src/lib/reviews.ts` and the updated `bookings`/`book`/
      `confirmation` page tests.
- [x] `npm run lint` passes.
- [x] `npm run build` passes (typecheck + production build; also
      confirms Next's generated route types for the new
      `[id]/review` dynamic segment).
- N/A `npm run format:check` — this branch (based on `main`) predates
  the Prettier setup added in the Phase 4 polish pass on `mvp`; no
  `format:check` script exists here.

## Manual smoke test

- [x] Booked a real appointment, submitted a review, confirmed the
      aggregate rating updates on the next `/dashboard/book` visit,
      confirmed a duplicate review is rejected — all via `npm run
      dev` plus direct Prisma calls (server actions aren't easily
      driven by `curl`). Test data cleaned up afterward; `dev.db` is
      back to a fresh-seed state (0 agents/appointments/reviews
      beyond the seeded ailments/therapies).

## Merge bar

All boxes above checked (one N/A, explained above). Known, accepted
gaps (not blockers, per `requirements.md`'s Out of scope): no
completion gate on reviews, no edit/delete, no auth on who can submit
a review, no public-site display.
