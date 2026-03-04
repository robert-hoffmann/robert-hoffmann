# Evidence Register (2026-03)

This register tracks internet-derived feedback claims used by `testing-governance` and classifies confidence.

Status labels:

- `verified`: supported by primary sources and/or reproducible official guidance
- `partial`: directionally supported, but source strength or generality is limited
- `unverified`: not confirmed in this pass; do not treat as normative policy

## Claim Register

1. Claim: redundant runtime tests for type guarantees add low value.
Status: `verified`
Sources:
- https://github.com/microsoft/typescript/wiki/faq#what-is-type-erasure
- https://testing-library.com/docs/guiding-principles/

2. Claim: behavior-over-implementation tests are more resilient under refactor.
Status: `verified`
Sources:
- https://testing-library.com/docs/guiding-principles/
- https://www.testdesiderata.com/

3. Claim: happy-path-heavy suites miss boundary failures seen in production.
Status: `partial`
Sources:
- https://www.mdpi.com/2306-5729/10/10/156
- https://arxiv.org/abs/2407.00225

4. Claim: use interface/public API verification instead of internals.
Status: `partial`
Sources:
- https://testing-library.com/docs/guiding-principles/
- https://www.testdesiderata.com/

5. Claim: LLMs often produce many tests but miss real bugs.
Status: `partial`
Sources:
- https://www.mdpi.com/2306-5729/10/10/156
- https://arxiv.org/abs/2407.00225
- https://www.microsoft.com/en-us/research/publication/rlsqm-a-large-scale-study-of-quality-in-llm-generated-unit-tests/

6. Claim: Ian Cooper guidance supports developer tests over internal-detail mock tests.
Status: `verified`
Sources:
- https://www.linkedin.com/posts/ian-cooper-8b19b9a_if-your-ai-agent-is-writing-your-unit-tests-activity-7301196014691436547-e4fM
- https://2024.allthingstesting.org/talks/tdd-where-did-it-all-go-wrong/

7. Claim: BrighterCommand-specific instruction set should be adopted directly.
Status: `unverified`
Sources:
- no canonical primary source confirmed in this pass

## Packaging Snapshot Inputs (Last Verified 2026-03-04)

These are reference snapshots, not policy mandates:

- pytest: https://pypi.org/project/pytest/
- pytest-xdist: https://pypi.org/project/pytest-xdist/
- hypothesis: https://pypi.org/project/hypothesis/
- testcontainers: https://pypi.org/project/testcontainers/
- Playwright releases: https://playwright.dev/docs/release-notes
- Vitest releases: https://github.com/vitest-dev/vitest/releases
- Nuxt testing docs (4.x): https://nuxt.com/docs/4.x/getting-started/testing
