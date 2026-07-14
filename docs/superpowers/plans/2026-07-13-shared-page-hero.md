# Shared Page Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the landing hero into a configurable component that can also render the shared subpage hero pattern shown in Figma.

**Architecture:** Keep persistent site chrome in the Next.js route-group layout. Add a server-compatible `PageHero` presentation component with landing/subpage and light/dark variants, then make the existing landing `Hero` a small content-and-actions adapter.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, `@repo/ui` Button, and the existing Icon component.

## Global Constraints

- Preserve the current landing hero's desktop appearance and content.
- Do not add dependencies, pathname conditionals, parallel routes, or client state.
- Keep future page-specific copy and background images outside the shared component.
- Keep `/color` outside the shared site layout.
- Do not commit temporary Figma MCP asset URLs.

---

### Task 1: Add the shared PageHero component

**Files:**
- Create: `apps/user/components/PageHero.tsx`
- Create: `apps/user/components/PageHero.module.css`

**Interfaces:**
- Consumes: React `ReactNode` and `CSSProperties` types.
- Produces: `PageHero` with `variant`, `tone`, `badge`, `title`, `description`, `backgroundImage`, `backgroundPosition`, and `actions` props.

- [x] **Step 1: Establish the current baseline**

Run:

```bash
pnpm --filter user lint
pnpm --filter user check-types
```

Expected: both commands exit with code `0`.

- [x] **Step 2: Define the configurable component API**

Create a server-compatible component whose defaults are `variant="subpage"`, `tone="light"`, and centered background positioning. Render the optional action group only when `actions` is provided.

- [x] **Step 3: Implement shared and variant styles**

Create CSS for the background and readability overlay, responsive container widths, badge, `36px/48px` desktop title, `16px/24px` description, light/dark tones, and the landing `632px` desktop minimum height and `52px` action gap.

- [x] **Step 4: Run static verification**

Run:

```bash
pnpm --filter user lint
pnpm --filter user check-types
```

Expected: both commands exit with code `0`.

---

### Task 2: Migrate the landing hero

**Files:**
- Modify: `apps/user/app/_components/Hero.tsx`
- Modify: `apps/user/app/page.module.css`

**Interfaces:**
- Consumes: `PageHero` and the existing gradient-border button helper.
- Produces: the same landing content and action buttons through `variant="landing"`.

- [x] **Step 1: Replace duplicated structure with PageHero**

Keep the landing title and description as React nodes so the Figma line breaks and highlighted text remain explicit. Pass the two existing buttons through `actions`.

- [x] **Step 2: Remove migrated structural CSS**

Delete hero shell, background, overlay, container, badge, typography, and responsive rules from `page.module.css`. Retain only landing button pseudo-element styles needed by the wrapper.

- [x] **Step 3: Run full static verification**

Run:

```bash
pnpm --filter user lint
pnpm --filter user check-types
pnpm --filter user build
git diff --check
```

Expected: every command exits with code `0`.

- [x] **Step 4: Verify the desktop landing hero in the browser**

At `1920x1080`, inspect `http://localhost:3000/`.

Expected:

- The hero has a `632px` minimum height and a `1360px` content container.
- Badge-to-copy spacing remains `20px` and copy-to-actions spacing remains `52px`.
- The title, descriptions, background position, overlay, and two buttons match the pre-refactor landing hero.
- `/color` has no site header, footer, or page hero.

- [ ] **Step 5: Commit and update the PR review thread**

Commit the component, landing migration, and approved design documents. Push the current branch, reply with the implementation and verification summary, then resolve thread `PRRT_kwDOTQciZs6QTvsm`.
