# Getting Started

If you've just downloaded this project, start here. This walks you through everything you need to do before your first day with students.

You don't have to do it all in one sitting — most teachers do it across 2–3 sessions over a week or two.

---

## Before you launch — the short version

1. **Make sure this fits your situation.** (5 minutes)
2. **Get permission from your admin.** (15 minutes — `setup/permissions/admin-pitch.md`)
3. **Notify families.** (10 minutes — `setup/permissions/parent-letter.md`)
4. **Set up your crisis card.** (10 minutes — `setup/crisis-card.md`)
5. **Install Claude Cowork on your computer.** (15 minutes — see Cowork's docs)
6. **Open this folder in Cowork and let your AI walk you through the persona setup.** (10–15 minutes)
7. **Do a dry run with the fictional class** in `sandbox/`. (30 minutes — try every tool)
8. **Plan how (and whether) you'll involve students in shaping the AI.** (10 minutes)
9. **Launch with your real class.**

Each section below explains a step in more detail.

---

## 1. Make sure this fits your situation

Before you commit any time, check the basics:

- **You teach at least one class regularly.** This works best in a class you see daily or every other day for at least a unit (~6 weeks).
- **Your school allows AI tools.** Some districts have policies banning AI in instruction. Check before you go further. If unsure, ask your tech coordinator.
- **You have a gradebook you can export.** Any system that lets you export a `.csv` or `.xlsx` (PowerSchool, Infinite Campus, Skyward, Canvas, Synergy, etc.) works.
- **You have a Mac or Windows computer.** Cowork is desktop-only for now — it doesn't run on Chromebooks.
- **You can spend 15–30 minutes a day on this for the duration of your experiment.** Some days less, Sundays more.
- **You're okay with this being an experiment.** Your students will know they're part of something new. That's actually a feature — but be ready for things to need adjustment.

If any of those is a no, this might not be the right project for you right now. That's totally fine.

---

## 2. Get permission from your admin

This is the biggest barrier for most teachers. Don't skip it.

Open `setup/permissions/admin-pitch.md` — it's a one-page summary you can email to your principal or print and hand them. It explains what the project is, how student data is handled, what kids will and won't experience, and what you're asking permission for.

If your admin says yes — great, move on.

If they want more detail, hand them `setup/permissions/privacy-explainer.md`. That's the longer version that covers FERPA, district vendor agreements, and exactly how this project keeps student data out of the AI.

If they say no — respect that. Some districts have legitimate concerns about AI in classrooms. You can try again next year, or with a stripped-down version (just the local tools, no Claude integration).

---

## 3. Notify families

Some districts require active consent for any AI involvement; others only require notification. Check with your admin.

Either way, `setup/permissions/parent-letter.md` is a template you can adapt. It explains what's happening, what the AI does and doesn't do, what kids will see, and how families can opt out. Keep it brief, send it home in the first week.

If parents have questions, route them to you — not to the AI.

---

## 4. Set up your crisis card

This is the most important file in the whole project. Open `setup/crisis-card.md` and fill it in.

It's a one-page document with:
- Your school counselor's name and contact
- Your admin's name and contact
- Crisis hotline numbers (988, local mental health)
- Your district's mandated reporter protocol

You keep this card on your desk, in your bag, somewhere visible. **You do not paste it into Cowork.** The AI does not need to know any of this — the rule is that anything the AI flags as crisis-related becomes your problem to act on, and this card is what you act with.

---

## 5. Install Claude Cowork

Follow the install instructions at [Cowork's site]. Confirm you can open the app and that it can see folders on your computer.

Test that Cowork works:
- Open Cowork in this `MyClassroomAIbot/` folder
- Say "hi"
- Your AI should read its instructions and respond

If you get errors, that's a Cowork issue, not a project issue — check their support docs first.

---

## 6. Set up your AI's persona

Open Cowork in this folder. Say hi. Your AI will notice that the persona file (`ai-instructions/your-classroom-ai.md`) is mostly blank and offer to walk you through filling it in.

The very first question it asks is whether you want your students to help shape the AI, or whether you want to decide solo.

**You don't have to decide right then.** If you want to think about it, say so — your AI will help you with something else first and come back to this later.

---

## 7. Do a dry run with the fictional class

The `sandbox/` folder has a fictional gradebook (`fictional-gradebook.csv`) with 24 fake students. Use it to try every tool before touching real data.

- Open `local-tools/ClassAI-dashboard.html`. This is your home base — the sidebar gets you to every other app from one place.
- From the sidebar, open **Student Cards**. Drop in the fictional gradebook. Print sample cards.
- Open **Class Pulse**. Generate a summary. Save a snapshot.
- Open **Gradebook Analytics**. Drop in the same gradebook. Sort by tier and skim the per-student view.
- Open **Parent Messages**. Load the sample templates. Generate messages.
- Open **Badges**. Start a new state file. Award some badges. Print certificates.
- Open **Random Groups**. Generate groups with the state file.

After the dry run, you should have a real feel for what the project does — and you'll catch any tool that doesn't fit your style before students are involved.

You'll also have a `class-state.json` file from the badges/groups session. **Move it out of the project folder** to your Documents or Drive, where you'll keep it for your real class.

---

## 8. Plan student involvement

If you chose to have students help shape the AI (Option A in `ai-instructions/your-classroom-ai.md`), now's the time to plan the session.

Typically:
- **Week 0 or Week 1:** explain the project to students (a 10-minute mini-lesson)
- **Same day:** open a vote (Google Form or anonymous slips) for the AI's name and one or two personality traits
- **Within a few days:** narrow the top finalists, then a runoff vote
- **Same week:** you fill in `your-classroom-ai.md` with what they chose
- **Next session in Cowork:** your AI introduces itself in its new voice

A template for the student voting form is on the way (`setup/student-voting-form.md`).

---

## 9. Launch

You're ready. On launch day:

- Tell students what they're going to see ("you'll get cards from [AI name] this week — they're not graded, they're a tool to help you stay on top of things")
- Hand out the first round of missing-work cards or progress sheets
- Run the first few days as gently as possible — watch for confusion or pushback
- After Week 1, sit down with the AI and ask "how did the first week go?" using whatever you noticed plus a Class Pulse summary

If something breaks early, that's normal. Adjust the relevant file in `ai-instructions/` and try again. Most teachers find the rhythm in 2–3 weeks.

---

## When you're stuck

- **Tool not working?** Check that you have internet (the tools download a small library on first use). Try a different browser.
- **AI sounds off?** Read `ai-instructions/your-classroom-ai.md` again and tighten the voice description.
- **Workflow feels heavy?** Read `ai-instructions/weekly-rhythm.md`'s "skip everything minimum" section.
- **Something more serious?** Take a week off. The project will be here when you come back.
