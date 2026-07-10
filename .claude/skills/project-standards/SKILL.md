---
name: project-standards
description: >
  Project-specific standards for Alivia — git workflow and commit rules.
  Always active — no need to invoke manually.
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
