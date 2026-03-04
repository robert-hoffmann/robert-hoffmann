---
name: governance-core
description: Shared governance primitives for exception metadata, gate vocabulary, profile selection, and report contracts used by governance domain skills.
---

# Governance Core

## Overview

Use this skill as the single source of truth for cross-domain governance primitives.

This skill is intentionally domain-neutral.
It defines shared contracts only and does not define repository-specific, testing-specific, or evidence-specific workflows.

## When To Use

Use this skill for:

- defining or updating canonical exception metadata
- defining shared gate vocabulary and gate states
- defining common governance output/report sections
- selecting profile defaults (`lean` vs `advanced`)
- preventing duplicated governance primitives across domain skills

## Load References On Demand

- Read `references/profile-model.md` for default complexity profiles.
- Read `references/gate-and-report-contract.md` for canonical gate semantics and output contract.
- Read `references/exception-contract.md` for canonical exception metadata and templates.
- Read `references/vocabulary.md` for normalized terms and status language.
- Read `references/governance-commands.md` for stable in-skill command entrypoints.

## Core Workflow

1. Detect which governance primitive is being changed (profile, gate, report, exception, vocabulary).
2. Choose profile defaults from `references/profile-model.md`.
3. Apply canonical gate and report semantics from `references/gate-and-report-contract.md`.
4. Apply exception metadata rules from `references/exception-contract.md`.
5. Keep the change domain-neutral and push domain details to domain skills.

## Rules

- Shared primitives are defined only in this skill.
- Domain skills may reference this skill.
- Domain skills must not duplicate schema-defining templates owned by this skill.
- Keep defaults lean and activate advanced controls explicitly.

## Output Requirements

When producing governance guidance from this skill, include:

1. selected profile (`lean` or `advanced`)
2. selected gate semantics (`merge`, `confidence`, `release`)
3. exception contract usage note (or explicit `none`)
4. normalized report section list

## Completion Checklist

- Shared primitive is defined in one place only.
- Domain-neutral scope is preserved.
- Lean default is unchanged unless explicitly requested.
- Advanced controls remain opt-in.
