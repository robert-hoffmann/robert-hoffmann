# AGENTS.md

## Guide Hierarchy

- Repository policy : start here for global skill, commit, and compatibility
  rules.
- App package       : read `app/AGENTS.md` before changing anything under
  `app/`.
- App subtrees      : then read the local guide for the active area:
  `app/src/AGENTS.md`, `app/scripts/AGENTS.md`, `app/design/AGENTS.md`, or
  `app/docs/AGENTS.md`.

## Global Skill Invocation Policy

For source, documentation, config, review, refactor, or debug tasks, agents
should:

1. Always apply `.agents/skills/ub-quality` first.
2. Apply any additional relevant skill(s) for the task domain.

Common mappings:

- TypeScript            : `.agents/skills/ub-ts`
- Vue                   : `.agents/skills/ub-vuejs`
- CSS                   : `.agents/skills/ub-css`
- Tailwind              : `.agents/skills/ub-tailwind`
- Agent-facing guidance : `.agents/skills/ub-authoring`

Conflict handling:

1. Prioritize syntax/runtime/toolchain correctness from the domain-specific skill.
2. Apply `.agents/skills/ub-quality` standards where non-conflicting.

## Commit Prefixes (Release Please)

This repo uses `release-please` (`.github/workflows/release-please.yml`) and
commit messages must follow Conventional Commits so releases and changelogs are
generated correctly.

Use exact prefixes (not aliases):

- `feat:` (or `feat(scope):`) for features
- `fix:` (or `fix(scope):`) for bug fixes
- `deps:` for dependency updates
- `type!:` (for example `feat!:` / `fix!:` / `refactor!:`) for breaking changes
- `BREAKING CHANGE:` in the footer also marks a breaking change

Important reminders:

- Use `feat:`, not `feature:`
- Use `fix:`, not `bugfix:`
- Non-conventional messages like `wip`, `update stuff`, etc. may be ignored by
  `release-please`
- If using squash merge, the PR title should also use a Conventional Commit
  prefix because it becomes the merge commit message.

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

- Actual project is in `<project root>/app/`
- Whenever considering implementing compatibility layers and fallbacks, always
  ask the user first, give multiple paths, and include pros/cons.
- When asking the user questions, always use easy to understand language and
  provide detailed explanations and pros/cons.
