# General Coding Guidelines

## Documentation
- Keep documentation in sync with the code: if you change behavior, update the relevant docs (README, inline docs) in the same change.
- DRY applies to documentation too: never duplicate information that already lives in another source. E.g. when a Makefile provides help strings via `make help`, do not copy that text into README.md — link to it instead. Duplication costs attention later: one copy will drift.

## Style
- Follow the conventions already present in the file or project (naming, formatting, idioms); do not introduce a new style mid-file.
- Prefer editing existing files over creating new ones; never create documentation or helper files unless asked.
- Keep diffs minimal — change only what the task requires.
- Prefer libraries/utilities already used in the project over adding new dependencies.

## Correctness
- Read and understand surrounding code before editing.
- After changes, run the project's lint and tests when available and fix what you broke.
