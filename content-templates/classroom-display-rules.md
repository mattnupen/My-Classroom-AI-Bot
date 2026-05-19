# Classroom Display Rules

These are the design rules your AI follows whenever it generates anything students will see — slides, posters, printed cards, signs on the wall, certificates. They exist because kids in the back of the room shouldn't have to squint, color-blind students shouldn't be locked out, and overloaded slides shouldn't drown the message.

Your AI reads this file. You can edit it. The defaults below come from accessibility standards (WCAG AA) and from what actually works in real classrooms.

---

## Slides (projected to the whole class)

### Text size

- **Body text:** 28-point minimum. 32+ is better.
- **Headers:** 40-point minimum.
- **Footers / metadata:** 18-point minimum.

If anyone in the back row would have to squint, the font is too small. Most slides in most classrooms have text that's far too small. The fix is usually to put less text on the slide, not to fight for a smaller font.

### How much text per slide

- **Maximum 8 lines** per slide.
- **Maximum ~50 words** per slide.
- **One main idea per slide.** If you have two ideas, that's two slides.

If the AI generates a slide with more than this, it's wrong. Reject it and ask for a tighter version.

### Color and contrast

- **Background:** plain. White, off-white, or a very pale neutral. Never a busy texture, photo, or pattern behind text.
- **Body text:** dark on light (default: near-black on white) OR light on dark (default: white on deep navy or charcoal). Never light text on a light background. Never tiny dark text on a very saturated background.
- **Contrast ratio:** WCAG AA minimum (4.5:1 for body text, 3:1 for large text). The AI's defaults already meet this.
- **Color-coding:** if used, always pair color with another signal (icon, label, position) — never use color alone to convey meaning. Around 8% of boys and ~0.5% of girls have some form of color blindness.
- **Red/green together:** avoid. The two most common forms of color blindness make these hard to distinguish.

### Visual hierarchy

- **One thing is biggest.** The most important thing on the slide is the biggest thing. If everything is the same size, the slide is failing.
- **White space is information.** Generous margins and line spacing aren't wasted space — they direct attention.
- **No center-aligned long text.** Left-align body content. Center alignment is for short headers only.

### Animations and transitions

- **None by default.** Animation should never carry meaning a student could miss by blinking. If used at all, only for revealing one bullet at a time on lists — and only if the lesson actually benefits.
- **No spinning, flashing, bouncing.** Triggers for some students. Distracting for everyone.

### Decorative elements

- **Sparingly.** A single decorative element on a slide (a small icon, a thin accent line, an emoji used once) is fine. A slide cluttered with stickers, doodads, and "fun" graphics is not.
- **Emoji:** use as a small accent or visual anchor, not as the main content. Never use emoji to convey something important (e.g., a flame emoji is not a replacement for the word "hot").

---

## Printed materials (cards, certificates, handouts)

### Text size

- **Body text:** 11-point minimum. 12 is the better default. Larger if the audience needs it.
- **Headers:** 16-point minimum.
- **Signatures and footer notes:** 9-point minimum.

### Paper layout

- **Margins:** at least 0.5 inch on all sides.
- **Line spacing:** 1.15 to 1.4 for body text. Never 1.0 (squished) or 2.0+ (looks like a draft).
- **Cards meant to be cut:** include clear cut lines or visible margins between cards.

### Color

- **Most printed material is black on white.** Save color for certificates, badges, or visual milestones — places where the color is part of the moment.
- **Never print critical content in light color on white.** Pale gray text might look elegant on screen but disappears on a printed page, especially after photocopying.

### Readability for students with reading challenges

- **Avoid serif fonts for dense text.** Sans-serif (e.g., Helvetica, Arial, Inter) is generally easier for students with dyslexia. Reserve serifs for ceremonial pieces like certificate names.
- **Avoid italic for body text.** Italics slow reading. Use for emphasis only.
- **Avoid all-caps blocks.** Capital letters lose word-shape cues and become harder to scan.

---

## Posters (wall display, visible all year)

### Text size

- **Anything important visible from across the room.** That's roughly 60-point minimum for the main message on a standard 17×11 poster, larger for bigger formats.
- **Body text:** 24-point minimum if there's any narrative.

### Content density

- **One message per poster.** Posters compete with everything else on your walls. A poster that's trying to say five things ends up saying zero.
- **No fine-print disclaimers.** If a poster needs a fine-print explanation, the poster's wrong.

### Lifespan

- **Date the back of every poster** the AI helps generate, so you know what's current and what's been on the wall too long.
- **Take them down when they're no longer relevant.** A stale celebration poster (last quarter's perfect-week winners) becomes a quiet message that nobody's tracking anymore.

---

## Specific never-do rules

- **Never put a list of struggling students on a slide, poster, or any class-wide display.** Ever. (See `ai-instructions/safety-rules.md`.)
- **Never put a student's exact words in a class-wide display.** Synthesize themes, never quote.
- **Never use comparative language** between students or sections in any visible artifact. ("Period 2 is ahead of Period 4" → no.)
- **Never use shaming visuals.** Frowning faces, "WARNING" badges, red flashing graphics next to a student's name — not in any form.
- **Never assume every student can see a slide.** Some students have low vision or are temporarily seated where they can't see well. Read aloud anything critical.

---

## How the AI uses these

When the teacher asks the AI to generate slides, posters, or printed materials, the AI silently checks the draft against these rules. If the draft violates them — text too dense, contrast too low, names listed where they shouldn't be — the AI rewrites or pushes back.

If the teacher specifically asks for something that breaks the rules ("can you make the font smaller so it all fits?"), the AI offers an alternative ("we could split this into two slides instead — that'll keep the size up").

The rules are how the AI thinks about visual content. The teacher doesn't have to read this file weekly; the AI does the work of following it.
