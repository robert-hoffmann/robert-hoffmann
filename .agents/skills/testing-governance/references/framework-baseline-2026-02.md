# Framework Baseline Snapshot (2026-02-14)

This snapshot records the default testing stack and acceptable alternatives as of **February 14, 2026 (US)**.

Use this as a governance baseline, not a frozen mandate. Re-check upstream docs when adopting new major versions.

## Default Stack Matrix

| Area | Default | Alternative(s) | Pros | Cons |
|---|---|---|---|---|
| TS/Vite/Vue unit+component | Vitest + Vue Test Utils / Testing Library | Jest, Cypress Component Testing | Vite-native speed, modern TS ergonomics, browser mode option | Migration work from Jest in older repos |
| Nuxt runtime tests | `@nuxt/test-utils` + separated Vitest projects | Integration-heavy Playwright-only approach | Nuxt-aware runtime coverage (plugins, middleware, server routes) | Requires fixture/project discipline |
| Web E2E | Playwright Test | Cypress, WebdriverIO | Cross-browser projects, trace tooling, retries/sharding | Heavier setup than simple smoke scripts |
| Node backend unit/integration | Vitest for TS-first services | `node:test` for lean JS services | Unified stack for TS monorepos | `node:test` gives less built-in ergonomics |
| Python backend unit/integration | pytest + pytest-xdist | unittest (legacy), nose2 (legacy) | Mature fixtures/parametrize/plugins, strong parallelism | Requires fixture hygiene to avoid state leaks |
| Property-based tests | Hypothesis | Custom fuzz scripts | High leverage for parsers/transforms/contracts | Learning curve for strategy design |
| API contract tests | OpenAPI + consumer contracts | OpenAPI-only | Catches breaking changes earlier than broad E2E | Requires contract lifecycle discipline |
| Integration infra | Testcontainers | docker compose-managed shared services | Hermetic, reproducible infra in CI | Startup overhead for some suites |
| Network mocking (frontend) | MSW | ad hoc fetch/axios mocks | Boundary-faithful tests, reusable handlers | Initial setup cost |

## Governance Defaults

1. Prefer deterministic tests over broad mock-heavy suites.
2. Use boundary-appropriate layers: unit, integration, contract, e2e.
3. Keep E2E compact and high-value; push logic verification left.
4. Treat retries as flake diagnostics, not a correctness substitute.

## Coverage Policy Baseline

1. Set per-layer thresholds (unit/integration) and track trend deltas.
2. Do not use aggregate percentages alone as quality proof.
3. For Node built-in runner coverage, note current reliance on `--experimental-test-coverage`.

## Version Notes (observed 2026-02-14)

- Nuxt testing docs reflect Nuxt `v4.3.1`.
- Vitest docs reflect Vitest `v4.0.17`.
- Playwright release notes list `Version 1.58` as latest at snapshot time.
- PyPI snapshots:
  - pytest `8.4.2`
  - pytest-xdist `3.8.0`
  - hypothesis `6.142.4`
  - testcontainers (Python) `4.13.0`

## Sources

- Nuxt testing docs: https://nuxt.com/docs/4.x/getting-started/testing
- Nuxt docs header/version context: https://nuxt.com/docs/4.x/getting-started/testing
- Vitest guide: https://vitest.dev/guide/
- Vitest browser mode: https://vitest.dev/guide/browser/
- Vitest migration: https://vitest.dev/guide/migration
- Playwright best practices: https://playwright.dev/docs/best-practices
- Playwright sharding: https://playwright.dev/docs/test-sharding
- Playwright retries: https://playwright.dev/docs/test-retries
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
- MSW Node integration: https://mswjs.io/docs/integrations/node
- Testcontainers Node docs: https://node.testcontainers.org/
- Testcontainers Python docs: https://testcontainers-python.readthedocs.io/en/latest/
- Testcontainers Python package: https://pypi.org/project/testcontainers/
- Pact docs: https://docs.pact.io/
