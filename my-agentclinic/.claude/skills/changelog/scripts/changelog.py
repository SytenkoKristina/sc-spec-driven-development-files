#!/usr/bin/env python3
"""Maintain CHANGELOG.md from git commit history."""

import re
import subprocess
import sys
from collections import OrderedDict, defaultdict
from pathlib import Path

DATE_HEADING = re.compile(r"^## (\d{4}-\d{2}-\d{2})\s*$")


def git_log(since=None):
    """Return commits as {date: [subject, ...]}, each list newest-first."""
    cmd = ["git", "log", "--no-merges", "--format=%ad|%s", "--date=short"]
    if since:
        cmd.append(f"--since={since} 00:00:00")
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    by_date = defaultdict(list)
    for line in result.stdout.strip().splitlines():
        if "|" in line:
            date, subject = line.split("|", 1)
            by_date[date.strip()].append(subject.strip())
    return by_date


def parse_existing(path):
    """Return an ordered {date: [subjects]} as they currently appear in the file."""
    sections = OrderedDict()
    current = None
    for line in path.read_text().splitlines():
        heading = DATE_HEADING.match(line)
        if heading:
            current = heading.group(1)
            sections[current] = []
        elif current and line.startswith("- "):
            sections[current].append(line[2:].strip())
    return sections


def render_section(date, subjects):
    return [f"\n## {date}\n"] + [f"- {s}\n" for s in subjects]


def main():
    changelog = Path("CHANGELOG.md")

    if not changelog.exists():
        by_date = git_log()
        if not by_date:
            print("No commits found — nothing to write.")
            sys.exit(0)
        content = ["# Changelog\n"]
        for date in sorted(by_date, reverse=True):
            content += render_section(date, by_date[date])
        changelog.write_text("".join(content))
        total = sum(len(v) for v in by_date.values())
        print(f"Created CHANGELOG.md with {total} entries across {len(by_date)} date(s).")
        return

    existing = parse_existing(changelog)
    if not existing:
        print("CHANGELOG.md has no ## YYYY-MM-DD headings — fix it manually before rerunning.")
        sys.exit(1)

    last_date = next(iter(existing))  # topmost heading = most recent date
    by_date = git_log(since=last_date)

    # Same-day commits: keep only the ones not already logged under last_date.
    if last_date in by_date:
        already = set(existing[last_date])
        fresh = [s for s in by_date[last_date] if s not in already]
        if fresh:
            by_date[last_date] = fresh
        else:
            del by_date[last_date]

    if not by_date:
        print("No new commits since last entry — CHANGELOG.md is up to date.")
        sys.exit(0)

    lines = changelog.read_text().splitlines(keepends=True)
    insert_at = 1 if lines and lines[0].startswith("# ") else 0

    newer_dates = sorted((d for d in by_date if d != last_date), reverse=True)
    new_top_sections = []
    for date in newer_dates:
        new_top_sections += render_section(date, by_date[date])

    updated = lines[:insert_at] + new_top_sections + lines[insert_at:]

    if last_date in by_date:
        heading_idx = next(
            i
            for i, l in enumerate(updated)
            if (m := DATE_HEADING.match(l.strip())) and m.group(1) == last_date
        )
        insertion = [f"- {s}\n" for s in by_date[last_date]]
        updated = updated[: heading_idx + 1] + insertion + updated[heading_idx + 1 :]

    changelog.write_text("".join(updated))
    total = sum(len(v) for v in by_date.values())
    print(f"Added {total} new entries to CHANGELOG.md.")


if __name__ == "__main__":
    main()
