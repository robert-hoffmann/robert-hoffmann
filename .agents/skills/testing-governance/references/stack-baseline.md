# Stack Baseline

Last verified: **2026-03-04 (US)**

This baseline defines default testing stacks and acceptable alternatives. It is a governance default, not a frozen mandate.

## 1) Major/Minor Guidance

1. Prefer current stable major lines for each tool.
2. Prefer latest compatible minor/patch in active project constraints.
3. Re-check upstream release notes before major upgrades.
4. Keep migration exceptions explicit, owned, and time-bounded.

## 2) Default Matrix

| Area | Default | Alternative(s) | Pros | Cons |
|---|---|---|---|---|
| TS/Vite/Vue unit+component | Vitest + Vue Test Utils / Testing Library | Jest, Cypress component testing | Vite-native speed, modern TS ergonomics | Migration effort from legacy Jest stacks |
| Nuxt runtime tests | `@nuxt/test-utils` + separated Vitest projects | Playwright-only integration approach | Nuxt-aware runtime coverage | Requires fixture/project discipline |
| Web e2e | Playwright Test | Cypress, WebdriverIO | Cross-browser coverage, trace tooling, sharding | Heavier setup than smoke-only scripts |
| Node backend unit/integration | Vitest for TS-first services | `node:test` for lean JS services | Unified TS monorepo stack | Fewer built-in ergonomics in `node:test` |
| Python backend unit/integration | pytest + pytest-xdist | unittest (legacy), nose2 (legacy) | Mature fixtures/parametrize/plugins | Fixture hygiene required to avoid state leaks |
| Property-based tests | Hypothesis | custom fuzz scripts | High leverage for parser/transform domains | Strategy-design learning curve |
| API contract tests | OpenAPI + consumer contracts | OpenAPI-only | Earlier breakage detection than broad e2e | Contract lifecycle discipline required |
| Integration infra | Testcontainers | docker compose shared services | Hermetic and reproducible CI infra | Startup overhead for some suites |
| Network mocking (frontend) | MSW | ad hoc fetch/axios mocks | Boundary-faithful reusable handlers | Initial setup cost |

## 3) Governance Defaults

1. Prefer deterministic tests over broad mock-heavy suites.
2. Keep layers explicit: unit, integration, contract, e2e.
3. Keep e2e compact and high-value; push logic verification left.
4. Treat retries as flake diagnostics, not correctness proof.
5. Select runner commands repo-truth-first.

## 4) Coverage Baseline

1. Set per-layer thresholds and track trend deltas.
2. Do not use aggregate percentage alone as quality proof.
3. When using Node built-in coverage flags, document stability expectations in CI.

## 5) Sources

- Nuxt testing docs: https://nuxt.com/docs/4.x/getting-started/testing
- Vitest guide: https://vitest.dev/guide/
- Vitest migration: https://vitest.dev/guide/migration
- Vitest releases: https://github.com/vitest-dev/vitest/releases
- Playwright best practices: https://playwright.dev/docs/best-practices
- Playwright release notes: https://playwright.dev/docs/release-notes
- Node test runner: https://nodejs.org/api/test.html
- Node coverage docs: https://nodejs.org/en/learn/test-runner/collecting-code-coverage
- pytest docs: https://docs.pytest.org/en/stable/
- pytest package: https://pypi.org/project/pytest/
- pytest-xdist docs: https://pytest-xdist.readthedocs.io/en/stable/
- pytest-xdist package: https://pypi.org/project/pytest-xdist/
- Hypothesis docs: https://hypothesis.readthedocs.io/en/latest/
- Hypothesis package: https://pypi.org/project/hypothesis/
- MSW docs: https://mswjs.io/docs/
- Testcontainers Node docs: https://node.testcontainers.org/
- Testcontainers Python docs: https://testcontainers-python.readthedocs.io/en/latest/
- Testcontainers Python package: https://pypi.org/project/testcontainers/
- Pact docs: https://docs.pact.io/
