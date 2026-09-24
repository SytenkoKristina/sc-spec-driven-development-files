---
name: changelog
description: Update CHANGELOG.md from git history before merging a branch.
---

# Changelog

Keeps `CHANGELOG.md` at this project's root (`my-agentclinic/`) current with
the repo's commit history, grouped under `## YYYY-MM-DD` headings, newest
date first. Run this by hand before merging a branch.

## 1. Run the script

From `my-agentclinic/` — even though `.git` lives one directory up, `git
log` still returns the whole repo's history from any subdirectory:

```bash
python3 .claude/skills/changelog/scripts/changelog.py
```

It handles both cases:
- **No `CHANGELOG.md`** — reads the full git history and writes the file,
  one date section per commit date, oldest history included.
- **`CHANGELOG.md` exists** — finds the newest `## YYYY-MM-DD` heading,
  fetches commits from that date onward, skips any whose subject is already
  listed under that date (safe to re-run same-day), and prepends any newer
  dates as new sections above it.

Done when the script has printed either how many entries it added, or that
the file is already up to date.

## 2. Review and commit

Read the diff. Bullets are commit subjects verbatim — reword any that are
unclear on their own (`wip`, `fix typo`) using `git show --stat <hash>` for
context, without inventing detail the commit didn't contain. Commit
`CHANGELOG.md` as part of the merge.

Done when every new bullet reads as a clear, factual one-liner and the file
is staged.

## Format

```markdown
# Changelog

## 2026-09-24

- Build marketing landing page (Phase 1)
- Scaffold Next.js app (Phase 0 project scaffolding)

## 2026-09-23

- Initial project scaffold
```

- One `# Changelog` title at the top.
- `## YYYY-MM-DD` headings, newest date first; bullets within a date are
  also newest-first, matching `git log`'s default order.
- Merge commits are excluded — their auto-generated subjects
  (`Merge branch 'x' into y`) aren't useful history.
