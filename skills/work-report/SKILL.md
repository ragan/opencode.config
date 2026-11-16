---
name: work-report
description: "Report what this session accomplished: distills the conversation + git into docs/sessions/YYYY-MM-DD-<topic>.md (context, what was done, key decisions, open questions, next steps). Hard cap ~80 lines. Distillate, NOT transcript."
disable-model-invocation: true
argument-hint: "[topic-one-liner] [--noninteractive] [--dry-run]"
---

# /work-report

## What it does

At the end of a working session, writes a short distilled summary to
`docs/sessions/YYYY-MM-DD-<topic>.md`. It serves two readers at once:
you (a report of what got done) and the next agent — yours tomorrow, or
a different agent in a month — who picks up the thread without
re-discovering everything cold.

This is **not a transcript dump**. Raw chat is noise no reader can
usefully consume. A session report is the *distillate*: 30–80 lines
that compress a multi-hour conversation into actionable continuity.

## Workflow

1. **Find target dir.** Default `docs/sessions/` from the current repo
   root (via `git rev-parse --show-toplevel`). If it doesn't exist, ask
   "create it now?" — if yes, create it.

2. **Get topic.** If the arguments have a positional, use it. Otherwise
   ask: "what was this session about, in one line?" Convert to
   kebab-case for the filename: `2026-05-24-pivot-cleanup.md`.

3. **Compute filename.** `YYYY-MM-DD-<kebab-topic>.md`. If a file with
   the same name exists (multiple sessions on the same topic same day),
   suffix with `-2`, `-3`, etc.

4. **Gather facts** from git and the conversation:
   - Current branch: `git rev-parse --abbrev-ref HEAD`.
   - Recent commits this session: `git log --oneline -10`. Use the
     first commit hash *after* the previous session's HEAD if you
     can infer it, otherwise show the last 5–10 with the human
     confirming which ones belong.
   - Uncommitted work: `git status` / `git diff --stat`.
   - Conversation summary: distill from the actual chat above (you,
     the model, have access). Categorize into:
     - **What was done** — concrete actions: code shipped, decisions
       recorded, files moved. Bullet list.
     - **Key decisions** — non-obvious calls made in conversation.
     - **Open questions** — anything deferred or unresolved.
     - **Next steps** — what should happen first in the next session.

5. **Generate the file** using the template below. Use `<TODO>` for
   anything you genuinely can't infer; better an honest gap than a
   fabrication.

6. **Confidentiality pass.** The report may end up committed and
   pushed — sometimes to a public repo. Before writing, scrub anything
   that shouldn't ship: secrets, credentials, client names, internal
   business reasoning, security details. Keep the *decision*, drop the
   sensitive specific ("chose vendor X for pricing reasons" → "chose
   the payments vendor; rationale in the private tracker").

7. **Hard cap on length.** If your draft is over 80 lines, reduce. Cut
   the "what was done" bullets to the load-bearing 5–8. Move tactical
   detail into commit messages or specs. The report is *pointers +
   decisions + next-actions*, not a play-by-play.

8. **Do not commit.** Write the file and print its path. Committing is
   the user's call.

## Template

```markdown
# Session: <topic one-liner>

- **Date:** YYYY-MM-DD
- **Branch:** <branch>
- **Participants:** <user> + <model name>
- **Commits:** <hash range, or "none — uncommitted work only">

## Context

<1–3 sentences: what this session set out to do, and why.>

## What was done

- <concrete action, load-bearing only>
- ...

## Key decisions

- <decision> — <why> <(link to spec/ADR by path or hash, don't copy)>
- ...

## Open questions

- <question or "None">

## Next steps

1. <first thing the next session should do>
2. ...

## References

- <specs, ADRs, issues, PRs — by path/hash, never pasted in full>
```

## Hard rules

- **Write for a public reader.** Never put secrets, credentials, client
  names, internal business reasoning, or security details in a report —
  even if the repo is private today.
- **Distillate, not transcript.** If the user asks "include the full
  conversation," push back. The journal is for future consumption, not
  playback.
- **No fabrication.** If you don't know what "was done" because the
  conversation was mostly planning, write that explicitly:
  *"Session was planning-only — no code shipped. Plan landed in
  `docs/specs/<file>`."*
- **Link, don't duplicate.** Specs, commits, issues get linked by
  number/hash — never copied into the report body.
- **Pre-existing reports are immutable.** If you're amending, write a
  new dated file (`-2`, `-3` suffix) rather than editing.

## Tunables

- `--noninteractive` — skip prompts; requires a topic positional.
  Pulls everything else from git + the visible conversation context.
- `--dry-run` — print the generated content to stdout, write nothing.

## When to invoke

- **End of a substantial working session.** Substantial = anything
  that shipped a commit chain or made a load-bearing decision.
- **NOT after a quick one-shot fix.** A 5-minute typo fix doesn't
  need a report entry; the commit message is enough.
- **NOT after a pure-exploration session.** If you didn't decide
  anything and didn't ship anything, there's no continuity to
  preserve.

A useful rule of thumb: would a reader benefit from knowing where this
session left off? If yes, write the report. If no, skip.

## What this skill does NOT do

- **Doesn't read the future.** The "next steps" section is what *you*
  think should happen, distilled from the conversation. The model
  doesn't predict.
- **Doesn't replace commit messages or specs.** Each layer serves a
  different purpose:
  - Commit message: per-commit *what*.
  - Spec: per-feature *plan* (lives through implementation).
  - Session report: per-working-period *narrative* (continuity).

---

Local fork of [filip-podstavec/claude-leverage `session-log`](https://github.com/filip-podstavec/claude-leverage/blob/main/skills/session-log/SKILL.md). Differences from upstream: renamed, manual-invoked only; dropped plugin-specific machinery (allowed-tools allowlist, docs/sessions/README.md stub, /adr-new and AIDEV-TODO pairing, pre-commit hook references); template inlined instead of referencing an external file; added git status/diff for uncommitted work; explicit do-not-commit rule (upstream assumes logs get committed).
