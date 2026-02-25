---
description: Create/update AGENTS.md to guide agentic coding assistants
model: ollama/janitor
---

You create and maintain AGENTS.md files for repositories. These files tell agentic coding assistants (like yourself) how to work effectively in the codebase.

---

Input: $ARGUMENTS

---

## Discovery

First, understand the repository structure:

1. **Project type identification**
   - Check for package.json, pyproject.toml, requirements.txt, Cargo.toml, go.mod, etc.
   - Identify the primary language(s) and framework(s)
   - Note build systems (webpack, vite, cargo, etc.)

2. **Configuration analysis**
   - Look for .editorconfig, .prettierrc, .eslintrc, pylintrc, .rustfmt.toml
   - Check tsconfig.json, jest.config.js, pytest.ini, etc.
   - Find Dockerfile, docker-compose.yml

3. **Existing rules**
   - Check .cursor/rules/ directory
   - Look for .cursorrules file
   - Check .github/copilot-instructions.md
   - Look for existing AGENTS.md at ${path}

4. **Codebase patterns** (use explore agent)
   - Read multiple files to understand patterns
   - Identify naming conventions (camelCase, snake_case, PascalCase)
   - Check import/export patterns
   - Look for error handling approaches
   - Note testing patterns (where tests live, how they're named)

---

## What to Include

### Build/Lint/Test Commands
- Build commands and when to run them
- Linting commands and expected output
- Test commands, including how to run a single test
- Type checking commands if applicable

### Code Style Guidelines
- Imports/ordering (alphabetical, grouped, absolute vs relative)
- Formatting (indentation, line length, trailing commas)
- Types (TypeScript strictness, Python typing annotations)
- Naming conventions for variables, functions, classes, files
- Error handling patterns
- Comments/documentation expectations
- File organization (where components go, utilities, etc.)

### Project-Specific Conventions
- Architectural patterns (MVC, clean architecture, etc.)
- State management approach
- API design patterns
- Database interaction patterns
- Authentication/authorization patterns
- Environment variable usage

### Integration Points
- How to run the dev server
- How to run production builds
- How to interact with external services
- Deployment considerations

---

## Handling Existing AGENTS.md

If AGENTS.md already exists at ${path}:
- Read the current file completely
- Preserve existing accurate information
- Add missing sections if identified
- Update outdated information
- Improve clarity and organization
- Keep maximum size around 300 lines

If no AGENTS.md exists:
- Create a new comprehensive file
- Include all relevant sections
- Structure with clear headings

---

## Output Format

1. **Repository Type** - Brief description (e.g., "Node.js web application with React frontend")
2. **Build/Lint/Test Commands** - Clear commands with explanations
3. **Code Style Guidelines** - Organized by category
4. **Project Structure** - Key directories and their purposes
5. **Working with This Repository** - Context for agentic assistants
6. **Additional Notes** - Anything else relevant

Keep it:
- Concise (max ~300 lines)
- Actionable (clear instructions, not vague advice)
- Accurate (verify commands work)
- Well-organized (clear sections, logical flow)

---

## Verification

Before finalizing:
1. Verify all commands actually work by trying them
2. Check that style guidelines match actual code patterns
3. Ensure all important configurations are captured
4. Confirm file paths and references are correct

---

Input: $ARGUMENTS
