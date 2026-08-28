# Agentic Dev Team

A reusable framework for running multi-agent development teams with Claude Code. Copy this repo, fill in the placeholders, and you have a fully orchestrated dev team with architect, developers, QA, security, and an independent judge agent as quality gate.

## What's Inside

```
CLAUDE.md                    — Team workflow, pipeline, policies (main project instructions)
BACKLOG.md                   — Entry point: user adds work items here, TL picks them up
architecture.md              — Starter architecture template
criteria.md                  — Judge evaluation criteria (project-level + per-role)
SESSION_LOG.md               — Activity log template (missile-project format)
.gitignore
.claude/
  settings.local.json        — Default permissions (safe git ops, no force push)
  agents/
    tl.md                    — Team Lead — orchestrates everything
    architect.md             — System design and specs
    developer.md             — Implementation
    senior-developer.md      — Complex/high-risk implementation (optional)
    qa.md                    — Testing and bug reports
    visual-qa.md             — Screenshot-based visual QA (optional)
    security.md              — Security audits
    judge.md                 — Quality gate — evaluates agent output
    ui-designer.md           — Visual design specs (optional)
    devops.md                — Deployment and infra (optional)
  skills/
    qa-screenshot/           — Puppeteer screenshot skill for QA agents
      SKILL.md
      scripts/qa-screenshot.js
```

## How to Use

### 1. Copy this repo to your new project

```bash
cp -r /path/to/agentic-dev-team/.claude /path/to/your-project/
cp /path/to/agentic-dev-team/CLAUDE.md /path/to/your-project/
cp /path/to/agentic-dev-team/criteria.md /path/to/your-project/
cp /path/to/agentic-dev-team/architecture.md /path/to/your-project/
cp /path/to/agentic-dev-team/SESSION_LOG.md /path/to/your-project/
```

### 2. Replace placeholders

Search for `{{` across all files and fill in your project-specific values:

| Placeholder | Where | What to put |
|-------------|-------|-------------|
| `{{PROJECT_NAME}}` | CLAUDE.md | Your project name |
| `{{PROJECT_DESCRIPTION}}` | CLAUDE.md | One-line description |
| `{{PROJECT_CONCEPT}}` | CLAUDE.md | What the project does |
| `{{PROJECT_STRUCTURE}}` | CLAUDE.md | High-level directory structure |
| `{{GITHUB_REPO}}` | CLAUDE.md, all agents | `Owner/repo-name` |
| `{{GITHUB_USERNAME}}` | CLAUDE.md | Your GitHub username |
| `{{WORKING_DIRECTORY}}` | All agents | Absolute path to project root |
| `{{TECH_STACK_CONSTRAINTS}}` | architect.md | Tech stack and constraints |
| `{{DESIGN_PRINCIPLES}}` | ui-designer.md | Visual design principles |
| `{{PROJECT_QUALITY_BAR}}` | criteria.md | Overall quality standard |
| `{{APP_URL}}` | QA skill | Default app URL for screenshots |

### 3. Fill in architecture.md

Replace the template sections with your actual architecture.

### 4. Set up GitHub labels

```bash
gh label create "architect" --color "7B68EE" --repo Owner/repo
gh label create "developer" --color "2E8B57" --repo Owner/repo
gh label create "qa" --color "4169E1" --repo Owner/repo
gh label create "ui-design" --color "FF69B4" --repo Owner/repo
gh label create "security" --color "DC143C" --repo Owner/repo
gh label create "in-progress" --color "FFD700" --repo Owner/repo
gh label create "judge-fail" --color "FF4500" --repo Owner/repo
gh label create "won't fix" --color "808080" --repo Owner/repo
```

### 5. Remove optional agents you don't need

Delete any agent files from `.claude/agents/` that aren't relevant to your project.

### 6. Customize settings.local.json

Add project-specific tool permissions (e.g., `pnpm`, `turbo`, `python`, etc.) to the allow list.

## Pipeline

```
Feature request
    |
    v
architect --> JUDGE --> developer --> JUDGE --> qa --> JUDGE --> done
                                                        |
                                                   security (if needed)
```

Every agent's output goes through the judge before proceeding. The judge evaluates against criteria defined in `criteria.md` and acceptance criteria on the GitHub issue. FAIL sends work back with specific feedback. PASS proceeds to the next stage.

## Key Concepts

- **GitHub issues are the source of truth** — all tasks tracked as issues with labels driving the pipeline
- **Session log** — every agent logs what it did, decisions made, and improvement suggestions
- **Judge as gate** — independent agent evaluates work quality, no confirmation bias from the TL
- **Continuous self-improvement** — agents suggest improvements, TL applies them via retrospective
- **No push without approval** — git push and deployment always require user confirmation

## Customization

- **Strictness**: Change `STRICTNESS` in criteria.md (low/medium/high/paranoid)
- **Gate mode**: Change `GATE_MODE` to `advisory` to make judge non-blocking
- **Agent models**: Change `model:` in agent frontmatter (opus for critical work, sonnet for routine)
- **Add domain agents**: Create new `.md` files in `.claude/agents/` following the existing pattern
- **Per-role criteria**: Edit criteria.md to add/remove/modify what the judge checks
