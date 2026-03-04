# Execution Playbook (Agentic TDD)

Use this playbook for behavior-changing work delivered with semi-autonomous Red-Green-Refactor.

## 1) Intake and Scope

1. Capture feature objective in one sentence.
2. Capture acceptance boundaries:
   - expected outcomes
   - boundary and error conditions
   - explicit non-goals
3. Detect and record active test command via repo truth.

## 2) Runner Detection (Repo-Truth-First)

Resolution order:

1. project task scripts
2. CI/test config commands
3. language defaults
4. user confirmation only if still ambiguous

Examples:

- Node/TS: `npm run test`, `pnpm test`, `yarn test`, `npm run test:unit`
- Python: `make test`, `tox`, `nox`, `poetry run pytest`, `uv run -m pytest`
- Go: `make test` or `go test` wrappers

Fallback defaults only when no repo command exists:

- TS/JS: `npx vitest run`
- Python: `python -m pytest -xvs`
- Go: `go test -v ./...`

## 3) Increment Design

Design increments as behavior contracts, not coverage padding.

Default order:

1. degenerate behavior (`empty`, `zero`, `none`, no-op)
2. boundary/error behavior (invalid input, missing data, limits, failures)
3. minimal happy path
4. additional valid variants
5. integration composition

Reject these anti-patterns:

- many happy-path increments with no boundary/error increments
- increments that restate type-system guarantees
- increments validating internal call order without observable behavior
- giant increments mixing unrelated behaviors

Acceptance rule:

1. each major behavior group has at least one boundary/error increment
2. increment names are externally observable behavior-oriented
3. each increment maps to one failing test before implementation

## 4) Red-Green-Refactor Loop

### RED

1. Add one failing behavior test for the current increment.
2. Run the narrowest command for the new test.
3. Confirm failure for the intended reason.
4. Run strict test-signal gate for the touched test file:
   - `scripts/check_test_signal.py --path <test-file> --language auto --strict`

### GREEN

1. Implement minimal production code to satisfy RED.
2. Re-run narrowed test command.
3. Re-run full-scope project tests.
4. Stop and resolve unrelated failures before continuing.

### REFACTOR

1. Refactor only for clear readability/duplication/naming gains.
2. Keep behavior unchanged.
3. Re-run full-scope project tests.
4. Revert or fix immediately if behavior regresses.

## 5) Required Checkpoints

Pause only at:

1. increment-list approval before cycle start
2. RED confirmation for each increment
3. anomalies:
   - RED passes unexpectedly
   - unrelated suite failures at GREEN
   - refactor breakage
   - strict gate violations without approved exception record

Continue automatically when GREEN and REFACTOR succeed.

## 6) Increment Closure

For each increment record:

1. test added or updated
2. minimal code added or updated
3. refactor changes (or explicit `none`)
4. final pass/fail state

Final wrap-up:

1. list completed increments and linked tests
2. report full-suite result
3. list deferred edge cases, integration risks, and docs follow-ups
