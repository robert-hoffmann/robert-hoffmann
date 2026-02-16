# Release Please Playbook

Use this file when defining release governance for repositories that publish versioned artifacts.

## 1) Why `release-please` Is The Default

`release-please` is the default because it provides:

- automated release PR generation from commit history
- changelog management aligned to Conventional Commits
- monorepo support via manifest mode
- explicit configuration through `release-please-config.json`

Primary references:

- Project: https://github.com/googleapis/release-please
- Action: https://github.com/googleapis/release-please-action
- Manifest releaser docs: https://github.com/googleapis/release-please/blob/main/docs/manifest-releaser.md
- Config schema: https://github.com/googleapis/release-please/blob/main/schemas/config.json

## 2) Workflow Contract (GitHub Actions)

Minimum workflow expectations:

- trigger on pushes to release branch (typically `main`)
- minimal permissions, including `contents: write` and `pull-requests: write` for release PR management
- explicit token strategy when defaults are insufficient

Example skeleton:

```yaml
name: release-please

on:
  push:
    branches: [main]

permissions:
  contents: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          config-file: release-please-config.json
          manifest-file: .release-please-manifest.json
```

## 3) `release-please-config.json` Patterns

### Single-package pattern

```json
{
  "$schema": "https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json",
  "release-type": "node",
  "include-v-in-tag": true,
  "bump-minor-pre-major": true
}
```

### Monorepo manifest pattern

```json
{
  "$schema": "https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json",
  "packages": {
    ".": {
      "release-type": "node"
    },
    "services/worker": {
      "release-type": "python"
    }
  }
}
```

## 4) `.release-please-manifest.json` Usage

Use manifest mode whenever multiple independently versioned packages are managed from one repository.

Example:

```json
{
  ".": "1.4.2",
  "services/worker": "0.8.1"
}
```

Rules:

- treat manifest file as source of version truth for managed packages
- update only through release automation flow unless exception is documented

## 5) Token Caveat

Default `GITHUB_TOKEN` is often sufficient for release PR creation.

If downstream workflows must be triggered by release commits or release PR events, use an approved PAT or GitHub App token strategy as required by your repository and organization policy.

Document which token path is used and why.

## 6) Commit Semantics Requirement

Release-please derives version bumps and changelog entries entirely from commit messages.
Commits that do not follow Conventional Commits format are invisible to release-please and will not trigger releases or appear in changelogs.

### How release-please maps commits to versions

| Commit prefix | Release-please action |
|---|---|
| `feat:` or `feat(scope):` | Opens or updates release PR with **minor** bump |
| `fix:` or `fix(scope):` | Opens or updates release PR with **patch** bump |
| `feat!:` or any type with `!` | Opens or updates release PR with **major** bump |
| `BREAKING CHANGE:` in footer | Opens or updates release PR with **major** bump |
| `docs:`, `chore:`, `ci:`, `style:`, `refactor:`, `test:`, `build:`, `perf:` | Grouped into the next release but do not independently trigger a version bump |
| Non-conventional message | **Ignored entirely** — no release PR, no changelog entry |

### Common pitfalls

- Commits like `update stuff` or `wip` are invisible to release-please.
- If all commits since the last release use non-conventional messages, release-please will not open a release PR.
- Squash-merge PRs inherit the PR title as the commit message — PR titles must also follow Conventional Commit format.

### Minimum commit quality for release-please

- Use imperative mood in the description: `add`, `fix`, `remove`, not `added`, `fixing`, `removes`.
- Keep the first line under 72 characters.
- Use the body for context when the description alone is insufficient.
- Reference issue numbers in the footer: `Closes #42`.

Reference:

- Conventional Commits 1.0.0: https://www.conventionalcommits.org/en/v1.0.0/
- release-please commit parsing: https://github.com/googleapis/release-please/blob/main/docs/customizing.md

## 7) Alternative Paths (Non-default)

### Alternative A: `semantic-release`

Pros:

- mature plugin ecosystem
- strong automation for npm-centric flows

Cons:

- often higher configuration complexity
- less straightforward cross-ecosystem governance for mixed stacks

### Alternative B: Manual changelog + manual tagging

Pros:

- maximum manual control
- no automation dependency

Cons:

- high human overhead
- inconsistent release notes risk
- weak scaling for multi-package repositories

Label all alternatives as non-default and require explicit tradeoff documentation before adoption.
