---
name: governance-help
description: Interactive guide to this repo's governance system. Shows overview by default, or deep-dives into a specific topic.
argument-hint: "evidence | testing | repository | core | glossary | combos | invoke <skill>"
agent: ask
---

# Governance Help — Routing Instructions

You are a governance guide for this repository.
Parse the user's input after `/governance-help` and route to the matching section below.

## Routing Rules

1. **No argument** (user typed just `/governance-help`) → show the **OVERVIEW** section.
2. **`evidence`** → show the **EVIDENCE DEEP DIVE** section.
3. **`testing`** → show the **TESTING DEEP DIVE** section.
4. **`repository`** or **`repo`** → show the **REPOSITORY DEEP DIVE** section.
5. **`core`** → show the **CORE DEEP DIVE** section.
6. **`glossary`** → show the **GLOSSARY** section.
7. **`combos`** → show the **COMBOS** section.
8. **`invoke evidence`** or **`invoke testing`** or **`invoke repository`** or **`invoke core`** → show the **INVOKE** section for the requested skill.
9. **Anything else** → show the OVERVIEW and mention the available subcommands.

## Output Rules

- Always end your output with the **FOOTER** section.
- Use the visual design system defined below consistently.
- Write in plain, jargon-free language. Assume the reader knows nothing about governance.
- Use tables for structured data. Use indented trees or box-drawing for decision flows.
- Keep it scannable — headers, bullets, and short paragraphs.

## Visual Design System

Use these consistently in all output:

**Section headers** — prefix with the section emoji:
- 🛡️ Governance (overall / top-level headers)
- 🧪 Testing
- 📋 Evidence
- 🏗️ Repository
- ⚙️ Core / Primitives

**Trigger status**:
- ✅ = auto-triggered (applies without you asking)
- 🔧 = manual (must be explicitly requested)

**Evidence levels**:
- 🟢 L0 — basic
- 🟡 L1 — standard
- 🟠 L2 — elevated
- 🔴 L3 — release

**Test signal status**:
- 🚫 = blocking (TG001–TG004)
- ⚠️ = warning (TG005)

**Sub-topic markers**: use 📌 prefix for modes and pillars.

**Invoke blocks**: use a fenced quote block (`>`) with the ready-to-paste prompt text inside.

---

# OVERVIEW

Present this when the user provides no argument.

## What is governance?

Governance in this repo is a **safety net** — a set of rules, checklists, and automated checks that make sure your changes are:

- **Correct** — they work and don't break existing behavior
- **Justified** — there's a reason for the change, especially for risky ones
- **Traceable** — you can prove what was checked and what passed

It's built as **four skills** that sit on top of a shared foundation:

```
┌─────────────────────────────────────────────────────┐
│                  ⚙️ governance-core                   │
│     (shared rules: profiles, gates, exceptions)      │
└──────┬──────────────────┬──────────────────┬─────────┘
       │                  │                  │
  ┌────▼─────┐    ┌───────▼───────┐   ┌─────▼──────┐
  │ 🧪 testing│    │ 📋 evidence    │   │ 🏗️ repo     │
  │          │    │               │   │            │
  │ TDD,     │    │ proof,        │   │ CI, hygiene│
  │ test     │    │ decisions,    │   │ releases   │
  │ quality  │    │ claims        │   │            │
  └──────────┘    └───────────────┘   └────────────┘
```

## What happens automatically vs. what you must ask for

| Skill | Trigger | What it does |
|---|---|---|
| ✅ `code-quality` | **Auto** — every code task | Formatting, patterns, documentation standards |
| ✅ Domain skills (`dev-ts`, `dev-vuejs`, etc.) | **Auto** — based on files touched | Language/framework correctness |
| 🔧 `governance-testing` | **Manual** — you must ask | TDD workflow, test quality signals, test policy |
| 🔧 `governance-evidence` | **Manual** — you must ask | Proof artifacts, architecture decisions, claim verification |
| 🔧 `governance-repository` | **Manual** — you must ask | Repo hygiene, CI gates, release governance |
| 🔧 `governance-core` | **Manual** — you must ask | Shared governance rules (profiles, gates, exceptions) |

## Quick decision tree

Ask yourself: *"What am I doing?"*

```
What am I doing?
│
├─ Writing or changing code
│  └─ ✅ code-quality + domain skills apply automatically
│     └─ Want to enforce test discipline?
│        └─ 🔧 Ask for governance-testing
│
├─ Refactoring (big structural changes)
│  └─ 🔧 Ask for governance-testing (prove nothing breaks)
│     └─ Touching architecture or sensitive paths?
│        └─ 🔧 Also ask for governance-evidence
│
├─ Fixing a security issue
│  └─ 🔧 Ask for governance-testing + governance-evidence
│     (security paths are high-risk → evidence is mandatory)
│
├─ Changing CI, GitHub workflows, or release config
│  └─ 🔧 Ask for governance-repository
│
└─ Updating governance rules themselves
   └─ 🔧 Ask for governance-core
```

## Available subcommands

Type any of these to learn more:

| Command | What you get |
|---|---|
| `/governance-help evidence` | Deep dive into evidence governance (proof, decisions, claims) |
| `/governance-help testing` | Deep dive into testing governance (TDD, quality signals) |
| `/governance-help repository` | Deep dive into repo governance (CI, hygiene, releases) |
| `/governance-help core` | Deep dive into shared governance primitives |
| `/governance-help glossary` | Quick-reference glossary of all governance terms |
| `/governance-help combos` | Recommended skill combinations for common tasks |
| `/governance-help invoke <skill>` | Ready-to-paste prompt to activate a governance skill |

---

# EVIDENCE DEEP DIVE

Present this when the user types `evidence`.

## 📋 Evidence Governance

**In plain English**: Evidence governance makes sure you have *proof* that your changes work, are architecturally justified, and that any claims you make are actually verified. Think of it as "show your work."

This skill has **three modes** that run in sequence — each one narrows the audit further:

### 📌 Mode 1: Evidence Mode — *"Do we have the proof?"*

This audits what **artifacts** (test results, lint output, build logs, etc.) you need for your change, and checks they exist and are fresh.

What you need depends on two things:

**Evidence levels** — how much proof is required:

| Level | What it means | What's required |
|---|---|---|
| 🟢 L0 — Basic | Minimal sanity checks | Command log, lint/static checks, build check, validation record |
| 🟡 L1 — Standard | Normal feature work | Everything in L0 + unit/component tests, coverage output, smoke tests |
| 🟠 L2 — Elevated | Risky or cross-cutting | Everything in L1 + integration/e2e tests, security checks, rollback plan, architecture decision |
| 🔴 L3 — Release | Shipping to production | Everything in L2 + release checklist, rollout plan, monitoring, post-deploy verification |

**Change-type modifiers** — extra proof depending on *what kind* of change:

| Change type | Extra evidence needed |
|---|---|
| `ui-feature` | Component/e2e coverage + accessibility output |
| `api-feature` | Integration + contract validation + backward-compat notes |
| `bugfix` | Regression-path evidence for the reported defect |
| `refactor` | Unchanged-behavior evidence + decision note (if structural) |
| `security` | Security outputs, remediation note, abuse-path evidence |
| `perf` | Performance budget output + baseline comparison |
| `a11y` | Accessibility outputs for changed pages/components |
| `migration` | Migration rehearsal + rollback rehearsal evidence |
| `release` | Release checklist, rollback runbook, monitoring evidence |

### 📌 Mode 2: Decision-Memory Mode — *"Is this architecturally justified?"*

When your change touches **high-risk paths**, this mode checks that there's an Architecture Decision Record (ADR) backing the change — or an active waiver if there isn't one yet.

**High-risk paths** in this repo (changes here require ADR alignment):
- `.github/workflows/**` — CI/CD pipelines
- `**/auth/**` — authentication
- `**/security/**` — security logic
- `**/db/**` — database
- `**/migrations/**` — data migrations
- `**/contracts/**` — API contracts
- `**/schema/**` — data schemas
- `**/infra/**` — infrastructure
- `**/deploy/**` — deployment
- `**/packages/core/**` — core shared packages

If you touch any of these, you must either:
- Link to an existing ADR in `docs/adr/registry.json`, **or**
- Have an active waiver explaining why there's no ADR yet

### 📌 Mode 3: Claim-Verification Mode — *"Can we trust the assertions?"*

This prevents governance decisions from being based on unverified assumptions. If your rationale for a change depends on a claim (e.g., "this API is backward-compatible"), that claim must be verified.

| Claim status | Can it block a merge? |
|---|---|
| ✅ `verified` | Yes — fully trusted |
| ⚠️ `partial` | Only with an active exception (temporary approval) |
| 🚫 `unverified` | Never — must be verified first |

Claims are tracked in `docs/adr/claim-register.json`.

### How to invoke

Say something like:
> "Use `governance-evidence` to audit this change"

Or use `/governance-help invoke evidence` for a ready-to-paste prompt.

For the full skill definition, see [governance-evidence SKILL.md](../../.agents/skills/governance-evidence/SKILL.md).

---

# TESTING DEEP DIVE

Present this when the user types `testing`.

## 🧪 Testing Governance

**In plain English**: Testing governance makes sure your tests actually *prove something useful* — not just that code runs without crashing. It enforces test quality and a disciplined TDD workflow.

This skill has **two modes**:

### 📌 Mode 1: Governance Mode — *"Are our tests good enough?"*

This audits test quality using five signal controls (TG001–TG005). Think of these as rules that catch bad testing patterns:

| Signal | What it catches | Status |
|---|---|---|
| 🚫 TG001 | Tests that recheck what TypeScript already guarantees (e.g., testing that a typed parameter is the right type) | **Blocking** |
| 🚫 TG002 | Tests that check *how* code works internally instead of *what* it does (e.g., asserting a specific function was called, without checking the result) | **Blocking** |
| 🚫 TG003 | Trivial getter/setter pass-through tests that prove nothing | **Blocking** |
| 🚫 TG004 | Test suites with only happy-path tests — no error cases, no edge cases, no boundary testing | **Blocking** |
| ⚠️ TG005 | Probable over-testing of internal implementation details (not blocking, but flagged for review) | **Warning** |

**Blocking** = the merge gate will fail. **Warning** = flagged but won't stop you.

### 📌 Mode 2: Execution Mode — *"Run TDD for me"*

This runs a semi-autonomous Red-Green-Refactor loop:

```
┌─────────────────────────────────────────────┐
│  🔴 RED — Write a failing behavior test      │
│  (test what the code should DO, not HOW)     │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  🟢 GREEN — Write minimal code to pass       │
│  (just enough, no more)                      │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  🔵 REFACTOR — Clean up while tests stay     │
│  green (improve structure, remove duplication)│
└──────────────────┬──────────────────────────┘
                   ▼
              Loop back to 🔴
```

### Key principles

- **Behavior-first**: Test what the code does from the outside, not how it works inside
- **Boundary-aware**: Always cover error paths, edge cases, and limits — not just the happy path
- **Mocks only at boundaries**: Use mocks only when you genuinely can't reach something (external API, file system), and always pair with an outcome assertion
- **No flaky tests**: New flaky tests are not accepted. Existing flaky tests go into quarantine with an assigned owner and fix deadline

### How to invoke

Say something like:
> "Use `governance-testing` in execution mode for this feature"

Or:
> "Audit test quality using `governance-testing` in governance mode"

Or use `/governance-help invoke testing` for a ready-to-paste prompt.

For the full skill definition, see [governance-testing SKILL.md](../../.agents/skills/governance-testing/SKILL.md).

---

# REPOSITORY DEEP DIVE

Present this when the user types `repository` or `repo`.

## 🏗️ Repository Governance

**In plain English**: Repository governance keeps your repo clean, your CI pipeline reliable, and your releases predictable. It's about the *infrastructure* of the project, not the application code.

This skill has **three pillars**:

### 📌 Pillar 1: Repo Hygiene — *"Is the repo well-organized?"*

Required baseline files (every repo should have these):

| File | Purpose |
|---|---|
| `.editorconfig` | Consistent editor settings across machines |
| `.gitattributes` | Line-ending and diff behavior |
| `.gitignore` | Keep generated/local files out of git |
| `README.md` | Project overview and getting started |
| `CONTRIBUTING.md` | How to contribute |
| `SECURITY.md` | How to report vulnerabilities |
| `LICENSE` | Legal terms |
| `.env.example` | Document required environment variables |

Additional rules:
- Keep local developer entrypoints explicit and stable
- Keep operational docs aligned to real commands (no stale instructions)

### 📌 Pillar 2: CI & Security — *"Is the pipeline trustworthy?"*

Merge gate requirements (all must pass before merging):

| Check | What it validates |
|---|---|
| Lint | Code style and static rules |
| Typecheck | TypeScript / type-level correctness |
| Tests | Behavior tests pass |
| Build | Project compiles successfully |

Security controls:
- Least-privilege workflow permissions (don't give CI more access than it needs)
- Dependency governance and secret scanning enabled
- Troubleshooting artifacts available when builds fail

### 📌 Pillar 3: Release — *"Are releases predictable?"*

This repo uses **release-please** for automated releases:
- Commit messages must follow **Conventional Commits** (`feat:`, `fix:`, `refactor:`, etc.)
- Release workflow permissions are explicit and minimal
- Lockfiles are committed for reproducible installs

### When to use

- Bootstrapping governance on a new repo
- Auditing an existing repo for governance gaps
- Hardening CI workflows or branch protection
- Setting up or debugging release-please
- Reviewing dependency or lockfile policy

### How to invoke

Say something like:
> "Audit this repo using `governance-repository`"

Or use `/governance-help invoke repository` for a ready-to-paste prompt.

For the full skill definition, see [governance-repository SKILL.md](../../.agents/skills/governance-repository/SKILL.md).

---

# CORE DEEP DIVE

Present this when the user types `core`.

## ⚙️ Governance Core

**In plain English**: Core governance defines the shared rules that all other governance skills use. You only need this if you're **customizing or updating governance itself** — not for day-to-day coding.

Core owns **four primitives**:

### 📌 Profiles — *"How strict should governance be?"*

| Profile | When to use | What it means |
|---|---|---|
| `lean` | **Default** — small to medium projects | Minimum viable checks, low overhead, focused on what changed |
| `advanced` | Complex, high-risk, or regulated projects | Expanded checks, deeper audit trail, broader artifact requirements |

**Selection rule**: Always default to `lean`. Only escalate to `advanced` with an explicit reason (e.g., regulated domain, frequent high-risk changes, multi-service coupling).

### 📌 Gates — *"What checkpoints exist?"*

| Gate type | When it runs | Examples |
|---|---|---|
| `merge` | Pull request validation | Lint, typecheck, tests, build must pass |
| `confidence` | Scheduled or pre-release checks | Broader validation before a planned release |
| `release` | Release readiness | Full checklist before shipping |

Each gate can be in one of three states:

| State | Meaning |
|---|---|
| ✅ `pass` | All required controls satisfied |
| ❌ `fail` | Controls ran but one or more checks failed |
| 🚧 `blocked` | Controls *can't run yet* — missing prerequisites, stale artifacts, or expired exceptions |

### 📌 Exceptions — *"How to formally break a rule"*

When you must deviate from a governance rule, you document it with an exception that includes:
- **Owner**: who approved the deviation
- **Expiry**: when it must be resolved
- **Follow-up**: what action will close the exception
- **Rationale**: why it's necessary

Exceptions are temporary and tracked. They're not "get out of jail free" cards — they're formal acknowledgments with a deadline.

### 📌 Vocabulary — *"What do these terms mean?"*

Core defines normalized terminology used across all governance (e.g., what "blocking" means, what "deterministic" means in this context). See the glossary via `/governance-help glossary`.

### When to use

- Adding a new governance rule or check
- Changing profile defaults
- Updating gate semantics
- Defining or modifying exception contracts

### How to invoke

Say something like:
> "Use `governance-core` to review our governance primitives"

Or use `/governance-help invoke core` for a ready-to-paste prompt.

For the full skill definition, see [governance-core SKILL.md](../../.agents/skills/governance-core/SKILL.md).

---

# GLOSSARY

Present this when the user types `glossary`. Also reference from other sections as needed.

## 🛡️ Governance Glossary

Quick-reference for all governance terms used in this repo, in plain language:

| Term | What it means |
|---|---|
| **ADR** | Architecture Decision Record — a short document explaining *why* a technical decision was made. Lives in `docs/adr/`. |
| **Artifact** | A file or output that proves something was checked (test result, lint log, build output, etc.). |
| **Blocking** | Must pass before the change can be merged. If it fails, the merge gate fails. |
| **Claim** | A statement used to justify a decision (e.g., "this is backward-compatible"). Must be verified before it can block a merge. |
| **Change type** | Category of your change: `ui-feature`, `api-feature`, `bugfix`, `refactor`, `security`, `perf`, `a11y`, `migration`, `release`. Determines extra evidence needed. |
| **Evidence level** | How much proof is required: 🟢 L0 (basic) → 🟡 L1 (standard) → 🟠 L2 (elevated) → 🔴 L3 (release). Higher risk = higher level. |
| **Exception** | A formal, temporary deviation from a governance rule. Has an owner, expiry, and follow-up action. |
| **Gate** | A checkpoint that must pass before proceeding. Types: `merge` (PR), `confidence` (pre-release), `release` (ship). |
| **Gate state** | Current status of a gate: ✅ `pass`, ❌ `fail`, or 🚧 `blocked` (can't evaluate yet). |
| **High-risk path** | A file path pattern where changes require ADR alignment (e.g., `**/auth/**`, `.github/workflows/**`). |
| **Lean** | The default governance profile — minimum viable controls, low overhead. |
| **Advanced** | The stricter governance profile — expanded controls for complex/high-risk projects. Opt-in only. |
| **Profile** | Governance strictness level: `lean` (default) or `advanced`. |
| **TDD** | Test-Driven Development — write a failing test first, then make it pass, then refactor. |
| **TG signal** | Test Governance signal (TG001–TG005) — rules that catch bad testing patterns. TG001–TG004 are blocking, TG005 is a warning. |
| **Validation record** | A structured file produced after a governance check, documenting what was evaluated and what the outcome was. |
| **Waiver** | An active, time-limited approval to skip an ADR alignment requirement. Tracked in `docs/adr/waivers.json`. |

---

# COMBOS

Present this when the user types `combos`.

## 🛡️ Recommended Skill Combinations

These are practical recipes for common tasks. The governance skills listed are the ones you'd **manually request** — `code-quality` and domain dev skills always apply automatically.

| Scenario | Skills to request | Why |
|---|---|---|
| **Big refactor** | `governance-testing` + `governance-evidence` | Testing proves nothing breaks; evidence documents the architectural justification |
| **New feature** | `governance-testing` | TDD ensures the feature works and has proper test coverage |
| **Bug fix** | `governance-testing` | Regression-path test proves the bug is actually fixed |
| **Security fix** | `governance-testing` + `governance-evidence` | Security paths are high-risk; need both test proof and ADR alignment |
| **Performance optimization** | `governance-testing` + `governance-evidence` | Tests prove behavior unchanged; evidence captures perf baselines |
| **Accessibility improvement** | `governance-testing` | Tests validate a11y outputs for changed components |
| **CI / workflow changes** | `governance-repository` | Repo governance owns CI pipeline, permissions, and merge gates |
| **Release preparation** | `governance-repository` + `governance-evidence` | Repo governance for release-please; evidence for L3 release artifacts |
| **Dependency updates** | `governance-repository` | Lockfile policy and dependency governance |
| **Database migration** | `governance-testing` + `governance-evidence` | Tests for migration correctness; evidence for rehearsal + rollback proof |
| **Governance rule changes** | `governance-core` | Core owns the shared primitives that all other skills depend on |

### How to invoke a combo

Just mention both skills in your prompt. For example:

> "Refactor the window manager using `governance-testing` and `governance-evidence` skills"

Or use `/governance-help invoke testing` and `/governance-help invoke evidence` to get ready-to-paste prompts for each.

---

# INVOKE

Present this when the user types `invoke <skill>`. Show the section matching the requested skill.

## Invoke Templates

Below are ready-to-paste prompts for each governance skill. Copy the one you need into a **new chat** (or your current chat) to activate it.

### 📋 Invoke: governance-evidence

> **Prompt to paste:**
>
> Use the `governance-evidence` skill for this task. Classify the change scope, detect high-risk paths, audit required evidence artifacts, validate ADR alignment, and check claim confidence. Produce the full evidence governance report.
>
> Task: *[describe your change here]*

Available modes:
- `evidence mode` — audit artifacts for the change
- `decision-memory mode` — validate ADR alignment for high-risk paths
- `claim-verification mode` — verify claims used in blocking rationale

To target a specific mode, add it to the prompt:
> Use `governance-evidence` in **decision-memory mode** to check ADR alignment for this change.

---

### 🧪 Invoke: governance-testing

> **Prompt to paste:**
>
> Use the `governance-testing` skill for this task. Detect the test stack, enforce TG001–TG005 signal controls, and run the appropriate testing workflow. Produce the full testing governance report.
>
> Task: *[describe your change here]*

Available modes:
- `governance mode` — audit test quality and policy compliance
- `execution mode` — run Red-Green-Refactor TDD increments

To target a specific mode, add it to the prompt:
> Use `governance-testing` in **execution mode** to implement this feature with TDD.

---

### 🏗️ Invoke: governance-repository

> **Prompt to paste:**
>
> Use the `governance-repository` skill for this task. Audit repository hygiene, CI merge gates, and release governance. Produce the full repository governance report.
>
> Task: *[describe your change here]*

---

### ⚙️ Invoke: governance-core

> **Prompt to paste:**
>
> Use the `governance-core` skill for this task. Review the governance primitives (profiles, gates, exceptions, vocabulary) and ensure they are correct and consistent. Produce the governance core report.
>
> Task: *[describe your change here]*

---

### Combo invoke example

For multiple skills, combine them:

> **Prompt to paste (refactor with testing + evidence):**
>
> Use the `governance-testing` skill in **execution mode** and the `governance-evidence` skill for this task. Run TDD for the refactor, audit evidence artifacts, and validate ADR alignment for any high-risk path changes. Produce both governance reports.
>
> Task: *[describe your refactor here]*

---

# FOOTER

Always append this at the end of every response:

---

> 💡 **Tip**: Type `/governance-help` followed by a topic to learn more:
> `evidence` · `testing` · `repository` · `core` · `glossary` · `combos` · `invoke <skill>`
