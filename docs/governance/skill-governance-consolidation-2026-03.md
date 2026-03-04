# Governance Skill Consolidation Record (2026-03)

Status: `implemented`
Owner: `@platform-governance`
Date: `2026-03-04`
Scope: hard cutover from split governance skills to a single unified governance skill

## Summary

The repository now uses one self-contained governance skill:

1. `.agents/skills/governance`

This replaces the former split model and removes cross-skill dependencies.

## Decisions

1. single skill architecture (`governance`)
2. no router skill
3. no backward aliases
4. deterministic script behavior preserved with path-root migration only
5. progressive disclosure preserved through mode-based reference loading

## Public Interface

1. removed: split governance skill set
2. added: `governance`
3. unified script entrypoints under `.agents/skills/governance/scripts/`

## Unified Operating Modes

1. `repository mode`
2. `testing mode`
3. `evidence mode`
4. `core-contract mode`
5. `full governance audit mode`

## Validation

1. skill metadata/frontmatter validated with quick validator
2. governance script regression suite executed from unified path
3. workflow path rewrites verified for decision and integrity workflows
4. stale `governance-*` references removed from active instructions/workflows/docs
