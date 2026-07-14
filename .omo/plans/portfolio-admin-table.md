# portfolio-admin-table - Work Plan

## TL;DR (For humans)
**What you'll get:** 포트폴리오 관리 화면의 목록 테이블을 다른 관리 화면에서도 재사용할 수 있는 공통 리스트 섹션으로 만든다. 제목, 필터, 검색, 표, 하단 등록 버튼은 공통 구조로 두고 각 페이지는 컬럼과 데이터만 넘긴다.

**Why this approach:** Figma 캡처는 단순 표가 아니라 제목/필터/검색/행/하단 CTA가 묶인 관리 리스트 섹션이다. 그래서 표 body만 컴포넌트화하지 않고, 관리 페이지 공통 레이아웃 단위로 만든다.

**What it will NOT do:** API 연동, 새 테이블 라이브러리 설치, 공유 패키지 추출, 헤더 재디자인은 하지 않는다.

**Effort:** Medium
**Risk:** Medium - Figma 폭이 넓고 컬럼 폭이 고정/flex 혼합이라 반응형 처리와 캡처 QA가 필요하다.
**Decisions to sanity-check:** 첫 구현은 로컬 fixture 데이터로 한다. 어드민은 모바일 반응형을 구현하지 않고, 모바일 랩탑 폭을 최소 PC 기준으로 보며 그 이하에서는 전체 표 비율을 유지한 채 축소한다.

Your next move: `$start-work`로 실행하거나, 구현 전 고정밀 리뷰를 요청한다. Full execution detail follows below.

---

> TL;DR (machine): Medium-risk reusable React/Vite admin table section; no backend/dependency work; verify with build, lint, Figma URL scan, and browser screenshots.

## Scope
### Must have
- Reusable admin table section that represents the Figma node `440:3294` as a configurable layout:
  - section title
  - right-aligned toolbar
  - select-like filters
  - search control
  - header row
  - data rows
  - row status indicator
  - row detail link/action
  - bottom-right primary action
- Portfolio management page mounted on `/portfolio` that uses the reusable section.
- Portfolio page config must define columns, rows, filter controls, search placeholder, and bottom action outside the reusable table component.
- Desktop layout must preserve the Figma table shape from `.omo/evidence/portfolio-admin-table/figma-440-3294.png`:
  - screenshot size: `1376 x 674`
  - header/row height: `52px`
  - column tracks: `120 / 160 / flex / 160 / 120 / 120 / 120 / 120`
  - toolbar gap groups: `32px`, inner control gaps `16px`, icon/text gaps `4px` or `8px`
- Admin mobile responsive layout is out of scope. The table targets PC/laptop first; below the minimum laptop width, the section scales down proportionally instead of reflowing into a mobile layout.
- UI icons must be inline SVG/currentColor components or a local admin icon pattern; no Figma MCP asset URLs in source.
- Typography must reuse existing Pretendard utilities from `design.md` and `design-system.css`; add admin-only CSS tokens only for missing table colors/surfaces.

### Must NOT have (guardrails, anti-slop, scope boundaries)
- Must not introduce `tanstack-table`, MUI, shadcn, lucide, or any other dependency for this table.
- Must not integrate Supabase/API/data fetching in this task.
- Must not move the table to a shared package until a second app actually needs it.
- Must not leave `https://www.figma.com/api/mcp/asset/*` or `https://www.figma.com/api/*` in source.
- Must not use a pasted screenshot/background image as the table implementation.
- Must not change `AdminHeader` behavior or redesign navigation.
- Must not use `as any`, `@ts-ignore`, `@ts-expect-error`, non-null assertions, or enum declarations.

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: tests-after via existing project checks, because `apps/admin` has no unit/e2e test harness. Required checks are `pnpm --filter admin build`, `pnpm --filter admin lint`, source scan, and Playwright browser QA.
- Evidence:
  - Figma reference: `.omo/evidence/portfolio-admin-table/figma-440-3294.png`
  - Build/lint log: `.omo/evidence/portfolio-admin-table/build-lint.txt`
  - Figma URL scan: `.omo/evidence/portfolio-admin-table/figma-url-scan.txt`
  - Desktop screenshot: `.omo/evidence/portfolio-admin-table/portfolio-1376.png`
  - Minimum PC shrink screenshot: `.omo/evidence/portfolio-admin-table/portfolio-1024.png`
  - Browser QA JSON: `.omo/evidence/portfolio-admin-table/browser-qa.json`

## Execution strategy
### Parallel execution waves
- Wave 1: Create reusable table primitives, CSS tokens, and local icon components.
- Wave 2: Create portfolio page config/fixture data, route `/portfolio`, and wide page layout.
- Wave 3: Run verification and capture screenshots.

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 | none | 2, 3, 4 | none |
| 2 | 1 | 4, 5 | 3 after shared types exist |
| 3 | 1 | 4, 5 | 2 after shared types exist |
| 4 | 2, 3 | 5, F3 | none |
| 5 | 4 | F1-F4 | none |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->
- [ ] 1. Create reusable admin table component API and local icons
  What to do / Must NOT do:
  - Add `apps/admin/src/components/admin-table/AdminDataTableSection.tsx`.
  - Add `apps/admin/src/components/admin-table/AdminDataTableSection.css`.
  - Add `apps/admin/src/components/admin-table/adminTableTypes.ts` if type declarations become too noisy inside the component file; otherwise keep types in the component file to avoid extra files.
  - Add minimal inline SVG icon components inside the table component file or `apps/admin/src/components/admin-table/AdminTableIcons.tsx` only if more than one component needs them.
  - Component props must be readonly:
    - `title: string`
    - `filters: readonly AdminTableFilter[]`
    - `search: AdminTableSearch`
    - `columns: readonly AdminTableColumn<Row>[]`
    - `rows: readonly Row[]`
    - `getRowKey: (row: Row) => string`
    - `bottomAction?: AdminTableAction`
    - `emptyMessage?: string`
  - Use semantic controls where possible:
    - filter trigger can be a `<button type="button">` in this first layout task, not a working dropdown.
    - search can be a labelled `<label>`/`<input type="search">`.
    - detail and bottom action use `<a>` when they navigate.
  - Must NOT implement dropdown state, sorting, pagination, API loading, or form submission.
  Parallelization: Wave 1 | Blocked by: none | Blocks: 2, 3, 4
  References (executor has NO interview context - be exhaustive):
  - Figma reference: `.omo/evidence/portfolio-admin-table/figma-440-3294.png`
  - Figma context findings in `.omo/drafts/portfolio-admin-table.md`
  - `design.md:17-36` for Pretendard type utilities
  - `design.md:38-90` for SVG/currentColor icon rules
  - `design.md:92-103` for gap-based spacing rules
  - `apps/admin/src/index.css:17-22` for admin brand/surface tokens already added
  - `apps/admin/package.json:12-16` confirms no table/icon dependency exists
  Acceptance criteria (agent-executable):
  - `pnpm --filter admin build` exits 0 after the component compiles.
  - `pnpm --filter admin lint` exits 0.
  - `rg "figma.com/api/mcp/asset|https://www.figma.com/api" apps/admin/src apps/admin/public` returns no matches.
  QA scenarios (name the exact tool + invocation):
  - Happy: run `pnpm --filter admin build` and append output to `.omo/evidence/portfolio-admin-table/build-lint.txt`; PASS if exit 0.
  - Failure: run `rg "figma.com/api/mcp/asset|https://www.figma.com/api" apps/admin/src apps/admin/public > .omo/evidence/portfolio-admin-table/figma-url-scan.txt`; PASS if exit code is 1/no matches and the evidence file is empty.
  Commit: Y | feat(admin): add reusable admin data table section

- [ ] 2. Add portfolio table fixture/config and PortfolioPage wrapper
  What to do / Must NOT do:
  - Add `apps/admin/src/pages/PortfolioPage.tsx`.
  - Add `apps/admin/src/pages/PortfolioPage.css` only for page-level width/layout; keep table styling inside `AdminDataTableSection.css`.
  - Define a readonly `PortfolioRow` type with fields matching Figma:
    - `id`
    - `status: "draft" | "published"`
    - `type`
    - `title`
    - `client`
    - `landingStatus: "published" | "none"`
    - `views`
    - `createdAt`
    - `detailHref`
  - Use fixture rows matching visible Figma examples:
    - draft row: `임시저장`, `브로슈어 · 카탈로그`, `제품 카탈로그 A4 16P`, `대전화병원`, `게시됨`, `24`, `26. 03. 16`, `상세`
    - published rows with types `리플렛 · 팜플렛`, `명함 · 봉투`, `배너 · 족자 · 현수막`, `촬영`
  - Define columns in the page config, not inside generic table internals.
  - Use the generic `renderCell` hooks only where the row needs special content:
    - status dot + label
    - landing published color or `-`
    - detail link
  - Must NOT fetch from API or introduce state management beyond search input display if implemented.
  Parallelization: Wave 2 | Blocked by: 1 | Blocks: 4, 5
  References:
  - `apps/admin/src/App.tsx:18-23` shows `/portfolio` currently exists as placeholder route data.
  - `apps/admin/src/App.tsx:62-72` shows the current placeholder `AdminPage` shape to replace for portfolio only.
  - Figma reference `.omo/evidence/portfolio-admin-table/figma-440-3294.png` for visible rows/copy.
  Acceptance criteria:
  - `/portfolio` renders title `포트폴리오 등록 현황`.
  - Visible table header cells exactly include `상태`, `유형`, `포트폴리오 제목`, `고객사`, `랜딩`, `조회수`, `등록일자`, `상세`.
  - At least one draft row and one published row render with different status colors.
  QA scenarios:
  - Happy: Playwright script opens `http://127.0.0.1:<port>/portfolio`, reads `document.body.innerText`, and writes `.omo/evidence/portfolio-admin-table/browser-qa.json`; PASS if all header labels and `신규 포폴 등록` are present.
  - Failure: same script checks `/products` still renders its existing page title `상품`; PASS if products route is not broken by portfolio route replacement.
  Commit: Y | feat(admin): add portfolio management table page

- [ ] 3. Add Figma-faithful admin table CSS and responsive behavior
  What to do / Must NOT do:
  - Implement class names under an `admin-data-table-*` prefix.
  - Map Figma color tokens to existing or admin-local CSS variables:
    - brand: `var(--admin-brand-500)`
    - gray text: use `var(--color-gray-800)` or `--admin-gray-800`
    - muted placeholder: add `--admin-gray-400` only if no existing token matches visually.
    - row/header surface: add `--admin-table-surface: #f8fafc` in `apps/admin/src/index.css` if needed.
  - Implement layout:
    - section `display:flex; flex-direction:column; gap:20px;`
    - top bar `display:flex; justify-content:space-between; align-items:center;`
    - toolbar `gap:32px`
    - table min-width `1376px` or equivalent column total preserving the Figma shape.
    - header row and emphasized first row background `#f8fafc`, radius `16px`.
    - row list gap `8px`.
    - cells height `52px`, horizontal padding from Figma.
    - bottom action: `height:40px`, `border-radius:40px`, `gap:4px`, `padding:8px 16px`, brand background, subtle shadow.
  - PC shrink behavior:
    - set a fixed design canvas width matching the Figma table.
    - below the minimum laptop viewport, scale the full section proportionally from the top-left so column ratios are preserved.
    - do not introduce mobile-specific wrapping, stacked filters, hidden columns, or horizontal table scrolling as the primary behavior.
  - Must NOT use child margins for normal spacing; use parent flex/grid gaps.
  Parallelization: Wave 2 | Blocked by: 1 | Blocks: 4, 5
  References:
  - `apps/admin/src/App.css:9-16` shows current `admin-main` width and padding that are too narrow for this table.
  - `apps/admin/src/index.css:17-22` for existing admin tokens.
  - `design.md:92-103` requires gap-based spacing.
  - Figma reference `.omo/evidence/portfolio-admin-table/figma-440-3294.png`.
  Acceptance criteria:
  - Desktop screenshot at 1376px shows the table section without horizontal clipping.
  - 1024px screenshot shows the table proportionally scaled down with preserved column ratios.
  - No Figma API URLs exist in source.
  QA scenarios:
  - Happy: Playwright captures `portfolio-1376.png` at viewport `{ width: 1376, height: 760 }`; PASS if screenshot file exists and table header/CTA are visible.
  - Failure: Playwright captures `portfolio-1024.png` at viewport `{ width: 1024, height: 760 }`; PASS if the table section is scaled rather than reflowed into a mobile layout.
  Commit: Y | style(admin): match portfolio table layout

- [ ] 4. Route `/portfolio` to PortfolioPage and preserve adjacent admin routes
  What to do / Must NOT do:
  - Update `apps/admin/src/App.tsx` so `/portfolio` renders `PortfolioPage`.
  - Keep `/`, `/sales`, `/products`, `/blog`, `/reviews`, `/notices`, `/complaints`, and `/linkpay/new` behavior intact.
  - Do not remove `AdminPage` placeholders for the other routes in this task.
  - If route mapping becomes noisy, split route data into a small helper only if it reduces the current file; do not create a router abstraction.
  Parallelization: Wave 3 | Blocked by: 2, 3 | Blocks: 5
  References:
  - `apps/admin/src/App.tsx:5-54` current route metadata.
  - `apps/admin/src/App.tsx:76-98` current route rendering.
  - `apps/admin/src/App.css:9-16` current main layout.
  Acceptance criteria:
  - `/portfolio` renders `PortfolioPage`.
  - `/products` still renders the existing placeholder page title `상품`.
  - Header active style for `/portfolio` remains handled by existing `AdminHeader`.
  QA scenarios:
  - Happy: Playwright opens `/portfolio` and asserts one `.admin-header__menu-link--active` has text `포트폴리오`; evidence in `.omo/evidence/portfolio-admin-table/browser-qa.json`.
  - Failure: Playwright opens `/notices` and asserts active menu is `공지사항`, proving route changes did not break adjacent nav.
  Commit: Y | feat(admin): route portfolio to table page

- [ ] 5. Final verification and evidence capture
  What to do / Must NOT do:
  - Run all checks after the last source edit.
  - Start a local Vite server for browser QA.
  - If sandboxed Vite/browser fails with `listen EPERM` or Chromium Mach port errors, rerun the same command with approved escalation and record that reason.
  - Tear down the Vite server after QA and record cleanup.
  - Do not declare done from build/lint alone; browser screenshots are required.
  Parallelization: Final wave | Blocked by: 4 | Blocks: completion
  References:
  - `apps/admin/package.json:6-10` available scripts.
  - Figma source search requirement from project instructions.
  - Figma reference `.omo/evidence/portfolio-admin-table/figma-440-3294.png`.
  Acceptance criteria:
  - `pnpm --filter admin build` exits 0.
  - `pnpm --filter admin lint` exits 0.
  - `rg "figma.com/api/mcp/asset|https://www.figma.com/api" apps packages` returns no matches.
  - Browser QA JSON proves:
    - `/portfolio` title exists.
    - all table headers exist.
    - bottom CTA exists.
    - desktop viewport has expected 52px header/row height.
    - 1024px viewport preserves the table proportions by scaling the section down.
  QA scenarios:
  - Happy: command sequence:
    - `pnpm --filter admin build`
    - `pnpm --filter admin lint`
    - `rg "figma.com/api/mcp/asset|https://www.figma.com/api" apps packages`
    - Playwright script captures `.omo/evidence/portfolio-admin-table/portfolio-1376.png` and `.omo/evidence/portfolio-admin-table/portfolio-1024.png`.
  - Failure: Playwright opens `/portfolio` and checks `document.querySelectorAll("table, [role='table']").length > 0`; PASS if a real DOM table/role table exists and no screenshot/background-image substitute is used.
  Commit: N | verification only

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [ ] F1. Plan compliance audit
  - Check every todo references this plan, Figma capture, and exact files.
  - Check no todo requires human-only verification.
- [ ] F2. Code quality review
  - Check no `any`, non-null assertion, `@ts-ignore`, or new dependency was introduced.
  - Check reusable table API is not over-abstracted: no factory, no plugin system, no premature package extraction.
- [ ] F3. Real manual QA
  - Browser-open `/portfolio` at 1376px and 1024px.
  - Capture screenshots and JSON evidence under `.omo/evidence/portfolio-admin-table/`.
- [ ] F4. Scope fidelity
  - Verify no backend/API/Supabase integration, no header redesign, no unrelated route/content churn.

## Commit strategy
- Commit only if the user asks to commit after implementation.
- Suggested implementation commits:
  - `feat(admin): add reusable admin data table section`
  - `feat(admin): add portfolio management table page`
  - `style(admin): match portfolio table layout`
- If all implementation lands as one small diff, collapse to:
  - `feat(admin): add reusable portfolio table layout`
- Commit footer if generated from this plan:
  - `Plan: .omo/plans/portfolio-admin-table.md`

## Success criteria
- The implementation exposes a reusable admin table section, not portfolio-only copied markup.
- `/portfolio` matches the Figma table structure and visible content from `.omo/evidence/portfolio-admin-table/figma-440-3294.png`.
- Other admin routes still render.
- The final source contains no Figma MCP/API URLs.
- Build and lint pass.
- Browser screenshots exist for desktop and minimum-PC shrink widths.
- QA evidence proves the table is real DOM, not a pasted image.
