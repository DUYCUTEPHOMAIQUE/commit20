<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## UI/UX Engineering Rules

### 1. Interactive Cursor & Hover Affordance
- **Mandatory Pointer Cursor**: Every interactive element with `onClick`, click handlers, or navigation (`button`, `[role="button"]`, tabs, category pills, dropdown items, interactive cards) MUST show `cursor: pointer` (`cursor-pointer`).
- **Disabled State**: Any disabled interactive element (`disabled`, `aria-disabled="true"`) must show `cursor: not-allowed` (`cursor-not-allowed`) and appropriate opacity/contrast reduction.
- **Global Safeguard**: Ensured via global reset in `src/app/globals.css` and explicit Tailwind classes (`cursor-pointer`). Never leave an interactive clickable element with default arrow cursor (`cursor: default`).

