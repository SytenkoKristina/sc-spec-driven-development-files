# Plan — Post-therapy reviews

Numbered task groups, each independently shippable/testable in order.

## 1. Data model

- Add `Review` model to `prisma/schema.prisma`:
  - `id String @id @default(cuid())`
  - `appointmentId String @unique`
  - `appointment Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)`
  - `rating Int`
  - `comment String?`
  - `createdAt DateTime @default(now())`
- Add the inverse `review Review?` relation field to `Appointment`.
- Run `npm run db:migrate` to generate and apply the migration.

## 2. Server-side data access (`src/lib/reviews.ts`)

- `createReview(appointmentId, rating, comment)` — validates `rating`
  is an integer 1-5, inserts the row. Throws/returns an error if a
  review already exists for that appointment (unique constraint).
- `getReviewForAppointment(appointmentId)` — used to show "already
  reviewed" state instead of the form.
- `getTherapyRatingSummary(therapyId)` — average rating + count for a
  therapy, via `Review` joined through `Appointment.therapyId`.
- Mirror the existing pattern in `src/lib/appointments.ts` (plain
  async functions wrapping `db`, no repository class).

## 3. Submit a review

- New route `src/app/dashboard/bookings/[id]/review/page.tsx`:
  - Loads the appointment by id (404/redirect if missing).
  - If already reviewed, show the existing rating/comment instead of
    a form.
  - Otherwise render a form: rating (`<select>` 1-5, PicoCSS default
    styling, required) + comment (`<textarea>`, optional) + submit
    button (reuse `src/components/forms/SubmitButton.tsx`).
  - Server action (`actions.ts` alongside the page, matching
    `dashboard/book/actions.ts`'s existing convention) calls
    `createReview` and redirects back to `/dashboard/bookings` on
    success.

## 4. Surface it from the bookings list

- `src/app/dashboard/bookings/page.tsx`: add a "Review" column. Per
  row, link to `/dashboard/bookings/[id]/review` — label "Leave a
  review" if none exists yet, "★ {rating}/5" (linking to the same
  page to view it) if one does.

## 5. Show aggregate rating before booking

- `src/app/dashboard/book/page.tsx`: on the ailment→therapy match
  screen (the `name && ailmentId` branch), call
  `getTherapyRatingSummary(ailment.therapyId)` and render it under the
  therapy description, e.g. "★ 4.3 average (12 reviews)" or "No
  reviews yet" if `count === 0`.

## 6. Tests

- `src/lib/reviews.test.ts`: `createReview` (happy path, duplicate
  rejected, rating out of range rejected), `getTherapyRatingSummary`
  (average math, zero-review case).
- `src/app/dashboard/bookings/[id]/review/page.test.tsx`: form render,
  already-reviewed state.
- Update `src/app/dashboard/bookings/page.test.tsx` and
  `src/app/dashboard/book/page.test.tsx` for the new column /
  aggregate display.

## 7. Spec + changelog close-out

- Fill in `validation.md`'s checklist as each step above lands.
- Update `CHANGELOG.md` per the existing changelog skill/convention
  once the phase is complete.
