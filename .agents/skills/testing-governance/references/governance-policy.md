# Governance Policy

This file defines cross-project testing governance defaults for TypeScript, Node.js, Vue, Vite, Nuxt, and Python repositories.

## 1) Policy Intent

1. Keep test feedback high-signal, deterministic, and auditable.
2. Standardize modern defaults while allowing bounded migration exceptions.
3. Require clear ownership for exceptions and flaky tests.

## 2) TDD Policy (Default)

Default rule for behavior-changing work:

1. Write or update a test that fails for the desired behavior.
2. Implement minimal code to pass.
3. Refactor safely with tests still green.

Allowed temporary exceptions:

- urgent production hotfix
- exploratory spike/prototype
- legacy rescue refactor where test harness is currently broken

Every exception requires a `TDD exception record` with:

- owner
- rationale
- creation date
- expiry date
- follow-up task/issue

### TDD Exception Record Template

```yaml
tdd_exception:
  owner: "@team-or-person"
  rationale: "Why TDD could not be applied for this change"
  created_at: "2026-02-14"
  expires_at: "2026-02-21"
  follow_up: "https://tracker.example.com/TST-123"
```

## 3) Progressive Baseline and Legacy Exceptions

Default rule:

- adopt modern baseline tools from `framework-baseline-2026-02.md`

Legacy exception contract:

1. name the retained legacy tool/pattern
2. document why it cannot be removed yet
3. list explicit migration target and checkpoint date
4. assign owner and SLA

Example:

```yaml
legacy_exception:
  retained: "Jest snapshot suite in package X"
  reason: "Blocked by custom Babel macro migration"
  target: "Vitest + explicit assertions"
  owner: "@frontend-platform"
  review_on: "2026-03-15"
```

## 4) Flaky Test Governance

Definition:

- a test that passes only on retry or shows nondeterministic failure under equivalent conditions

Policy:

1. Tag flaky tests (`@flaky` or equivalent) and move to quarantine lane.
2. Quarantine lane must be non-blocking but visible.
3. Each flaky test requires an owner and fix ETA.
4. Default SLA: fix or remove in 7 calendar days.
5. No net-new flaky tests merged without explicit exception record.

## 5) E2E Reliability Rules

1. Do not use arbitrary sleeps except when validating timeout behavior.
2. Prefer semantic selectors (role, label, accessible name).
3. Use stable `data-testid` only when semantic selectors are insufficient.
4. Use deterministic data setup and reset strategy for each run.
5. Keep retries low and treat retry usage as a quality signal.

## 6) Agent Safety Rules

All AI/agent test automation must enforce:

1. Command allowlist (test/lint/type/build commands only by default).
2. Filesystem allowlist (typically `src/**`, `tests/**`, config files under review).
3. Network allowlist (package registries and approved internal hosts only).
4. No production secrets in context or agent runtime.
5. Autonomous writes limited to PR branches; no direct protected-branch mutation.
6. Human review and approval required for merge.
7. Audit log capture of commands run and produced artifacts.

Reference:

- MCP security best practices (2025-06-18): https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices

## 7) Decision and Evidence Vocabulary

Standard terms used by this policy:

- merge gate
- confidence gate
- contract boundary
- flake quarantine
- exception SLA
- TDD exception record
