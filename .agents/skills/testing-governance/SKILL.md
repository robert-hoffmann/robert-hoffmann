---
name: testing-governance
description: Enforce cross-stack modern testing governance for TypeScript, Node.js, Vue, Vite, Nuxt, and Python projects. Use when designing, reviewing, refactoring, or debugging test strategy, CI test gates, flaky test policy, TDD workflow, and agent-safe test automation.
---

# Testing Governance

## Overview

Use this skill to enforce a modern, cross-stack testing governance baseline with progressive migration rules.

This skill is policy-driven: it sets default tooling and quality gates, allows bounded exceptions, and requires clear evidence.

## When To Use

Use this skill for:

- designing or revising repository-level testing standards
- reviewing whether a project test stack is modern and fit for purpose
- migrating from legacy test runners or brittle E2E patterns
- defining merge gates and confidence gates in CI
- enforcing TDD-default behavior for feature changes
- establishing flaky test quarantine and remediation SLAs
- defining safe boundaries for AI/agent-assisted test automation

## Load References On Demand

- Read `references/framework-baseline-2026-02.md` for the dated tool baseline, supported alternatives, and pros/cons.
- Read `references/governance-policy.md` for TDD policy, exception handling, flaky test governance, and agent safety controls.
- Read `references/ci-gates-and-artifacts.md` for merge/confidence gate definitions, required artifacts, and CI implementation patterns.

## Core Workflow

1. Detect stack and runtime truth from repository files (`package.json`, lockfiles, CI workflows, `pyproject.toml`, existing test configs).
2. Propose at least two implementation paths for non-trivial testing decisions, each with concise pros/cons.
3. Choose the progressive modern baseline by default unless explicit constraints require an alternative.
4. Apply TDD-first for behavior-changing work:
   - write or adjust a failing test first
   - implement minimal code to pass
   - refactor while keeping tests green
5. Define the test portfolio by system boundary, not by naming convention:
   - unit
   - integration
   - contract
   - e2e
   - non-functional checks
6. Define CI gates and required evidence artifacts:
   - merge gate
   - confidence gate
7. Document every exception with owner, rationale, expiry date, and next modernization step.
8. Validate with available commands and report what was executed and what remains.

## Governance Rules

### Boundary-first Classification

- Classify tests by boundary and dependency realism, not folder naming alone.
- Keep unit tests isolated and deterministic.
- Use integration tests for real infra boundaries (DB, queue, filesystem, HTTP server).
- Use contract tests to lock consumer/provider compatibility.
- Keep E2E focused on critical user journeys and smoke coverage.

### Determinism and Flake Control

- Eliminate arbitrary sleeps in E2E unless explicitly testing timeout behavior.
- Prefer resilient selectors (`getByRole`, labels, stable test ids only when needed).
- Control time, randomness, network, and seed data.
- Treat retry-only passes as flaky signals.
- Quarantine flaky tests with explicit SLA and owner.

### Progressive Baseline and Alternatives

- Default to the modern baseline in `references/framework-baseline-2026-02.md`.
- Allow alternatives only with explicit tradeoff documentation.
- Allow temporary legacy retention only with bounded exception records.

### Agent Safety and Auditability

- Enforce least-privilege command, path, and network allowlists for agent runs.
- Keep production secrets out of agent context.
- Keep autonomous writes PR-branch-only, with human review and merge approval.
- Preserve command logs and evidence artifacts for auditability.

## Output Requirements

When generating guidance or reviewing testing posture, include:

1. Environment note: detected stack, runtime, and existing test tooling.
2. Chosen stack note: selected default baseline and why.
3. Alternative note: at least one viable alternative path.
4. Tradeoff note: concise pros/cons for chosen and rejected paths.
5. Exception note: bounded legacy or policy exceptions (if any).
6. Validation note: commands/checks run and outcomes.

## Completion Checklist

- Baseline test stack is selected and justified by runtime truth.
- TDD-default policy is applied for behavior changes.
- Test layers are defined by boundary with clear responsibilities.
- Merge gate and confidence gate are explicit.
- Artifact strategy includes JUnit, coverage, and E2E diagnostics.
- Flaky test quarantine policy and SLA are defined.
- Agent safety controls are explicit and auditable.
- Any legacy retention is documented with owner and expiry.
