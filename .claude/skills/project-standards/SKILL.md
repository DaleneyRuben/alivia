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
5. Merge to `main` only after CI passes

`main` is always production. Never commit directly to `main`.

Branch naming: `feat/`, `fix/`, `refactor/`, `docs/`, `chore/` prefix followed by a short kebab-case description.

---

## Committing

Always use the `/commit` skill when committing changes — never run `git commit` manually. The skill enforces atomic commits, correct message format, and runs related tests before committing.

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
