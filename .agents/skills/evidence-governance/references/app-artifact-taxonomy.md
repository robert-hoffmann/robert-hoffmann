# App Artifact Taxonomy

## Scope

This taxonomy defines default required artifacts for web applications and Python backend services.

Artifacts are selected by:

1. `evidenceLevel` (`L0` to `L3`)
2. `changeType` (`ui-feature`, `api-feature`, `bugfix`, `refactor`, `security`, `perf`, `a11y`, `migration`, `release`)
3. high-risk path impact from `high-risk-paths.yaml`

## Artifact Buckets

1. Correctness: unit, integration, contract, E2E, regression evidence.
2. Safety: lint, typecheck/static analysis, security scans, migration safety checks.
3. User impact: accessibility/performance outputs and impact notes.
4. Operability: release checklist, rollback plan, monitoring/alert references.
5. Decision memory: ADR references, ADR registry linkage, alignment status.
6. Claim quality: claim-register status and policy-use confidence.

## Baseline by Evidence Level

| Evidence Level | Required Lane B Artifacts |
|---|---|
| `L0` | command log, lint or static analysis, build/syntax check (if applicable), validation record |
| `L1` | all `L0` plus unit/component tests with JUnit output, coverage report, targeted smoke (`api` or `E2E`) when touched |
| `L2` | all `L1` plus expanded integration, contract validation, full/expanded E2E for impacted paths, security scan outputs, rollback plan, decision object with ADR refs |
| `L3` | all `L2` plus release checklist, rollout strategy, monitoring links/queries, post-deploy verification evidence |

## Change Type Modifiers

| Change Type | Additional Must-Meet Artifacts |
|---|---|
| `ui-feature` | component test outputs, targeted E2E route coverage, accessibility report for changed views |
| `api-feature` | integration tests, API contract validation (OpenAPI/GraphQL/protobuf), backward-compat notes |
| `bugfix` | regression test proving defect path is covered, acceptance criteria mapping |
| `refactor` | unchanged behavior evidence (existing test stability + targeted smoke), architecture decision note when structural |
| `security` | security scanner output, remediation note, abuse-path or permission tests, ADR linkage for policy-level changes |
| `perf` | performance budget report, baseline comparison, temporary exception record if budget exceeded |
| `a11y` | accessibility checks for affected components/pages and manual notes if automation gaps remain |
| `migration` | migration rehearsal logs, rollback rehearsal evidence, optional parity extension if enabled |
| `release` | release checklist, rollback runbook, monitoring/alert references, confidence-gate completion evidence |

## High-Risk Path Modifier (Immediate Blocking)

If any touched path matches `high-risk-paths.yaml`, add these must-meet artifacts:

1. ADR update or new ADR file in `docs/adr/`.
2. ADR presence in `docs/adr/registry.json`.
3. Validation record `decision` object with:
   - `impact`: `none|local|structural|systemic`
   - `alignment`: `aligned|requires-adr|conflict`
   - non-empty `adrRefs` when aligned
   - `waiverRef` when not aligned but waived
   - `constraintsRef`
4. Claim register validation output when governance assertions depend on internet-derived claims.

## Polyglot Producer Examples

| Artifact Type | Node/Web Example Producers | Python Service Example Producers |
|---|---|---|
| Lint/static checks | `eslint`, `stylelint` | `ruff`, `flake8` |
| Type checks | `tsc --noEmit`, `vue-tsc` | `mypy`, `pyright` |
| Unit/integration tests | `vitest`, `jest` | `pytest` |
| E2E checks | `playwright`, `cypress` | API/system smoke via `pytest` + HTTP client |
| Contract validation | OpenAPI/GraphQL validators | OpenAPI schema checks, pydantic contract tests |
| Coverage | `lcov`, `istanbul` output | `coverage.py` XML/HTML |
| Security scan | `npm audit`, `osv-scanner` | `pip-audit`, `safety`, `bandit` |
| Decision registry | `build_adr_registry.py` | `build_adr_registry.py` |
| ADR gate | `check_adr_gate.py` | `check_adr_gate.py` |
| Claim gate | `check_claim_register.py` | `check_claim_register.py` |

## Required Agent Validation Record

Every blocking run must produce a record conforming to `agent-validation-record.schema.json`.

Minimum linkage:

1. classification (`changeType`, `evidenceLevel`, `highRiskChange`)
2. environment (`runtime`, `packageManager`, `os`)
3. produced artifacts (repo-root relative paths)
4. TDD outcome fields (`regressionTestAdded`, `acceptanceCriteriaCovered`)
5. decision-memory fields (`impact`, `alignment`, `adrRefs`, `constraintsRef`, optional `waiverRef`)

## Optional Migration Extension

If the project declares a migration parity profile, additionally include:

1. parity matrix CSV
2. parity report JSON
3. parity exceptions where exclusions are approved
