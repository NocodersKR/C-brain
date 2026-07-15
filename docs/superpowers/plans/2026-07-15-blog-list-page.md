# Blog List Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 피그마 P/T/F/M 프레임과 일치하는 `/blog` 목록 페이지를 만들고 게시글 데이터와 UI를 서버 연결 가능한 구조로 분리한다.

**Architecture:** Next.js App Router의 서버 페이지가 공용 `PageHero`와 초기 게시글 데이터를 조합하고, `BlogBoard` 클라이언트 컴포넌트가 카테고리 필터 상태만 관리한다. 카드, 상담 박스, 인기글 목록은 표시 전용 컴포넌트로 분리하며 모든 콘텐츠는 타입이 지정된 더미 데이터에서 주입한다.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, `next/image`, 기존 `@repo/ui` Button과 `HorizontalDragScroll`

## Global Constraints

- 구현 범위는 블로그 목록 `/blog`이며 상세 페이지 `/blog/[id]`는 만들지 않는다.
- 피그마 기준 노드는 P `33:3195`, T `40:4123`, F `41:4575`, M `41:5097`이다.
- 공통 브레이크포인트 `640px`, `1080px`, `1440px`를 사용한다.
- 게시글 데이터와 표시 컴포넌트를 분리하고 컴포넌트 내부에 게시글 배열을 하드코딩하지 않는다.
- 새 외부 라이브러리는 추가하지 않는다.
- 기존 랜딩 페이지 시각 스타일은 변경하지 않는다.

---

### Task 1: Figma Assets and Typed Blog Data

**Files:**
- Create: `apps/user/public/figma-assets/blog-hero-background.png`
- Create: `apps/user/public/figma-assets/blog-featured.png`
- Create: `apps/user/app/(site)/blog/_types/blog.ts`
- Create: `apps/user/app/(site)/blog/_constants/blogCategories.ts`
- Create: `apps/user/app/(site)/blog/_data/blogPosts.ts`
- Create: `apps/user/app/(site)/blog/_utils/filterBlogPosts.ts`

**Interfaces:**
- Produces: `BlogCategory`, `BlogPost`, `BLOG_CATEGORIES`, `blogPosts`, `filterBlogPosts(posts, category)`.
- `BlogPost` fields are `id`, `category`, `title`, `summary`, `publishedAt`, `author`, `image`, `featured`, and optional `popularRank`.

- [ ] **Step 1: Export the two missing Figma images**

Export node `33:3297` as `blog-hero-background.png` and node `33:3948` as `blog-featured.png`. Keep the existing `blog-brochure.png` and `blog-print-guide.png` for ordinary cards.

- [ ] **Step 2: Define the shared category and post types**

```ts
export const BLOG_CATEGORY_VALUES = [
  "브로슈어·카탈로그",
  "리플렛·팜플렛",
  "디자인 실무팁",
  "인쇄 실무팁",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORY_VALUES)[number];

export type BlogPost = {
  id: string;
  category: BlogCategory;
  title: string;
  summary: string;
  publishedAt: string;
  author: string;
  image: string;
  featured: boolean;
  popularRank?: number;
};
```

- [ ] **Step 3: Define tab values and typed dummy posts**

```ts
export const BLOG_CATEGORIES = ["전체", ...BLOG_CATEGORY_VALUES] as const;
export type BlogCategoryFilter = (typeof BLOG_CATEGORIES)[number];
```

Create eight posts matching the Figma count. The first post uses `blog-featured.png`; remaining posts alternate the two existing blog images. Set `popularRank` from 1 through 5 on five posts.

- [ ] **Step 4: Add the pure filtering utility**

```ts
export function filterBlogPosts(
  posts: readonly BlogPost[],
  category: BlogCategoryFilter,
) {
  if (category === "전체") return posts;
  return posts.filter((post) => post.category === category);
}
```

- [ ] **Step 5: Verify the data layer**

Run: `corepack pnpm --filter user check-types`

Expected: route type generation and TypeScript compilation both succeed.

---

### Task 2: Blog Hero and Page Shell

**Files:**
- Create: `apps/user/app/(site)/blog/page.tsx`
- Create: `apps/user/app/(site)/blog/page.module.css`

**Interfaces:**
- Consumes: `PageHero`.
- Produces: the `/blog` route with the shared site header and footer supplied by `(site)/layout.tsx`.

- [ ] **Step 1: Compose the blog hero with the shared component**

```tsx
<PageHero
  backgroundImage="/figma-assets/blog-hero-background.png"
  backgroundPosition="center"
  badge="C · Brain Blog"
  description={
    <p>
      26년 경력 전문가 씨브레인이 직접 작성하는
      <br />
      브로슈어 · 카탈로그 · 인쇄물 제작에 관한 실전 정보
    </p>
  }
  title="홍보물 제작 · 디자인 · 인쇄 실무 꿀팁"
/>
```

- [ ] **Step 2: Add a page-level style hook for Figma-specific hero sizing**

Use a local wrapper only where the blog frame differs from generic subpage defaults. Preserve the shared hero component and avoid route-name conditionals inside it.

- [ ] **Step 3: Verify the route compiles**

Run: `corepack pnpm --filter user check-types`

Expected: `/blog` appears in generated route types and compilation succeeds.

---

### Task 3: Blog Board and Display Components

**Files:**
- Modify: `apps/user/app/(site)/blog/page.tsx`
- Create: `apps/user/app/(site)/blog/_components/BlogBoard.tsx`
- Create: `apps/user/app/(site)/blog/_components/BlogFeaturedCard.tsx`
- Create: `apps/user/app/(site)/blog/_components/BlogCard.tsx`
- Create: `apps/user/app/(site)/blog/_components/BlogAuthorMeta.tsx`
- Create: `apps/user/app/(site)/blog/_components/BlogConsultCard.tsx`
- Create: `apps/user/app/(site)/blog/_components/BlogPopularList.tsx`

**Interfaces:**
- `BlogBoard({ posts }: { posts: readonly BlogPost[] })` owns `activeCategory`.
- Card components consume one `BlogPost` and do not own filtering or data fetching.
- `BlogPopularList` consumes posts whose `popularRank` is defined.

- [ ] **Step 1: Build the interactive category tabs**

Use `HorizontalDragScroll` around a button row. Each button uses `aria-pressed={activeCategory === category}` and a named `handleCategoryChange` callback. Do not use inline event handlers.

- [ ] **Step 2: Derive visible featured and ordinary posts**

```ts
const visiblePosts = filterBlogPosts(posts, activeCategory);
const featuredPost = visiblePosts.find((post) => post.featured) ?? visiblePosts[0];
const ordinaryPosts = visiblePosts.filter(
  (post) => post.id !== featuredPost?.id,
);
```

Render a friendly empty state when `featuredPost` is undefined.

- [ ] **Step 3: Implement the featured card**

Use `next/image` with `fill`, a stable `aspect-ratio`, a bottom dark overlay, category badge, title, summary, and `1/3` visual index. Render the card as an `article`; do not link to `/blog/${post.id}` before that detail route exists.

- [ ] **Step 4: Implement the ordinary card and author metadata**

Use the supplied image, category badge, clamped title and summary, turquoise author mark, author name, and formatted date. Set meaningful image alt text from the article title.

- [ ] **Step 5: Implement consult and TOP5 panels**

The consult panel contains `카카오톡으로 1:1 상담하기`, supporting copy, and a `지금 상담 시작하기` button with arrow icon. The popular list sorts by `popularRank` and shows five numbered, single-line titles.

- [ ] **Step 6: Assemble placement hooks**

Render one desktop sidebar consult card and popular list, plus one fold/mobile consult card in the ordinary-card flow. CSS controls which placement is visible; do not duplicate the data or state.

- [ ] **Step 7: Inject the board into the route**

Import `blogPosts` and render `<BlogBoard posts={blogPosts} />` after the hero in `page.tsx`.

- [ ] **Step 8: Verify semantics and types**

Run: `corepack pnpm --filter user lint`

Expected: no warnings or errors, including hooks and accessibility rules.

Run: `corepack pnpm --filter user check-types`

Expected: TypeScript succeeds.

---

### Task 4: Responsive Figma Styling

**Files:**
- Modify: `apps/user/app/(site)/blog/page.module.css`

**Interfaces:**
- Consumes the class names emitted by all Task 3 components.
- Produces P/T/F/M layouts without JavaScript viewport detection.

- [ ] **Step 1: Implement the shared list header and tabs**

Set the list section to `104px` vertical padding at P and `72px` elsewhere. Use a `1080px` body width at P, fluid width with `20px` side padding below P, `52px` from heading to content, and a `20px` tab-to-featured-card gap.

- [ ] **Step 2: Implement P and T layout**

At `min-width: 1080px`, use a main grid with `minmax(0, 2fr) minmax(280px, 1fr)` and `20px` gap. Ordinary cards form two equal columns with `32px` row gap. The sidebar has `32px` vertical gap.

- [ ] **Step 3: Implement F layout**

From `640px` through `1079px`, keep two ordinary-card columns, hide the sidebar, and show the in-flow consult card as a full-width grid item after the first four ordinary posts.

- [ ] **Step 4: Implement M layout**

Below `640px`, use one card column, full-width images, and show the in-flow consult card after the first four ordinary posts. Preserve `20px` horizontal page padding.

- [ ] **Step 5: Implement overflow-safe tabs**

Use the existing breakout pattern: the scroll viewport extends through section padding, while the first and last button receive logical `20px` outer spacing. Keep mouse drag, touch scrolling, keyboard arrows, and hidden scrollbar behavior.

- [ ] **Step 6: Add stable text and media constraints**

Use CSS `line-clamp` for card title and summary, fixed line heights, stable aspect ratios, `min-width: 0`, and `overflow-wrap: anywhere` where required. Do not calculate layout from fractional pixel values copied from Figma.

---

### Task 5: Navigation Integration

**Files:**
- Modify: `apps/user/app/_components/Header.tsx`
- Modify: `apps/user/app/_components/BlogSection.tsx`

**Interfaces:**
- Produces a real `/blog` route link from the shared header and landing-page button.

- [ ] **Step 1: Change the header blog target**

Change only the blog nav item from `#blog` to `/blog`. Use `usePathname()` so `/blog` is active on direct entry and refresh; keep existing mobile dialog behavior.

- [ ] **Step 2: Link the landing blog action**

Render the existing button appearance inside a Next.js `Link` or apply the same action styling to a semantic link so `블로그 전체 보기` navigates to `/blog` without a nested interactive element.

- [ ] **Step 3: Verify navigation**

Open `/`, activate `블로그 전체 보기`, confirm `/blog` loads. Refresh `/blog` and confirm the header blog item remains active.

---

### Task 6: Automated and Visual Verification

**Files:**
- Modify only files required by defects found during verification.

- [ ] **Step 1: Run static checks**

Run: `corepack pnpm --filter user lint`

Expected: exit code 0 with no warnings.

Run: `corepack pnpm --filter user check-types`

Expected: exit code 0.

- [ ] **Step 2: Run the production build**

Run: `corepack pnpm --filter user build`

Expected: successful Next.js production build containing `/blog`.

- [ ] **Step 3: Start the user dev server**

Run: `corepack pnpm --filter user dev`

Expected: a local URL on port `3000`, or the next available port when `3000` is occupied.

- [ ] **Step 4: Compare responsive screenshots**

Inspect `/blog` at `1920x1080`, `1080x900`, `640x900`, and `390x844`. Compare the hero, list header, tabs, representative card, ordinary card columns, consult placement, TOP5 visibility, footer, text wrapping, and horizontal overflow against the four Figma frames.

- [ ] **Step 5: Exercise interactions**

Click each category without scroll jumps, drag the tabs with a mouse at narrow desktop widths, use arrow keys while the tab viewport is focused, and verify cards never resize the surrounding layout during image load.

- [ ] **Step 6: Review the final diff**

Run: `git diff --check`

Expected: no whitespace errors.

Run: `git status --short`

Expected: only blog feature files and the two intentional shared-navigation files are modified.
