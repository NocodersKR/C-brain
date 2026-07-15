# Task 1 작업 보고서

## 변경 파일

- `apps/user/public/figma-assets/blog-hero-background.png`
  - Figma 노드 `33:3297` 원본 비율(1388x536)로 추출했습니다.
- `apps/user/public/figma-assets/blog-featured.png`
  - Figma 노드 `33:3948` 원본 비율(1772x1000)로 추출하고 PNG로 저장했습니다.
- `apps/user/app/(site)/blog/_types/blog.ts`
  - 카테고리 값, `BlogCategory`, `BlogPost` 타입을 정의했습니다.
- `apps/user/app/(site)/blog/_constants/blogCategories.ts`
  - 전체 탭을 포함하는 `BLOG_CATEGORIES`와 `BlogCategoryFilter`를 정의했습니다.
- `apps/user/app/(site)/blog/_data/blogPosts.ts`
  - 대표 게시글 1개를 포함한 8개의 타입 지정 더미 게시글과 TOP5 순위를 추가했습니다.
- `apps/user/app/(site)/blog/_utils/filterBlogPosts.ts`
  - 전체 또는 카테고리별 게시글을 반환하는 순수 필터 유틸을 추가했습니다.
- `tests/blog/filterBlogPosts.test.mts`
  - 전체, 일치 카테고리, 빈 결과의 필터 동작을 검증하는 테스트를 추가했습니다.

## 검증 명령 및 실제 결과

| 명령 | 실제 결과 |
| --- | --- |
| `node --experimental-strip-types --test tests/blog/filterBlogPosts.test.mts` | 3개 테스트 통과, 실패 0개 |
| `corepack pnpm --filter user check-types` | `next typegen` 및 `tsc --noEmit` 성공 |
| `git diff --check` | 공백 오류 없음 |
| `rg "figma.com/api/mcp/asset|https://www.figma.com/api" apps packages` | 일치 항목 없음 |

## 자체 리뷰

- `BlogPost`의 필수 필드와 선택 `popularRank`를 타입으로 강제했습니다.
- 더미 데이터는 8개이며 첫 항목만 대표 이미지와 `featured: true`를 사용합니다.
- 나머지 7개는 기존 `blog-brochure.png`와 `blog-print-guide.png`를 번갈아 사용합니다.
- 필터 유틸은 전체 탭에서 입력 배열 참조를 그대로 반환하고, 특정 카테고리에서는 일치 게시글만 반환합니다.
- Figma 원격 URL은 소스 코드에 남기지 않았습니다.

## 우려사항

- 없음.
