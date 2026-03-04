# Policy and Signal

This file is the single policy source for testing governance defaults and strict test-signal enforcement.

## 1) Policy Intent

1. Keep test feedback high-signal, deterministic, and auditable.
2. Prioritize behavioral confidence over test count.
3. Keep exceptions explicit, bounded, and owned.

## 2) Default TDD Policy

For behavior-changing work, default to:

1. write or update a failing behavior test
2. implement the minimal code to pass
3. refactor with tests still green

Allowed temporary exceptions:

- urgent production hotfix
- exploratory spike/prototype
- legacy rescue refactor where harness is currently broken

Every exception requires a `TDD exception record` with:

- owner
- rationale
- created_at
- expires_at
- follow_up

## 3) Strict Test-Signal Rules

Use these rule ids in execution logs, CI reports, and review comments.

### Blocking violations

1. `TG001`: runtime tests that restate type-system guarantees.
2. `TG002`: interaction/mocking assertions without observable outcome assertions.
3. `TG003`: trivial getter/setter pass-through tests.
4. `TG004`: suite naming and test set signal repeated happy-path focus with no boundary/error representation.

### Non-blocking warning

1. `TG005`: probable interface-bypass/internal-detail verification pattern.

`TG005` is warning-only because static detection is heuristic and can produce false positives.

## 4) Allowed Testing Patterns

1. Assert externally observable outcomes.
2. Verify behavior via public interface/API contracts.
3. Cover boundary and error behavior before broad happy-path expansion.
4. Use mocks only at inaccessible boundaries, and pair them with outcome assertions.

## 5) Deterministic Gate Command

Use:

```bash
scripts/check_test_signal.py --path <test-file-or-dir> --language auto --strict
```

For CI artifacts:

```bash
scripts/check_test_signal.py --path <test-file-or-dir> --language auto --format json --strict
```

## 6) Exception Contract

Strict violations block progression unless an approved, time-bounded exception record exists.

Template:

```yaml
tdd_exception:
  owner: "@team-or-person"
  rationale: "Why strict policy is temporarily bypassed"
  created_at: "2026-03-04"
  expires_at: "2026-03-11"
  follow_up: "https://tracker.example.com/TST-123"
```

## 7) Flake Governance

1. Tag flaky tests (`@flaky` or equivalent) and move them to a visible non-blocking quarantine lane.
2. Each flaky test must have an owner and fix ETA.
3. Default SLA: fix or remove within 7 calendar days.
4. Do not merge net-new flaky tests without an explicit exception record.

## 8) Agent Safety Rules

All AI/agent testing runs should enforce:

1. command allowlist (test/lint/type/build by default)
2. filesystem allowlist scoped to touched areas
3. network allowlist for approved endpoints only
4. no production secrets in agent context
5. autonomous writes restricted to PR branches
6. human review required before merge
7. audit log capture for commands and artifacts

Reference:

- MCP security best practices (2025-06-18): https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices

## 9) Evidence Model

This policy uses a primary-plus-practitioner evidence model:

1. primary sources first for normative defaults (official docs, specs, papers)
2. practitioner feedback to refine heuristics and anti-pattern controls
3. unverified claims stay non-blocking rationale only

See `references/evidence-register-2026-03.md` for claim-by-claim status and links.
