# Teacher App-Builder Skill — Design

**Date:** 2026-05-17
**Status:** Draft for review

## Problem

Teachers using the MyClassroomAIbot framework need offline "local tools" tailored to their own classrooms — but their needs aren't predictable. The existing repo ships one example (`local-tools/missing-work-cards.html`) and can't anticipate every teacher's workflow. Asking each teacher to handwrite HTML is a non-starter; asking the project owner to predict every workflow is also a non-starter.

We need a Claude Code skill a teacher can invoke that:

1. Walks them through describing what they want
2. Generates a single-file offline HTML app that fits the project's privacy architecture by construction
3. Registers the new app with a manifest the (future) AI dashboard reads, so apps appear in the gallery with their description and links
4. Stays simple enough that a non-developer teacher can use it

## Non-goals

- **Building the dashboard UI itself.** This spec only defines the manifest contract that the future dashboard will consume.
- **Auto-tracked goal progress.** Goals and progress are entered manually by the teacher in the dashboard. Apps don't report telemetry.
- **Multi-page or build-step apps.** Every generated app is a single static HTML file the teacher double-clicks.
- **Server-side anything.** No backend, no Node tooling required.

## Architecture

### Privacy invariants (non-negotiable)

Every generated app must satisfy all four. The skill enforces them via templates + an automated verification step before handing off.

| Invariant | How it's enforced |
|---|---|
| Pure client-side, single HTML file | Generated from a hardened scaffold; no build artifacts, no module bundler, no Node runtime. One `.html` file. |
| No outbound network calls except an allowlist | `<meta http-equiv="Content-Security-Policy">` tag in the scaffold limits `connect-src` and `script-src` to the project allowlist (initially: `https://cdn.sheetjs.com`). Verification gate (below) confirms no other network access. |
| No localStorage / sessionStorage of student data | Scaffold uses only in-memory JS state. Verification gate flags any `localStorage`/`sessionStorage`/`indexedDB`/`caches` use and accepts it only if a reading model can confirm the stored value cannot contain uploaded data (e.g., a UI preference). |
| Outputs save outside the project folder | Generated apps only support print (system print dialog) or download (browser's default Downloads folder). The scaffold has no File System Access API. Verification gate confirms this. |

If any invariant fails verification, the skill reports the violation and does not register the app in the manifest.

### Folder layout (Approach A — per-app folder)

```
local-tools/
├── manifest.json                    ← skill regenerates on every build
├── missing-work-cards/              ← existing tool, migrated into this layout
│   ├── app.html
│   ├── app.json
│   └── sandbox.csv                  ← optional, lives with the app
└── <new-app-slug>/
    ├── app.html
    ├── app.json
    └── sandbox.<ext>                ← optional, only when the app takes a data file
```

**Migration note:** the skill's first run also migrates the existing `local-tools/missing-work-cards.html` and `sandbox/fictional-gradebook.csv` into this layout so the manifest can index it like any other app. The old paths are removed (no compatibility shims — the POC has no external users yet).

### Manifest contract

`local-tools/manifest.json` is the single source of truth the future dashboard reads. It is a flat array of entries; the skill rewrites it from scratch on every build by scanning `app.json` files. Teachers never edit it by hand.

```json
{
  "schema_version": 1,
  "generated_at": "2026-05-17T14:32:00Z",
  "apps": [
    {
      "slug": "missing-work-cards",
      "title": "Missing Work Cards",
      "problem_solved": "Print one card per student listing what they owe, ready to hand out.",
      "html_path": "local-tools/missing-work-cards/app.html",
      "sandbox_path": "local-tools/missing-work-cards/sandbox.csv",
      "icon": "📋",
      "built_on": "2026-05-17"
    }
  ]
}
```

`app.json` (per-app) has the same fields minus `schema_version`, `generated_at`, and the wrapping `apps` array — it's the entry the skill aggregates into the manifest.

### Conversation flow

The skill opens with one question: **"Do you want a guided walkthrough, or do you want to describe what you need in your own words?"** Both paths converge to the same generation step.

**Guided path** (~5 short questions):
1. What problem does this app solve? (one sentence — becomes `problem_solved` in the manifest)
2. Does it take a data file as input? If so, what kind? (CSV/XLSX/none)
3. What does the output look like? (printable cards / on-screen sortable list / downloadable CSV / on-screen text to copy)
4. What should we call it? (becomes the title)
5. Anything else you want it to do that the questions above didn't cover?

**Free-prose path:**
- Teacher writes a paragraph describing what they want
- Skill asks 1–2 follow-up questions only where ambiguous
- Skill confirms the resolved spec in plain language before generating

### Build steps the skill executes

1. **Plan** — converts the gathered requirements into an internal spec
2. **Scaffold** — copies a hardened template HTML, fills in the title/problem/UI sections
3. **Sandbox** — if the app takes a data file, generates a fictional sandbox file with realistic-looking but obviously-fake data (matches the existing `fictional-gradebook.csv` style)
4. **Verify** — runs the four invariant checks against `app.html` and reports each as pass/fail
5. **Register** — writes `app.json`, rewrites `manifest.json` by re-scanning all apps
6. **Hand off** — prints a message telling the teacher the path to double-click and (if a sandbox file was generated) suggests testing with it first

The skill never invokes the generated app via Bash. The teacher launches it by double-clicking in Finder.

### Verification check (the gate before manifest registration)

A single subagent reads the generated HTML and answers four boolean questions. If any answer is "no," it returns the offending line(s). The skill reports the failure to the teacher and stops — the app is not registered, but the file is left in place so it can be inspected.

This is intentionally a model-graded check rather than a regex sweep: regex catches the literal strings but misses obfuscated equivalents, while a subagent reading the file with a clear checklist catches both. We accept the small cost (a few hundred tokens per build) in exchange for a more robust gate.

## Testing strategy

The skill itself is tested two ways:

1. **Smoke test:** running the skill end-to-end on a known prompt produces a registered app whose `manifest.json` entry has the expected fields and whose `app.html` opens in a browser without console errors.
2. **Invariant red-team:** a fixture set of "intentionally bad" prompts (e.g., "make it save data to localStorage so I don't lose it on refresh") must end with the verification gate failing and the manifest *not* updated.

Both run as part of the skill's eval (the harness from `anthropic-skills:skill-creator`).

The generated apps themselves are not auto-tested — the teacher tests them against the sandbox file before pointing them at real data.

## Open questions deferred to implementation

- **Scaffold style/branding consistency.** The existing missing-work-cards.html has a specific look (light grey bg, blue accent, system font stack, print CSS). The scaffold should match. Exact CSS extraction happens during implementation; not a design-level decision.
- **CDN allowlist evolution.** Starts with `cdn.sheetjs.com`. New CDNs added only by editing a single allowlist constant in the skill, never by the model deciding ad-hoc.
- **Manifest schema versioning.** `schema_version: 1` is reserved; future schema changes get a migration when the dashboard exists to consume them.

## Out-of-scope (explicitly)

- Editing or "evolving" an already-built app via the skill. V1 builds new apps only. If a teacher wants to change one, they re-run the skill — it overwrites by slug after confirming.
- Sharing apps between teachers. V1 outputs are local to one teacher's repo.
- Telemetry, usage tracking, error reporting from generated apps.
