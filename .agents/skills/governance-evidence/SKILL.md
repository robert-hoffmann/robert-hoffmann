---
name: governance-evidence
description: Enforce evidence lifecycle, risk-tiered evidence requirements, decision-memory checks, and claim-verification controls for deterministic governance decisions.
---

# Governance Evidence

## Overview

Use this skill for evidence governance only.

This skill owns evidence inventory, lifecycle, risk-tiered artifact requirements, ADR/claim validation, and gate decision status.
Testing policy and TDD execution are not defined here.

## Operating Modes

1. `evidence mode`: audit required artifacts and gate readiness
2. `decision-memory mode`: evaluate ADR alignment and waiver state
3. `claim-verification mode`: evaluate claim confidence and blocking-use constraints

## Load References On Demand

- Read `references/evidence-baseline-2026-03.md` for default evidence controls.
- Read `references/evidence-lifecycle.md` for evidence structure, freshness, and retention.
- Read `references/evidence-artifact-taxonomy.md` for required artifacts by risk and scope.
- Read `references/decision-memory-and-claims.md` for ADR/claim validation decision rules.
- Read `references/high-risk-paths.yaml` for immediate-blocking path patterns.
- Read `references/agent-validation-record.schema.json` for run-record requirements.
- Read `references/adr-registry.schema.json` for ADR registry schema.
- Read `references/claim-register.schema.json` for claim-register schema.
- Read `references/adr-template-madr.md` for ADR authoring structure.
- Read `../governance-core/references/profile-model.md` for profile selection.
- Read `../governance-core/references/gate-and-report-contract.md` for canonical gate/report semantics.
- Read `../governance-core/references/exception-contract.md` for canonical exception metadata.

## Core Workflow

1. classify scope (`changeType`, `evidenceLevel`, `profile`), defaulting to `lean` unless explicitly elevated
2. detect high-risk path impact from `high-risk-paths.yaml`
3. compute required artifacts from taxonomy
4. validate deterministic artifact presence/freshness
5. validate ADR alignment or active waiver state
6. validate claim confidence and blocking-use constraints
7. apply bounded exceptions from governance-core only when unavoidable
8. emit gate decision (`pass`, `fail`, `blocked`) with explicit artifact paths

## Rules

- Blocking evidence must be deterministic and reproducible.
- High-risk path changes require decision-memory validation.
- Blocking rationale cannot depend on unverified claims.
- Exception schemas must be referenced from governance-core, not redefined here.

## Output Requirements

When producing evidence governance output, include:

1. `environment_note`
2. `scope_note`
3. `evidence_inventory`
4. `decision_note` (`impact`, `alignment`, `adrRefs`, `waiverRef` if any)
5. `claim_note`
6. `gate_note`
7. `exception_note`
8. `validation_note`

## Completion Checklist

- Required artifacts are evaluated for selected scope.
- Decision-memory checks are completed for high-risk scope.
- Claim-confidence rules are enforced for blocking policy usage.
- Gate outcome is traceable to deterministic artifact paths.
- TDD policy ownership remains outside this skill.
