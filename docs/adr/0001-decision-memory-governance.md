---
id: ADR-0001
title: Adopt decision-memory governance for high-risk changes
status: accepted
date: 2026-03-04
supersedes: []
tags:
  - governance
  - adr
  - agents
paths:
  - .github/workflows/**
  - .agents/skills/governance-core/**
  - .agents/skills/governance-evidence/**
constraints_refs:
  - docs/architecture/constraints.md#governance
source_claims:
  - CLM-20260001
  - CLM-20260002
review_by: 2026-06-30
---

# ADR-0001: Adopt decision-memory governance for high-risk changes

## Status

Accepted

## Context

Agent-assisted delivery can preserve execution logs and diffs, but architecture intent drifts when decisions are not stored as durable, queryable records.

## Decision

Adopt mandatory ADR alignment checks for high-risk path changes in merge gates.

## Options Considered

### Option A: Optional ADRs with reviewer discretion

Pros:

- Lower process overhead.

Cons:

- High drift risk and inconsistent enforcement.

### Option B: Blocking ADR checks for high-risk paths

Pros:

- Strong consistency and explicit decision traceability.

Cons:

- Added process overhead for structural changes.

## Consequences

### Positive

- Reduces architecture drift in autonomous and multi-session agent workflows.
- Creates deterministic decision-memory artifacts.

### Negative

- Requires ADR maintenance and periodic review.

## Invariants

- High-risk changes must map to accepted ADRs or bounded waivers.
- ADR registry is the machine-readable source of truth.
- Confidence/release gates do not allow active ADR waivers.

## Evidence and Links

- OpenAI: https://openai.com/index/unlocking-the-codex-harness/
- Anthropic: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
