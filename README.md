# Accessibility Audit Checklist

A checklist app for running WCAG 2.2 A/AA audits on web pages, PDFs and documents. Each check can be marked Not Tested, Pass, Fail or N/A, and ticked off when done. Audits are grouped into four phases (Automated, ANDI & DOM, Keyboard, Screen Reader) and saved in the browser.

React + TypeScript + Vite + Tailwind CSS v4. Audits are saved to `localStorage` (key `a11y-checklist:v1`).

## Run

Requires Node.js. On macOS with Homebrew: `brew install node`.

```sh
npm install
npm run dev
```

Then open http://localhost:5173.

## Editing the checklist

The source of truth is `checklist-source/checklist.json`. After editing it, regenerate the markdown the app reads:

```sh
python3 scripts/json_to_md.py
```

This writes `src/checklist.md` and reports WCAG 2.2 A/AA coverage (any missing success criteria).

- Phases come from `passName`, in file order; tools come from `metadata.tools.passN`.
- Results are stored by each item's `id` (e.g. `p3-2.1.1`), so keep ids stable or saved results for that row will reset.
- Web page audits show `webCheck`, PDF audits show `pdfCheck`, Document audits show both.
- In PDF audits, items whose `pdfCheck` starts with "N/A" default to N/A (you can still change them).

## How this was built

### 1. Prototyping the layout in v0 (Vercel)

I wrote the app spec as a Markdown prompt in [MarkEdit](https://markedit.app) (shown below under "The spec prompt"). Before building anything for real, I pasted that prompt into [v0](https://v0.dev) by Vercel to get a quick preview of what the app might look like.

I then gave the same prompt to Claude Code. The v0 code wasn't copied into this repo; Claude Code built the app from the prompt.

### 2. Building it with Claude Code

**The spec prompt.** I gave Claude Code this prompt:

> Build a web accessibility checklist app in React with the following requirements:
>
> **Features**
> - Ability to mark each success criteria as checked
> - Use a .md file for the checklist structure provided by my JSON object I'll give you
> - LocalStorage persistence so I can create and view checklists for different audits/pages/PDFs with page/document title and date included
> - Checklist should be grouped into 4 phases: automated checks, andi and DOM checks, keyboard checks, and screen reader checks
> - N/A should grey out the row or check criteria indicating it doesn't apply to the page or document
>
> **Technical**
> - React + TypeScript (scaffolded with Vite), using modern functional components and React hooks (useState, useEffect, useMemo).
> - Tailwind CSS for styling
> - Responsive design
>
> **UI**
> - Clean, minimal interface similar to Todoist
> - Checklist should be centered for clean presentation
> - Each check should have 4 boxes (Not Tested, Pass, Fail or N/A)
> - Use checkboxes for completion
> - Inter font preferred but not required

Claude Code built the first version against a placeholder checklist, since the JSON hadn't been shared yet.

**Giving it the JSON.** I then pasted my checklist JSON in several chunks. It has a `metadata` block (standard, Section 508 baseline, tools per pass, viewport specs) and a `checklist` array where each item has an `id`, `pass`/`passName`, `sc`, `title`, `level`, `section508`, `andiModule`, separate `webCheck` and `pdfCheck` steps, and `hints`.

Claude Code:
- reassembled the chunks into `checklist-source/checklist.json`. One chunk was cut off partway through `p2-1.4.5`; that entry was closed with empty `hints`.
- wrote `scripts/json_to_md.py` to turn the JSON into the `.md` file the spec asked for, with a check against all 55 WCAG 2.2 A/AA success criteria. Result: 63 checks covering all 55.
- updated the app to show web or PDF steps depending on the audit type, show Level / 508 / ANDI tags and hints, and default PDF-only "N/A" checks to N/A.

**Running it.** Node wasn't installed at first, so Claude Code wrote the Vite project files by hand. After `brew install node`, it ran `npm install`, did a full type-check and build, and started the dev server.

**Follow-up prompts.**
- *"Remove the N/A button since it's redundant with Not Tested."* Claude Code pointed out that N/A greys out the row, is excluded from progress, and is pre-set for PDF checks, while Not Tested means "still to do". I chose to keep N/A.
- *"Make a dark mode inspired by the style used on brittanychiang.com (the color palette, not the fonts)."* Claude Code added a dark theme in that palette: slate-navy background, slate text, teal accents, teal pill tags and a cursor-following glow. It follows the system setting, has a toggle in the sidebar, and keeps text contrast at WCAG AA.
- *"Add a README explaining how I prototyped this."* This section.
