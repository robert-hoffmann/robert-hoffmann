---
name: evidence-governance
description: Enforce evidence-based development governance for web applications and Python services with risk-tiered deterministic gates, typed artifacts, TDD outcome checks, and bounded exceptions for autonomous agent runs.
---

# Evidence Governance

## Overview

Use this skill to run and audit evidence-based development (EBD) for application delivery with autonomous agents.

This skill defines a deterministic governance model for web frontends and Python backend services: two-lane validation, risk-tiered gates, typed artifacts, bounded exceptions, and auditable run records.

## When To Use

Use this skill for:

- producing or auditing merge-gate and confidence-gate evidence
- classifying changes by risk (`evidenceLevel`) and scope (`changeType`)
- validating TDD outcomes for bugfixes, features, and refactors
- creating or reviewing agent validation records for autonomous runs
- reviewing, expiring, renewing, or escalating governance exceptions
- planning evidence folders and collection flow for new phases/releases

## Load References On Demand

- Read `references/evidence-lifecycle.md` for evidence tree structure, freshness, retention, and anti-patterns.
- Read `references/gate-governance-and-exceptions.md` for merge/confidence gate rules, must-meet criteria, and exception lifecycle.
- Read `references/app-artifact-taxonomy.md` for required artifacts by `evidenceLevel × changeType` and cross-stack producer examples.
- Read `references/tdd-outcomes.md` for enforceable TDD outcome policy and acceptance criteria coverage.
- Read `references/agent-validation-record.schema.json` for canonical validation record fields and schema validation rules.
- Read `references/governance-baseline-2026-02.md` for dated baseline defaults and standards alignment.
- Read `references/artifact-taxonomy-and-schemas.md` only when a migration-specific parity extension is explicitly in scope.

## Core Workflow

1. Identify the current phase/release context and acceptance criteria.
2. Classify the run:
   - `changeType`: `ui-feature`, `api-feature`, `bugfix`, `refactor`, `security`, `perf`, `a11y`, `migration`, `release`
   - `evidenceLevel`: `L0`, `L1`, `L2`, `L3` (default `L1`)
3. Define must-meet artifacts from `app-artifact-taxonomy.md` for the selected classification.
4. Execute deterministic Lane B checks and collect typed artifacts.
5. Validate TDD outcomes (regression and acceptance coverage) and update the run record.
6. Record exceptions only when unavoidable, with owner, risk, expiry, and follow-up.
7. Audit evidence freshness and gate completeness.
8. Report gate decision as `pass`, `fail`, or `blocked` with explicit artifact paths.

## Governance Rules

### Two-Lane Model

- Lane A (`exploration`): manual probes, local previews, ad hoc diagnostics. Non-blocking.
- Lane B (`gate`): deterministic checks executable in CI and reproducible from a clean checkout. Blocking.
- Lane A findings used in decisions must be converted to at least one Lane B check before gate exit.

### Risk Tiering

- `L0` (trivial): docs/copy/no-behavioral refactor. Minimal deterministic checks.
- `L1` (standard): routine features and bugfixes. Full merge gate.
- `L2` (risky): auth, permissions, payments, migrations, major refactors. Merge + expanded confidence checks.
- `L3` (release): production release readiness and rollout/rollback evidence.

### Determinism and Reproducibility

- Required gate artifacts must be reproducible from recorded commands.
- Toolchain versions and runtime details are recorded in the validation record.
- Missing or stale must-meet artifacts block gate decisions unless a valid, unexpired exception exists.

### Agent Safety Controls

- Autonomous runs use explicit command/path/network allowlists.
- No production secrets in agent context or logs.
- Autonomous writes remain on reviewable branches with human merge approval.
- Every autonomous blocking run must emit an agent validation record.

## Output Requirements

When producing governance output, include:

1. Scope note: phase/release, `changeType`, and `evidenceLevel`.
2. Evidence inventory: required artifacts with `present`, `missing`, or `stale` status.
3. Lane note: confirmation that blocking evidence is Lane B.
4. TDD note: regression coverage and acceptance criteria mapping.
5. Exception note: active exceptions with expiry state, or explicit `none`.
6. Decision note: `pass`, `fail`, or `blocked` with exact path references.

## Completion Checklist

- Evidence tree exists and follows lifecycle conventions.
- Required artifacts for selected `evidenceLevel × changeType` are collected.
- Agent validation record matches `agent-validation-record.schema.json`.
- TDD outcome rules are satisfied for the change class.
- Blocking evidence is deterministic Lane B (not Lane A-only).
- Exceptions are bounded, owned, and unexpired.
- Gate decision is documented with traceable artifact references.
