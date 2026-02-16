# App Artifact Taxonomy

## Scope

This taxonomy defines default required artifacts for web applications and Python backend services.

Artifacts are selected by:

1. `evidenceLevel` (`L0` to `L3`)
2. `changeType` (`ui-feature`, `api-feature`, `bugfix`, `refactor`, `security`, `perf`, `a11y`, `migration`, `release`)

## Artifact Buckets

1. Correctness: unit, integration, contract, E2E, regression evidence.
2. Safety: lint, typecheck/static analysis, security scans, migration safety checks.
3. User impact: accessibility/performance outputs and impact notes.
4. Operability: release checklist, rollback plan, monitoring/alert references.

## Baseline by Evidence Level

| Evidence Level | Required Lane B Artifacts |
|---|---|
| `L0` | command log, lint or static analysis, build/syntax check (if applicable), validation record |
| `L1` | all `L0` plus unit/component tests with JUnit output, coverage report, targeted smoke (`api` or `E2E`) when touched |
| `L2` | all `L1` plus expanded integration, contract validation, full/expanded E2E for impacted paths, security scan outputs, rollback plan |
| `L3` | all `L2` plus release checklist, rollout strategy, monitoring links/queries, post-deploy verification evidence |

## Change Type Modifiers

| Change Type | Additional Must-Meet Artifacts |
|---|---|
| `ui-feature` | component test outputs, targeted E2E route coverage, accessibility report for changed views |
| `api-feature` | integration tests, API contract validation (OpenAPI/GraphQL/protobuf), backward-compat notes |
| `bugfix` | regression test proving defect path is covered, acceptance criteria mapping |
| `refactor` | unchanged behavior evidence (existing test stability + targeted smoke), architecture decision note when structural |
| `security` | security scanner output, remediation note, abuse-path or permission tests |
| `perf` | performance budget report, baseline comparison, temporary exception record if budget exceeded |
| `a11y` | accessibility checks for affected components/pages and manual notes if automation gaps remain |
| `migration` | migration rehearsal logs, rollback rehearsal evidence, optional parity extension if enabled |
| `release` | release checklist, rollback runbook, monitoring/alert references, confidence-gate completion evidence |

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

## Required Agent Validation Record

Every blocking run must produce a record conforming to `agent-validation-record.schema.json`.

Minimum linkage:

1. classification (`changeType`, `evidenceLevel`)
2. environment (`runtime`, `packageManager`, `os`)
3. produced artifacts (repo-root relative paths)
4. TDD outcome fields (`regressionTestAdded`, `acceptanceCriteriaCovered`)

## Optional Migration Extension

If the project declares a migration parity profile, additionally include:

1. parity matrix CSV
2. parity report JSON
3. parity exceptions where exclusions are approved
