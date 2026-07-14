# 반응형 헤더 내비게이션 구현 계획

> **작업 에이전트 필수 지침:** 이 계획을 실행할 때
> `superpowers:executing-plans` 또는 `superpowers:subagent-driven-development`
> 스킬을 사용한다.

**목표:** 공용 헤더 메뉴 버튼에 피그마 LNB 패널의 열기·닫기·이동 동작을
추가한다.

**구조:** `Header.tsx`가 패널 열림 상태와 접근성 동작을 관리하고 기존
`navItems`를 데스크톱과 반응형 내비게이션이 함께 사용한다. CSS Modules가
고정 오버레이, `320px` 패널과 `52px` 메뉴 행을 표현한다.

**기술:** Next.js, React, TypeScript, CSS Modules, 인라인 SVG

## 공통 제약

- 기존 데스크톱 내비게이션과 링크 목적지는 변경하지 않는다.
- 새 패키지나 이미지 파일을 추가하지 않는다.
- 피그마에 없는 그림자, 색상, 애니메이션을 추가하지 않는다.
- 글자 간격은 프로젝트 규칙에 따라 `0`을 사용한다.

---

### 작업 1: 메뉴 패널 동작과 스타일 구현

**파일:**
- 수정: `apps/user/app/_components/Header.tsx`
- 수정: `apps/user/app/page.module.css`
- 확인: 로컬 사용자 앱의 헤더 DOM과 계산된 스타일

- [x] **1단계: 수정 전 실패 상태 확인**

  현재 메뉴 버튼을 클릭한 뒤 `모바일 메뉴` 대화상자와 `메뉴 닫기` 버튼이
  생성되지 않는지 확인한다.

- [x] **2단계: Header 상태와 접근성 동작 구현**

  `Header.tsx`에 `isMenuOpen`, 메뉴·닫기 버튼 ref, 스크롤 잠금, `Escape`
  처리와 데스크톱 전환 시 닫기 처리를 추가한다. 메뉴 버튼에는
  `aria-expanded`, `aria-controls`, `ref`를 연결한다.

- [x] **3단계: LNB 마크업 구현**

  열린 상태에서 투명 오버레이와 `role="dialog"`, `aria-modal="true"`,
  `aria-label="모바일 메뉴"` 패널을 렌더링한다. 닫기 버튼에는 피그마 경로
  `M16 8L8 16M16 16L8 8`을 사용하고 기존 `navItems`를 링크로 렌더링한다.

- [x] **4단계: 피그마 CSS 구현**

  패널 `320px × 484px`, 내부 여백 `8px`, 행 높이 `52px`, 행 좌우 여백
  `16px`, 둥글기 `16px`, 글자 `16px/24px/500`, 글자색 `#222222`, 선택
  배경 `#F6F8FB`를 적용한다. `1440px` 이상에서는 오버레이를 숨긴다.

- [x] **5단계: 자동 검사**

  ```bash
  pnpm --filter user lint
  pnpm --filter user check-types
  pnpm --filter user build
  ```

  예상 결과: 모든 명령이 오류 없이 종료한다.

- [x] **6단계: 브라우저 상호작용 확인**

  메뉴 버튼으로 열기, 닫기 버튼·바깥 영역·`Escape`·메뉴 링크로 닫기를
  확인한다. 패널과 행의 계산된 크기 및 색상이 피그마 값과 일치하는지
  검사한다.

- [x] **7단계: 커밋**

  ```bash
  git add apps/user/app/_components/Header.tsx \
    apps/user/app/page.module.css \
    docs/superpowers/specs/2026-07-14-responsive-header-nav-design.md \
    docs/superpowers/plans/2026-07-14-responsive-header-nav.md
  git commit -m "feat(user): add responsive header navigation"
  ```
