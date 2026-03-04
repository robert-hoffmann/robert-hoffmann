---
name: evidence-governance
description: Enforce evidence-based development governance for web applications and Python services with risk-tiered deterministic gates, decision-memory ADR controls, typed artifacts, claim-verification policy, and bounded exceptions for autonomous agent runs.
---

# Evidence Governance

## Overview

Use this skill to run and audit evidence-based development (EBD) for application delivery with autonomous agents.

This skill defines a deterministic governance model for web frontends and Python backend services:

1. two-lane validation (`exploration` vs `gate`)
2. risk-tiered gates (`L0` to `L3`)
3. typed evidence and run records
4. decision-memory controls (ADR alignment and waivers)
5. claim-verification controls for governance assertions
6. bounded exceptions with expiry and owner

## When To Use

Use this skill for:

- producing or auditing merge-gate and confidence-gate evidence
- classifying changes by risk (`evidenceLevel`) and scope (`changeType`)
- validating TDD outcomes for bugfixes, features, and refactors
- validating decision-memory alignment for high-risk and structural changes
- validating claim quality before using claims as governance rationale
- creating or reviewing agent validation records for autonomous runs
- reviewing, expiring, renewing, or escalating governance exceptions
- planning evidence folders and collection flow for new phases/releases

## Operating Modes

1. `evidence mode`: build and audit Lane B artifacts and gate decisions
2. `decision-memory mode`: map structural changes to accepted ADRs, waivers, or new ADR proposals
3. `claim-verification mode`: classify and validate claims used in governance controls

## Load References On Demand

- Read `references/evidence-lifecycle.md` for evidence tree structure, freshness, retention, and anti-patterns.
- Read `references/gate-governance-and-exceptions.md` for merge/confidence gate rules, ADR waivers, and exception lifecycle.
- Read `references/app-artifact-taxonomy.md` for required artifacts by `evidenceLevel x changeType` and high-risk modifiers.
- Read `references/tdd-outcomes.md` for enforceable TDD outcome policy and acceptance criteria coverage.
- Read `references/agent-validation-record.schema.json` for canonical run record fields and schema validation rules.
- Read `references/adr-registry.schema.json` for machine-readable ADR registry contracts.
- Read `references/claim-register.schema.json` for claim-verification contracts.
- Read `references/high-risk-paths.yaml` for default immediate-blocking path patterns.
- Read `references/adr-template-madr.md` for the default ADR authoring template.
- Read `references/governance-baseline-2026-02.md` for dated baseline defaults and standards alignment.
- Read `references/artifact-taxonomy-and-schemas.md` only when a migration-specific parity extension is explicitly in scope.

## Core Workflow

1. Identify the phase/release context and acceptance criteria.
2. Classify the run:
   - `changeType`: `ui-feature`, `api-feature`, `bugfix`, `refactor`, `security`, `perf`, `a11y`, `migration`, `release`
   - `evidenceLevel`: `L0`, `L1`, `L2`, `L3` (default `L1`)
3. Detect high-risk path impact using `high-risk-paths.yaml`.
4. Compute must-meet artifacts from `app-artifact-taxonomy.md` for the selected classification.
5. Execute deterministic Lane B checks and collect typed artifacts.
6. Validate TDD outcomes (regression and acceptance coverage) and update the run record.
7. Validate decision memory:
   - map impacted structural areas to accepted ADR references
   - if alignment is missing, require a new proposed ADR or a bounded ADR waiver
8. Validate claim quality:
   - classify claims as `verified`, `partial`, or `unverified`
   - block governance-grade blocking assertions based on `unverified` claims
   - require bounded exception metadata for `partial` claims used in blocking policy
9. Record exceptions only when unavoidable, with owner, risk, expiry, and follow-up.
10. Audit evidence freshness and gate completeness.
11. Report gate decision as `pass`, `fail`, or `blocked` with explicit artifact paths.

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

### Decision-Memory Controls

- High-risk path changes are immediate-blocking by default.
- High-risk merge pass requires one of:
  1. updated/new ADR present in `docs/adr/registry.json`, or
  2. active, unexpired ADR waiver with owner and follow-up.
- Confidence/release gate pass requires decision alignment `aligned` with no expired waiver.
- For `L2` and `L3`, the validation record must include non-empty `decision.adrRefs`.

### Claim-Verification Controls

- `verified`: primary-source-supported and currently valid for policy use.
- `partial`: directionally useful but limited confidence or scope.
- `unverified`: not confirmed or not reproducible; not acceptable for blocking governance rationale.
- Blocking policy cannot rely on `unverified` claims.
- Blocking policy relying on `partial` claims requires bounded exception metadata.

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

1. scope note: phase/release, `changeType`, and `evidenceLevel`
2. evidence inventory: required artifacts with `present`, `missing`, or `stale` status
3. lane note: confirmation that blocking evidence is Lane B
4. decision note: `impact`, `alignment`, `adrRefs`, `waiverRef` (if any)
5. claim note: claim statuses and any blocked `unverified` usage
6. TDD note: regression coverage and acceptance criteria mapping
7. exception note: active exceptions with expiry state, or explicit `none`
8. decision outcome note: `pass`, `fail`, or `blocked` with exact path references

## Completion Checklist

- Evidence tree exists and follows lifecycle conventions.
- Required artifacts for selected `evidenceLevel x changeType` are collected.
- Agent validation record matches `agent-validation-record.schema.json` v2.
- TDD outcome rules are satisfied for the change class.
- Decision-memory requirements are satisfied for high-risk and `L2`/`L3` scopes.
- Blocking evidence is deterministic Lane B (not Lane A-only).
- Claim register rules are satisfied for governance assertions.
- Exceptions are bounded, owned, and unexpired.
- Gate decision is documented with traceable artifact references.
