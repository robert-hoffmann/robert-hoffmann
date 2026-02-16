# Gate Governance and Exceptions

## Phase-Gate Model

### Gate Types

Use a two-tier gate model adapted for autonomous agent operations in web applications and Python backend services.

| Gate | Trigger | Scope | Blocking |
|------|---------|-------|----------|
| **Merge gate** | PR submission | lint, typecheck, test, build, required smoke checks | Yes (PR-blocking) |
| **Confidence gate** | nightly / pre-release / release prep | expanded integration, contract, E2E, security, perf, rehearsal | Yes (release-blocking) |

### Phase Exit Rules

1. No phase exit is allowed if blocking checks are missing or replaced by Lane A-only validation.
2. A phase cannot exit with failing blocking checks.
3. Gate decisions must reference specific evidence artifacts by path.
4. Required artifacts are selected by `evidenceLevel × changeType` from `app-artifact-taxonomy.md`.
5. Release checklists are required for `L3` and release-scoped work.

### Gate Decision Process

1. **Inventory**: list required artifacts for the phase/run using `evidenceLevel × changeType`.
2. **Collect**: verify each artifact exists in the phase evidence folder with valid content.
3. **Validate**: confirm artifacts are fresh (produced in the current phase iteration).
4. **Classify**: confirm all blocking evidence is Lane B (deterministic), not Lane A (exploration).
5. **TDD verify**: verify regression and acceptance coverage requirements from `tdd-outcomes.md`.
6. **Convert**: verify any Lane A findings used for decisions have been converted to Lane B checks.
7. **Exception check**: review active exceptions for validity and expiry status.
8. **Decision**: declare pass, fail, or blocked with specific gap references.

### Must-Meet vs. Should-Meet Criteria

- **Must-meet**: mandatory for phase exit. Failure blocks the gate unconditionally.
- **Should-meet**: desirable but not blocking. Failure is recorded as informational and tracked for future improvement.

All required artifacts from the selected classification are must-meet. Informational diagnostics remain should-meet unless explicitly elevated in the project profile.

## Exception Templates

### TDD Exception

Use when TDD-first cannot be applied for a specific change.

```yaml
tdd_exception:
  owner: "@team-or-person"
  rationale: "Why TDD could not be applied for this change"
  scope: "service/module/component impacted"
  change_type: "bugfix"
  evidence_level: "L1"
  created_at: "2026-02-14"
  expires_at: "2026-02-21"
  follow_up: "https://tracker.example.com/TST-123"
```

Default expiry: 7 calendar days from creation.

### Governance Exception

Use when a baseline governance rule cannot be applied.

```yaml
governance_exception:
  owner: "@team-or-person"
  rationale: "Why the baseline rule cannot be applied now"
  scope: "service/module/component impacted"
  change_type: "api-feature"
  evidence_level: "L2"
  risk: "Operational or product risk introduced by this deviation"
  created_at: "2026-02-14"
  expires_at: "2026-03-01"
  follow_up: "https://tracker.example.com/GOV-101"
```

Default expiry: 14 calendar days from creation.

### E2E Exception

Use when required E2E coverage is temporarily blocked by infrastructure or tooling instability.

```yaml
e2e_exception:
  owner: "@team-or-person"
  scope: "checkout-flow route group"
  change_type: "ui-feature"
  evidence_level: "L1"
  rationale: "Preview environment instability blocks deterministic browser runs"
  risk: "UI path not fully covered by E2E in this run"
  created_at: "2026-02-14"
  expires_at: "2026-02-21"
  follow_up: "https://tracker.example.com/E2E-201"
```

Default expiry: 7 calendar days from creation.

### Perf Budget Exception

Use when a temporary performance regression is accepted with explicit mitigation and follow-up.

```yaml
perf_budget_exception:
  owner: "@team-or-person"
  scope: "/checkout route and API latency budget"
  change_type: "perf"
  evidence_level: "L2"
  rationale: "Known regression accepted temporarily to unblock security patch"
  risk: "Short-term p95 latency increase for checkout"
  created_at: "2026-02-14"
  expires_at: "2026-02-28"
  follow_up: "https://tracker.example.com/PERF-332"
```

Default expiry: 14 calendar days from creation.

### Freshness Exception

Use when stale evidence cannot be re-validated for a gate decision.

```yaml
freshness_exception:
  owner: "@team-or-person"
  scope: "phase-03 API confidence gate"
  artifact: "<evidence-root>/phase-03/contracts/openapi-validate.json"
  change_type: "api-feature"
  evidence_level: "L2"
  rationale: "Why re-validation is not possible at this time"
  risk: "Risk of relying on stale evidence"
  created_at: "2026-02-14"
  expires_at: "2026-02-21"
  follow_up: "https://tracker.example.com/FRS-301"
```

Default expiry: 7 calendar days from creation.

## Expiry and Review Policy

### Default Expiry Windows

| Exception Type | Default Expiry |
|---------------|---------------|
| TDD exception | 7 calendar days |
| Governance exception | 14 calendar days |
| E2E exception | 7 calendar days |
| Perf budget exception | 14 calendar days |
| Freshness exception | 7 calendar days |
| Flaky test fix/remove SLA | 7 calendar days |

### Expiry Rules

1. Expired exceptions are treated as blocking failures until renewed or resolved.
2. Renewal requires a new exception record with updated rationale and fresh expiry date.
3. Renewal is not automatic; each renewal must demonstrate progress toward resolution.
4. Maximum consecutive renewals: 3. After 3 renewals, escalation to project owner is mandatory.
5. Exceptions must not become silent permanent policy.
6. Expired exceptions force a `blocked` gate status until resolved or renewed.

### Exception Lifecycle

```
Created → Active → { Resolved | Expired }
                        ↓
                   { Renewed (max 3) | Escalated }
```

### Recording Location

All exception records are stored exclusively in `<evidence-root>/agent-ops/policy-exceptions.md`.

Exception records are never stored in:
- Phase evidence folders (those contain only evidence artifacts, not policy records).
- Source code comments or TODO items.
- PR descriptions or commit messages (these may reference exceptions but are not the record of truth).

## Drift Controls

### Definition

Evidence drift occurs when code or environment state diverges from captured artifacts, making evidence unreliable for current gate decisions.

### Detection

1. Compare evidence artifact timestamps against the most recent relevant commits.
2. Re-run deterministic gate commands and compare outputs to stored evidence.
3. Re-check classification-dependent must-meet artifacts for `changeType` and `evidenceLevel`.
4. Check validation record `runId` and `commitSha` against the evaluated revision.

### Response

1. Stale evidence that can be re-validated: re-run and update the artifact.
2. Stale evidence that cannot be re-validated: create a freshness exception.
3. Evidence contradicted by current state: flag as invalid, require new collection.
4. Drift detected during gate decision: gate is blocked until evidence is refreshed.

## Optional Migration Extension

Parity matrices and checksum parity reports are optional migration extensions. They are non-blocking by default and only become must-meet when the project explicitly enables a migration parity profile.

## Standards Note

See `governance-baseline-2026-02.md` for dated standards mapping and external references.
