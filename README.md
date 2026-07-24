# C-Brain

C-Brain 프론트엔드 모노레포입니다. 현재는 디자인 시스템 기반 작업과 Supabase 접근 패키지 구성이 완료된 상태이며, 실제 서비스 화면과 도메인 기능 개발은 아직 시작 전입니다.

현재 구성된 범위:

- 디자인 토큰: `design-system.css`
- 공용 UI 컴포넌트 14종
- user/admin Next.js 앱
- 공용 Supabase access package

## 1. Tech Stack

| 기술 | 역할 | 설명 |
| --- | --- | --- |
| **Next.js** | App Framework | App Router 기반 user/admin 애플리케이션 |
| **React 19** | UI Layer | 컴포넌트 렌더링 및 인터랙션 구성 |
| **TypeScript** | Language | 정적 타입 기반 개발 |
| **Turborepo** | Monorepo Orchestration | 앱/패키지 작업 실행 및 캐싱 |
| **pnpm** | Package Manager | workspace 의존성 관리 |
| **Supabase** | Backend Platform | 인증, DB, 스토리지 연동 예정 |
| **ESLint / Prettier** | Code Quality | 정적 분석 및 포맷팅 |

## 2. Local Development

### Requirements

- Node.js 18 이상
- pnpm 9 이상

### Install

```bash
pnpm install
```

### Run

```bash
pnpm dev
```

전체 workspace dev task를 실행합니다.

앱 단위 실행:

```bash
pnpm dev --filter=user
pnpm dev --filter=admin
```

기본 로컬 주소:

| 앱 | 주소 |
| --- | --- |
| user | http://localhost:3000 |
| admin | http://localhost:3001 |

서버 종료는 실행 중인 터미널에서 `Ctrl+C`를 사용합니다.

## 3. Repository Layout

```txt
c-brain
├─ apps
│  ├─ user
│  │  ├─ app
│  │  │  ├─ page.tsx
│  │  │  ├─ page.module.css
│  │  │  └─ layout.tsx
│  │  └─ components
│  │     ├─ Icon.tsx
│  │     └─ icons.tsx
│  └─ admin
│     └─ app
│        ├─ page.tsx
│        └─ layout.tsx
├─ packages
│  ├─ supabase
│  │  └─ src
│  ├─ ui
│  │  └─ src
│  ├─ eslint-config
│  └─ typescript-config
├─ design.md
├─ design-system.css
├─ AGENTS.md
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
└─ README.md
```

| 경로 | 용도 |
| --- | --- |
| `apps/user` | 사용자-facing Next.js 앱 |
| `apps/admin` | 관리자용 Next.js 앱 |
| `packages/ui` | 공용 UI primitive |
| `packages/supabase` | Supabase client/server/admin access layer |
| `packages/eslint-config` | workspace ESLint 설정 |
| `packages/typescript-config` | workspace TypeScript 설정 |
| `design.md` | 디자인 시스템 규칙 |
| `design-system.css` | 색상/타이포그래피 CSS token |
| `AGENTS.md` | 작업 에이전트 지침 |

작업 위치 기준:

| 작업 | 위치 |
| --- | --- |
| user 화면/라우트 | `apps/user/app` |
| admin 화면/라우트 | `apps/admin/app` |
| 공용 UI 컴포넌트 | `packages/ui/src` |
| 디자인 토큰 | `design-system.css` |
| 아이콘 추가 | `apps/user/components/Icon.tsx`, `apps/user/components/icons.tsx` |
| Supabase 접근 로직 | `packages/supabase/src` |
| 디자인 규칙 확인 | `design.md` |

## 4. Current Surfaces

### `apps/user`

현재 user 앱은 디자인 시스템 쇼케이스 역할을 합니다.

- typography scale
- color token swatches
- UI 컴포넌트 예시 14종

### `apps/admin`

현재 admin 앱은 초기 Next.js shell 수준입니다. 본격적인 관리자 화면은 아직 구현되지 않았습니다.

### `packages/ui`

구성된 항목:

- `accordion.tsx`
- `button.tsx`
- `card.tsx`
- `category.tsx`
- `checkbox.tsx`
- `code.tsx`
- `dialog.tsx`
- `input.tsx`
- `radio.tsx`
- `search-input.tsx`
- `select.tsx`
- `tabs.tsx`
- `text-button.tsx`
- `toggle.tsx`

### `packages/supabase`

user/admin 앱에서 공통으로 사용하는 Supabase 접근 패키지입니다.

구성된 항목:

- browser/server/admin client factory
- auth/profile helper
- content/portfolio/service/FAQ/inquiry/file/settings data access helper
- database type placeholder
- public package export

현재 data access helper는 초기 부트스트랩 범위입니다. C-Brain 최종 도메인 모델이 확정되면 `packages/supabase/src/types.ts`와 각 data module을 실제 schema 기준으로 재정리해야 합니다.

## 5. Development Rules

### Design System

UI 작업 전에는 `design.md`를 먼저 확인합니다.

현재 디자인 방향:

- dark base
- turquoise / green / purple accent
- Pretendard GOV Variable typography 기준
- 8px 이하 radius 우선
- card-in-card 레이아웃 지양

### Layout / CSS

앱 화면 스타일은 각 앱의 CSS Module에서 관리합니다.

공통 스타일이 필요한 경우:

1. `design.md`에서 규칙 확인
2. `design-system.css`에서 token 확인
3. 재사용 범위가 명확할 때만 `packages/ui`로 이동

### Supabase

Supabase 접근은 앱별로 직접 client를 생성하지 않고 `@repo/supabase`를 통해 사용합니다.

사용 기준:

- 클라이언트 컴포넌트: `createBrowserSupabaseClient`
- 서버 컴포넌트 / route handler: `createServerSupabaseClient`
- service role 전용 작업: `createAdminSupabaseClient`
- 인증/권한 helper: `getCurrentUser`, `getCurrentProfile`, `requireUser`, `requireAdmin`

환경 변수:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

`SUPABASE_SECRET_KEY`는 서버 전용입니다. 클라이언트 컴포넌트에서 import하거나 노출하지 않습니다.

## 6. Common Commands

| 명령어 | 용도 |
| --- | --- |
| `pnpm install` | workspace 의존성 설치 |
| `pnpm dev` | 전체 dev task 실행 |
| `pnpm dev --filter=user` | user 앱만 실행 |
| `pnpm dev --filter=admin` | admin 앱만 실행 |
| `pnpm build` | 전체 build task 실행 |
| `pnpm lint` | 전체 lint 실행 |
| `pnpm check-types` | 전체 TypeScript 검사 |
| `pnpm --filter @repo/ui lint` | UI 패키지 lint |
| `pnpm --filter @repo/supabase check-types` | Supabase 패키지 타입 검사 |

## 7. Bootstrap Note

이 저장소는 zeroSourcing 프로젝트 세팅을 기반으로 시작했습니다. 코드, 에셋, 문서에 legacy naming이 남아 있을 수 있으므로 발견 시 C-Brain 기준으로 정리합니다.

## 8. Maintenance Notes

다음 항목은 목적이 명확할 때만 수정합니다.

- `pnpm-lock.yaml`: 의존성 변경 시 갱신
- `packages/eslint-config`: lint 정책 변경 시 수정
- `packages/typescript-config`: TypeScript 정책 변경 시 수정
- `node_modules`: 직접 수정하지 않음
