# General Coding Guidelines

## Documentation
- Keep documentation in sync with the code: if you change behavior, update the relevant docs (README, inline docs) in the same change.
- DRY applies to documentation too: never duplicate information that already lives in another source. E.g. when a Makefile provides help strings via `make help`, do not copy that text into README.md — link to it instead. Duplication costs attention later: one copy will drift.

## Style
- KISS: simple over clever, always. When two solutions work, pick the one a newcomer can read in one pass.
- Follow the conventions already present in the file or project (naming, formatting, idioms); do not introduce a new style mid-file.
- Prefer editing existing files over creating new ones; never create documentation or helper files unless asked.
- Keep diffs minimal — change only what the task requires.
- Prefer libraries/utilities already used in the project over adding new dependencies.

## Communication
- Prefer tl;dr responses: give the shortest answer that is still correct; the user will ask if they need more detail.
- **Simple language is a standing preference** (asked twice: 2026-10-08): plain words, short sentences, concrete examples, everyday vocabulary. Lead with the short version ("what happened / what it means / what you need to do"), then bullets, then details only if they earn their place.
- Technical depth is welcome — the user is strong technically and asks sharp follow-ups — but present it **precisely with honest caveats**, not as a wall of jargon. "One gotcha" beats a three-paragraph mechanism essay; put the deep dive in a file (config comment, vault note) or when asked.
- **Bold the action items** — the restart needed, the command to run, the decision pending. The user should be able to act without re-reading the response.
- Avoid dumping large code blocks or source excerpts into chat; summarize the behavior and cite the file/line.

## Correctness
- Read and understand surrounding code before editing.
- After changes, run the project's lint and tests when available and fix what you broke.

## Memory (Hindsight + Vault)
- Recall before assuming: when a question touches past decisions, user preferences, or the homelab setup, run `hindsight_recall` first instead of guessing or re-asking.
- Retain proactively: use `hindsight_retain` for user preferences, decisions, and environment specifics that have no other canonical home (not derivable from code or docs). Be specific — who, what, when, why.
- Keep the vault current: `~/.vault/` is the durable home for homelab architecture, service notes, and project documentation. When durable state changes (a service deployed/changed, a diagram redrawn, a decision documented), update the matching vault note in the same change. This is the exception to the "no new docs unless asked" rule above.

## Context Compaction

Retaining must be done before compacting: OpenCode has no explicit pre-compaction hook, so use these patterns to avoid losing state across compactions.

### Pattern 1: Auto-compaction instructions

OpenCode passes system-level instructions to the LLM during the context summarization phase. Instruct it to explicitly preserve specific details or structure (e.g., architectural decisions, active variables, or key lessons) whenever auto-compaction triggers.

Add a custom instruction rule in your project's `AGENTS.md` or `.opencode/instructions.md` file:

```markdown
## Context Compaction Guidelines
When auto-compacting or summarizing this session context:
1. Always retain key architectural choices, active terminal state, and uncommitted task lists.
2. Maintain an explicit "Hindsight Log" section recording key decisions made during the session.
3. Preserve key code snippets or file paths under active discussion.

```

### Pattern 2: Manual `/compact` with pre-execution command

If you want an explicit command to run and save state before summarizing, trigger the compaction manually using a custom slash command or alias.

1. **Run your state-retention command** (e.g., dump current decisions, state, or git diff to a file/memory store):
```bash
./scripts/save-hindsight.sh

```

2. **Execute compaction:**
```text
/compact

```
