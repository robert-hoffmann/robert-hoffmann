# Governance Baseline 2026-02

## Baseline Scope

This baseline defines default governance expectations for autonomous delivery in:

1. Web applications
2. Python backend services

This file is dated so teams can update standards references without rewriting the full skill contract.

## Dated Snapshot

- Baseline version: `2026-02`
- Last reviewed: `2026-02-15`
- Governance model: two-lane evidence (`exploration` vs `gate`), risk-tiered evidence levels (`L0` to `L3`), bounded exceptions, auditable run records

## Required Baseline Controls

1. Deterministic merge gate for every change (`lint/static`, `typecheck` where applicable, tests, build, command logs).
2. Confidence gate for risky and release-scoped work (`L2`, `L3`).
3. Validation record generated for every blocking run.
4. Exception lifecycle with owner, expiry, follow-up, and renewal cap.
5. Environment determinism via pinned runtime/package tooling and lockfile policy.

## Metrics Guidance (DORA Update)

DORA now standardizes **five** software delivery performance metrics and groups them as throughput and instability.

Throughput:

1. Change lead time
2. Deployment frequency
3. Failed deployment recovery time

Instability:

1. Change fail rate
2. Deployment rework rate

Governance use:

1. Track per application/service, not aggregate across unrelated systems.
2. Treat these as improvement signals, not hard quotas.
3. Pair them with quality and safety evidence from this skill.

## Standards Alignment Map

| Standard / Reference | Governance Mapping |
|---|---|
| SOC 2 Trust Services Criteria | Centralized evidence, traceability, reproducible controls, retention |
| NIST AI RMF 1.0 (`Govern`, `Map`, `Measure`, `Manage`) | Policy controls, scoped risk classification, measurable gate artifacts, exception lifecycle |
| EU AI Act (Regulation (EU) 2024/1689) | Record-keeping, risk controls, oversight traceability, accountability |
| OpenAI: Practices for Governing Agentic AI Systems | Agent identifiers, activity logging, bounded autonomy controls |
| Anthropic: Building Effective Agents | Tool-first verification and simpler deterministic workflows |

## Source Links

1. DORA metrics guide (last updated January 5, 2026): `https://dora.dev/guides/dora-metrics/`
2. DORA metrics history (last updated January 5, 2026): `https://dora.dev/guides/dora-metrics/history`
3. NIST AI RMF 1.0: `https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10`
4. EU AI Act official text: `https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng`
5. OpenAI whitepaper: `https://openai.com/index/practices-for-governing-agentic-ai-systems/`
6. Anthropic article: `https://www.anthropic.com/research/building-effective-agents`
