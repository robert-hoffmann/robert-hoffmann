# GitHub Implementation Playbook

Use this file when translating repository governance policy into concrete GitHub configuration.

## 1) Rulesets-First Governance

Prefer repository or organization rulesets over ad-hoc branch settings.

Apply rulesets across:

- branch protection behavior
- tag protections for release tags
- push restrictions for sensitive branches and patterns

Reference:

- Rulesets overview: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
- Available rules: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets

## 2) GitHub Actions Hardening

Baseline:

- set minimal `permissions` at workflow or job level
- avoid implicit broad token scopes
- pin actions to full commit SHA for high-assurance repositories
- avoid unsafe event patterns unless explicitly required and reviewed

Reference:

- Actions hardening: https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions

Token control:

- default to `GITHUB_TOKEN` with least privilege
- use PAT or GitHub App token only for explicit required capabilities (for example cross-repo writes or event chaining needs)

## 3) Dependency Governance

Baseline:

- enable Dependabot version updates for active ecosystems
- enable or enforce dependency review in PR workflows
- document dependency update and exception policy

Reference:

- Dependabot docs: https://docs.github.com/en/code-security/dependabot

## 4) Optional Provenance and Attestations

For release-critical artifacts, add provenance posture explicitly.

Recommended:

- artifact attestations for release artifacts
- signed release provenance where supported by policy

Reference:

- Artifact attestations: https://docs.github.com/en/actions/security-guides/use-artifact-attestations

## 5) Contribution Governance Artifacts

Recommended repository policy artifacts:

- `.github/CODEOWNERS`
- `.github/pull_request_template.md`
- issue templates under `.github/ISSUE_TEMPLATE/`

Naming conventions:

- branches: `feat/*`, `fix/*`, `chore/*`, `docs/*`
- commits: Conventional Commits format required — see the Commit Message Governance section in the main skill
- PR titles: Conventional Commits format required when squash-merge is the default strategy, since the PR title becomes the merge commit message that release-please parses

## 6) Extension Points For Other Providers

Keep these portable when supporting additional providers:

- policy intent (merge gates, permissions model, exception handling)
- evidence requirements (artifacts and audit trail)
- release requirements (versioning, changelog discipline)

Replace GitHub-specific mechanics with provider-native equivalents only in provider appendices.
