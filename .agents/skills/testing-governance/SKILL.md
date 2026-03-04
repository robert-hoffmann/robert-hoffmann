---
name: testing-governance
description: Define, audit, and execute cross-stack testing strategy for TypeScript, Node.js, Vue, Vite, Nuxt, Python, Go, and mixed repositories. Use when setting testing governance, running agentic Red-Green-Refactor loops, selecting or validating test runner commands, enforcing behavior-first test quality gates, handling flaky tests, and producing CI test evidence artifacts.
---

# Testing Governance

## Overview

Use this skill as the single entry point for testing policy and execution.

Operating modes:

1. `governance mode`: standards, gates, artifacts, and exceptions
2. `execution mode`: semi-autonomous Red-Green-Refactor delivery

## Load References On Demand

- Read `references/policy-and-signal.md` for governance defaults, strict signal rules (`TG001`-`TG005`), and exception contracts.
- Read `references/execution-playbook.md` for runner detection, increment design, and the Red-Green-Refactor loop.
- Read `references/ci-evidence-contract.md` for merge/confidence gate requirements and artifacts.
- Read `references/stack-baseline.md` for current baseline stack guidance.
- Read `references/evidence-register-2026-03.md` for claim-level evidence status and links.

## Core Workflow

1. Detect stack and runtime truth from repository files (`package.json`, lockfiles, CI workflows, `pyproject.toml`, `go.mod`, existing test configs).
2. Choose operating mode:
   - use `governance mode` for policy design, audit, or CI gate work
   - use `execution mode` for behavior-changing feature delivery with TDD
3. For non-trivial decisions, propose at least two implementation paths with concise pros and cons, then select one.
4. Keep tests boundary-first and behavior-first.
5. Prefer deterministic test execution and deterministic artifact paths.
6. Document every exception with owner, rationale, created_at, expires_at, and follow_up.
7. Validate with available commands and report what was executed and what remains.

## Governance Mode

Use governance mode to design or audit:

1. test layer boundaries (`unit`, `integration`, `contract`, `e2e`)
2. merge/confidence gates and override policy
3. CI artifact contracts
4. flake quarantine and remediation SLA
5. agent safety controls

## Execution Mode (Agentic TDD)

Use execution mode to deliver behavior changes with semi-autonomous checkpoints.

1. Define scope and acceptance boundaries.
2. Decompose into small boundary-first increments.
3. Ask for increment-list approval before writing tests.
4. For each increment, run Red-Green-Refactor from `references/execution-playbook.md`.
5. Select test commands using repo-truth runner detection.
6. Enforce strict quality gates via `scripts/check_test_signal.py`.
7. Block progression on strict violations unless an explicit time-bounded exception record is provided.
8. Continue automatically after successful Green and Refactor; pause only at required checkpoints or anomalies.

## Mandatory Rule Semantics

- `TG001`-`TG004`: strict and blocking.
- `TG005`: warning-only (heuristic review signal).
- Scope strict checks to touched tests in PR workflows.

## Output Requirements

When producing guidance or execution updates, include:

1. `environment note`: detected stack, runner, relevant configs
2. `decision note`: selected approach plus at least one alternative with pros and cons
3. `execution note`: current increment or policy scope
4. `quality gate note`: `TG001`-`TG005` violations/warnings from `check_test_signal.py` when applicable
5. `exception note`: bounded policy exceptions (if any)
6. `validation note`: commands run and outcomes

## Completion Checklist

- Selected mode and scope are explicit.
- Test boundaries are explicit and behavior-focused.
- Runner choice follows repo-truth-first detection.
- TDD loop checkpoints follow semi-autonomous cadence.
- `TG001`-`TG004` violations are resolved or formally excepted.
- Gate artifacts are mapped to stable paths.
- Exceptions include owner, rationale, and expiry.
