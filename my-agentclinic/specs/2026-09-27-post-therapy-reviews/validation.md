# Validation — Post-therapy reviews

How to know this phase succeeded and is ready to merge.

## Functional checks

- [ ] `prisma/schema.prisma` has the `Review` model; `npm run
      db:migrate` runs clean against a fresh SQLite db.
- [ ] From `/dashboard/bookings`, clicking "Leave a review" on an
      appointment with no review reaches a working form.
- [ ] Submitting rating 1-5 with and without a comment both succeed
      and redirect back to `/dashboard/bookings`.
- [ ] Submitting a rating outside 1-5 is rejected (client `required`
      + server-side validation in `createReview`).
- [ ] After submitting, the same appointment's row in
      `/dashboard/bookings` shows "★ {rating}/5" instead of "Leave a
      review", and visiting the review URL again shows the existing
      review, not a blank form.
- [ ] A second submission for the same `appointmentId` is rejected
      (unique constraint on `Review.appointmentId` holds).
- [ ] `/dashboard/book`'s therapy-match screen shows the aggregate
      rating for the matched therapy, or "No reviews yet" when a
      therapy has none.
- [ ] Reviews are not shown anywhere on the public marketing site
      (`src/app/page.tsx` / anything outside `/dashboard`).

## Test suite

- [ ] `npm test` passes, including new tests for `src/lib/reviews.ts`
      and the updated `bookings`/`book` page tests.
- [ ] `npm run lint` passes.
- [ ] `npm run format:check` passes.

## Manual smoke test

- [ ] `npm run dev`, book a fresh appointment via `/dashboard/book`,
      leave a review from `/dashboard/bookings`, and confirm the
      aggregate rating on `/dashboard/book` updates for that therapy
      on the next visit.

## Merge bar

All boxes above checked. Known, accepted gaps (not blockers, per
`requirements.md`'s Out of scope): no completion gate on reviews, no
edit/delete, no auth on who can submit a review, no public-site
display.
