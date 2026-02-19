# AGENTS.md

This is a configuration repository for [OpenCode](https://opencode.ai) containing personal settings and custom commands.

## Repository Type
Configuration-only repository (dotfiles-style)

## Build/Lint/Test Commands

**N/A** - This repository contains only JSON configuration files and has no build system, tests, or linting setup.

## Project Structure

```
/home/kpeek/opencode.config/
├── README.md                          # Empty placeholder
├── config/.config/opencode/opencode.json  # Main OpenCode configuration
└── .git/                              # Git repository
```

## Configuration Details

### opencode.json
- **Theme**: `opencode`
- **Auto-update**: Enabled (`autoupdate: true`)
- **Custom Commands**:
  - `init`: Creates/updates AGENTS.md files in other repositories

## Code Style Guidelines

Since this is a configuration repository:

### JSON Files
- Use 2-space indentation
- Include trailing commas where supported
- Keep JSON valid (no comments in .json files)

### General
- Configuration changes should be minimal and intentional
- Test new configurations before committing
- Document custom commands in the description field

## Working with This Repository

This repository is used to:
1. Store personal OpenCode settings
2. Define custom commands for use in other projects
3. Maintain consistent OpenCode behavior across sessions

When modifying `opencode.json`:
- Follow the [OpenCode configuration schema](https://opencode.ai/config.json)
- Test commands with the `opencode` CLI before committing
- Keep sensitive information (API keys, tokens) out of this repository
