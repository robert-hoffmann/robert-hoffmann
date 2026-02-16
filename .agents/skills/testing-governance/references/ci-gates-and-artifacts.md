# CI Gates and Artifacts

This file defines the governance baseline for CI test gates and required evidence artifacts.

## 1) Gate Model

Use two gates:

1. `merge gate` (PR blocking)
2. `confidence gate` (nightly/pre-release blocking)

## 2) Merge Gate (PR Blocking)

Required checks:

1. format/lint/typecheck
2. unit tests
3. selective integration tests (changed services/features)
4. smoke E2E (critical journeys only)

Recommended targets:

- total PR gate runtime ideally <= 10-15 minutes
- deterministic setup and teardown for all gating suites

## 3) Confidence Gate (Nightly or Pre-release)

Required checks:

1. full integration suite
2. full contract verification
3. full E2E regression (parallelized/sharded as needed)
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

## 5) Suggested Artifact Paths

Use stable paths to simplify automation:

```text
artifacts/
  junit/
  coverage/
  e2e-report/
  traces/
  flake.json
  command-log.txt
```

## 6) Polyglot Baseline Mapping

Recommended script naming across repos:

- `test:unit`
- `test:integration`
- `test:contract`
- `test:e2e`
- `test` (aggregate merge gate local equivalent)

Python repos may map equivalently through make targets or task runners while keeping these semantics explicit.

## 7) Failure Handling

1. Merge gate failure blocks merge.
2. Confidence gate failure blocks release.
3. Quarantined flaky tests are non-blocking but must be visible and time-bound.
4. Any gate override requires explicit owner, rationale, expiry, and follow-up task.

## 8) Minimal Decision Log Template

```yaml
testing_gate_decision:
  run_id: "2026-02-14T20:45:00Z-abc123"
  gate: "merge"
  status: "pass"
  exceptions: []
  artifacts:
    - "artifacts/junit/"
    - "artifacts/coverage/"
    - "artifacts/e2e-report/"
  reviewer: "@team-or-person"
```
