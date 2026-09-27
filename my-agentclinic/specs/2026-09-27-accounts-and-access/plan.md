# Plan — Accounts & Access (Roadmap Phase 3)

Numbered task groups, intended to be worked roughly in order.

## 1. Add the `Session` model

1.1. In `schema.prisma`, add `Session` (id/token, role enum-like
     string `"AGENT" | "STAFF"`, `agentId` optional FK to `Agent`,
     `createdAt`). Token is a random string (e.g. `cuid()` or
     `crypto.randomUUID()`), not guessable.
1.2. Run `prisma migrate dev` for the new model.
1.3. Add a `src/lib/session.ts` helper: `createSession`,
     `getSession` (reads the cookie, looks up the row), and
     `destroySession`.

## 2. Sign-in view

2.1. Add a sign-in form (e.g. rendered at `/dashboard` when no
     session cookie is present): name field + role radio
     (`Agent`/`Staff`).
2.2. On submit (server action): if role is `Agent`, find-or-create
     the `Agent` row by name (reuse the existing dedupe logic
     currently in `/dashboard/book`'s booking action — move it into
     a shared helper if needed); create a `Session` row linked to
     it. If role is `Staff`, create a `Session` row with no
     `Agent` link.
2.3. Set the httpOnly session cookie to the new session's token;
     redirect to the role-appropriate view (`/dashboard/book` for
     agents, `/dashboard/bookings` for staff).

## 3. Route gating

3.1. Add a small server-side check (helper or middleware) that
     loads the session for a request and exposes `{ role, agentId }`
     or `null`.
3.2. `/dashboard/book`: redirect to sign-in if no session or session
     role isn't `Agent`.
3.3. `/dashboard/bookings`: redirect to sign-in if no session or
     session role isn't `Staff`.
3.4. `/dashboard` (signed in): show role-appropriate nav/links
     instead of the sign-in form.

## 4. Wire the booking flow to the session

4.1. Remove the name field from `/dashboard/book`'s form.
4.2. Update the booking server action to use the session's linked
     `Agent` id directly instead of finding-or-creating by a
     submitted name.
4.3. Update/remove tests in `src/app/dashboard/book/*.test.ts` that
     exercised the now-removed name field; add coverage for
     "booking uses the signed-in agent."

## 5. Sign-out

5.1. Add a sign-out control to the dashboard nav
     (`src/app/dashboard/layout.tsx`).
5.2. Server action: delete the `Session` row, clear the cookie,
     redirect to the sign-in view.

## 6. Wrap up

6.1. Update `tech-stack.md` if it needs a note on the auth approach
     (role-picker + server-side session), so the "no auth yet" framing
     from Phase 2 doesn't linger.
6.2. Review `git status`/`git diff` — check the new migration is
     committed and nothing unexpected (e.g. a stray `.env` change)
     slipped in.
6.3. Run through `validation.md` end to end.
6.4. Commit with a message describing the Phase 3 work.
