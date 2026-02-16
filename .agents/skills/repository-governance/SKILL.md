---
name: repository-governance
description: Define and enforce modern repository governance across TypeScript, Node.js, Vue, Vite, Nuxt, and Python projects with GitHub-first defaults, strict exception handling, and release-please based release governance.
---

# Repository Governance

## Overview

Use this skill to define, bootstrap, or audit repository governance for modern polyglot repositories.

This skill is GitHub-first and extensible: default implementation guidance targets GitHub first, while non-GitHub providers are handled through explicit extension points without weakening baseline controls.

## When To Use

Use this skill for:

- new repository bootstrap and initial policy setup
- repository governance audits and modernization
- CI gate and branch governance hardening
- release process standardization
- cross-stack policy alignment for TypeScript, Node.js, Vue, Vite, Nuxt, and Python

## Load References On Demand

- Read `references/governance-baseline-2026-02.md` for dated baseline defaults, required artifacts, and CI minimum gates.
- Read `references/github-implementation-playbook.md` for concrete GitHub rulesets, Actions hardening, and repository policy implementation.
- Read `references/release-please-playbook.md` for release governance defaults, config patterns, and token caveats.
- Read `references/exception-records-and-audit.md` for mandatory exception templates, SLAs, and audit vocabulary.

## Core Workflow

1. Detect repository truth from files and runtime indicators:
   - `package.json`, lockfiles, `pyproject.toml`, workflow files, repository docs, and branch/release conventions.
2. Select governance profile from repository shape:
   - application, library, service, monorepo, or polyglot split.
3. Propose at least two implementation paths for major governance decisions, each with concise pros and cons.
4. Choose strict modern defaults unless explicit constraints require a temporary exception.
5. When deviating from defaults, produce an explicit exception record with owner, rationale, creation date, expiry date, and follow-up.
6. Validate with command checklists and CI-equivalent checks.
7. Report results with chosen path, one alternative, tradeoffs, exceptions, and validation evidence.

## Governance Rules

### Repository Hygiene

- Require baseline files:
  `.editorconfig`, `.gitattributes`, `.gitignore`, `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, license, and `.env.example`.
- Keep developer entrypoints explicit with stable local command contracts (`Makefile` or equivalent).
- Keep project documentation operational and aligned with actual commands.

### Deterministic Tooling

- Commit lockfiles for active ecosystems (for example `pnpm-lock.yaml`, `uv.lock`).
- Enforce reproducible installs in CI with strict lockfile modes.
- Prefer one formatter per language and one primary lint entrypoint per ecosystem.

### CI Gates

- Define merge gates for lint, typecheck, tests, and build.
- Keep workflow permissions minimal by default.
- Keep local and CI command contracts aligned.
- Retain debug artifacts for failed jobs when available and useful (coverage reports, test reports, E2E diagnostics).

### Security Baseline

- Never commit real secrets; use `.env.example` and secret scanning.
- Require dependency governance (Dependabot or equivalent) and dependency change review.
- Harden GitHub Actions usage and token permissions.
- Treat provenance and artifact attestations as recommended for build/release pipelines.

### Documentation Governance

- README must cover setup, lint, typecheck, test, build, and release entrypoints.
- CONTRIBUTING must define branch, commit, and PR validation rules.
- SECURITY must define a private disclosure path.
- Architecture and decision records should be discoverable in `docs/`.

## Commit Message Governance

All commits to governed branches must follow the [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) specification.
This is required for `release-please` to detect changes, generate changelogs, and determine version bumps.

### Required Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Allowed Types

| Type | Purpose | Version Bump |
|---|---|---|
| `feat` | New feature or capability | minor |
| `fix` | Bug fix | patch |
| `docs` | Documentation only | none (groups into next release) |
| `style` | Formatting, whitespace, missing semicolons | none |
| `refactor` | Code change that neither fixes nor adds | none |
| `perf` | Performance improvement | patch |
| `test` | Adding or correcting tests | none |
| `build` | Build system or external dependency changes | none |
| `ci` | CI configuration and scripts | none |
| `chore` | Maintenance tasks | none |
| `revert` | Reverts a previous commit | patch |

### Breaking Changes

Append `!` after the type/scope to signal a breaking change that triggers a major version bump:

```
feat!: remove legacy API endpoints
refactor(auth)!: change token format to JWT
```

Alternatively, include `BREAKING CHANGE:` in the commit footer.

### Examples

```
feat: add dark mode toggle
fix(dock): correct icon alignment on resize
docs: update setup instructions in README
chore: update dev dependencies
feat(i18n)!: switch locale keys to BCP 47 format
```

### Scope Conventions

Scopes are optional but encouraged for repositories with clear module boundaries.
Use lowercase, kebab-case scope names matching component, directory, or domain names.

### Enforcement

- Agents must use Conventional Commit format for all generated commit messages.
- PR titles should follow Conventional Commit format when squash-merge is the default merge strategy.
- Non-conforming commits will be invisible to `release-please` and will not appear in changelogs.

## Release Governance

- Default release automation is `release-please`.
- Require `release-please-config.json` for governed repositories that publish versions.
- For monorepos, require `.release-please-manifest.json` and manifest-mode strategy.
- Require Conventional Commits-compatible commit history as defined in the Commit Message Governance section above.
- Keep release workflow permissions explicit and minimal.
- If downstream workflows must run from release commits or release PR merges, use approved PAT or GitHub App token strategy instead of relying solely on default `GITHUB_TOKEN`.

## Exception Policy

Any deviation from defaults must include a record with this minimum schema:

```yaml
governance_exception:
  owner: "@team-or-person"
  rationale: "Why baseline rule cannot be applied now"
  created_at: "2026-02-14"
  expires_at: "2026-03-01"
  follow_up: "https://tracker.example.com/ISSUE-123"
```

Exception rules:

- Exceptions are temporary, scoped, and reviewable.
- Exceptions must not become silent permanent policy.
- Every exception must include a concrete modernization follow-up step.

## Output Requirements

When generating governance guidance or audits, always include:

1. Environment note: detected stack, repository shape, and existing governance signals.
2. Chosen path note: selected approach and why.
3. Alternative note: at least one viable non-selected path.
4. Tradeoff note: concise pros and cons for chosen and rejected paths.
5. Exception note: explicit exception record, or explicit statement that no exception is needed.
6. Validation note: commands/checks used and outcomes.

## Completion Checklist

- Governance profile was selected from repository truth.
- Required baseline artifacts are present or explicitly planned.
- Deterministic tooling and lockfile policy are explicit.
- CI merge gates are defined and enforceable.
- Security and dependency governance controls are explicit.
- Release strategy defaults to `release-please` with the proper config pattern.
- Any deviations include bounded exception records.
- Guidance stays GitHub-first while documenting extension points for other providers.
