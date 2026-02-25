---
description: Auto-commit with generated message
model: ollama/janitor
---

Commit current changes to git. Follow these steps:

1. Run `git status` to see all untracked and modified files
2. Run `git diff HEAD` (staged and unstaged) to understand the changes
3. Check AGENTS.md for build/lint/test commands and run them if they exist. If any tests fail, report the failure and DO NOT commit.
4. Ensure branch is on top of main:
   - Check current branch name with `git branch --show-current`
   - If not on main, check if we need to rebase: `git fetch main && git log main..HEAD`
   - If there are commits on the branch that are not on main, rebase with main: `git rebase main`
   - This ensures branch commits are on top of main HEAD
5. If tests pass (or no tests configured), stage all changes with `git add .`
6. Analyze the changes and craft a concise commit message (1-2 sentences) following the repository's commit message style if documented in AGENTS.md
7. Create the commit with the generated message

$ARGUMENTS
