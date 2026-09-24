# Roadmap

High-level implementation order, broken into very small phases. Each
phase should be independently shippable/demoable before moving to the
next. Later phases can reorder based on what's learned, but this is
the starting sequence.

## Phase 0 — Project scaffolding
- Confirm Next.js app structure on top of the existing TypeScript
  config.
- Wire up `npm run dev` / `npm run build` scripts.
- Nothing product-specific yet — just a running "hello world" page.

## Phase 1 — Marketing landing page
- Build the public-facing landing page: what AgentClinic is, who it's
  for, a clear call to action.
- Prioritize looking attractive and working well on modern browsers
  (Steve's ask) — this is the first thing visitors see.
- Static content only; no data layer yet.

## Phase 2 — Dashboard shell
- Add the dashboard route(s) with basic navigation and layout, no
  auth or real data yet — empty/placeholder states only.
- Establishes the shared shell that agent- and staff-facing views
  will build on (Mary's ask).

## Phase 3 — Core domain model
- Define the data model for agents, ailments, and therapies.
- Decide and wire up the data layer (see open decision in
  `tech-stack.md`).
- Basic read-only list/detail views in the dashboard.

## Phase 4 — Booking flow
- Let an agent pick an ailment, get matched to a therapy, and book an
  appointment (Susan's core feature ask).
- Keep the flow minimal: no cancellation/rescheduling yet.

## Phase 5 — Staff view of bookings
- Dashboard view for staff to see and manage upcoming appointments.
- Connects Phase 2's shell to Phase 4's booking data.

## Phase 6 — Accounts & access
- Basic auth so agents and staff see the dashboard views relevant to
  them, rather than everything being open.

## Phase 7 — Polish pass
- Responsive/accessibility/visual polish across landing page and
  dashboard.
- Revisit open tech-stack decisions (styling, deployment, linting) if
  not already settled.

## Later / not yet scheduled
- Editing/cancelling appointments, richer therapy content, search,
  notifications — deliberately deferred until the core loop above is
  proven out.
