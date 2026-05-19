# Install the teacher-app-builder skill

The seven offline apps included in this project cover the common cases, but your classroom is unique. When you want an app that doesn't exist yet — a printable badge layout the existing one doesn't support, a sortable view of a specific report, a quick form that mail-merges into something you copy elsewhere — you can ask your AI to build it for you. Installing the **teacher-app-builder skill** turns that on.

The skill walks you through 4–5 short questions (or you can describe what you want in your own words), generates a single offline `.html` file, and runs an automatic privacy check before saving the result. **It refuses to ship tools that violate the project's privacy rules** — no outbound network calls, no browser storage of student data, no save-to-the-project-folder, single static file. If you accidentally ask for something unsafe ("save my gradebook to localStorage so I don't lose it"), it explains why it won't and proposes a compliant alternative.

The new app lands in `local-tools/<name>/app.html` and is automatically registered with the Dashboard's sidebar.

## Where to get the installer

The zip is in the root of this project: **`teacher-app-builder-skill-upload.zip`** (next to `README.md`).

## Install in Claude Cowork

1. Open Cowork's skill upload screen (Settings → Skills → Upload).
2. Drag in `teacher-app-builder-skill-upload.zip` from this folder.
3. Confirm. The skill is now available in every Cowork session.

## Install in Claude Code (terminal users)

1. Unzip the file into `~/.claude/skills/teacher-app-builder/` so that `SKILL.md` sits at the root of that folder.
   ```bash
   mkdir -p ~/.claude/skills/teacher-app-builder
   unzip teacher-app-builder-skill-upload.zip -d ~/.claude/skills/teacher-app-builder
   ```
2. Start (or restart) a Claude Code session in this project folder. The skill is now available.

## How to use it

Once installed, just ask your AI in plain language:

> "Build me a new tool that takes my roster and prints a seating-chart card for every kid."

The skill takes over from there. When it's done, your new tool is in `local-tools/seating-chart-cards/app.html` and shows up on the Dashboard.
