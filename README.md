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

### `branch-out`
Creates a new branch with a smart two-word name reflecting the type of changes made relative to main/master.

### `review`
Reviews code changes for bugs, structure issues, and best practices. Uses Ollama with the `glm4.7-flash-100k` model.

## Usage

Clone this repository somewhere (not in your home directory), then use GNU Stow to deploy the configuration:

```bash
# Clone the repository
git clone git@nas.hjkl.am:kpeek/opencode.config.git ~/opencode.config
cd ~/opencode.config

# Install using stow
make install

# Uninstall if needed
make uninstall
```

## See Also

- [AGENTS.md](./AGENTS.md) - Documentation for AI coding agents working in this repository
- [OpenCode Documentation](https://opencode.ai)