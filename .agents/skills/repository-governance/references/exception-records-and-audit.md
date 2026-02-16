# Exception Records And Audit

Use this file for governance exceptions, legacy retention control, and audit evidence language.

## 1) Governance Exception Template

Use when a baseline repository governance rule cannot be applied immediately.

```yaml
governance_exception:
  owner: "@team-or-person"
  rationale: "Why the baseline rule cannot be applied now"
  created_at: "2026-02-14"
  expires_at: "2026-03-01"
  follow_up: "https://tracker.example.com/GOV-101"
```

## 2) Legacy Retention Exception Template

Use when retaining a legacy tool or pattern temporarily.

```yaml
legacy_exception:
  retained: "Tool, config, or pattern being retained"
  reason: "Constraint blocking migration now"
  target: "Modern replacement target"
  owner: "@team-or-person"
  created_at: "2026-02-14"
  review_on: "2026-03-15"
  follow_up: "https://tracker.example.com/GOV-102"
```

## 3) Release Exception Template

Use when standard release governance cannot be followed for a specific release cycle.

```yaml
release_exception:
  owner: "@team-or-person"
  rationale: "Why default release automation is bypassed"
  temporary_process: "Manual or alternate release steps"
  created_at: "2026-02-14"
  expires_at: "2026-02-28"
  rollback_plan: "How to return to default release policy"
  follow_up: "https://tracker.example.com/REL-201"
```

## 4) SLA Defaults And Review Cadence

Default SLA rules:

- governance exception expiry: 14 calendar days
- legacy exception review cadence: every 30 calendar days
- release exception expiry: same release cycle or 14 days, whichever is sooner

Policy:

- no exception should be indefinite
- expired exceptions must fail governance review until renewed or resolved

## 5) Audit Checklist

Minimum audit checklist:

1. Required artifacts exist and are current.
2. Merge-gate workflows are active and enforceable.
3. Workflow permissions follow least privilege.
4. Dependency governance is enabled.
5. Release governance follows default path or has valid exception.
6. All active exceptions have owner, dates, and follow-up links.

## 6) Evidence Vocabulary

Use these terms consistently in governance reports:

- merge gate
- release gate
- exception SLA
- policy drift
- deterministic install
- lockfile authority
- provenance posture
- remediation owner
