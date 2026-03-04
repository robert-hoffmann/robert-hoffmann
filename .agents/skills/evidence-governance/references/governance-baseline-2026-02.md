# Governance Baseline 2026-02

## Baseline Scope

This baseline defines default governance expectations for autonomous delivery in:

1. web applications
2. Python backend services

This file is dated so teams can update standards references without rewriting the full skill contract.

## Dated Snapshot

- Baseline version: `2026-02`
- Last reviewed: `2026-03-04`
- Governance model: two-lane evidence (`exploration` vs `gate`), risk-tiered evidence levels (`L0` to `L3`), decision-memory ADR controls, claim-verification controls, bounded exceptions, auditable run records

## Required Baseline Controls

1. Deterministic merge gate for every change (`lint/static`, `typecheck` where applicable, tests, build, command logs).
2. Confidence gate for risky and release-scoped work (`L2`, `L3`).
3. Validation record generated for every blocking run.
4. Decision object required for high-risk or `L2`/`L3` runs.
5. High-risk path changes require ADR registry alignment or active ADR waiver.
6. Governance-grade blocking assertions cannot rely on `unverified` claims.
7. Exception lifecycle with owner, expiry, follow-up, and renewal cap.
8. Environment determinism via pinned runtime/package tooling and lockfile policy.

## Metrics Guidance (DORA Update)

DORA standardizes five software delivery performance metrics and groups them as throughput and instability.

Throughput:

1. change lead time
2. deployment frequency
3. failed deployment recovery time

Instability:

1. change fail rate
2. deployment rework rate

Governance use:

1. track per application/service, not aggregate across unrelated systems
2. treat these as improvement signals, not hard quotas
3. pair them with quality and safety evidence from this skill

## Standards Alignment Map

| Standard / Reference | Governance Mapping |
|---|---|
| SOC 2 Trust Services Criteria | Centralized evidence, traceability, reproducible controls, retention |
| NIST AI RMF 1.0 (`Govern`, `Map`, `Measure`, `Manage`) | Policy controls, scoped risk classification, measurable gate artifacts, exception lifecycle |
| EU AI Act (Regulation (EU) 2024/1689) | Record-keeping, risk controls, oversight traceability, accountability |
| OpenAI: Practices for Governing Agentic AI Systems | Agent identifiers, activity logging, bounded autonomy controls |
| OpenAI: Unlocking the Codex harness (2026-02-23) | Durable execution context and protocolized tool-use environment |
| Anthropic: Effective harnesses for long-running agents (2025-11-26) | Initializer and durable progress context for long-running sessions |
| Anthropic: Claude Code best practices (2025-09-29) | Context engineering and explicit externalized project memory |

## Source Links

1. DORA metrics guide (last updated January 5, 2026): `https://dora.dev/guides/dora-metrics/`
2. DORA metrics history (last updated January 5, 2026): `https://dora.dev/guides/dora-metrics/history`
3. NIST AI RMF 1.0: `https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10`
4. EU AI Act official text: `https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng`
5. OpenAI whitepaper: `https://openai.com/index/practices-for-governing-agentic-ai-systems/`
6. OpenAI Codex harness article (February 23, 2026): `https://openai.com/index/unlocking-the-codex-harness/`
7. Anthropic harness article (November 26, 2025): `https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents`
8. Anthropic context engineering article (September 29, 2025): `https://www.anthropic.com/engineering/claude-code-best-practices`
