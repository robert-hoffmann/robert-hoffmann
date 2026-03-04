---
name: governance-repository
description: Define and audit repository-level governance for GitHub-based projects with lean-by-default policy, deterministic CI, and release-please release controls.
---

# Governance Repository

## Overview

Use this skill for repository-level policy only.

This skill owns repository hygiene, CI/release governance, branch/ruleset policy, and deterministic tooling contracts.
Shared primitives (exceptions, gate vocabulary, report format, profiles) are owned by `governance-core`.

## When To Use

Use this skill for:

- repository governance bootstrap
- repository governance audits and modernization
- branch/ruleset and workflow hardening
- deterministic CI and lockfile policy setup
- release governance with `release-please`

## Load References On Demand

- Read `references/repository-baseline-2026-03.md` for repository defaults.
- Read `references/github-implementation-playbook.md` for GitHub-first implementation patterns.
- Read `references/release-please-playbook.md` for release automation policy.
- Read `../governance-core/references/profile-model.md` for profile selection.
- Read `../governance-core/references/gate-and-report-contract.md` for canonical gate/report semantics.
- Read `../governance-core/references/exception-contract.md` for canonical exception metadata.

## Core Workflow

1. Detect repository shape and active toolchains from repository truth.
2. Select profile (`lean` by default, `advanced` when explicitly required).
3. Propose at least two implementation paths for major governance decisions with concise pros/cons.
4. Choose one path, then apply repository controls and release policy.
5. Use core exception metadata only when deviations are unavoidable.
6. Validate with CI-equivalent checks and publish governance report sections.

## Repository Rules

### Repository Hygiene

- Require baseline artifacts: `.editorconfig`, `.gitattributes`, `.gitignore`, `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `LICENSE`, `.env.example`.
- Keep local developer entrypoints explicit and stable.
- Keep operational docs aligned to real commands.

### Deterministic Tooling

- Commit lockfiles for active ecosystems.
- Use reproducible install modes in CI.
- Keep one primary formatter and lint entrypoint per ecosystem.

### CI and Security

- Use least-privilege workflow permissions.
- Enforce merge gate checks for lint, typecheck, tests, and build.
- Enable dependency governance and secret scanning.
- Keep troubleshooting artifacts available for failures.

### Release Governance

- Default to `release-please`.
- Use Conventional Commits-compatible history.
- Keep release workflow permissions explicit and minimal.

## Output Requirements

When producing repository governance output, include:

1. `environment_note`
2. `scope_note`
3. `decision_note` (chosen path plus one alternative with pros/cons)
4. `gate_note`
5. `exception_note`
6. `validation_note`

## Completion Checklist

- Repository profile is explicit (`lean` or `advanced`).
- Baseline repository artifacts are present or planned.
- Deterministic tooling and lockfile policy are explicit.
- CI merge controls are defined and enforceable.
- Release policy uses `release-please` unless explicitly excepted.
- Exceptions use `governance-core` contract without duplication.
