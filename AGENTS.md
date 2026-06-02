# AGENTS.md

## Repository Type

OpenCode configuration repository. Contains opencode settings, custom slash commands, and theme configuration. No application code, build steps, or tests.

## Project Structure

```
opencode.json                          # Main opencode configuration (providers, models, tools, permissions)
opencode.json.tui-migration.bak       # Backup of pre-TUI migration config
tui.json                               # TUI theme configuration
package.json                           # Only dependency: @opencode-ai/plugin
commands/
  review.md                            # /review - code review command
  commit.md                            # /commit - auto-commit command
  branch.md                            # /branch - smart branch naming command
  init.md                              # /init - AGENTS.md generator command
  lookaround.md                        # /lookaround - project context reader command
```

## Configuration Conventions

- **opencode.json** uses the `$schema: "https://opencode.ai/config.json"` schema
- Provider models are nested under `provider.<provider-name>.models`
- Environment variables use `${VAR_NAME}` syntax (e.g., `${OPENCODE_OLLAMA_URI}`)
- Timeout settings are in milliseconds (`timeout`, `chunkTimeout`)
- Modalities use `input`/`output` arrays with `"text"` and `"image"` values

## Commands

Commands are Markdown files in `commands/` with YAML frontmatter:

```markdown
---
description: Short description of what the command does
model: ollama/janitor          # optional: override model
---

Command instructions here...
$ARGUMENTS
```

- `$ARGUMENTS` placeholder receives user input after the command name
- `description` is required and shown in the command listing
- `model` is optional; defaults to the session model

### Command Naming

- File name = slash command name (e.g., `commit.md` → `/commit`)
- Use lowercase, single-word names
- Each command should be self-contained with its full instructions

## JSON Formatting

- 2-space indentation
- Trailing commas allowed
- Double-quoted keys
- No comments in JSON files

## Git Conventions

### Commit Messages

Format: `type(scope): message`

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `update`, `rm`

Scopes: `config`, `commands`, `skills`, `readme`, `plugin`, `model`

Examples from history:
- `feat(config): add timeout settings for Ollama provider`
- `docs(readme): add awesome-copilot and claude-code-owasp sources`
- `chore(skills): add agent skill definitions`
- `rm tools skills webtest command`

### Branches

Format: `<type>/<two-word-kebab>`

Examples: `feature/user-auth`, `fix/api-endpoint`, `update-config`

## Working with This Repository

- This is a **configuration-only repo** — no build, lint, or test commands
- No source code to compile or test
- Changes are JSON config edits or Markdown command edits
- Verify JSON is valid after edits (use a JSON linter or parser)
- The `node_modules/` directory exists only for the `@opencode-ai/plugin` dependency
- `package.json`, `package-lock.json`, and `.gitignore` are excluded from git (listed in .gitignore)

## Key References

- OpenCode config schema: `https://opencode.ai/config.json`
- OpenCode TUI schema: `https://opencode.ai/tui.json`
