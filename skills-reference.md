# OpenCode Skills Reference

## Overview

OpenCode supports skills as a way to extend functionality through external or user-defined capabilities. Skills are loaded automatically from configured directories and can be used as tools within sessions.

## Skill Directory Structure

### Standard Locations

Skills are automatically discovered from these locations (in order):

1. Global directories: `~/.claude/skills/` and `~/.agents/skills/`
2. Project-level: `.opencode/skill/` in the project directory
3. Additional configured paths listed in `skills.paths` in config
4. Remote URLs listed in `skills.urls` in config

### Skill Structure

A skill consists of:

```
skill-name/
├── SKILL.md          # Required - skill definition with frontmatter
└── references/       # Optional - supporting documentation
    └── ...
```

## SKILL.md Format

### Frontmatter

```markdown
---
name: skill-name
description: Short description of the skill
references:
  - reference1
  - reference2
---
```

### Content

The markdown content provides detailed skill information, capabilities, and usage examples.

## Integration

Skills integrate with the tool system via `SkillTool`. They can be invoked as tools in sessions and respect permission rules.

## Configuration

Skills can be configured through the OpenCode config file with:

```json
{
  "skills": {
    "paths": ["/path/to/custom/skills"],
    "urls": ["https://example.com/.well-known/skills/"]
  }
}
```

## Usage

Skills are automatically discovered and can be used through the skill tool command when reviewing code or performing tasks.
