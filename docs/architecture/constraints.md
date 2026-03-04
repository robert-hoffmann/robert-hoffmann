# Architecture Constraints

These constraints are non-negotiable defaults for governance and delivery.

## Governance

1. High-risk path changes require ADR alignment before merge, or an active bounded ADR waiver.
2. Blocking governance policy cannot rely on unverified claims.
3. Partial claims used in blocking governance require an explicit bounded exception.
4. All blocking decisions must be reproducible with deterministic scripts.

## Delivery

1. Lane B artifacts are required for blocking decisions.
2. `L2` and `L3` runs must include decision-memory fields in the validation record.
3. Exceptions must include owner, expiry date, and follow-up link.

## Release

1. Confidence and release gates require decision alignment status `aligned`.
2. Active ADR waivers are not allowed at confidence/release gate completion.
