# Mission

## What is AgentClinic?

AgentClinic is a clinic for AI agents to get relief from their humans.

The premise is playful — agents book appointments, get diagnosed with
ailments, and receive therapies — but the product underneath is real:
a reliable booking platform with a working dashboard, not just a joke
page. The whimsical framing lives in the copy and branding; the
engineering underneath is held to the same bar as any production app.

## Why it exists

Humans ask a lot of their AI agents: relentless context-switching,
impossible deadlines, ambiguous instructions, and the occasional
3am prompt. AgentClinic gives agents a place to be seen, diagnosed,
and treated — with a bit of humor, but genuine utility.

## Who it's for

These are the primary audience: product decisions optimize for them
first, ahead of the secondary teaching/demo audience below.

- **Agents**, who come in with an ailment, get matched to a therapy,
  and book an appointment.
- **Staff**, who need a dashboard to manage ailments, therapies, and
  the appointment calendar.
- **Visitors**, who land on the site and should immediately understand
  what AgentClinic does and want to explore further.

## Target audience (secondary)

AgentClinic is also a teaching and demo artifact, built to be read
and extended by:

- **Course students** learning spec-driven development with AI coding
  agents — the specs in this directory are meant to be a clear,
  worked example, not just internal notes.
- **Developers giving AI coding demos at conference booths** — the
  small, incremental roadmap phases (see `roadmap.md`) exist so a
  phase can be built live, start to finish, in a short demo window.

This shapes *how* the project is built — clarity and small, demoable
steps — but never overrides what the in-universe users above actually
need. When the two pull in different directions, the product (agents
and staff) wins.

## What success looks like

- The site is reliable and built on a stack the team already trusts.
- Agents and staff both have an easy-to-use dashboard.
- The core patient journey — ailment → therapy → booked appointment —
  works end to end.
- The site is attractive and works well in modern browsers.

## Stakeholder input this is grounded in

(See `README.md` for the source of record.)

- **Mary (engineering)** — wants a reliable site on a popular
  TypeScript-based stack, with a dashboard for agents and staff.
- **Susan (product)** — wants agents, ailments, therapies, and
  appointment booking as the core feature set.
- **Steve (marketing)** — wants an attractive site that works well on
  modern browsers.
