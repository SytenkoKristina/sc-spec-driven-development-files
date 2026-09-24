# Validation — Dashboard, Domain Model & Booking Flow (Roadmap Phase 2)

This phase is done when all of the following hold:

## Data layer

- [x] `prisma/schema.prisma` defines `Agent`, `Ailment`, `Therapy`,
      and `Appointment` models, with `Ailment` → `Therapy` as a
      fixed one-to-one relation.
- [x] `prisma migrate dev` runs cleanly from a fresh clone (no
      committed `dev.db`, no manual DB setup beyond `npm install` +
      migrate).
- [x] `npm run db:seed` populates a fixed starter set of ailments,
      each with exactly one matched therapy.
- [x] `tech-stack.md`'s "Data layer" section reflects SQLite +
      Prisma and no longer says "not yet decided."

## Booking flow

- [x] Visiting `/dashboard/book` shows a list of ailments sourced
      from the DB (not hardcoded).
- [x] Picking an ailment shows the one matched therapy — no
      therapy-selection step.
- [x] Completing the flow (name + ailment + time) creates an
      `Agent` row (if new) and an `Appointment` row linking agent,
      ailment, therapy, and the chosen time.
- [x] A confirmation is shown after a successful booking.
- [x] Submitting the flow twice with the same agent name doesn't
      create duplicate `Agent` rows (reuses the existing one).

## Staff view

- [x] Visiting `/dashboard/bookings` lists upcoming appointments
      with agent name, ailment, therapy, and scheduled time.
- [x] A newly created booking from `/dashboard/book` appears in
      `/dashboard/bookings` without a manual refresh workaround
      (standard Next.js data flow — reload is fine, no realtime
      requirement).
- [x] No edit/cancel controls are present (read-only, per
      `requirements.md`).

## Dashboard shell

- [x] `/dashboard`, `/dashboard/book`, and `/dashboard/bookings`
      all render without errors.
- [x] Shared nav links between the book and bookings views work.
- [x] The Phase 1 marketing landing page still renders correctly,
      now styled via PicoCSS instead of Tailwind, with only the
      addition of a link into `/dashboard` (per `requirements.md`)
      — no other content/copy changes.

## Styling migration

- [x] `tailwindcss` and `@tailwindcss/postcss` are removed from
      `package.json`; no `@import "tailwindcss"` remains anywhere.
- [x] `@picocss/pico` is installed and imported once (e.g. in
      `src/app/globals.css`).
- [x] No Tailwind utility classes (e.g. `flex`, `text-4xl`,
      `dark:bg-neutral-950`) remain in `src/app` or
      `src/components`.
- [x] `tech-stack.md`'s "Styling / UI" section reflects PicoCSS, not
      Tailwind.

## Build & scope discipline

- [x] `npm run build` completes with no type errors.
- [x] `npm run lint` passes.
- [x] No auth, login, or session logic was introduced — every
      dashboard route remains open, per `requirements.md`.
- [x] No editing/cancelling appointments, no admin UI for
      ailments/therapies, and no multi-therapy matching were added —
      all deferred per `requirements.md`'s "out of scope" list.
- [x] The Phase 1 landing page's content/copy is unchanged apart
      from the new dashboard link — no other copy or structural
      changes.

## Sign-off

- [x] A reviewer can clone the branch, run
      `npm install && npm run db:migrate && npm run db:seed && npm run dev`,
      and complete a full booking (pick ailment → see therapy → book
      → see it in the staff view) within a couple of minutes — this
      is the bar for "ready to merge and build Phase 3 (accounts &
      access) on top of."
