---
name: feature-spec
description: Start the next roadmap phase — branch, Q&A on scope/plan/validation, then write specs/YYYY-MM-DD-feature-name/{requirements,plan,validation}.md.
disable-model-invocation: true
---

# Feature spec

Turns the next unaddressed phase in `specs/roadmap.md` into a branch plus a
dated spec folder, with the user's decisions captured before anything is
written.

## 1. Find the next phase

Read `specs/roadmap.md`'s phase list. Read the `specs/` directory for
existing `YYYY-MM-DD-*` folders — each one is a phase already spec'd.
Match phases to folders by content, not just position: roadmap.md notes
phases can reorder based on what's learned, so also sanity-check against
the actual repo state (e.g. does the phase's described work already
exist?) rather than trusting order alone.

Done when you can name one phase, in the roadmap's own words, that has no
matching folder and isn't already built.

## 2. Branch

Slug the phase's title (kebab-case) and combine with today's date:
`YYYY-MM-DD-feature-name`. Create and switch to a branch with that name.

Done when `git branch --show-current` prints that name.

## 3. Ask before writing anything

Nothing gets written to `specs/` until this step completes. Batch
questions through AskUserQuestion (multiple calls if more than 4
decisions surface — never skip asking to stay under the limit), grouped
by the file each decision lands in:

- **requirements.md** — scope boundaries (what's explicitly out), and any
  decisions the phase forces. Check `specs/tech-stack.md`'s open
  decisions list — if this phase touches one, surface it as a question
  instead of guessing.
- **plan.md** — how to break the phase into task groups; flag any
  ordering or sequencing choice that isn't obvious from the roadmap text.
- **validation.md** — what "done, mergeable" means for this specific
  phase, beyond the roadmap's own description of it.

Ground every question in the actual phase text plus `specs/mission.md`
and `specs/tech-stack.md` — don't ask generic questions the roadmap
already answers.

## 4. Write the spec folder

Create `specs/YYYY-MM-DD-feature-name/` with three files, built strictly
from the answers just gathered (not invented afterward):

- `requirements.md` — scope (in/out), decisions (with the reasoning from
  the Q&A), context (why, tying back to `mission.md`/`tech-stack.md`).
- `plan.md` — numbered task groups, each with numbered sub-steps.
- `validation.md` — a checklist for "succeeded and can be merged,"
  covering the roadmap phase's own description plus anything the Q&A
  added.

If `specs/2026-09-24-project-scaffolding/` exists, it's a worked example
of the expected shape and tone — check it when unsure, don't copy it
verbatim.

Done when all three files exist and every decision in them traces back to
an answered question, not an assumption.
