---
name: governance-testing
description: Define and execute testing governance with behavior-first TDD, strict TG001-TG005 signal controls, and deterministic test artifacts.
---

# Governance Testing

## Overview

Use this skill as the single owner for testing policy and TDD execution flow.

This skill owns test strategy, test-signal quality controls, and test artifact expectations.
Shared primitives (exceptions, gate vocabulary, profiles, report sections) are owned by `governance-core`.

## Operating Modes

1. `governance mode`: define or audit test policy and test gate contracts
2. `execution mode`: run semi-autonomous Red-Green-Refactor increments

## Load References On Demand

- Read `references/testing-policy-and-signals.md` for TG001-TG005 and TDD policy.
- Read `references/execution-playbook.md` for increment design and Red-Green-Refactor loop.
- Read `references/ci-artifact-contract.md` for required test artifacts.
- Read `references/stack-baseline-2026-03.md` for lean testing stack defaults.
- Read `../governance-core/references/profile-model.md` for profile selection.
- Read `../governance-core/references/gate-and-report-contract.md` for canonical gate/report semantics.
- Read `../governance-core/references/exception-contract.md` for canonical exception metadata.

## Core Workflow

1. Detect stack and test runner from repository truth.
2. Select profile (`lean` by default).
3. Propose at least two implementation paths for non-trivial testing decisions with concise pros/cons.
4. Choose one path and run governance or execution mode.
5. Enforce TG001-TG004 as blocking and TG005 as warning-only.
6. Use canonical exception metadata only when strict controls are temporarily bypassed.
7. Validate with deterministic commands and publish governance report sections.

## Rules

- Testing/TDD policy is defined here.
- Runtime tests must remain behavior-first and boundary-aware.
- Deterministic test artifact paths are required for blocking gates.
- Exception schemas must be referenced from governance-core, not duplicated here.

## Output Requirements

When producing testing governance output, include:

1. `environment_note`
2. `scope_note`
3. `decision_note` (chosen path plus one alternative with pros/cons)
4. `gate_note`
5. `quality_gate_note` (TG001-TG005 status)
6. `exception_note`
7. `validation_note`

## Completion Checklist

- Operating mode is explicit.
- TG001-TG004 violations are resolved or formally excepted.
- TG005 warnings are reviewed and tracked when relevant.
- Deterministic test artifacts are mapped to stable paths.
- TDD ownership remains in this skill.
