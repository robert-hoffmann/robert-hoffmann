# Skill Governance Migration Plan (2026-03)

Status: `implemented`
Owner: `@platform-governance`
Scope: governance skill architecture rewrite (greenfield, no backward compatibility)

## 1) Summary

This migration introduces a four-skill governance model with strict domain independence and lean defaults:

1. `.agents/skills/governance-core`
2. `.agents/skills/governance-repository`
3. `.agents/skills/governance-testing`
4. `.agents/skills/governance-evidence`

Key decisions:

1. full rewrite (no compatibility layer)
2. renamed skills
3. shared primitives centralized in `governance-core`
4. lean by default, advanced as explicit opt-in
5. scripts re-homed first, behavior preserved in pass 1
6. pass 2 completed with stable in-skill wrapper entrypoints and in-skill regression tests

## 2) Architecture and Ownership

### Governance Core

Owns canonical:

1. exception metadata contract
2. gate vocabulary and status model
3. shared governance report contract
4. profile model (`lean`/`advanced`)

### Governance Repository

Owns:

1. repository hygiene baseline
2. GitHub controls and workflow hardening
3. release governance (`release-please`)

### Governance Testing

Owns:

1. testing strategy and runner detection
2. TDD execution model
3. TG001-TG005 signal policy
4. testing artifact contract

### Governance Evidence

Owns:

1. evidence lifecycle and taxonomy
2. risk-tiered evidence requirements
3. ADR/claim validation
4. deterministic gate decisioning (`pass`/`fail`/`blocked`)

## 3) Independence Rules

1. Domain skills may reference `governance-core` only.
2. Domain skills must not reference each other.
3. Exception templates are defined in one place only (`governance-core`).
4. Script ownership is local to each domain skill.

## 4) Public Interface Changes

1. `repository-governance` -> `governance-repository`
2. `testing-governance` -> `governance-testing`
3. `evidence-governance` -> `governance-evidence`
4. added `governance-core`

Script re-homing:

1. `check_test_signal.py` -> `governance-testing/scripts/`
2. `build_adr_registry.py` -> `governance-evidence/scripts/`
3. `check_adr_gate.py` -> `governance-evidence/scripts/`
4. `check_claim_register.py` -> `governance-evidence/scripts/`

Stable in-skill entrypoints (pass 2):

1. `.agents/skills/governance-evidence/scripts/build-adr-registry.sh`
2. `.agents/skills/governance-evidence/scripts/check-adr-gate.sh`
3. `.agents/skills/governance-evidence/scripts/check-claim-register.sh`
4. `.agents/skills/governance-testing/scripts/check-test-signal.sh`
5. `.agents/skills/governance-core/scripts/check-skill-integrity.sh`

## 5) Migration Tasks

1. create new skill directories and contracts
2. centralize shared primitives in governance-core
3. rewrite domain skills with strict ownership boundaries
4. re-home scripts (preserve CLI behavior)
5. update references in:
   - `AGENTS.md`
   - `.github/workflows/decision-governance.yml`
   - `docs/adr/*.md`
   - `docs/adr/registry.json`
6. delete old skill directories
7. add CI independence checks for cross-skill references and duplicated exception templates
8. add in-skill governance script regression tests under `.agents/skills/governance-core/tests/governance_scripts/`

## 6) Validation Matrix

1. independence audit: no domain-to-domain references
2. single-source exception templates: only in governance-core
3. workflow integrity: decision workflow resolves new script paths
4. script parity: same outcomes for ADR/claim/test signal checks
5. release integrity: `release-please` workflow remains intact

## 7) Assumptions

1. no backward compatibility required
2. no alias support for old names
3. lean profile is default
4. advanced controls are explicit opt-in

## 8) External Inputs (last reviewed 2026-03-04)

1. release-please action/docs
2. GitHub rulesets and Actions hardening docs
3. MCP security best practices
4. OpenAI/Anthropic governance and harness references
