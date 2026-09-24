# Plan — Marketing Landing Page (Roadmap Phase 1)

Numbered task groups, intended to be worked roughly in order.

## 1. Add Tailwind CSS

1.1. Install `tailwindcss`, `postcss`, and `autoprefixer` (or the
     current Next.js-recommended equivalent) as dev dependencies.
1.2. Add `postcss.config` and `tailwind.config` (or the current
     zero-config `@import "tailwindcss"` approach, whichever matches
     the installed Tailwind version) scoped to `src/app/**` and
     `src/**` content.
1.3. Replace `src/app/globals.css`'s contents with Tailwind's
     directives/import, dropping the `create-next-app` boilerplate
     custom properties/dark-mode media query that came with the
     default template.
1.4. Confirm a Tailwind utility class actually takes effect on the
     page (sanity check before building real content on top).

## 2. Replace the boilerplate homepage

2.1. Rewrite `src/app/page.tsx`: remove the Next.js/Vercel logos,
     "Deploy now" / "Read our docs" links, and template CTAs.
2.2. Add the minimal landing content: a hero headline, a one-line
     pitch explaining what AgentClinic is, and a single CTA element
     using a placeholder target (`mailto:` or an in-page anchor, per
     `requirements.md`).
2.3. Delete `src/app/page.module.css` (superseded by Tailwind utility
     classes).
2.4. Remove any `public/*.svg` assets (`next.svg`, `vercel.svg`,
     `file.svg`, `globe.svg`, `window.svg`) that the new page no
     longer references; confirm nothing else in `src/app` still
     imports them first.

## 3. Update metadata

3.1. Update `src/app/layout.tsx`'s `metadata` (`title`,
     `description`) to reflect AgentClinic instead of the "Create
     Next App" default.

## 4. Verify

4.1. Run `npm run dev`, load the app in a browser, confirm the
     landing page renders with no console errors and Tailwind
     styling is visibly applied.
4.2. Manually check the page at a mobile width and a desktop width —
     no broken layout, no horizontal overflow, CTA is reachable and
     legible at both.
4.3. Run `npm run build`, confirm it completes without errors or type
     errors.
4.4. Run `npm run lint`, confirm it passes.

## 5. Wrap up

5.1. Update `tech-stack.md`'s Styling / UI section to record Tailwind
     CSS as the chosen approach, and remove "styling" from the Open
     decisions list.
5.2. Review `git status`/`git diff` for anything unexpected before
     committing (in particular, confirm no leftover boilerplate
     assets or unused CSS survived).
5.3. Commit with a message describing the Phase 1 landing page.

## 6. Add a Header/Main/Footer layout

6.1. Create `src/components/layout/Header.tsx`, `Main.tsx`, and
     `Footer.tsx` as three separate subcomponents, plus
     `Layout.tsx`, which composes them and takes `children` (the
     page content) to render inside `<Main>`.
6.2. Create `src/components/layout/layout.css` with plain CSS rules
     for the header/main/footer elements — hand-written CSS, not
     Tailwind utility classes, kept alongside (not replacing) the
     existing Tailwind setup.
6.3. Import `layout.css` into `Layout.tsx` via a plain ES import
     (`import "./layout.css"`); Next.js bundles and links it
     automatically, no manual `<link>` tag needed.
6.4. Update `src/app/page.tsx` to wrap its existing hero/pitch/CTA
     content in `<Layout>`, so that content becomes the children
     rendered inside `<Main>`.
6.5. Verify: `npm run dev` shows the header and footer around the
     existing hero content with no console errors; `npm run build`
     and `npm run lint` both pass.

## 7. Add automated tests for the layout and home page

7.1. Install `@testing-library/react`, `@testing-library/jest-dom`,
     and `jsdom` as dev dependencies (Vitest itself is already a
     dependency, per `tech-stack.md`'s Tooling section).
7.2. Add `vitest.config.ts` (jsdom environment, a setup file for
     jest-dom matchers, and a `@` → `src` resolve alias matching
     `tsconfig.json`'s `paths`) and `vitest.setup.ts`.
7.3. Write a colocated `*.test.tsx` for each of `Header`, `Main`,
     `Footer`, and `Layout` (`src/components/layout/`), asserting on
     what each renders (wordmark, children placement, copyright
     line, composition of all three).
7.4. Write `src/app/page.test.tsx` asserting the `Home` page renders
     its hero heading, pitch copy, and a CTA link pointing at the
     `mailto:` placeholder target.
7.5. Run `npm test`, confirm all tests pass; confirm `npm run build`
     and `npm run lint` still pass with the new test files present.
