# OpenCode Configuration

Personal configuration repository for [OpenCode](https://opencode.ai) - an AI-powered coding assistant.

## Overview

This repository stores custom OpenCode settings and commands to maintain consistent behavior across development environments.

## Contents

- `config/.config/opencode/opencode.json` - Main OpenCode configuration including:
  - Theme settings
  - Auto-update preferences
  - Custom commands

## Custom Commands

### `init`
Creates or updates an `AGENTS.md` file in other repositories with:
- Build, lint, and test commands
- Code style guidelines
- Project structure information

### `commit`
Automatically commits changes with a generated message following the repository's commit message style.

### `verify-readme`
Verifies all README.md files are aligned with the current state of the codebase by checking factual claims against actual code.

### `branch-out`
Creates a new branch with a smart two-word name reflecting the type of changes made relative to main/master.

### `review`
Reviews code changes for bugs, structure issues, and best practices. Uses Ollama with the `glm4.7-flash-100k` model. See [REVIEW_SETUP.md](./REVIEW_SETUP.md) for configuration details.

## Usage

1. Clone this repository
2. Ensure OpenCode is installed
3. OpenCode will automatically pick up these settings

## See Also

- [AGENTS.md](./AGENTS.md) - Documentation for AI coding agents working in this repository
- [OpenCode Documentation](https://opencode.ai)