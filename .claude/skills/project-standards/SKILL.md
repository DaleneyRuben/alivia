---
name: project-standards
description: >
  Project-specific standards for Alivia — git workflow, commit rules, code
  organization, and language conventions.
  Always active — no need to invoke manually.
---

## Package manager

This project uses **yarn** — never npm or npx. Install with `yarn add` / `yarn add -D`, run scripts with `yarn <script>`, and run package binaries with `yarn <binary>` (e.g. `yarn prisma migrate dev`).

---

## Git workflow

This project uses **GitHub Flow**:

1. Create a feature branch off `main` before starting any change (`git checkout -b <type>/<short-description>`)
2. Work on the branch with atomic commits (use `/commit`)
3. Verify the change end-to-end via Playwright (see "Verify end-to-end before calling it done" below) — this is a hard stop before step 4, not an optional follow-up
4. Open a PR — CI runs lint, typecheck, frontend tests, and backend tests
5. Merge to `main` only after CI passes, using a regular merge commit (`gh pr merge --merge`) — **never squash**, so the branch's atomic commits stay intact on `main`

`main` is always production. Never commit directly to `main`.

Branch naming: `feat/`, `fix/`, `refactor/`, `docs/`, `chore/` prefix followed by a short kebab-case description.

---

## Verify end-to-end before calling it done

For any UI or frontend change, drive the actual feature with Playwright before opening a PR — type checks and unit tests confirm correctness, not that the feature works.

- Launch **headed**, not headless (`chromium.launch({ headless: false })`), so the browser is visible while it runs — add a small `slowMo` (e.g. 200–300ms) so actions are watchable, not instant.
- Cover the golden path and the edge cases relevant to the change (e.g. both roles when behavior is role-conditional).
- Screenshots are a fine supplement for the record, but the headed run itself is the verification — a passing test suite alone does not satisfy this step.

---

## Match design values property-by-property, not by eyeballing

CLAUDE.md already says to check `./design` before implementing UI — this is about _how_ to check it. A visual screenshot comparison misses small drifts: an off-white input on a cream page background, or a 1px padding difference, don't stand out at a glance, especially at reduced screenshot size. They're still wrong, and they're the kind of thing a user notices immediately in the real app even when a side-by-side screenshot looked fine.

For every new or changed element:

- Open the relevant block in `design/*.dc.html` and read **every** inline style property — `background`, `border`, `color`, `padding`, `border-radius`, `font-size`, `font-weight`, `gap` — not just the ones that look load-bearing.
- Map each property to an explicit Tailwind class or arbitrary value (`bg-white`, `py-[13px]`), even when it seems like it should be inherited or "probably fine." A dropped property silently falls back to something that can look close enough while still being measurably wrong.
- Don't pattern-match a new element's classes off a neighboring _already-built_ component — that component may itself have skipped a property (this codebase has several inputs missing `bg-white` for exactly this reason).
- Verify programmatically, not just visually: read back computed styles in a quick Playwright `page.evaluate` (`getComputedStyle(el).backgroundColor`, `.paddingTop`, etc.) and diff against the design's literal hex/px values. Treat a screenshot as a first pass for layout, not proof that colors and spacing match.

---

## Committing

Always use the `/commit` skill when committing changes — never run `git commit` manually. The skill enforces atomic commits, correct message format, and runs related tests before committing.

---

## Component naming & folder structure

- **Component files** → PascalCase, named after the component they export: `LoginForm.tsx` exports `LoginForm`. One component per file.
- **Next.js route files** keep their framework-mandated lowercase names (`page.tsx`, `layout.tsx`, `route.ts`) — these live in `src/app` and contain routing/layout concerns only, importing components from `src/components`.
- **All components live in `src/components/<feature>/`**, grouped by feature (e.g. `src/components/auth/LoginForm.tsx`), never colocated inside `src/app`. Shared primitives (buttons, inputs) go in `src/components/ui/`.
- **Non-component modules** → camelCase filenames matching their main export (Airbnb style): `src/lib/auth/verifyCredentials.ts`, `src/hooks/useSlotAvailability.ts`.
- **Tests** are colocated next to the file they test: `LoginForm.test.tsx` beside `LoginForm.tsx`.

---

## File size

Keep files under 400 lines. If a file grows beyond that, split it — extract subcomponents, separate hooks, or break out helper modules. A React component that's getting long is almost always doing too much.

---

## Reuse before creating

Before writing a new function, hook, helper, or constant, search the codebase for something equivalent. Shared helpers live longer and stay consistent — duplication is the real cost.

---

## Separation of concerns

Functions and components should do one thing. UI rendering, data fetching, and business logic belong in separate layers. If a component is importing from many places and managing complex state, it's a signal to split.

---

## DRY

Don't repeat logic. If the same pattern appears twice, extract it. The third occurrence is already technical debt.

---

## Language conventions

- **UI labels, copy, and messages** → Neutral Spanish (no regional slang or localisms)
- **Code identifiers** → English: variable names, function names, constants, route names, type names, file names — even when the concept is Spanish-only
- **Comments** → only when the WHY is non-obvious; write them in English
