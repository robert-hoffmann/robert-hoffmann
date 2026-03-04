---
id: ADR-0002
title: Require claim-verification tiers for governance policy rationale
status: accepted
date: 2026-03-04
supersedes: []
tags:
  - governance
  - evidence
  - claims
paths:
  - .agents/skills/evidence-governance/**
  - docs/adr/**
constraints_refs:
  - docs/architecture/constraints.md#governance
source_claims:
  - CLM-20260001
  - CLM-20260003
review_by: 2026-06-30
---

# ADR-0002: Require claim-verification tiers for governance policy rationale

## Status

Accepted

## Context

Governance guidance often includes internet-derived claims with uneven source quality. Blocking policy decisions need explicit confidence controls.

## Decision

Use claim tiers (`verified`, `partial`, `unverified`) and enforce policy-use constraints through deterministic checks.

## Options Considered

### Option A: No claim-confidence controls

Pros:

- Faster documentation updates.

Cons:

- High risk of policy drift from weak or stale claims.

### Option B: Tiered claim verification with blocking rules

Pros:

- Stronger trust boundaries for governance rationale.

Cons:

- Requires ongoing claim review and maintenance.

## Consequences

### Positive

- Prevents unverified social claims from driving blocking governance rules.
- Makes policy assumptions auditable and reviewable.

### Negative

- Adds recurring claim review workload.

## Invariants

- Unverified claims cannot be used as blocking governance rationale.
- Partial blocking claims require bounded exceptions.
- Every claim has owner and review window.

## Evidence and Links

- OpenAI: https://openai.com/index/unlocking-the-codex-harness/
- Claim caution (example summary): internal review marked as unverified until reproducible evidence exists.
