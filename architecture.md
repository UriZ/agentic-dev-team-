# Architecture

## Overview

{{PROJECT_OVERVIEW}}

## Modules

<!--
Define the major modules/components of the system. For each:
- What it does
- What it owns (data, behavior)
- What it depends on
-->

### Module 1: {{MODULE_NAME}}

{{MODULE_DESCRIPTION}}

### Module 2: {{MODULE_NAME}}

{{MODULE_DESCRIPTION}}

## Boundaries

<!--
Define the integration boundaries between modules.
Where are the API contracts? What crosses network boundaries?
What's synchronous vs async?
-->

```
{{BOUNDARY_DIAGRAM}}
```

## Tech Stack

<!--
For each technology choice, explain WHY it was chosen and what tradeoffs were accepted.
-->

### {{TECHNOLOGY}}

{{JUSTIFICATION}}

## Data Model

<!--
Key data entities, their relationships, and where they live.
-->

## Design Principles

<!--
Project-specific architectural principles that guide all decisions.
Examples:
- "Thin clients — all business logic lives on the server"
- "Event-driven — modules communicate via events, not direct calls"
- "Offline-first — app must work without network"
-->

- {{PRINCIPLE_1}}
- {{PRINCIPLE_2}}
- {{PRINCIPLE_3}}
