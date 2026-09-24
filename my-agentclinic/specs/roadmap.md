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

## Phase 2 — Dashboard, domain model & booking flow
- Add the dashboard route(s) with basic navigation and layout —
  the shared shell that agent- and staff-facing views build on
  (Mary's ask).
- Define the data model for agents, ailments, and therapies; decide
  and wire up the data layer (see open decision in `tech-stack.md`).
- Basic read-only list/detail views in the dashboard, built on that
  data model.
- Let an agent pick an ailment, get matched to a therapy, and book an
  appointment (Susan's core feature ask). Keep the flow minimal: no
  cancellation/rescheduling yet.
- Add a staff view of bookings: see and manage upcoming appointments,
  connecting the shell to the booking data.
- No auth yet — everything in the dashboard is open; auth lands in
  the next phase.

## Phase 3 — Accounts & access
- Basic auth so agents and staff see the dashboard views relevant to
  them, rather than everything being open.

## Phase 4 — Polish pass
- Responsive/accessibility/visual polish across landing page and
  dashboard.
- Revisit open tech-stack decisions (styling, deployment, linting) if
  not already settled.

## Later / not yet scheduled
- Editing/cancelling appointments, richer therapy content, search,
  notifications — deliberately deferred until the core loop above is
  proven out.
