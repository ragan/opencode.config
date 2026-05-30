# OpenCode Configuration

Personal configuration repository for [OpenCode](https://opencode.ai) - an AI-powered coding assistant.

## Overview

This repository stores custom OpenCode settings and commands to maintain consistent behavior across development environments.

## Custom Commands

- [init](./config/.config/opencode/commands/init.md)
- [commit](./config/.config/opencode/commands/commit.md)
- [branch-out](./config/.config/opencode/commands/branch.md)
- [review](./config/.config/opencode/commands/review.md)

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
- [awesome-copilot](https://github.com/github/awesome-copilot) - Source of agent skills used in this configuration
- [claude-code-owasp](https://github.com/agamm/claude-code-owasp) - OWASP security skills for AI coding agents
- [awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) - Agent skills collection for AI coding assistants
- [agent-skills](https://github.com/CommandCodeAI/agent-skills) - Agent skills for AI coding assistants