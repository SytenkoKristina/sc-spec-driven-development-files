# Validation — Dashboard, Domain Model & Booking Flow (Roadmap Phase 2)

This phase is done when all of the following hold:

## Data layer

- [ ] `prisma/schema.prisma` defines `Agent`, `Ailment`, `Therapy`,
      and `Appointment` models, with `Ailment` → `Therapy` as a
      fixed one-to-one relation.
- [ ] `prisma migrate dev` runs cleanly from a fresh clone (no
      committed `dev.db`, no manual DB setup beyond `npm install` +
      migrate).
- [ ] `npm run db:seed` populates a fixed starter set of ailments,
      each with exactly one matched therapy.
- [ ] `tech-stack.md`'s "Data layer" section reflects SQLite +
      Prisma and no longer says "not yet decided."

## Booking flow

- [ ] Visiting `/dashboard/book` shows a list of ailments sourced
      from the DB (not hardcoded).
- [ ] Picking an ailment shows the one matched therapy — no
      therapy-selection step.
- [ ] Completing the flow (name + ailment + time) creates an
      `Agent` row (if new) and an `Appointment` row linking agent,
      ailment, therapy, and the chosen time.
- [ ] A confirmation is shown after a successful booking.
- [ ] Submitting the flow twice with the same agent name doesn't
      create duplicate `Agent` rows (reuses the existing one).

## Staff view

- [ ] Visiting `/dashboard/bookings` lists upcoming appointments
      with agent name, ailment, therapy, and scheduled time.
- [ ] A newly created booking from `/dashboard/book` appears in
      `/dashboard/bookings` without a manual refresh workaround
      (standard Next.js data flow — reload is fine, no realtime
      requirement).
- [ ] No edit/cancel controls are present (read-only, per
      `requirements.md`).

## Dashboard shell

- [ ] `/dashboard`, `/dashboard/book`, and `/dashboard/bookings`
      all render without errors.
- [ ] Shared nav links between the book and bookings views work.
- [ ] The Phase 1 marketing landing page still renders correctly
      (same content/copy), now styled via PicoCSS instead of
      Tailwind.

## Styling migration

- [ ] `tailwindcss` and `@tailwindcss/postcss` are removed from
      `package.json`; no `@import "tailwindcss"` remains anywhere.
- [ ] `@picocss/pico` is installed and imported once (e.g. in
      `src/app/globals.css`).
- [ ] No Tailwind utility classes (e.g. `flex`, `text-4xl`,
      `dark:bg-neutral-950`) remain in `src/app` or
      `src/components`.
- [ ] `tech-stack.md`'s "Styling / UI" section reflects PicoCSS, not
      Tailwind.

## Build & scope discipline

- [ ] `npm run build` completes with no type errors.
- [ ] `npm run lint` passes.
- [ ] No auth, login, or session logic was introduced — every
      dashboard route remains open, per `requirements.md`.
- [ ] No editing/cancelling appointments, no admin UI for
      ailments/therapies, and no multi-therapy matching were added —
      all deferred per `requirements.md`'s "out of scope" list.
- [ ] The Phase 1 landing page's content/copy is unchanged — only
      its styling implementation changed.

## Sign-off

- [ ] A reviewer can clone the branch, run
      `npm install && npm run db:migrate && npm run db:seed && npm run dev`,
      and complete a full booking (pick ailment → see therapy → book
      → see it in the staff view) within a couple of minutes — this
      is the bar for "ready to merge and build Phase 3 (accounts &
      access) on top of."
