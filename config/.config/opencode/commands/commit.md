---
description: Auto-commit with generated message
---

Commit current changes to git. Follow these steps:

1. Run `git status` to see all untracked and modified files
2. Run `git diff HEAD` (staged and unstaged) to understand the changes
3. Check AGENTS.md for build/lint/test commands and run them if they exist. If any tests fail, report the failure and DO NOT commit.
4. If tests pass (or no tests configured), stage all changes with `git add .`
5. Analyze the changes and craft a concise commit message (1-2 sentences) following the repository's commit message style if documented in AGENTS.md
6. Create the commit with the generated message

$ARGUMENTS
