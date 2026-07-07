# C-Brain

## 1. 현재 상태 요약

이 저장소는 C-Brain 프로젝트의 웹 프론트엔드 모노레포입니다. 현재는 **디자인 시스템 기반 작업까지 완료**된 상태이며, 실제 서비스 화면과 기능 개발은 아직 시작 전입니다.

지금까지 만들어진 것: 디자인 토큰(색상·타이포그래피), 공용 UI 컴포넌트 14종, 아이콘 시스템, 글라스모피즘 스타일, 헤더 컴포넌트.

### 기술 스택

| 기술 | 역할 | 한 줄 설명 |
| --- | --- | --- |
| **Next.js** | 웹 프레임워크 | 화면(페이지)을 만드는 도구. 이 프로젝트의 몸통 |
| **Turborepo** | 모노레포 관리 | 여러 프로젝트(web, docs 등)를 한 폴더에서 함께 관리·실행해주는 정리함 |
| **pnpm** | 패키지 매니저 | 외부 라이브러리를 설치·관리하는 도구. `npm`의 빠른 버전 |
| **TypeScript** | 언어 | 자바스크립트에 타입 검사를 더한 언어. 실수를 미리 잡아줌 |
| **React 19** | UI 라이브러리 | 화면을 컴포넌트(부품) 단위로 조립하는 도구 |

## 2. 실행 방법

### 2.1 준비물

- **Node.js 18 이상** — [nodejs.org](https://nodejs.org)에서 LTS 버전 설치
- **pnpm 9** — Node 설치 후 터미널에서:

  ```sh
  npm install -g pnpm@9
  ```

설치 확인:

```sh
node -v   # v18 이상이면 OK
pnpm -v   # 9.x면 OK
```

### 2.2 설치 & 실행

처음 받았을 때 한 번만:

```sh
pnpm install
```

> 프로젝트가 사용하는 외부 라이브러리를 전부 내려받는 명령입니다. 몇 분 걸릴 수 있습니다.

**전체 동시 실행** (web + docs 모두 켜기):

```sh
pnpm dev
```

**개별 실행** (필요한 것만 켜기):

```sh
pnpm dev --filter=web    # web 앱만
pnpm dev --filter=docs   # docs 앱만
```

실행 후 브라우저에서 확인:

| 앱 | 주소 | 설명 |
| --- | --- | --- |
| web | http://localhost:3000 | 실제 서비스가 될 메인 앱 |
| docs | http://localhost:3001 | 문서용 앱 (현재 스타터 상태) |

끌 때는 터미널에서 `Ctrl + C`.

## 3. 폴더 구조와 현재 구현 현황

### 3.1 폴더 지도

```
c-brain/
├── apps/
│   ├── web/                  # 메인 앱 (실제 개발은 여기서)
│   │   ├── app/              #   페이지들 (URL 하나 = 폴더 하나)
│   │   │   ├── color/        #   색상 팔레트 확인용 페이지
│   │   │   └── glass.css     #   글라스모피즘 공용 스타일
│   │   ├── components/       #   web 전용 컴포넌트 (Header, Icon 등)
│   │   └── public/           #   이미지·SVG 등 정적 파일
│   └── docs/                 # 문서용 앱 (아직 스타터 그대로)
├── packages/
│   ├── ui/src/               # 공용 UI 부품 (버튼, 인풋, 다이얼로그 …)
│   ├── eslint-config/        # 코드 검사 설정 (건드릴 일 거의 없음)
│   └── typescript-config/    # 타입스크립트 설정 (건드릴 일 거의 없음)
├── design.md                 # ★ 디자인 시스템 규칙 원본 (작업 전 필독)
├── design-system.css         # ★ 디자인 토큰 (색상·타이포 CSS 변수)
└── AGENTS.md                 # AI 도구가 자동으로 읽는 작업 지침
```

**"이걸 바꾸고 싶으면 여기를 보세요"**

| 하려는 일 | 위치 |
| --- | --- |
| 페이지 추가/수정 | `apps/web/app/` |
| 버튼·인풋 같은 공용 부품 수정 | `packages/ui/src/` |
| 아이콘 추가 | `apps/web/components/Icon.tsx` (먼저 중복 확인) |
| 색상·글꼴 토큰 변경 | `design-system.css` |
| 디자인 규칙 확인 | `design.md` |

### 3.2 구현된 것 목록

- **디자인 토큰** (`design-system.css`) — Pretendard 폰트, 색상 스케일 6종(brand / gray / error / warning / success / info, 각 50~900 단계), 타이포그래피 토큰(`pretendard-medium-12` ~ `pretendard-bold-32`)
- **공용 UI 컴포넌트 14종** (`packages/ui/src`) — accordion, button, card, category, checkbox, code, dialog, input, radio, search-input, select, tabs, text-button, toggle. 가져다 쓸 때는 `import { Button } from "@repo/ui/button"` 형태
- **아이콘 시스템** — `apps/web/components/Icon.tsx`에 등록된 아이콘을 `<Icon name="arrow-left" size={16} />` 형태로 사용. 원본 백업은 `icons.tsx`
- **글라스모피즘 스타일** (`apps/web/app/glass.css`) — `glassSurface`, `glassSurfaceStrong`, `glassSurfacePill`, `glassSurfaceInteractive` 4종
- **헤더 컴포넌트** (`apps/web/components/Header.tsx`) — 글라스 스타일 적용된 상단 내비게이션
- **색상 팔레트 페이지** (`apps/web/app/color`) — 토큰 색상을 눈으로 확인하는 페이지

### 3.3 주의사항: zeroSourcing 잔재

이 저장소는 **zeroSourcing 프로젝트의 기본 세팅을 그대로 가져와서** 시작했습니다. 이름·문구는 c-brain으로 정리했지만, 아직 잔재가 남아 있을 수 있습니다.

- 헤더의 **로고 이미지**(`apps/web/public/figma-assets/logo-mark.svg`, `logo-type.svg`)는 아직 zeroSourcing 그래픽입니다. C-Brain 로고가 나오면 파일 교체 필요
- 그 외 파일·에셋·설정에서 zeroSourcing 흔적을 발견하면 그대로 두지 말고 정리하거나 팀에 공유해 주세요

## 4. 작업 규칙

> 상세 규칙 원본은 [design.md](design.md)입니다. 아래는 요약이며, 충돌 시 원본이 우선입니다.

### 4.1 디자인 시스템 준수

- 글꼴은 **Pretendard 토큰만** 사용 — Medium(500)/Bold(700), 12~32px 정해진 조합만 (`design.md`의 표 참고)
- 색상은 임의의 색상코드를 쓰지 말고 `design-system.css`의 **CSS 변수 토큰** 사용 (예: `var(--color-brand-500)`)

### 4.2 아이콘 규칙

- 아이콘은 **SVG만** 사용 (PNG, 이모지, 아이콘 폰트 금지)
- 반드시 `Icon.tsx`에 등록하고 `<Icon name="..." />` 컴포넌트로 렌더링
- 색상은 `currentColor`로 — 부모의 글자색을 따라가게 하고, 색상별 아이콘 파일을 따로 만들지 않기
- **추가 전에 `Icon.tsx`와 `icons.tsx`에 같은 이름이 있는지 먼저 확인**, 있으면 재사용
- `ButtonIcon`, `HeaderIcon` 같은 로컬 래퍼 컴포넌트 만들지 않기
- 예외(고정색 허용): 로고, 브랜드마크, 파트너 로고, 국기, 일러스트

### 4.3 컴포넌트·레이아웃 규칙

- **공용 부품**은 `packages/ui/src`에, **web 전용 컴포넌트**는 `apps/web/components`에
- 간격은 부모의 `flex/grid` + `gap`으로 — 자식 요소에 `margin`으로 간격 만들지 않기
- 반투명·블러 효과는 직접 `backdrop-filter`를 쓰지 말고 `glass.css`의 `glassSurface` 유틸리티 사용 (헤더·툴바·오버레이 등 떠 있는 UI에만)

## 5. 자주 쓰는 명령어

루트 폴더에서 실행합니다.

| 명령어 | 하는 일 | 언제 쓰나 |
| --- | --- | --- |
| `pnpm dev` | 개발 서버 실행 | 작업하면서 화면 확인할 때 (항상) |
| `pnpm build` | 배포용 빌드 | 배포 전, 빌드가 깨지지 않는지 확인할 때 |
| `pnpm lint` | 코드 검사 | 작업 마무리 후 규칙 위반 확인 |
| `pnpm check-types` | 타입 검사 | 작업 마무리 후 타입 오류 확인 |
| `pnpm format` | 코드 정리 | 들여쓰기 등 스타일 자동 정돈 |

> `--filter=web` 을 붙이면 특정 앱에만 실행됩니다. 예: `pnpm build --filter=web`

## 6. 부록

### 6.1 용어 사전

| 용어 | 뜻 |
| --- | --- |
| 모노레포 | 여러 프로젝트를 저장소 하나에 모아 관리하는 방식 |
| 패키지 | 기능 묶음 단위. `apps/`와 `packages/` 아래 폴더 하나하나가 패키지 |
| 의존성 | 프로젝트가 빌려 쓰는 외부 라이브러리. `pnpm install`로 설치되어 `node_modules`에 저장됨 |
| 개발 서버 | 코드를 고치면 즉시 브라우저에 반영해주는 로컬 서버 (`pnpm dev`) |
| 빌드 | 코드를 실제 배포 가능한 형태로 변환·검증하는 과정 |
| 린트 | 코드 규칙 위반을 자동으로 잡아주는 검사 |
| 타입 체크 | 데이터 종류가 어긋나는 실수를 미리 찾는 검사 |
| 컴포넌트 | 버튼·헤더처럼 화면을 구성하는 재사용 가능한 부품 |
| 디자인 토큰 | 색상·글꼴 값을 변수로 정해둔 것. 토큰만 쓰면 디자인이 일관돼짐 |
| CSS 변수 | `var(--color-brand-500)`처럼 토큰을 코드에서 불러 쓰는 방법 |

### 6.2 프로젝트 링크

| 항목 | 링크 |
| --- | --- |
| Figma 디자인 파일 | _(채워주세요)_ |
| GitHub 저장소 | _(채워주세요)_ |
| 배포 환경 | _(채워주세요)_ |

---

⚠️ **주의**: `node_modules/`, `pnpm-lock.yaml`, `packages/eslint-config`, `packages/typescript-config`는 직접 수정하지 마세요.
