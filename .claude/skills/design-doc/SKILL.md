---
name: design-doc
description: Create a high-level architecture/design doc for a project through guided discovery, then critical review. Use when starting a new project or feature that needs a design doc before implementation.
argument-hint: "[optional: one-line description of what to build]"
user-invocable: true
---

# Design Doc Skill

Create a concise, implementation-ready architecture document through a structured process: guided questions → draft → critical review → final doc.

## Principles

- **Less is more.** Say less words, fewer diagrams, no ai slop
- **MVP first.** Design what you're building now, not what you might build later.
- **No AI slop.** No "Non-Goals" lists, no "Future Considerations" padding, no vague "consider X" language.
- **High-level only.** Don't design implementation details (polling intervals, field lengths, etc.) in the architecture doc. Those belong in implementation specs.
- **Opinionated.** Make decisions, don't present options. Research costs and tradeoffs, then recommend one path.

## Process

### Phase 1: Discovery (ask questions, don't assume)

Ask the user questions to understand what they're building. Go slow — ask only 1-2 questions at a time, wait for answers, then ask follow-ups based on what you learned. Don't front-load all questions.

**Question flow (adapt based on answers):**
1. Start with the core: what does the user do in the product? (one sentence)
2. Then drill into what matters most based on their answer — target user, key interactions, technical constraints, etc.
3. Continue until you have enough to draft. Typically 3-5 rounds of 1-2 questions each.

**Rules for questions:**
- Ask 1-2 questions per round, never more. Wait for answers before asking more.
- Only ask questions that directly change the architecture. If the answer wouldn't change what you design, don't ask it. Examples of bad questions: team size, budget (unless choosing between paid services), timeline, "who is the target user" (when obvious from context).
- If a question is obvious from context, don't ask it — just decide.
- If the user says something is "for later", drop it. Don't design around it.
- When the user picks a technology or API, research the actual pricing and constraints before proceeding. Use WebSearch. Don't guess.
- Let the conversation flow naturally. Don't follow a rigid script — adapt based on what the user tells you.

When you have enough to draft, say so and move to Phase 2. Don't over-ask.

### Phase 2: Draft the doc

Write `architecture.md` in the project root. Structure:

```markdown
# [Project Name] — Architecture

## Overview
[2-3 sentences. What the product does, who it's for, what matters.]

## System Diagram
[One mermaid diagram showing the major components and data flow. Keep it simple.]

## Modules
[One subsection per major component. For each: what it does, its interfaces, key decisions.]

## Boundaries
[What talks to what. API contracts between components. Data flow across boundaries.]

## Security & Cost Protection
[Only MVP must-haves: cost controls, input validation, API key handling, rate limiting. Skip anything that's not a real risk for MVP.]

## Privacy & Compliance
[Only if the product has specific requirements — e.g., kids as users (COPPA), health data (HIPAA). Skip if not applicable.]

## Tech Stack
[Table: Component | Technology | Why (one phrase)]
```

**What NOT to include:**
- Non-Goals sections
- Future/Post-MVP sections (if something is post-MVP, mention it inline in one sentence, not a whole section)
- Deployment architecture diagrams
- Database schemas (too detailed for this doc)
- API response format details
- Anything you'd label "nice to have"

### Phase 3: Critical review

After the draft is written, spawn an architect subagent with the `architecture-review` skill to critically review the doc. Use:

```
Agent(subagent_type="architect", prompt="Read the architecture-review skill at .claude/skills/architecture-review/SKILL.md, then follow its instructions to review the architecture doc at architecture.md")
```

This uses the architect agent but scoped to the review skill — skipping the irrelevant issue-tracking and spec-output instructions.

### Phase 4: Incorporate feedback

Present the review findings to the user. Categorize into:
- **Fix now** — real gaps that will block or break the build
- **Skip** — valid but not MVP-critical, or adds unnecessary complexity

For each finding, include enough context that the user can make an informed decision without reading the full review. Specifically:
- What's missing or wrong (the problem, not just a label)
- Why it matters — what breaks or gets blocked if you don't fix it
- What the fix would be (1-2 sentences)

Don't compress findings into one-liners. The user needs to understand each issue well enough to say yes or no.

Apply the fixes the user agrees with. Don't add complexity the user didn't ask for.

### Phase 5: User review

Ask the user to review the final doc. Apply any final changes. Done.

## Notes

- The user may provide external feedback (from colleagues, other reviews, etc.) at any point. Treat it the same way: categorize, get user approval, apply.
- If the user asks to defer something ("leave X for later"), remove it from the doc or mark it as post-MVP in a single inline sentence. Don't create a section for deferred items.
- Research real costs. Don't write "$X/request" without checking. Use WebSearch to verify pricing.
- When comparing technology options, present a concise table with actual numbers, then recommend one. Don't leave the choice open unless the user explicitly wants to decide later.