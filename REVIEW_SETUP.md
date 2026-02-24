# Configure /review Command with Ollama

## Overview

This guide explains how to configure opencode to use your custom ollama instance for the `/review` command.

## Current Setup

Your opencode.json already has ollama configured:

- **Provider ID**: `ollama`
- **Base URL**: `http://ollama.hjkl.am:11434/v1`
- **Model**: `glm4.7-flash-100k`

## Step 1: Create the /review Command

Create a command file at `.opencode/command/review.md` in your project:

```markdown
---
description: Review code for best practices and potential issues
model: ollama/glm4.7-flash-100k:latest
---

Review the provided code changes for:

- Best practices and code quality
- Potential bugs and edge cases
- Security vulnerabilities
- Performance improvements
- Documentation and comments
- Consistency with existing codebase

Focus on actionable feedback that improves the code quality.

$ARGUMENTS
```

**Placement options:**

1. **Project-specific** (recommended): `.opencode/command/review.md` in your project root
2. **Global**: `~/.config/opencode/commands/review.md` for use across all projects

## Step 2: Usage

After creating the command file, use it in opencode:

```bash
# Review current git diff
/review

# Review specific file
/review src/main.ts

# Review staged changes
/review --staged
```

## Model Format

The `model` field uses the format: `<provider-id>/<model-name>`

- Provider ID: `ollama` (as defined in your config)
- Model name: `glm4.7-flash-100k:latest` (as defined in your config)

## Adding More Models

To add more ollama models to your config:

```json
{
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama",
      "options": {
        "baseURL": "http://ollama.hjkl.am:11434/v1"
      },
      "models": {
        "glm4.7-flash-100k:latest": {
          "name": "glm4.7-flash-100k"
        },
        "llama3:latest": {
          "name": "Llama 3",
          "limit": {
            "context": 8192,
            "output": 4096
          }
        }
      }
    }
  }
}
```

## Troubleshooting

### Command not found

If `/review` doesn't appear:

- Restart opencode after creating the command file
- Check the file is in the correct location
- Verify the filename is `review.md` (not `Review.md`)

### Connection errors

If opencode can't connect to ollama:

- Verify ollama is running: `curl http://ollama.hjkl.am:11434/v1/models`
- Check firewall rules
- Ensure the URL in your config is correct

### Model not found

If the model isn't available:

- List ollama models: `ollama list` (on the ollama server)
- Pull the model if needed: `ollama pull <model-name>`
- Verify the model name matches exactly in your config
