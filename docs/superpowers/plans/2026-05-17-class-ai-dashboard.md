# Class AI Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a teacher-facing homepage (`ClassAI-dashboard.html`) for the MyClassroomAIbot project — a JSON-driven launcher for offline tools plus a bento-grid of class-goal cards updated by Claude Cowork.

**Architecture:** Single static HTML file with embedded CSS + vanilla JS, no external dependencies. On load, it fetches two sibling JSON files (`manifest.json` for the sidebar apps list, `dashboard-data.json` for the card content) and renders them. All content authoring happens via Claude editing the JSON files during cowork chats — the page is read-only in the browser.

**Tech Stack:** HTML5, CSS3 (Grid + responsive media queries), vanilla JavaScript (fetch + DOM). No build step, no package manager, no framework. System font stack only.

**Spec reference:** [docs/superpowers/specs/2026-05-17-class-dashboard-design.md](../specs/2026-05-17-class-dashboard-design.md)

**Testing approach:** The spec explicitly opts out of an automated test suite for v1 ("the surface is small and entirely visual"). Each task ends with a manual browser-based verification step instead of a unit test. The verification commands open the file in the system browser and the engineer confirms specific visual outcomes.

---

## File Inventory

**Created by this plan:**
- `local-tools/ClassAI-dashboard.html` — the new dashboard homepage
- `local-tools/dashboard-data.json` — seed card content (Claude-editable)
- `CLAUDE.md` (project root) — guardrails for Claude Cowork

**Modified:**
- `local-tools/manifest.json` — extended from empty `apps: []` to seeded list of 8 existing tools
- `local-tools/class-dashboard.html` → renamed to `local-tools/gradebook-analytics.html`

**Untouched (but registered in sidebar):**
- `local-tools/badges.html`
- `local-tools/class-pulse.html`
- `local-tools/cold-call.html`
- `local-tools/parent-messages.html`
- `local-tools/random-groups.html`
- `local-tools/student-cards.html`

---

## Task 1: Rename existing `class-dashboard.html` → `gradebook-analytics.html`

The existing file is a CSV-upload per-student analytics tool, unrelated to the new homepage. Rename frees the "dashboard" concept for the new homepage and gives the existing tool a name that describes what it actually does.

**Files:**
- Rename: `local-tools/class-dashboard.html` → `local-tools/gradebook-analytics.html`

- [ ] **Step 1: Verify the existing file is what we think it is**

Run: `head -10 "local-tools/class-dashboard.html"`
Expected: First lines show `<!DOCTYPE html>`, `<title>Class Dashboard</title>`, and reference to SheetJS (CSV-parsing library).

- [ ] **Step 2: Rename via git mv (preserves history)**

Run: `git mv "local-tools/class-dashboard.html" "local-tools/gradebook-analytics.html"`
Expected: No output. `git status` shows `renamed: local-tools/class-dashboard.html -> local-tools/gradebook-analytics.html`.

- [ ] **Step 3: Update the page title inside the renamed file**

Replace the `<title>` element to reflect the new name. Use Edit tool on `local-tools/gradebook-analytics.html`:

- old_string: `<title>Class Dashboard</title>`
- new_string: `<title>Gradebook Analytics</title>`

- [ ] **Step 4: Update visible H1 inside the renamed file**

Find the visible header. Run:
`grep -n 'header.app h1\|<h1' "local-tools/gradebook-analytics.html" | head -5`

Locate the H1 that displays the user-visible title (likely something like `Class Dashboard` in the header section). Edit it to: `Gradebook Analytics`. Use the surrounding context to make the Edit unique.

- [ ] **Step 5: Manually verify the rename**

Run: `open "local-tools/gradebook-analytics.html"` (macOS) — opens in default browser.
Expected:
- Page loads without 404
- Tab title says "Gradebook Analytics"
- H1 says "Gradebook Analytics"
- CSV upload UI is present (this tool's existing functionality)

- [ ] **Step 6: Commit**

```bash
git add local-tools/gradebook-analytics.html
git commit -m "Rename class-dashboard.html to gradebook-analytics.html

Frees the 'dashboard' name for the new ClassAI-dashboard.html homepage.
Renamed tool retains all existing CSV-analytics functionality."
```

---

## Task 2: Seed `manifest.json` with the eight existing tools

The current `manifest.json` has `apps: []`. Populate it with entries for every existing local tool so the new dashboard's sidebar has links from day one.

**Files:**
- Modify: `local-tools/manifest.json`

- [ ] **Step 1: Read the existing manifest to preserve its structure**

Run: `cat "local-tools/manifest.json"`
Expected: Shows `schema_version: 1`, `generated_at: "2026-05-17T00:00:00Z"`, `apps: []`. Note the field order and indentation for the update.

- [ ] **Step 2: Replace the file contents with the seeded apps list**

Write the following to `local-tools/manifest.json`:

```json
{
  "schema_version": 1,
  "generated_at": "2026-05-17T00:00:00Z",
  "_comment": "This file is readable by Claude Cowork. Apps registry only — never include student names, grades, or per-student data.",
  "apps": [
    {
      "id": "badges",
      "label": "Badges",
      "file": "badges.html",
      "description": "Generate printable student recognition badges"
    },
    {
      "id": "class-pulse",
      "label": "Class Pulse",
      "file": "class-pulse.html",
      "description": "Quick read on how the class is doing"
    },
    {
      "id": "cold-call",
      "label": "Cold Call",
      "file": "cold-call.html",
      "description": "Randomly pick a student to call on"
    },
    {
      "id": "gradebook-analytics",
      "label": "Gradebook Analytics",
      "file": "gradebook-analytics.html",
      "description": "Upload a gradebook CSV for per-student stats"
    },
    {
      "id": "parent-messages",
      "label": "Parent Messages",
      "file": "parent-messages.html",
      "description": "Draft parent-facing messages"
    },
    {
      "id": "random-groups",
      "label": "Random Groups",
      "file": "random-groups.html",
      "description": "Shuffle the class into small groups"
    },
    {
      "id": "student-cards",
      "label": "Student Cards",
      "file": "student-cards.html",
      "description": "Per-student printable info cards"
    }
  ]
}
```

Note: `missing-work-cards.html` is referenced in the README but does not exist on disk. Omit it from the manifest until it's created. If it does exist when you run this task, add an entry matching the pattern above.

- [ ] **Step 3: Verify JSON validity**

Run: `python3 -m json.tool "local-tools/manifest.json" > /dev/null && echo OK`
Expected: `OK` (no parse errors).

- [ ] **Step 4: Commit**

```bash
git add local-tools/manifest.json
git commit -m "Seed manifest.json with existing local tools

Adds the eight currently-shipping local tools to the apps registry so
the new ClassAI dashboard sidebar populates from day one."
```

---

## Task 3: Create `dashboard-data.json` with example cards

Seed the dashboard with at least one card of each type so the renderer (built in later tasks) can be visually verified. The teacher's real cards will be written by Claude during onboarding.

**Files:**
- Create: `local-tools/dashboard-data.json`

- [ ] **Step 1: Write the seed dashboard data**

Write to `local-tools/dashboard-data.json`:

```json
{
  "_comment": "This file is readable by Claude Cowork. Aggregate text only — NEVER include student names, grades, or per-student data.",
  "title": "My Class",
  "subtitle": "Set up by Claude Cowork during onboarding",
  "cards": [
    {
      "id": "current-unit",
      "size": "large",
      "type": "progress",
      "title": "Current Unit",
      "body": "Replace this card during onboarding with your current curriculum focus.",
      "progress": 0.0,
      "tone": "neutral"
    },
    {
      "id": "focus-this-week",
      "size": "medium",
      "type": "text",
      "title": "Focus This Week",
      "body": "What is your class working on this week? Update with Claude Cowork.",
      "tone": "neutral"
    },
    {
      "id": "upcoming",
      "size": "small",
      "type": "dates",
      "title": "Upcoming",
      "body": [
        "No dates yet — add some with Claude Cowork"
      ],
      "tone": "neutral"
    },
    {
      "id": "teacher-goals",
      "size": "medium",
      "type": "checklist",
      "title": "My Teaching Goals",
      "body": [
        { "text": "Add a goal during onboarding", "done": false }
      ],
      "tone": "neutral"
    },
    {
      "id": "generated-artifacts",
      "size": "small",
      "type": "files",
      "title": "Generated Files",
      "body": [
        {
          "name": "Nothing here yet",
          "type": "folder",
          "children": []
        }
      ],
      "tone": "neutral"
    }
  ]
}
```

- [ ] **Step 2: Verify JSON validity**

Run: `python3 -m json.tool "local-tools/dashboard-data.json" > /dev/null && echo OK`
Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add local-tools/dashboard-data.json
git commit -m "Add dashboard-data.json with seed cards

Includes one example of each card type (progress, text, dates,
checklist, files) so the renderer can be verified end-to-end before
the teacher replaces them via Claude Cowork."
```

---

## Task 4: Create `ClassAI-dashboard.html` skeleton with sidebar + main shell

Build the static HTML structure and base styles. No JS yet — the page renders empty content regions with the correct layout shape.

**Files:**
- Create: `local-tools/ClassAI-dashboard.html`

- [ ] **Step 1: Write the file with HTML skeleton + base CSS**

Write the following to `local-tools/ClassAI-dashboard.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>ClassAI Dashboard</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root {
    --bg: #fafaf9;
    --card-bg: #ffffff;
    --line: #e7e5e4;
    --ink: #18181b;
    --muted: #6b7280;
    --sidebar-bg: #1f2937;
    --sidebar-ink: #e5e7eb;
    --sidebar-muted: #9ca3af;
    --sidebar-active: #4f46e5;
    --accent: #4f46e5;
    --tone-good: #10b981;
    --tone-warning: #f59e0b;
    --radius: 10px;
    --space: 16px;
  }

  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    background: var(--bg);
    color: var(--ink);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
  }

  /* Layout shell */
  .shell { display: flex; min-height: 100vh; }
  .sidebar {
    width: 220px;
    flex-shrink: 0;
    background: var(--sidebar-bg);
    color: var(--sidebar-ink);
    padding: 20px 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .sidebar .brand {
    color: white;
    font-weight: 600;
    font-size: 15px;
    padding: 6px 10px 14px;
    border-bottom: 1px solid #374151;
    margin-bottom: 10px;
  }
  .sidebar .nav-item {
    display: block;
    padding: 8px 10px;
    border-radius: 6px;
    color: var(--sidebar-ink);
    text-decoration: none;
    font-size: 13px;
    transition: background 0.12s;
  }
  .sidebar .nav-item:hover { background: #374151; }
  .sidebar .nav-item.active { background: var(--sidebar-active); color: white; }
  .sidebar .nav-item .desc {
    display: block;
    font-size: 11px;
    color: var(--sidebar-muted);
    margin-top: 2px;
  }
  .sidebar .empty {
    padding: 12px 10px;
    color: var(--sidebar-muted);
    font-size: 12px;
    font-style: italic;
  }

  /* Main area */
  .main { flex: 1; padding: 28px 32px; min-width: 0; }
  .header { margin-bottom: 24px; }
  .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
  .header .subtitle { color: var(--muted); margin-top: 4px; font-size: 13px; }

  /* Error banner */
  .error-banner {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
    padding: 10px 14px;
    border-radius: 6px;
    margin-bottom: 18px;
    font-size: 13px;
  }
  .error-banner:empty { display: none; }

  /* Bento grid */
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(120px, auto);
    grid-auto-flow: dense;
    gap: var(--space);
  }
  .grid .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    color: var(--muted);
    padding: 60px 20px;
    border: 1px dashed var(--line);
    border-radius: var(--radius);
    background: white;
  }
</style>
</head>
<body>
<div class="shell">
  <aside class="sidebar">
    <div class="brand">ClassAI</div>
    <nav id="sidebar-nav"></nav>
  </aside>
  <main class="main">
    <div id="error-banner" class="error-banner"></div>
    <header class="header">
      <h1 id="dash-title">Dashboard</h1>
      <div class="subtitle" id="dash-subtitle"></div>
    </header>
    <div id="grid" class="grid"></div>
  </main>
</div>
<script>
  // Renderer will be filled in by Task 5 onwards.
</script>
</body>
</html>
```

- [ ] **Step 2: Manually verify the shell**

Run: `open "local-tools/ClassAI-dashboard.html"`
Expected:
- Page opens in browser
- Dark slate sidebar on left, ~220px wide, showing "ClassAI" brand
- Main area on right with light background and "Dashboard" header
- No console errors (open devtools to confirm)
- Sidebar is empty below the brand (no nav items yet — expected)
- Grid area is empty (expected)

- [ ] **Step 3: Commit**

```bash
git add local-tools/ClassAI-dashboard.html
git commit -m "Add ClassAI-dashboard.html skeleton with sidebar + main shell

Static HTML structure and base CSS. No JS yet; the page renders the
layout shape with empty content regions."
```

---

## Task 5: Render the sidebar from `manifest.json`

Add JS that fetches the manifest and populates the sidebar nav with one entry per app.

**Files:**
- Modify: `local-tools/ClassAI-dashboard.html` (script block only)

- [ ] **Step 1: Replace the `<script>` block with the sidebar-rendering logic**

Find the `<script>` block at the bottom of the file and replace its contents with:

```javascript
const $ = (id) => document.getElementById(id);
const errors = [];

function showErrors() {
  const banner = $('error-banner');
  if (errors.length === 0) { banner.textContent = ''; return; }
  banner.textContent = errors.join(' · ');
}

async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${path}: ${res.status}`);
    return await res.json();
  } catch (err) {
    errors.push(`Couldn't read ${path} — ${err.message}`);
    showErrors();
    return null;
  }
}

function renderSidebar(manifest) {
  const nav = $('sidebar-nav');
  nav.innerHTML = '';
  const apps = (manifest && manifest.apps) || [];
  if (apps.length === 0) {
    nav.innerHTML = '<div class="empty">No tools yet</div>';
    return;
  }
  for (const app of apps) {
    const a = document.createElement('a');
    a.className = 'nav-item';
    a.href = `./${app.file}`;
    a.innerHTML = `${escapeHtml(app.label || app.id)}` +
      (app.description ? `<span class="desc">${escapeHtml(app.description)}</span>` : '');
    nav.appendChild(a);
  }
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function init() {
  const manifest = await loadJSON('./manifest.json');
  renderSidebar(manifest);
}

init();
```

- [ ] **Step 2: Manually verify the sidebar renders**

Run: `open "local-tools/ClassAI-dashboard.html"`
Expected:
- Sidebar shows 7 items: Badges, Class Pulse, Cold Call, Gradebook Analytics, Parent Messages, Random Groups, Student Cards
- Each item shows the label in white-ish text plus the description in muted grey below it
- Hovering an item changes its background to a slightly lighter slate
- Clicking "Gradebook Analytics" navigates to `gradebook-analytics.html` (use browser back to return)
- No console errors

- [ ] **Step 3: Manually verify error handling**

Temporarily rename `manifest.json` to `manifest.json.bak`. Reload the dashboard.
Expected:
- Red error banner appears at top: "Couldn't read ./manifest.json — ..."
- Sidebar shows "No tools yet" placeholder

Restore: `mv "local-tools/manifest.json.bak" "local-tools/manifest.json"`. Reload — error gone, sidebar populated.

- [ ] **Step 4: Commit**

```bash
git add local-tools/ClassAI-dashboard.html
git commit -m "Render sidebar from manifest.json

Fetches manifest.json on load and populates the sidebar nav with one
anchor per app. Includes graceful handling for missing/malformed JSON
and empty apps arrays."
```

---

## Task 6: Render dashboard header from `dashboard-data.json`

Fetch the dashboard data file and apply its `title` and `subtitle` to the header. Cards come in subsequent tasks.

**Files:**
- Modify: `local-tools/ClassAI-dashboard.html` (script block)

- [ ] **Step 1: Add `renderHeader` and wire it into `init`**

Inside the existing `<script>` block, add a new function above `init`:

```javascript
function renderHeader(data) {
  $('dash-title').textContent = (data && data.title) || 'Dashboard';
  $('dash-subtitle').textContent = (data && data.subtitle) || '';
}
```

Then update `init` to fetch both files and call `renderHeader`. Replace the existing `init` with:

```javascript
async function init() {
  const [manifest, data] = await Promise.all([
    loadJSON('./manifest.json'),
    loadJSON('./dashboard-data.json'),
  ]);
  renderSidebar(manifest);
  renderHeader(data);
}
```

- [ ] **Step 2: Manually verify the header**

Run: `open "local-tools/ClassAI-dashboard.html"`
Expected:
- Header now reads "My Class" with subtitle "Set up by Claude Cowork during onboarding"
- Sidebar still shows the 7 apps
- Grid below is still empty (cards come next task)

- [ ] **Step 3: Commit**

```bash
git add local-tools/ClassAI-dashboard.html
git commit -m "Render header from dashboard-data.json

Fetches dashboard-data.json in parallel with manifest.json and applies
its title + subtitle to the page header."
```

---

## Task 7: Render `progress`, `text`, `dates`, `checklist` card types

Implement the four simpler card renderers and wire them into the grid. The `files` type comes next.

**Files:**
- Modify: `local-tools/ClassAI-dashboard.html` (script and style blocks)

- [ ] **Step 1: Add card styles**

Inside the existing `<style>` block, append (before the closing `</style>`):

```css
/* Cards */
.card {
  background: var(--card-bg);
  border: 1px solid var(--line);
  border-left: 3px solid var(--line);
  border-radius: var(--radius);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
.card.tone-good    { border-left-color: var(--tone-good); }
.card.tone-warning { border-left-color: var(--tone-warning); }
.card.tone-neutral { border-left-color: var(--accent); }
.card h3 {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}
.card .body {
  color: var(--ink);
  font-size: 13px;
  flex: 1;
  min-height: 0;
}
.card.size-large   { grid-column: span 2; grid-row: span 2; }
.card.size-medium  { grid-column: span 2; grid-row: span 1; }
.card.size-small   { grid-column: span 1; grid-row: span 1; }
.card .progress-track {
  height: 6px;
  background: var(--line);
  border-radius: 3px;
  margin-top: 12px;
  overflow: hidden;
}
.card .progress-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.3s;
}
.card.tone-good .progress-fill    { background: var(--tone-good); }
.card.tone-warning .progress-fill { background: var(--tone-warning); }
.card ul.dates, .card ul.checklist {
  list-style: none;
  padding: 0;
  margin: 0;
}
.card ul.dates li {
  padding: 4px 0;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
}
.card ul.dates li:last-child { border-bottom: none; }
.card ul.checklist li {
  padding: 4px 0;
  font-size: 13px;
  display: flex;
  gap: 8px;
  align-items: baseline;
}
.card ul.checklist li.done { color: var(--muted); text-decoration: line-through; }
.card ul.checklist li::before {
  content: "☐";
  font-family: inherit;
}
.card ul.checklist li.done::before { content: "☑"; }
.card .unknown-type {
  display: inline-block;
  font-size: 11px;
  color: var(--muted);
  margin-top: 6px;
  font-style: italic;
}
```

- [ ] **Step 2: Add the card renderer logic**

Inside the `<script>` block, add these functions above `init`:

```javascript
function renderCards(data) {
  const grid = $('grid');
  grid.innerHTML = '';
  const cards = (data && data.cards) || [];
  if (cards.length === 0) {
    grid.innerHTML = '<div class="empty-state">No dashboard cards yet. Set them up with Claude Cowork.</div>';
    return;
  }
  for (const card of cards) {
    grid.appendChild(renderCard(card));
  }
}

function renderCard(card) {
  const el = document.createElement('div');
  const size = ['large', 'medium', 'small'].includes(card.size) ? card.size : 'small';
  const tone = ['good', 'warning', 'neutral'].includes(card.tone) ? card.tone : 'neutral';
  el.className = `card size-${size} tone-${tone}`;

  const title = document.createElement('h3');
  title.textContent = card.title || '';
  el.appendChild(title);

  const body = document.createElement('div');
  body.className = 'body';
  renderCardBody(body, card);
  el.appendChild(body);

  return el;
}

function renderCardBody(container, card) {
  switch (card.type) {
    case 'progress': return renderProgress(container, card);
    case 'text':     return renderText(container, card);
    case 'dates':    return renderDates(container, card);
    case 'checklist':return renderChecklist(container, card);
    default:
      container.textContent = card.body ? String(card.body) : '';
      const note = document.createElement('span');
      note.className = 'unknown-type';
      note.textContent = `unknown type: ${card.type || '(missing)'}`;
      container.appendChild(note);
  }
}

function renderProgress(container, card) {
  if (card.body) {
    const p = document.createElement('div');
    p.textContent = String(card.body);
    container.appendChild(p);
  }
  const pct = typeof card.progress === 'number'
    ? Math.max(0, Math.min(1, card.progress))
    : 0;
  const track = document.createElement('div');
  track.className = 'progress-track';
  const fill = document.createElement('div');
  fill.className = 'progress-fill';
  fill.style.width = `${pct * 100}%`;
  track.appendChild(fill);
  container.appendChild(track);
}

function renderText(container, card) {
  container.textContent = card.body ? String(card.body) : '';
}

function renderDates(container, card) {
  const items = Array.isArray(card.body) ? card.body : [];
  const ul = document.createElement('ul');
  ul.className = 'dates';
  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = String(item);
    ul.appendChild(li);
  }
  container.appendChild(ul);
}

function renderChecklist(container, card) {
  const items = Array.isArray(card.body) ? card.body : [];
  const ul = document.createElement('ul');
  ul.className = 'checklist';
  for (const item of items) {
    const li = document.createElement('li');
    if (item && item.done) li.classList.add('done');
    li.appendChild(document.createTextNode(' ' + ((item && item.text) || '')));
    ul.appendChild(li);
  }
  container.appendChild(ul);
}
```

- [ ] **Step 3: Wire `renderCards` into `init`**

Update `init` to call `renderCards`:

```javascript
async function init() {
  const [manifest, data] = await Promise.all([
    loadJSON('./manifest.json'),
    loadJSON('./dashboard-data.json'),
  ]);
  renderSidebar(manifest);
  renderHeader(data);
  renderCards(data);
}
```

- [ ] **Step 4: Manually verify all four card types render**

Run: `open "local-tools/ClassAI-dashboard.html"`
Expected:
- "Current Unit" card renders as a large card with caption text and a progress bar at 0%
- "Focus This Week" renders as a medium card with prose text
- "Upcoming" renders as a small card with a single bulleted entry
- "My Teaching Goals" renders as a medium card with one unchecked checkbox-style item
- "Generated Files" card is present but body text shows (files renderer comes next task — for now its body may show as raw text or empty; that is expected)
- Bento layout: large card spans 2×2, mediums span 2×1, smalls 1×1
- No console errors

- [ ] **Step 5: Commit**

```bash
git add local-tools/ClassAI-dashboard.html
git commit -m "Render progress, text, dates, and checklist card types

Adds card styles (sizes, tones, progress bars) and renderer dispatch.
Files type still falls through to the unknown-type fallback and will
be implemented next."
```

---

## Task 8: Render the `files` card type

Implement the recursive file/folder tree renderer.

**Files:**
- Modify: `local-tools/ClassAI-dashboard.html`

- [ ] **Step 1: Add files-tree styles**

Append to the `<style>` block (before `</style>`):

```css
.card ul.files-tree, .card ul.files-tree ul {
  list-style: none;
  padding-left: 14px;
  margin: 0;
}
.card ul.files-tree { padding-left: 0; }
.card ul.files-tree li {
  padding: 2px 0;
  font-size: 13px;
}
.card ul.files-tree li.folder > .label { font-weight: 600; }
.card ul.files-tree li .label::before {
  display: inline-block;
  width: 14px;
  margin-right: 2px;
}
.card ul.files-tree li.folder > .label::before { content: "▸"; color: var(--muted); }
.card ul.files-tree li.file   > .label::before { content: "·"; color: var(--muted); }
.card ul.files-tree li.file a { color: var(--accent); text-decoration: none; }
.card ul.files-tree li.file a:hover { text-decoration: underline; }
.card ul.files-tree li.empty {
  color: var(--muted);
  font-style: italic;
}
```

- [ ] **Step 2: Add the `renderFiles` function and register it in `renderCardBody`**

Inside the `<script>` block, add this function:

```javascript
function renderFiles(container, card) {
  const items = Array.isArray(card.body) ? card.body : [];
  if (items.length === 0) {
    container.innerHTML = '<span class="unknown-type">No files yet</span>';
    return;
  }
  const ul = document.createElement('ul');
  ul.className = 'files-tree';
  for (const node of items) ul.appendChild(renderFileNode(node));
  container.appendChild(ul);
}

function renderFileNode(node) {
  const li = document.createElement('li');
  const label = document.createElement('span');
  label.className = 'label';

  if (node && node.type === 'folder') {
    li.classList.add('folder');
    label.textContent = ' ' + (node.name || 'Untitled folder');
    li.appendChild(label);
    const children = Array.isArray(node.children) ? node.children : [];
    if (children.length === 0) {
      const empty = document.createElement('ul');
      const emptyLi = document.createElement('li');
      emptyLi.className = 'empty';
      emptyLi.textContent = '(empty)';
      empty.appendChild(emptyLi);
      li.appendChild(empty);
    } else {
      const sub = document.createElement('ul');
      for (const child of children) sub.appendChild(renderFileNode(child));
      li.appendChild(sub);
    }
  } else {
    li.classList.add('file');
    if (node && node.href) {
      const a = document.createElement('a');
      a.href = node.href;
      a.textContent = ' ' + (node.name || node.href);
      label.appendChild(a);
    } else {
      label.textContent = ' ' + ((node && node.name) || 'Untitled');
    }
    li.appendChild(label);
  }
  return li;
}
```

Then update the `renderCardBody` switch to dispatch to `renderFiles`:

- old_string:
```
    case 'checklist':return renderChecklist(container, card);
    default:
```
- new_string:
```
    case 'checklist':return renderChecklist(container, card);
    case 'files':    return renderFiles(container, card);
    default:
```

- [ ] **Step 3: Manually verify**

Run: `open "local-tools/ClassAI-dashboard.html"`
Expected:
- "Generated Files" card now shows a folder tree
- Top entry is "Nothing here yet" folder, expanded, showing "(empty)" inside
- Folder names are bold with a ▸ marker; files (when present) are linked in accent color

- [ ] **Step 4: Test with nested data**

Temporarily edit `dashboard-data.json` to make the `generated-artifacts` card have richer content:

```json
{
  "id": "generated-artifacts",
  "size": "medium",
  "type": "files",
  "title": "Generated Files",
  "body": [
    {
      "name": "Week of May 13",
      "type": "folder",
      "children": [
        { "name": "Monday slides.html", "type": "file", "href": "./gradebook-analytics.html" },
        { "name": "Parent update.md", "type": "file" }
      ]
    },
    { "name": "Reflection journal.md", "type": "file" }
  ],
  "tone": "neutral"
}
```

Reload. Expected: nested tree renders, "Monday slides.html" is a clickable link, "Parent update.md" appears as plain text (no href).

Revert the change before committing — keep the seeded card minimal.

- [ ] **Step 5: Commit**

```bash
git add local-tools/ClassAI-dashboard.html
git commit -m "Render files card type as recursive folder/file tree

Folders show with a ▸ marker and bold name; files show as links when
an href is present. Empty folders render with an (empty) placeholder."
```

---

## Task 9: Responsive breakpoints (tablet + mobile)

Make the layout adapt to narrower viewports per the spec.

**Files:**
- Modify: `local-tools/ClassAI-dashboard.html` (style block)

- [ ] **Step 1: Append responsive media queries**

Append to the `<style>` block (before `</style>`):

```css
/* Tablet: 640–1023px */
@media (max-width: 1023px) {
  .sidebar { width: 64px; padding: 16px 6px; }
  .sidebar .brand {
    font-size: 12px;
    text-align: center;
    padding: 4px 0 12px;
  }
  .sidebar .nav-item {
    text-align: center;
    padding: 8px 4px;
    font-size: 11px;
    line-height: 1.2;
  }
  .sidebar .nav-item .desc { display: none; }
  .grid { grid-template-columns: repeat(2, 1fr); }
  .card.size-large  { grid-column: span 2; grid-row: span 2; }
  .card.size-medium { grid-column: span 2; grid-row: span 1; }
  .card.size-small  { grid-column: span 1; grid-row: span 1; }
}

/* Mobile: < 640px */
@media (max-width: 639px) {
  .shell { flex-direction: column; }
  .sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    padding: 10px 12px;
    gap: 8px;
    align-items: center;
  }
  .sidebar .brand {
    flex-shrink: 0;
    border-bottom: none;
    border-right: 1px solid #374151;
    padding: 4px 12px 4px 0;
    margin-bottom: 0;
    margin-right: 4px;
  }
  .sidebar nav {
    display: flex;
    gap: 6px;
    flex-direction: row;
  }
  .sidebar .nav-item {
    flex-shrink: 0;
    padding: 6px 10px;
    font-size: 12px;
    white-space: nowrap;
  }
  .main { padding: 18px 16px; }
  .grid { grid-template-columns: 1fr; }
  .card,
  .card.size-large,
  .card.size-medium,
  .card.size-small {
    grid-column: 1 / -1;
    grid-row: auto;
  }
}
```

- [ ] **Step 2: Manually verify each breakpoint**

Open `ClassAI-dashboard.html` in the browser. Open devtools → toggle device toolbar / responsive mode.

At 1280px width: Expected — desktop layout, 220px sidebar with labels + descriptions, 4-column grid.
At 800px width: Expected — sidebar narrows to ~64px showing labels only (no descriptions), grid drops to 2 columns.
At 400px width: Expected — sidebar becomes a top horizontal bar that scrolls; cards stack to single column at full width.

No console errors at any width.

- [ ] **Step 3: Commit**

```bash
git add local-tools/ClassAI-dashboard.html
git commit -m "Add responsive breakpoints for tablet and mobile

Tablet (640–1023px): sidebar narrows to 64px, grid drops to 2 columns.
Mobile (<640px): sidebar collapses to top horizontal scroll bar, cards
stack single-column at full width."
```

---

## Task 10: Print styles

Add a `@media print` rule so Cmd-P produces a usable output.

**Files:**
- Modify: `local-tools/ClassAI-dashboard.html` (style block)

- [ ] **Step 1: Append print styles**

Append to the `<style>` block:

```css
@media print {
  body { background: white; }
  .sidebar, #error-banner { display: none; }
  .shell { display: block; }
  .main { padding: 12px; }
  .grid { display: block; }
  .card,
  .card.size-large,
  .card.size-medium,
  .card.size-small {
    grid-column: auto;
    grid-row: auto;
    page-break-inside: avoid;
    margin-bottom: 12px;
    border: 1px solid #ccc;
  }
}
```

- [ ] **Step 2: Manually verify print output**

Open `ClassAI-dashboard.html`. Press Cmd-P (or Ctrl-P).
Expected:
- Print preview shows no sidebar
- Each card on its own block, stacked vertically
- No cards split across pages (within reason)
- Header and cards readable in monochrome

Cancel the print dialog.

- [ ] **Step 3: Commit**

```bash
git add local-tools/ClassAI-dashboard.html
git commit -m "Add print stylesheet

Hides the sidebar and stacks cards vertically for Cmd-P output. Not a
primary use case but produces a sane fallback."
```

---

## Task 11: Create project-root `CLAUDE.md` with Cowork guardrails

This file is loaded automatically by Claude Code when it operates in this directory. It encodes the privacy and update-protocol rules the spec defined.

**Files:**
- Create: `CLAUDE.md` (at project root)

- [ ] **Step 1: Write the file**

Write to `CLAUDE.md` at the project root (not inside `local-tools/`):

```markdown
# Claude Cowork Guardrails — MyClassroomAIbot

This project is built around a strict architectural privacy boundary: **Claude must never see, store, or transmit student-identifying data.** The architecture is designed so this guarantee comes from where data lives, not from policy you choose to follow — but the guardrails below are still important.

## Files Claude Edits

Two JSON files in `local-tools/` are edited by Claude Cowork during teacher conversations:

- `local-tools/manifest.json` — sidebar tools list. Changes rarely (when a new tool ships).
- `local-tools/dashboard-data.json` — class-goal cards. Changes often.

The teacher never opens or edits these files directly. All authoring happens via chat with Claude.

## Rules When Editing These Files

1. **Never write student names, grades, or per-student data.** Aggregate text only. Write "3 students behind on Unit 3" — never "Maria, José, Aisha behind on Unit 3." The JSON schemas have no fields for per-student data by design. Do not invent fields.

2. **Preserve unrelated cards.** Use targeted Edit operations on specific card content. Never overwrite the whole file blind.

3. **Ask before adding or removing cards.** Edits to existing card content (`title`, `body`, `progress`, `tone`) are fine. Structural changes (new cards, deleting cards, reordering) require teacher confirmation.

4. **`id` is stable.** Once a card or app has an `id`, never rename it. Only change content fields.

## Files Claude Does Not Open

- Any file containing student data, no matter where it lives. The teacher's gradebook CSVs, rosters, and grade exports must stay outside this project folder.

If a teacher accidentally drops a student-data file into the project folder, tell them about the boundary and ask them to move it out. Do not read it.

## Where to Run Offline Apps

Never invoke the local tools (e.g., `gradebook-analytics.html`, `student-cards.html`) via Bash. The teacher opens them directly in their browser. Running them via Claude's tools would surface file paths and stdout into Claude's context — defeating the purpose of the architecture.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "Add project-root CLAUDE.md with Cowork guardrails

Documents the four editing rules for manifest.json and
dashboard-data.json, plus the broader 'no student data' boundary
and the 'never invoke offline tools via Bash' rule."
```

---

## Task 12: Final end-to-end smoke test

Walk through the test scenarios from the spec's Testing Approach section. Fix anything that surfaces.

**Files:** All. Read-only verification; only modify on failure.

- [ ] **Step 1: Fresh-load smoke test**

Close all browser tabs of the dashboard. Run: `open "local-tools/ClassAI-dashboard.html"`.
Expected:
- Header reads "My Class" / "Set up by Claude Cowork during onboarding"
- Sidebar shows 7 apps with descriptions on desktop
- Grid shows 5 cards: Current Unit (large progress), Focus This Week (medium text), Upcoming (small dates), My Teaching Goals (medium checklist), Generated Files (small files)
- No console errors

- [ ] **Step 2: Navigation test**

Click each sidebar app in turn. Each should open the corresponding HTML file in the same tab. Use browser back to return.
Expected: All 7 links navigate; no 404s.

- [ ] **Step 3: Responsive test**

Resize the browser window (or use devtools responsive mode) through ~1280px → 800px → 400px.
Expected: Layout adapts at each breakpoint as described in Task 9 verification.

- [ ] **Step 4: Error state — malformed dashboard-data.json**

Open `local-tools/dashboard-data.json`, introduce a syntax error (e.g., add a stray `,` before the final `}`), save. Reload the dashboard.
Expected:
- Red error banner at top: "Couldn't read ./dashboard-data.json — ..."
- Sidebar still renders (manifest is fine)
- Grid is empty

Revert the file (Cmd-Z in your editor, or `git checkout local-tools/dashboard-data.json`).

- [ ] **Step 5: Error state — unknown card type**

Edit `dashboard-data.json` and change one card's `type` to `"banana"`. Reload.
Expected: That card renders with the body text and a small italic "unknown type: banana" note. No crash.

Revert.

- [ ] **Step 6: Error state — missing manifest**

Run: `mv "local-tools/manifest.json" "local-tools/manifest.json.bak"`. Reload.
Expected: Error banner present, sidebar shows "No tools yet", cards still render.

Restore: `mv "local-tools/manifest.json.bak" "local-tools/manifest.json"`.

- [ ] **Step 7: Claude-edit simulation**

Using the Edit tool, change the `current-unit` card's `progress` value from `0.0` to `0.6` in `dashboard-data.json`. Reload the page.
Expected: The progress bar on "Current Unit" is now ~60% filled, all other cards unchanged.

Revert: `git checkout local-tools/dashboard-data.json`.

- [ ] **Step 8: If any step above failed, fix and recommit**

If a test surfaced a bug, fix it in `ClassAI-dashboard.html`, re-run the failing step until it passes, then:

```bash
git add local-tools/ClassAI-dashboard.html
git commit -m "Fix <short description of the bug>"
```

- [ ] **Step 9: Final summary commit (only if no fixes needed)**

If all steps passed cleanly, no commit needed for this task. Otherwise, the fix commit(s) from Step 8 are the final state.

---

## Self-Review Notes

Coverage check — every spec section maps to a task:

- File structure → Tasks 1, 2, 3, 4, 11
- Runtime behavior (fetch + render) → Tasks 5, 6, 7, 8
- `manifest.json` schema → Task 2
- `dashboard-data.json` schema → Task 3
- All five card types → Tasks 7 (four) and 8 (files)
- Visual design (color, layout, bento) → Tasks 4 and 7
- Responsive breakpoints → Task 9
- Print → Task 10
- Cowork update model + guardrails → Task 11
- Error handling (4 cases) → Tasks 5, 7, 12
- Privacy boundary → Task 11
- Testing approach → Task 12

No placeholders. All code shown. File paths exact. Card-type renderer names (`renderProgress`, `renderText`, `renderDates`, `renderChecklist`, `renderFiles`) match the dispatcher's `switch`.
