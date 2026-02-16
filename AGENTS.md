# AGENTS.md

## Global Skill Invocation Policy

For coding tasks (create, edit, review, refactor, or debug), agents should:

1. Always apply `.agents/skills/code-quality` first.
2. Apply any additional relevant skill(s) for the task domain.

Common mappings:

- TypeScript            : `.agents/skills/ts-modern`
- Vue                   : `.agents/skills/vuejs-modern`
- Nuxt                  : `.agents/skills/nuxt-modern`
- CSS                   : `.agents/skills/css-modern`
- Tailwind              : `.agents/skills/tailwind-modern`
- Python                : `.agents/skills/python-modern`
- Testing               : `.agents/skills/testing-governance`
- Repository Governance : `.agents/skills/repository-governance`
- Evidence Governance   : `.agents/skills/evidence-governance`

Conflict handling:

1. Prioritize syntax/runtime/toolchain correctness from the domain-specific skill.
2. Apply `.agents/skills/code-quality` standards where non-conflicting.
