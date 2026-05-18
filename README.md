# MyClassroomAIbot — Proof of Concept

> **Status:** Early POC. We're testing one architectural question before committing to the full repo build: *can a classroom AI framework deliver real value to teachers without ever sending student data to Claude?*

## The architecture being tested

Two-layer system:

1. **Local HTML tools** (this folder's `local-tools/`) handle anything mechanical — parsing the gradebook, identifying missing work, printing per-student cards, generating dashboards. These run entirely in the teacher's browser. **No student data ever leaves the laptop.**
2. **Claude / Cowork** handles language and judgment — drafting parent messages, building slides, refining the AI persona, generating new local tools. Claude works from the teacher's prose summary, never raw student data.

If this split holds up under a realistic day-in-the-life test, we'll build the full repo around it. If it falls apart, we go back to the drawing board before investing the next 3–4 weeks.

## What's in this folder

```
MyClassroomAIbot/
├── README.md                       ← you are here
├── local-tools/
│   ├── student-cards.html          ← drag-drop gradebook, print per-student cards in two modes (Missing Work or Full Progress)
│   ├── class-pulse.html            ← drag-drop gradebook, get an aggregate-only summary (safe to paste into Claude)
│   ├── class-dashboard.html        ← drag-drop gradebook, see a visual one-page snapshot of where the class stands
│   ├── parent-messages.html        ← write per-tier templates, merge with gradebook, get per-student messages ready to send
│   └── badges.html                 ← define badges, award them to students, print certificates; history saved to class-state.json
├── sandbox/
│   └── fictional-gradebook.csv     ← 24 fake students with varied missing-work patterns
└── _legacy-reference/              ← the original iterative project, kept for reference; will be deleted before going public
```

## The tools so far

### `student-cards.html`
For students. Drop in the gradebook, pick a card type:
- **Missing Work** — one printable card per student listing only what they owe, with checkboxes and a "great work" variant for students with no missing assignments.
- **Full Progress** — a complete grade snapshot per student: current grade with letter, every assignment with score and percentage, color-coded.

Both modes use the same greeting/body/footer customization and the same `{name}` substitution.

### `class-pulse.html`
For the teacher (and for safe AI use). Drop in the gradebook, get a **paste-ready summary that contains zero student names, zero IDs, and zero per-student rows** — only tier counts, most-missed assignments, and week-over-week movement. Pastes cleanly into Claude with no FERPA risk. Save a snapshot file (kept anywhere outside the Cowork folder) to enable next week's trend comparison.

### `class-dashboard.html`
For the teacher's eyes only. Drop in the gradebook to see a one-page visual snapshot: hero stats (% strong, % struggling, total missing items, top pain point), per-period tier breakdown bars, a most-missed-assignments leaderboard, and a sortable/searchable student table. Names are shown here because this view never leaves the laptop. Reuses the same snapshot format as Class Pulse — drop in last week's snapshot to get trend arrows.

### `parent-messages.html`
For weekly/monthly family communication. Write a message template for each tier (Strong / Steady / Struggling) — placeholders fill in name, period, current grade, missing assignments, points to recover. Drop in the gradebook and the tool generates one ready-to-send message per student, with copy buttons. Templates auto-save in the browser and can be exported as JSON to share with colleagues. Built-in "Load sample templates" button gives teachers a high-quality starting point they can edit.

### `badges.html`
For celebration. Define your own badges (name + icon + color + description), award them to students from the roster (multi-select, filter by period), and print bordered certificates two-per-page. **Introduces the shared `class-state.json` file** — a single file the teacher saves anywhere outside the Cowork folder that holds badge definitions and award history. Future tools (Random Groups, Cold-Call) will read/write the same file, so the teacher only manages one piece of state across the whole toolkit.

## The shared state file: `class-state.json`

Some tools (currently `badges.html`, soon `random-groups.html` and `cold-call.html`) need to remember information between sessions — badge definitions, who got what badge, who has worked together, who's been called on. Rather than scatter this across browser caches or separate files, the toolkit uses **one JSON file the teacher owns and controls**.

```
class-state.json (kept in Documents, Drive, USB — NOT in the Cowork folder)
├── badges
│   ├── definitions   (your custom badges)
│   └── awards        (history: who got what, when)
├── groups            (future: pair history, do-not-pair list)
└── coldCall          (future: who's been called on recently)
```

The flow is always: **drop the file in → make changes → download the updated file back to the same location.** No cloud, no account, no lock-in. The teacher can back it up, share it with a co-teacher, or move between computers by carrying one file.

## How to test the POC (5 minutes)

1. **Open the tool.** Double-click `local-tools/missing-work-cards.html`. It opens in your default browser.
   *(Needs internet on first load to fetch the spreadsheet-parsing library. Future versions will bundle it for fully-offline use.)*
2. **Load the sandbox data.** Drag `sandbox/fictional-gradebook.csv` into the upload zone (or click to pick it).
3. **Confirm the column mapping.** The tool auto-detects "Student" and "Period" — confirm or adjust.
4. **Customize the message.** Edit the greeting and footer. Use `{name}` to insert the student's first name.
5. **Generate.** Filter by period (or all), pick a missing-work threshold, click Generate.
6. **Print.** Cmd/Ctrl-P → save as PDF or print. Cards print two-per-page, ready to cut and hand out.

## What to look for when judging the POC

- **Did the cards come out well?** Are they something you'd actually print and hand to students?
- **How long did the whole flow take?** Should be under 5 minutes once you know the steps.
- **Did anything break or surprise you?** Note where the tool was unclear, ugly, or wrong.
- **What's missing?** What would the original Nolan workflow have done that this tool doesn't?

## Next step (after POC validation)

If the missing-work-cards tool feels useful, we'll continue with:

1. **Simulate the AI side of the same day.** Write a 5-minute teacher prose summary; have Claude generate the day's slides, a parent message, and an encouragement message from it. Compare to what Nolan would have produced.
2. **Decide.** If the combined output is roughly as good as the original — commit to the full repo plan with Tier 0 (no student data) as the default architecture.

## The full plan (for reference)

See conversation notes for the broader 17–20 session plan covering: foundation, AI instruction layer, full local-tools suite, content templates, onboarding flow (8 phases including a dry-run week), sandbox dataset, docs, and privacy sweep before release.

---

*Created 2026-05-17. Not yet ready for other teachers — this is a build-in-progress.*
