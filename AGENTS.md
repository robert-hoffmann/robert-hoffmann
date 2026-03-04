# AGENTS.md

## Global Skill Invocation Policy

For coding tasks (create, edit, review, refactor, or debug), agents should:

1. Always apply `.agents/skills/code-quality` first.
2. Apply any additional relevant skill(s) for the task domain.

Common mappings:

- TypeScript            : `.agents/skills/dev-ts`
- Vue                   : `.agents/skills/dev-vuejs`
- Nuxt                  : `.agents/skills/dev-nuxt`
- CSS                   : `.agents/skills/dev-css`
- Tailwind              : `.agents/skills/dev-tailwind`
- Python                : `.agents/skills/dev-python`
- Governance            : `.agents/skills/governance`

Conflict handling:

1. Prioritize syntax/runtime/toolchain correctness from the domain-specific skill.
2. Apply `.agents/skills/code-quality` standards where non-conflicting.

## Commit Prefixes (Release Please)

This repo uses `release-please` (`.github/workflows/release-please.yml`) and commit messages must follow Conventional Commits so releases and changelogs are generated correctly.

Use exact prefixes (not aliases):

- `feat:` (or `feat(scope):`) for features
- `fix:` (or `fix(scope):`) for bug fixes
- `deps:` for dependency updates
- `type!:` (for example `feat!:` / `fix!:` / `refactor!:`) for breaking changes
- `BREAKING CHANGE:` in the footer also marks a breaking change

Important reminders:

- Use `feat:`, not `feature:`
- Use `fix:`, not `bugfix:`
- Non-conventional messages like `wip`, `update stuff`, etc. may be ignored by `release-please`
- If using squash merge, the PR title should also use a Conventional Commit prefix (it becomes the merge commit message)

Common non-release prefixes that are still valid Conventional Commits:

- `docs:`
- `chore:`
- `ci:`
- `build:`
- `refactor:`
- `perf:`
- `test:`
- `style:`
- `revert:`

## Important (mandatory)

- Actual project is in `<project root>/desktop-portfolio/`
- Whenever considering implementing compatibility layers and fallbacks, always ask the user first, give mutiple paths, and pros/cons
- When asking the user questions, always use easy to understand language, and provide detailed explanations and pros/cons
