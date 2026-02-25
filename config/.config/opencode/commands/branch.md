---
description: Create smart branch name based on changes
model: ollama/supervisor
---

Create a new branch with a two-word name reflecting changes in relation to main/master:

1. Check current git branch and status
2. Identify the base branch (main or master)
3. Analyze changes compared to base branch:
   - Run `git diff main...HEAD` or `git diff master...HEAD` to see diff
   - Identify the main type of changes (e.g., feature, fix, refactor, update, add, remove)
   - Identify the main component/module affected (e.g., auth, ui, api, config, docs)
 4. Generate a branch name in format: <prefix>/<first-second>
    - The prefix MUST indicate the category of change
    - Type examples: feature, fix, bugfix, refactor, update, add, remove, improve
    - The part after "/" must be a two-word name (kebab-case)
    - Use format: feature/user-auth, fix/api-endpoint, bugfix/login-page, refactor/ui-theme, update-config
5. If on a non-default branch already:
   - Check if branch has uncommitted changes
   - If no uncommitted changes, rename the branch: `git branch -m <new-name>`
   - If there are uncommitted changes, create new branch: `git checkout -b <new-name>`
6. If on main/master, create new branch: `git checkout -b <new-name>`
7. Confirm the action taken and report the new branch name

$ARGUMENTS
