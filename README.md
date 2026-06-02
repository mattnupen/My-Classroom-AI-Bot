# MyClassroomAIbot

**Can a semi-autonomous classroom AI bot help a class make progress towards a goal?**

[ Demo video — placeholder URL: [DEMO_VIDEO_URL] ]

## The experiment

That's the question this project exists to explore. Not "can AI do classroom tasks" — it's "can an AI, given some real autonomy, move the needle on something a teacher actually cares about."

To make the question answerable, the AI runs under four constraints:

1. **A personality.** Your students help name and shape the AI's voice. It's *your class's* AI, with a stake in your class's success.

2. **A clear goal.** The AI is given one mission for the unit, quarter, or semester. Everything it does ladders up to that goal, and "progress towards the goal" is what success looks like.

3. **Evidence-based teaching practices.** The AI's defaults come from research, not vibes. When it makes a choice — what to put on a slide, how to phrase an encouragement note — it can tell you which practice it's drawing on.

4. **Aggregated data only.** The AI never sees individual student records. Only summaries, tier counts, and aggregate movement. PII stays in offline tools that run on the teacher's laptop.

The AI proposes, the teacher decides, the class moves (or doesn't), the aggregates come back, the AI adjusts. That's the loop.

The shape of this project is borrowed from [Anthropic's Project Vend](https://www.anthropic.com/research/project-vend-1) — the experiment where Claude was given a small business to run, with real goals, real constraints, and real autonomy. The question here is the classroom version: what if something like that existed in a classroom? This is a scaled-back test of that idea.

## How it works

### The brain: Claude Cowork

The AI lives in Claude Cowork. Every conversation reads from a small set of instruction files in this folder — the AI's personality, its goal, the teaching practices it draws on, and the boundaries the teacher has set. The teacher updates those files through normal chat; the AI grows with the class across every session.

### How it personalizes

The teacher and the class build the AI's personality and style together during setup — the AI can produce the slides and voting forms you'll use to run that. From there, it adapts to what the class wants and needs: an "ASL sign of the week" drawn from your uploaded lessons, an end-of-unit celebration where it tells you what to pick up and prints the slides and posters for you.

### What the AI makes

Slides, posters, parent messages, encouragement notes, lesson openers. When the right tool doesn't exist, the AI builds one — a single offline HTML file the teacher double-clicks to open. None of these tools call the internet or store student data; the AI generates the code, the browser does the data work.

### How the AI hears from the class

Students send anonymous messages through something like a Google Form. The teacher removes any identifying info like names or emails, pastes the aggregate into Cowork, and the AI uses the messages to adjust what it proposes next.

### How the AI measures itself

The teacher drops their gradebook into an offline tool (included) that produces a paste-ready aggregate — tier counts, most-missed assignments, week-over-week movement, zero names. The AI reads the aggregate and checks whether its actions are moving the class toward the goal.

### Where the AI doesn't get to decide

The teacher sets boundaries during onboarding and adjusts them as the experiment runs: what the AI can ship without review, what always needs a human read first, and what's off-limits entirely.

## The offline apps

The project includes a set of small browser-based apps the teacher uses to do anything that touches student data. They run entirely offline — no network calls, no cloud, no AI in the loop. Your roster and gradebook never leave your laptop. **They're safe to use with real student data.**

You open them through the **AI Dashboard** (`local-tools/ClassAI-dashboard.html`) — double-click it once, and a sidebar lets you jump between apps.

Included today:

- **Dashboard.** Your home base. Shows your class goals, where the class is right now, and what your AI is focused on. Every other app is one click from here.

- **Student Cards.** Print one card per student — either what they owe right now (missing work, with checkboxes) or how they're doing overall (every assignment, color-coded). Two-per-page; cut them and hand them out at the door.

- **Parent Messages.** Write one short template per tier (struggling / steady / strong) and the app mail-merges it into per-student messages with each kid's name, period, grade, and missing assignments. You paste each one into ParentSquare, email, or whatever you use to reach families.

- **Gradebook Analytics.** Drop in your gradebook and get a sortable per-student view — tiers, missing assignments, and patterns you wouldn't spot scrolling rows in PowerSchool.

- **Class Pulse.** A name-free summary of how the whole class is doing — counts by tier, most-missed assignments, week-over-week movement. This is what you paste to your AI so it knows the state of the class without ever seeing student records.

- **Badges.** Make up your own badges (Most Improved, Best Question of the Week, whatever fits your class), pick students from the roster, and print bordered certificates two-per-page.

- **Random Groups.** Generate balanced groups of any size, with a do-not-pair list (for the kids you know shouldn't be together) and pair history so the same combinations don't keep coming up.

When you need something the included apps don't cover, the **teacher-app-builder skill** (installable in Claude Cowork) lets the AI generate a new offline app for you. It asks a few questions, builds the HTML, runs a privacy check, and registers the new app with the Dashboard sidebar automatically. Install instructions: [docs/teacher-app-builder.md](docs/teacher-app-builder.md).

## What's in this folder

```
MyClassroomAIbot/
├── README.md                          ← you are here
├── CLAUDE.md                          ← the first file your AI reads each session — sets the rules of the experiment
│
├── brain/                             ← the AI's character, principles, and rules — its name, voice, mission, and limits (the teacher edits these through normal chat)
│   ├── your-classroom-ai.md           ← the AI's name, voice, and current mission — the personality file
│   ├── teaching-principles.md         ← research-backed defaults the AI uses
│   ├── research-foundations.md        ← the research the AI cites when it explains its choices
│   ├── safety-rules.md                ← hard limits the AI follows
│   └── weekly-rhythm.md               ← how the day, week, and month flow
│
├── content-templates/                 ← student-facing materials for introducing the project and running the vote
│   ├── day-one-lesson-plan.md         ← 15-minute script for introducing the AI to your class
│   ├── lms-intro-page.md              ← LMS page text explaining the project to students
│   ├── student-voting-form.md         ← co-creation vote template (Google Form or paper)
│   └── classroom-display-rules.md     ← design rules + the AI's default visual theme (colors, fonts, text sizes) for anything visual
│
├── local-tools/                       ← the offline apps (see "The offline apps" section above)
│   ├── ClassAI-dashboard.html         ← home base — open this one, the sidebar gets you to every other app
│   ├── student-cards.html             ← drop in a gradebook, print per-student cards (missing work or full progress)
│   ├── parent-messages.html           ← per-tier templates, mail-merged into per-student messages to send home
│   ├── gradebook-analytics.html       ← drop in a gradebook, get a sortable per-student view with tier labels
│   ├── class-pulse.html               ← drop in a gradebook, get the aggregate-only summary you paste into your AI
│   ├── badges.html                    ← define badges, award them, print bordered certificates
│   ├── random-groups.html             ← balanced groups with a do-not-pair list and pair-history memory
│   └── _nav.js                        ← shared sidebar that links every app to every other app
│
├── setup/                             ← everything you need before launching with students
│   ├── getting-started.md             ← the end-to-end setup guide — start here after this README
│   ├── crisis-card.md                 ← fill in, print, keep on your desk (emergency contacts and procedures)
│   └── permissions/
│       ├── admin-pitch.md             ← one-page pitch for your principal
│       ├── parent-letter.md           ← template letter to send families
│       ├── privacy-explainer.md       ← long-form privacy explanation for admins and district privacy officers
│       └── checklist.md               ← pre-launch checklist
│
├── sandbox/
│   ├── fictional-gradebook.csv         ← 24 fake students, simple format (for trying things out)
│   └── fictional-gradebook-canvas.csv  ← 29 fake students, real Canvas LMS export format (emoji headers, points-possible row, "Last, First" names)
│
├── docs/
│   └── teacher-app-builder.md         ← install instructions for the build-your-own-app skill
│
└── teacher-app-builder-skill-upload.zip  ← installer for the build-your-own-app skill (see "The offline apps" section)
```

## Try it without your students

Before launching with real kids, try this with the included fictional gradebook. Three on-ramps depending on how much time you have:

**Just the apps, quickest path (2 minutes)**
Double-click `local-tools/ClassAI-dashboard.html`. Click "Student Cards" in the sidebar. Drop in `sandbox/fictional-gradebook.csv`. Print a card. That's the whole flow.

**A full dry run of the apps (~15 minutes)**
From the Dashboard, walk through Student Cards → Class Pulse → Parent Messages → Badges with the fictional gradebook. See what each one produces side by side.

**The full experiment, end to end (~30 minutes)**
Open this folder in Claude Cowork and say hi. Run Class Pulse, paste the aggregate into Cowork, and ask the AI for "Monday's opening slide." That's the loop from Section 2 running on a fictional class.

The full setup walkthrough — admin permission, parent letter, day one with real students — is in [setup/getting-started.md](setup/getting-started.md).

## Next steps

Coming soon.
