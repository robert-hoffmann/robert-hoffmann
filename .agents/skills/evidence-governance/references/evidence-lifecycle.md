# Evidence Lifecycle

## Folder Conventions

### Evidence Root

Each project defines a single evidence root directory (for example `docs/evidence/` or `evidence/`). All evidence artifacts reside under this root.

### Phase-Scoped Evidence

Store all evidence artifacts in phase-scoped folders under the evidence root:

```
<evidence-root>/
├── phase-01/          # First phase scope
├── phase-02/          # Second phase scope
├── phase-NN/          # Additional phases as needed
└── agent-ops/         # Cross-cutting agent operations
```

Create one folder per phase defined in the project's phase specifications. The `agent-ops/` folder is always present for cross-cutting agent governance records.

### Phase Folder Contents

Each phase folder stores:

1. **Command logs** — reproducible shell transcripts of gate runs.
2. **Test reports** — JUnit XML, coverage reports, E2E HTML reports.
3. **Build and contract outputs** — build logs, schema checks, contract validation reports.
4. **Decision logs** — numbered entries with rationale and cross-references.
5. **Release checklists** — signed-off exit criteria for release gates when applicable.

### Agent Operations Folder

`<evidence-root>/agent-ops/` contains cross-cutting records:

1. `agent-validation-records.md` — chronological agent validation records.
2. `policy-exceptions.md` — all active and resolved exception records.
3. `tooling-baseline.md` — current gate tooling baseline and change history.

## Collection Model (SOC 2-Aligned)

### Centralized Collection

- All evidence artifacts reside in a single evidence tree, not scattered across the repository.
- Evidence paths are absolute from repository root for unambiguous cross-referencing.
- Duplicate evidence across folders is prohibited; use path references instead.

### Ownership and Accountability

- Every evidence artifact must be traceable to a specific phase exit criterion or acceptance gate.
- The producing agent or contributor is recorded in the agent validation record.
- Evidence without a traceable gate reference is flagged as orphaned during audits.

### Freshness Policy

- Evidence artifacts must reflect the current state of the codebase at gate decision time.
- Artifacts older than the current phase iteration require explicit re-validation.
- Re-validation means re-running the producing command and comparing outputs, not simply reviewing old artifacts.
- Stale artifacts that cannot be re-validated require a freshness exception record.

### Retention Policy

- Retain all evidence artifacts for the full program duration.
- Archive evidence only after program completion (all phases exited and closed).
- Do not delete evidence artifacts during active phases, even if superseded by newer runs.
- Superseded artifacts should be clearly marked (e.g., renamed with a date suffix or moved to a `superseded/` subfolder within the phase folder).

## Evidence Integrity

### Run Identity and Provenance

- Agent validation records include unique `runId` values for temporal ordering.
- Validation records include `commitSha` and environment metadata (`runtime`, `packageManager`, `os`).
- Gate decisions reference exact artifact paths produced by that run.

### Reproducibility

- Every blocking gate artifact must be reproducible from a clean checkout using only the recorded command log.
- Lane A (exploratory) artifacts are informational and not subject to reproducibility requirements.
- Lane B (deterministic) artifacts that fail reproducibility checks are treated as invalid evidence.

### Optional Migration Extension

- Parity matrix and parity report artifacts are optional migration-specific extensions.
- They are non-blocking by default unless a project explicitly declares a migration parity profile.

## Anti-Patterns

1. **Scattered evidence**: storing artifacts in component directories instead of the evidence tree.
2. **Undated artifacts**: evidence without timestamps or run identifiers.
3. **Orphaned evidence**: artifacts not referenced by any gate decision or validation record.
4. **Stale pass-through**: accepting old artifacts without re-validation for a new gate decision.
5. **Lane A substitution**: using exploratory findings as blocking evidence without Lane B conversion.
