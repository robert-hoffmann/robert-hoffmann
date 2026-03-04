# ADR Index

Canonical ADR source of truth: `docs/adr/`.

## Active ADRs (Accepted)

1. `ADR-0001` - Adopt decision-memory governance for high-risk changes (`docs/adr/0001-decision-memory-governance.md`)
2. `ADR-0002` - Require claim-verification tiers for governance policy rationale (`docs/adr/0002-claim-verification-policy.md`)

## Status Model

1. `proposed`
2. `accepted`
3. `deprecated`
4. `superseded`

## Operational Notes

1. Keep `docs/adr/registry.json` in sync using `.agents/skills/governance-evidence/scripts/build-adr-registry.sh`.
2. Update `docs/adr/claim-register.json` when introducing policy-level claims.
3. Store temporary waivers in `docs/adr/waivers.json`.
