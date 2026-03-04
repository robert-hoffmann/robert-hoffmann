# CI Evidence Contract

This file defines merge/confidence gates and required evidence artifacts.

## 1) Gate Model

Use two gates:

1. `merge gate` (PR blocking)
2. `confidence gate` (nightly or pre-release blocking)

## 2) Merge Gate (PR Blocking)

Required checks:

1. format/lint/typecheck
2. unit tests
3. selective integration tests for changed services/features
4. smoke e2e for critical journeys
5. strict test-signal checks for touched test files in the PR

Recommended runtime target:

- keep PR gate runtime near 10-15 minutes when feasible

## 3) Confidence Gate

Required checks:

1. full integration suite
2. full contract verification
3. full e2e regression (parallel/sharded as needed)
4. scheduled non-functional checks:
   - accessibility sampling
   - performance budgets
   - security/dependency scanning

## 4) Artifact Contract (Required)

Every blocking gate run should publish:

1. JUnit XML for all test runners used
2. coverage artifacts (lcov/xml/html as stack-appropriate)
3. Playwright HTML report and trace on first retry
4. flaky test ledger (`flake.json` or equivalent)
5. command log summary for reproducibility
6. TDD cycle log (`tdd-cycle-log.jsonl` or `tdd-cycle-log.md`) for behavior-changing work
7. strict test-signal report (`test-signal-gates.json`) when agentic TDD is used

Suggested stable paths:

```text
artifacts/
  junit/
  coverage/
  e2e-report/
  traces/
  flake.json
  tdd-cycle-log.jsonl
  test-signal-gates.json
  command-log.txt
```

## 5) Enforcement Model

1. strict rules `TG001`-`TG004` are immediate-fail from adoption
2. `TG005` remains warning-only
3. gate overrides require explicit owner, rationale, expiry, and follow-up

## 6) Polyglot Layer Mapping

Recommended naming semantics across stacks:

- `test:unit`
- `test:integration`
- `test:contract`
- `test:e2e`
- `test` (aggregate local merge-gate equivalent)

## 7) Minimal Decision Log

```yaml
testing_gate_decision:
  run_id: "2026-03-04T20:45:00Z-abc123"
  gate: "merge"
  status: "pass"
  exceptions: []
  artifacts:
    - "artifacts/junit/"
    - "artifacts/coverage/"
    - "artifacts/e2e-report/"
    - "artifacts/tdd-cycle-log.jsonl"
    - "artifacts/test-signal-gates.json"
  reviewer: "@team-or-person"
```
