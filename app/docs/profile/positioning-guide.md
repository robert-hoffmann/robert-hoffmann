# Profile Positioning Guide

Purpose: durable positioning guidance for Robert Hoffmann's portfolio, CV,
public hiring material, and channel copy. This file is human-owned and is not
parsed by generators.

Use this guide to decide what message to preserve when editing profile-facing
content. Use source files and generated public artifacts to verify exact live
copy before changing the app.

## Source Truth And Routes

- App profile copy       : `src/data/apps/about.ts`.
- Project facts          : `src/data/apps/projects.ts` and
  `docs/profile/project-evidence.md`.
- Gallery evidence       : `src/data/apps/gallery.ts`.
- Resume history         : `src/data/apps/resume.ts`.
- Generated CV selection : `src/data/docs/cv.ts`.
- AI-agent summary       : `public/llms.txt`.
- Recruiter brief route  : `/hiring-brief/`, generated from
  `src/data/portfolio/canonical.ts`.
- Recruiter brief source : `docs/profile/hiring-brief.md`.
- LinkedIn channel copy  : `docs/profile/linkedin.md`.

Profile docs are not canonical app data. Promote stable facts manually into the
owning source file when they become app, CV, public brief, or channel source
material.

## Target Narrative

Robert should be positioned as a senior product-minded full-stack engineer,
frontend/platform lead, and technical owner for complex web products.

The recurring message:

> I have been building frontend-heavy and full-stack web products since 1998.
> My deepest strength is owning complex browser/product experiences and the
> backend systems required to make them reliable: APIs, databases, caching, web
> services, logging, monitoring, and production support. I have led the technical
> side of high-traffic real-time chat products, built ad-serving and developer
> tooling, modernized operational systems, and now use AI-directed workflows to
> increase delivery throughput while keeping architecture, functionality,
> testing, review, and maintainability under human control. I work best in
> autonomous startup, scale-up, SaaS, software-publisher, or product-team
> environments where the goal is to build useful software with short feedback
> loops and production responsibility.

Use "frontend-led, not frontend-limited" as a recurring framing device.

## Best-Fit Roles

- Lead Frontend Engineer / Frontend Platform Lead.
- Senior or Lead Full-Stack Engineer.
- Product-Minded Technical Lead.
- Startup, scale-up, SaaS, or software-publisher technical lead.
- Developer Tooling / DX / AI-directed delivery lead.
- Operational software lead when reliability, traceability, and observability
  matter.

Industrial and aerospace projects should remain visible, but they should prove
production robustness, offline constraints, observability, and operational
maintainability. They should not become the whole identity.

## Best Environments

Use:

```text
Autonomous product teams, startups, scale-ups, SaaS companies, software
publishers / editeurs de logiciels, and small expert teams with direct user
feedback, short decision loops, low ceremony, and ownership from problem
framing to production.
```

Avoid leading with dislike of process or paperwork. Better framing:

```text
I work best where traceability supports delivery rather than replacing it:
clear goals, lightweight specs, observable systems, automated checks, and fast
feedback loops.
```

## Not Primary Positioning

Do not classify Robert primarily as:

- ML model engineer.
- Kubernetes/SRE specialist.
- Pure security engineer.
- Pure process/agile coach.
- Heavy enterprise-architecture or bureaucracy-focused consultant.
- Pure people manager detached from hands-on product and technical ownership.

## AI-Directed Delivery Framing

Use:

```text
AI-directed, human-owned engineering workflow
```

Or:

```text
AI-assisted delivery system with human-owned architecture, acceptance criteria,
review, testing, and quality gates.
```

Avoid naked "AI-built" claims. The point is not that a model produced files; the
point is that implementation throughput is accelerated while product direction,
architecture, review, tests, documentation sync, and quality gates stay under
human control.

## Claim Safety

- Prefer concrete ownership language: "lead developer", "technical owner",
  "built", "modernized", "introduced", or "maintained".
- Distinguish public proof, private-client context, and self-attested metrics.
- Use qualifiers such as "around", "roughly", or "about" for unaudited
  historical metrics.
- Keep client and employer context explicit. Do not imply ownership of client
  products, client trademarks, or confidential internal systems.
- Keep the CV direct and technical. Avoid corporate fluff.
- Verify volatile public metrics, such as stars, downloads, and marketplace
  installs, before refreshing public copy.

## Maintenance

Update this guide when the target narrative, best-fit role set, not-primary
positioning, or claim-safety rules change.

When a claim becomes durable public content, update the owning source file or
public artifact and keep `docs/profile/project-evidence.md` aligned with the
evidence boundary.
