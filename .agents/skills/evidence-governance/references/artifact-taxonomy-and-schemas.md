# Artifact Taxonomy and Schemas (Migration Extension)

## Status

This document is deprecated as the default taxonomy for this skill.

Use these canonical references for default governance:

1. `app-artifact-taxonomy.md`
2. `agent-validation-record.schema.json`
3. `tdd-outcomes.md`
4. `gate-governance-and-exceptions.md`

## Purpose

This file is retained only for migration programs that explicitly enable a parity profile.

Parity artifacts are non-blocking by default and become must-meet only when that profile is declared in project governance.

## Optional Migration Artifacts

### Parity Matrix (CSV)

Use to track source-to-target behavior parity when migrating from a legacy system.

Required columns:

1. `area`
2. `source_behavior`
3. `target_behavior`
4. `status` (`pass`, `fail`, `n/a`)
5. `evidence_path`

Validation notes:

1. `pass` rows require non-empty `evidence_path`.
2. `fail` rows require remediation or an approved parity exception.
3. `n/a` rows require explicit scope/defer rationale.

### Parity Report (JSON)

Use when data mirror integrity checks are needed during migration.

Example:

```json
{
  "runId": "2026-02-14T15:00:00Z-abc123",
  "sourceManifestHash": "sha256:...",
  "targetManifestHash": "sha256:...",
  "added": 0,
  "changed": 3,
  "deleted": 1,
  "status": "pass"
}
```

Validation notes:

1. `status: "pass"` generally expects matching source/target hashes.
2. Deletions require explicit intent logging.
3. Failing parity reports are blocking only for migration profiles that require parity checks.

## Agent-Ops Records

The following files remain required in `<evidence-root>/agent-ops/`:

1. `agent-validation-records.md`
2. `policy-exceptions.md`
3. `tooling-baseline.md`
