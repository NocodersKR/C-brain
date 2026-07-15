# 헤더 메뉴 아이콘 구현 계획

> **작업 에이전트 필수 지침:** 이 계획을 실행할 때
> `superpowers:executing-plans` 또는 `superpowers:subagent-driven-development`
> 스킬을 사용한다.

**목표:** 공용 헤더 메뉴 아이콘을 피그마 노드 `27:3896`과 동일하게 만든다.

**구조:** 현재 공용 `Header` 컴포넌트의 버튼 구조와 반응형 표시 조건은
유지한다. CSS로 만든 막대 대신 피그마 경로를 담은 인라인 SVG를 사용하고,
버튼 CSS는 투명한 `40px` 클릭 영역만 담당한다.

**기술:** Next.js, React, TypeScript, CSS Modules, 인라인 SVG

## 공통 제약

- 별도 아이콘 패키지나 이미지 파일을 추가하지 않는다.
- 아이콘은 `24px × 24px`, 선 색상은 `#1E293B`, 선 두께는 `2px`이다.
- 버튼 클릭 영역은 `40px × 40px`로 유지한다.
- 헤더의 나머지 레이아웃과 동작은 변경하지 않는다.

---

### 작업 1: 공용 헤더 메뉴 아이콘 교체

**파일:**
- 수정: `apps/user/app/_components/Header.tsx:84`
- 수정: `apps/user/app/page.module.css:123`
- 확인: 실행 중인 사용자 앱의 헤더 DOM과 계산된 스타일

**인터페이스:**
- 입력: 기존 `mobileMenuButton` CSS 클래스와 `메뉴 열기` 접근성 라벨
- 출력: 피그마 경로를 사용하는 `mobileMenuIcon` SVG

- [x] **1단계: 수정 전 실패 상태 확인**

  메뉴 버튼이 보이는 화면 너비에서 현재 버튼을 검사한다. SVG가 없고 막대
  `span` 세 개가 있으며, 테두리와 반투명 배경이 존재하므로 새 사양을
  만족하지 않는 것을 확인한다.

- [x] **2단계: 정확한 SVG 적용**

  `Header.tsx`의 막대 세 개를 아래 SVG로 교체한다.

  ```tsx
  <svg
    aria-hidden="true"
    className={styles.mobileMenuIcon}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      d="M13.5 18H4M20 12H4M20 6H4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
    />
  </svg>
  ```

- [x] **3단계: 버튼과 아이콘 CSS 적용**

  `page.module.css`에서 버튼을 투명한 클릭 영역으로 만들고 SVG 크기를
  고정한다.

  ```css
  .mobileMenuButton {
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--landing-gray-800);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .mobileMenuIcon {
    width: 24px;
    height: 24px;
    display: block;
    flex: 0 0 auto;
  }
  ```

- [x] **4단계: 자동 검사**

  실행 명령:

  ```bash
  pnpm --filter user lint
  pnpm --filter user check-types
  ```

  예상 결과: 두 명령 모두 오류 없이 종료한다.

- [x] **5단계: 브라우저 확인**

  메뉴 버튼이 보이는 화면 너비에서 버튼 `40px × 40px`, SVG
  `24px × 24px`, 계산된 색상 `rgb(30, 41, 59)`, 투명 배경과 테두리
  제거를 확인한다.

- [x] **6단계: 커밋**

  ```bash
  git add apps/user/app/_components/Header.tsx \
    apps/user/app/page.module.css \
    docs/superpowers/specs/2026-07-14-header-menu-icon-design.md \
    docs/superpowers/plans/2026-07-14-header-menu-icon.md
  git commit -m "fix(user): match responsive header menu icon"
  ```
