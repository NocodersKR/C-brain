---
slug: portfolio-admin-table
status: plan-written
intent: clear
pending-action: user can approve execution with $start-work or request a high-accuracy review
approach: Build one reusable AdminDataTable section from the Figma portfolio table: toolbar + filters + search + table header/body + bottom action, then wrap it in a PortfolioPage that only supplies columns, rows, filters, and actions.
---

# Draft: portfolio-admin-table

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->
| C1 | Admin table section shell renders title, toolbar, table, and footer action from configuration | active | .omo/evidence/portfolio-admin-table/figma-440-3294.png |
| C2 | Portfolio page supplies portfolio-specific columns, filters, search placeholder, rows, and add action | active | .omo/evidence/portfolio-admin-table/figma-440-3294.png |
| C3 | Table tokens/styles map Figma dimensions to design-system/Pretendard/admin tokens without Figma URLs | active | design.md, apps/admin/src/index.css |
| C4 | Agent-executed verification covers build/lint/Figma URL scan/browser screenshot across desktop and mobile | active | .omo/evidence/portfolio-admin-table/figma-440-3294.png |

## Open assumptions (announced defaults)
<!-- Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->
| Table reuse scope | Create a generic admin table component local to apps/admin instead of a package | apps/admin is the only active admin app and there is no shared table package yet | yes |
| Data source | Use typed fixture rows for the first portfolio page implementation | No admin API/data contract exists in apps/admin yet; table layout is the requested target | yes |
| Icons | Use inline currentColor SVG components for chevron/search/package icons | design.md forbids remote Figma URLs and product UI icons should inherit color | yes |
| Responsiveness | Keep desktop Figma width faithful and proportionally scale below the minimum laptop width | User clarified admin mobile responsive layout is not needed; Figma node is 1376px wide and has fixed column tracks | yes |
| Test strategy | Tests-after plus browser QA, not TDD | This is currently a visual/layout implementation with no existing test harness; agent-executed QA remains mandatory | yes |

## Findings (cited - path:lines)
- Figma node 440:3294 is a full portfolio table section, not just a table body: title, filters, search, table header, rows, and bottom-right add button are in one visual unit. Evidence: .omo/evidence/portfolio-admin-table/figma-440-3294.png.
- Figma table column tracks are fixed/flex hybrid: 상태 120, 유형 160, title flex, 고객사 160, 랜딩 120, 조회수 120, 등록일자 120, 상세 120. Header and row height are 52px.
- Figma typography maps to Pretendard/Pretendard GOV 18/14 weights; current project design.md provides Pretendard tokens for 18/14, so plan should use existing utility classes and only add missing admin table tokens if required.
- `apps/admin/src/App.tsx` currently defines all admin routes inline and `/portfolio` renders a generic placeholder page.
- `apps/admin/src/main.tsx` imports `../../../design-system.css` and `./index.css`; table styles can rely on global design tokens and admin-local CSS.
- `apps/admin/src/App.css` constrains `.admin-main` to `min(1120px, 100%)`, narrower than the 1376px Figma capture; table pages need a wider layout class or route-specific wrapper.
- `apps/admin/package.json` has React, Vite, and react-router-dom only; no table/headless UI/icon package should be added for this layout.

## Decisions (with rationale)
- Plan will create reusable table primitives under `apps/admin/src/components/admin-table/` so other admin pages can reuse columns, filters, search, row actions, empty/loading states, and layout without copying portfolio markup.
- Plan will create a portfolio-specific page wrapper under `apps/admin/src/pages/PortfolioPage.tsx` and route `/portfolio` to it, keeping page data/config out of the generic component.
- Plan will keep API integration out of scope until a real admin data contract exists; the first implementation uses typed local fixture rows that can later be swapped for fetched data without changing table layout.
- Plan will require local or inline SVG icons only and a final Figma URL source scan.

## Scope IN
- Reusable admin table section component API for columns, rows, filter controls, search, row links/actions, and bottom CTA.
- Portfolio management page using the reusable component and matching the Figma node.
- Admin-local CSS/tokens for table layout, status dots, row/header surfaces, controls, and responsive overflow.
- Verification plan: `pnpm --filter admin build`, `pnpm --filter admin lint`, Figma URL scan, and Playwright screenshot QA at 1376/1440 and 1024 widths.

## Scope OUT (Must NOT have)
- No backend/API/Supabase integration.
- No new dependency for table rendering, icons, or forms.
- No remote Figma MCP asset URLs in source.
- No extraction to a shared package before a second app actually needs it.
- No unrelated header/navigation redesign.

## Open questions
- None blocking. User can veto the adopted defaults above before plan writing.

## Approval gate
status: plan-written
completed action: wrote .omo/plans/portfolio-admin-table.md with detailed todos, references, acceptance criteria, QA scenarios, and commit strategy.
evidence: .omo/evidence/portfolio-admin-table/figma-440-3294.png
