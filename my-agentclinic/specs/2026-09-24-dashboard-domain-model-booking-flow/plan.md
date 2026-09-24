# Plan — Dashboard, Domain Model & Booking Flow (Roadmap Phase 2)

Numbered task groups, intended to be worked roughly in order.

## 1. Migrate styling from Tailwind to PicoCSS

1.1. Install `@picocss/pico`; import it in `src/app/globals.css` in
     place of `@import "tailwindcss";`.
1.2. Uninstall `tailwindcss` and `@tailwindcss/postcss`; remove
     `postcss.config.mjs` (or strip the Tailwind plugin from it) if
     nothing else needs PostCSS.
1.3. Rework `src/app/page.tsx` (currently Tailwind utility classes)
     to rely on PicoCSS's semantic-HTML defaults plus minimal custom
     CSS where needed, preserving the existing content/copy.
1.4. Confirm `src/components/layout/*` (already plain CSS classes in
     `layout.css`, not Tailwind) still render correctly alongside
     PicoCSS's base styles; adjust `layout.css` only if PicoCSS's
     defaults conflict.
1.5. Visually spot-check the landing page in a browser (light mode
     at minimum) before moving on — this is a styling migration, not
     a rewrite, so it should look intentional, not broken.

## 2. Add Prisma + SQLite

2.1. Install `prisma` and `@prisma/client`; run `prisma init` to
     scaffold `prisma/schema.prisma` and a `.env` with
     `DATABASE_URL` pointing at a local SQLite file (e.g.
     `prisma/dev.db`).
2.2. Add the SQLite file and `.env` to `.gitignore` (keep
     `.env.example` committed instead, if one doesn't already exist).
2.3. Add `npm run db:migrate` / `npm run db:seed` scripts to
     `package.json`.

## 3. Define the domain model

3.1. In `schema.prisma`, define models: `Agent` (id, name,
     createdAt), `Ailment` (id, name, description), `Therapy` (id,
     name, description), `Appointment` (id, agentId, ailmentId,
     therapyId, scheduledFor, createdAt).
3.2. Add a one-to-one relation field on `Ailment` pointing at its
     matched `Therapy` (per the fixed-mapping decision in
     `requirements.md`).
3.3. Run the initial migration (`prisma migrate dev`) and confirm
     the SQLite file and generated client are created correctly.

## 4. Seed starter data

4.1. Write `prisma/seed.ts` with a fixed starter set of ailments,
     each paired with one therapy (enough variety to demo the
     matching flow — e.g. 4-6 ailment/therapy pairs).
4.2. Wire the seed script into Prisma's `seed` config so
     `npm run db:seed` (and `prisma migrate reset`) runs it.
4.3. Run the seed script and spot-check the data via
     `prisma studio` or a quick query.

## 5. Build the dashboard shell

5.1. Add `src/app/dashboard/layout.tsx` with a shared nav linking
     `/dashboard/book` and `/dashboard/bookings`.
5.2. Add a minimal `src/app/dashboard/page.tsx` landing view (e.g.
     brief orientation + links into the two flows) if `/dashboard`
     itself needs to render something.
5.3. Style with PicoCSS's semantic defaults (`<nav>`, `<main>`,
     etc.) — no utility-class framework, no dedicated polish pass
     yet.

## 6. Read-only ailment/therapy views

6.1. Add a data-access module (e.g. `src/lib/db.ts`) exporting a
     singleton `PrismaClient` instance (guarding against multiple
     instances in Next.js dev mode).
6.2. Add list/detail views for ailments and therapies in the
     dashboard (can live under `/dashboard/book` as part of the
     picker, per 7.x, rather than as separate routes, if that reads
     more naturally).

## 7. Agent booking flow (`/dashboard/book`)

7.1. Step 1: agent identifies themselves (minimal — e.g. a name
     field, no auth) and picks an ailment from a list fetched from
     the DB.
7.2. Step 2: show the matched therapy (looked up via the fixed
     mapping) and a way to pick an appointment time.
7.3. Step 3: on confirm, create (or reuse) the `Agent` row and
     create an `Appointment` row linking agent, ailment, therapy,
     and the chosen time.
7.4. Use a Next.js server action (or route handler) for the
     write, consistent with keeping data logic server-side.
7.5. Show a confirmation state after a successful booking.
7.6. Build form/list markup with PicoCSS's default element styling
     (`<form>`, `<fieldset>`, `<select>`, `<button>`) rather than
     custom utility classes.

## 8. Staff bookings view (`/dashboard/bookings`)

8.1. Server-rendered list of upcoming appointments, each showing
     agent name, ailment, therapy, and scheduled time, ordered by
     time.
8.2. Render as a semantic `<table>`, letting PicoCSS style it by
     default.
8.3. No edit/cancel actions this phase — read-only, per
     `requirements.md`.

## 9. Wrap up

9.1. Update `tech-stack.md`: "Data layer" → SQLite + Prisma, and
     "Styling / UI" → PicoCSS (Tailwind removed), resolving both
     decisions.
9.2. Review `git status`/`git diff` for anything unexpected
     (generated Prisma client output, `.env`, `dev.db`, leftover
     Tailwind config) before committing — confirm `.gitignore` is
     catching what it should.
9.3. Run through `validation.md` end to end.
9.4. Commit with a message describing the Phase 2 work.
