# Governance Commands

Stable governance entrypoints (Pass 2 baseline):

1. `.agents/skills/governance-evidence/scripts/build-adr-registry.sh`
2. `.agents/skills/governance-evidence/scripts/check-adr-gate.sh`
3. `.agents/skills/governance-evidence/scripts/check-claim-register.sh`
4. `.agents/skills/governance-testing/scripts/check-test-signal.sh`
5. `.agents/skills/governance-core/scripts/check-skill-integrity.sh`

These wrappers intentionally hide internal skill script locations so workflows and docs remain stable even if internal files move.

## Usage Examples

```bash
.agents/skills/governance-evidence/scripts/build-adr-registry.sh --strict --output docs/adr/registry.json
.agents/skills/governance-evidence/scripts/check-adr-gate.sh --gate merge --changed-files-file artifacts/decision-governance/changed-files.txt --output artifacts/decision-governance/adr-gate.json
.agents/skills/governance-evidence/scripts/check-claim-register.sh --claim-register docs/adr/claim-register.json --output artifacts/decision-governance/claim-gate.json
.agents/skills/governance-testing/scripts/check-test-signal.sh --path .agents/skills/governance-core/tests --language auto --strict
.agents/skills/governance-core/scripts/check-skill-integrity.sh
```
