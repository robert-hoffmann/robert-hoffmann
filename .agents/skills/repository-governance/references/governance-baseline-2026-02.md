# Governance Baseline 2026-02

This baseline is date-stamped to `2026-02-14`.

Use it as the default policy floor for repository governance across TypeScript, Node.js, Vue, Vite, Nuxt, and Python projects.

## 1) Stack Baseline Matrix

| Area | Baseline Default | Notes |
|---|---|---|
| Node runtime | Node 20 LTS or newer policy target | Keep org policy explicit if pinned to another active LTS |
| Python runtime | Python 3.11+ | Keep `requires-python` explicit in `pyproject.toml` |
| TypeScript | strict mode, modern module strategy | Keep runtime-faithful module settings |
| Vue/Nuxt/Vite | Vue 3 / Nuxt 3+ or active supported major | Use current framework toolchain defaults |
| Python tooling | `uv`, `ruff`, `pytest`, plus one type checker | Keep one clear type checker policy (`pyright` or `mypy`) |
| Node tooling | one package manager, one formatter, one lint entrypoint | Keep lockfile authoritative |
| Testing | unit + integration minimum; E2E by risk profile | Prefer deterministic tests and clear ownership |

## 2) Required Repository Artifacts

Minimum governance artifacts:

- `.editorconfig`
- `.gitignore`
- `.gitattributes`
- `README.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `LICENSE`
- `.env.example`
- CI workflow(s) under `.github/workflows/`
- lockfiles for active ecosystems (`pnpm-lock.yaml`, `uv.lock`, or equivalent)

Recommended governance artifacts:

- `CODEOWNERS`
- PR template
- issue templates
- architecture notes in `docs/`
- release workflow and release configuration

## 3) CI Minimum Gates

Required merge gates:

1. Lint
2. Typecheck
3. Unit tests
4. Build verification for shippable artifacts

Required policy properties:

- least-privilege workflow permissions
- deterministic install strategy
- parity between local command contracts and CI jobs
- visible failure artifacts for test/build troubleshooting

Recommended security gates:

- dependency review for PRs
- scheduled dependency health checks
- secret scanning and vulnerability surfacing

## 4) Lockfile and Reproducibility Rules

Rules:

- Commit lockfiles for all active package ecosystems.
- Do not bypass frozen lockfile behavior in CI except as a documented short-lived exception.
- Regenerate lockfiles only through approved package-manager commands.
- Keep build inputs explicit and deterministic.

Exception handling:

- Any temporary bypass requires owner, rationale, expiry date, and follow-up issue.

## 5) Provider Extensibility

Default implementation target is GitHub.

Extension model:

- Keep governance intent provider-agnostic.
- Keep operational examples GitHub-first.
- Add provider-specific appendices only when there is an active migration or multi-provider requirement.
