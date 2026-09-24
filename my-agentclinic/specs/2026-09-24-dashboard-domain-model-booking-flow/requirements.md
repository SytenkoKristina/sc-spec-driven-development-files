# Requirements — Dashboard, Domain Model & Booking Flow (Roadmap Phase 2)

## Scope

Add the dashboard shell, define and wire up the data model for
agents, ailments, therapies, and appointments, and deliver the core
patient journey end to end: an agent picks an ailment, gets matched
to a therapy, and books an appointment. Staff get a view of upcoming
bookings. No auth yet — every dashboard route is open to anyone who
navigates to it.

In scope:
- A dashboard shell (shared layout/nav) under `/dashboard`, separate
  from the Phase 1 marketing site.
- A SQLite database (via Prisma) with tables for agents, ailments,
  therapies, and appointments.
- A seed script populating a fixed starter set of ailments and
  therapies (one therapy per ailment — see Decisions).
- `/dashboard/book` — agent-facing flow: pick an ailment, see the
  matched therapy, pick a time, confirm the booking. Creates an
  agent record (if new) and an appointment record.
- `/dashboard/bookings` — staff-facing read view of upcoming
  appointments (agent, ailment, therapy, time).
- Basic read-only list/detail views of ailments and therapies in the
  dashboard, built on the same data model.
- Shared dashboard nav linking `/dashboard/book` and
  `/dashboard/bookings`.
- Migrate styling from Tailwind CSS to **PicoCSS** across the whole
  app — including the Phase 1 marketing landing page, not just the
  new dashboard routes — and remove Tailwind entirely (see
  Decisions).

Out of scope (deferred to later phases per `roadmap.md`):
- Auth / role-based access (Phase 3) — both dashboard routes stay
  open to anyone for now.
- Editing or cancelling appointments (Later/not yet scheduled).
- Admin UI for creating/editing ailments or therapies — seeded once,
  not managed through the UI this phase.
- Multiple candidate therapies per ailment, or any matching logic
  beyond a fixed lookup (see Decisions).
- Responsive/accessibility/visual polish pass (Phase 4) — functional
  UI is enough; don't gold-plate.
- Deployment target (still an open `tech-stack.md` decision, not
  resolved here).

## Decisions

Made via stakeholder Q&A before writing this spec:

1. **Data layer** — SQLite (embedded, file-based) with Prisma as the
   ORM. Chosen over managed Postgres to keep the project demoable
   with zero external infra to provision — important given this repo
   doubles as a teaching/conference-demo artifact (`mission.md`).
   Resolves the open data-layer decision in `tech-stack.md`; that
   file gets updated as part of this phase.
2. **Ailment → therapy matching** — Fixed one-to-one mapping: every
   ailment has exactly one associated therapy. An agent picks an
   ailment and the therapy is auto-assigned; there's no
   therapy-selection step. Chosen to keep the booking flow minimal,
   per the roadmap's explicit note for this phase.
3. **Dashboard route structure** — Agent-facing and staff-facing
   views live at separate routes (`/dashboard/book`,
   `/dashboard/bookings`) under a shared dashboard shell/nav, rather
   than one combined page. Chosen so Phase 3 can gate each route by
   role without restructuring the UI.
4. **Ailment/therapy data** — Seeded once via a Prisma seed script
   into real DB tables, not hardcoded constants and not manageable
   through the UI. Ailments and therapies are read-only from the
   dashboard's perspective this phase; only agents and appointments
   are created through the UI.
5. **Styling framework** — Switch from Tailwind CSS to PicoCSS,
   project-wide, with Tailwind removed entirely rather than kept
   alongside it. Chosen because PicoCSS's classless/semantic
   defaults fit a small, mostly-forms-and-lists dashboard (agent
   picker, booking form, staff table) without hand-writing utility
   classes, and because running two styling systems side by side
   would leave the repo — a teaching/demo artifact — harder to read.
   This supersedes Phase 1's original Tailwind choice; the landing
   page is migrated to PicoCSS as part of this phase rather than
   left on Tailwind.

## Context

- `tech-stack.md` commits to Next.js (App Router) and TypeScript
  strict mode; this phase inherits those and adds Prisma + SQLite as
  the data layer, updating `tech-stack.md`'s "Data layer" section
  from "not yet decided" to this choice. It also updates the
  "Styling / UI" section from Tailwind to PicoCSS (Decision 5).
- Phase 1 (marketing landing page) is static and lives outside
  `/dashboard`. This phase does touch it, but only for the styling
  migration (Tailwind → PicoCSS) — no content, copy, or structural
  changes to the landing page itself. Link it to `/dashboard` from
  the landing page's call to action, if that link doesn't already
  exist.
- No accounts exist yet. "Agent" records created by the booking flow
  are identified by whatever minimal info the flow collects (e.g. a
  name) — there's no login, session, or agent identity beyond that
  record. Phase 3 (auth) is where a real agent identity/session gets
  layered on.
- This is the first phase with a real data layer, so schema
  decisions made here (field names, relations) set the shape later
  phases (editing/cancelling, richer therapy content, search) build
  on — keep the schema simple but not obviously wrong for those
  future needs.
- Per `mission.md`, this project is a teaching/demo artifact: keep
  the domain model and booking flow legible enough that a student or
  conference audience can follow it end to end without extra
  explanation.
