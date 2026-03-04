# TDD Outcomes

## Purpose

This policy enforces measurable TDD outcomes without requiring commit-by-commit proof of red-green order.

## Enforceable Rules

1. Bugfixes must add or update a regression test that covers the reported defect path.
2. Features must map acceptance criteria to executable tests at the correct level (unit, integration, E2E).
3. Refactors must preserve behavior evidence (pre-existing test intent remains satisfied).
4. Structural refactors must also include ADR alignment evidence or a bounded ADR waiver.
5. Missing testability must be explicitly documented with a bounded TDD exception.

## Required Validation Record Fields

The run record must populate:

1. `tdd.regressionTestAdded` (`true`/`false`)
2. `tdd.acceptanceCriteriaCovered` (array of IDs such as `AC-1`, `AC-2`)
3. `decision.alignment` and `decision.adrRefs` for high-risk or structural changes

## Decision Rules by Change Type

| Change Type | TDD Outcome Requirement |
|---|---|
| `bugfix` | `regressionTestAdded` must be `true` unless an active TDD exception exists |
| `ui-feature` | acceptance criteria must map to component/E2E tests for changed flows |
| `api-feature` | acceptance criteria must map to integration/contract tests |
| `refactor` | unchanged behavior must be evidenced by stable pre-existing test intent plus targeted smoke; structural refactors require ADR alignment evidence |
| `migration` | migration safety checks and rollback checks must be represented in tests or deterministic scripts |

## Evidence Examples

1. Test diff summary (`tests changed`, `new tests`, `removed tests`).
2. Artifact paths to JUnit and coverage outputs.
3. Acceptance criteria map in decision log or PR evidence note.
4. ADR gate output for structural/high-risk paths.

## Anti-Patterns

1. Marking bugfix as complete with no regression test or TDD exception.
2. Listing acceptance criteria with no executable test mapping.
3. Treating manual QA notes as Lane B substitutes.
4. Using flaky tests as accepted evidence without bounded exception and follow-up.
5. Treating structural refactors as test-only changes without decision-memory review.
