---
version: alpha
name: Pretendard Type Scale
description: Typography reference extracted from the provided design image.
fontFamily:
  base: Pretendard
  fallback: "Apple SD Gothic Neo", "Noto Sans KR", sans-serif
weights:
  M: 500
  B: 700
---

# Typography

`M` = `500`, `B` = `700`.

| Label | Token | Font | Weight | Size | Line height |
| --- | --- | --- | ---: | ---: | ---: |
| 프리텐다드 / M / 12 / 18 | `pretendard-medium-12` | Pretendard | 500 | 12px | 18px |
| 프리텐다드 / B / 12 / 18 | `pretendard-bold-12` | Pretendard | 700 | 12px | 18px |
| 프리텐다드 / M / 14 / 21 | `pretendard-medium-14` | Pretendard | 500 | 14px | 21px |
| 프리텐다드 / B / 14 / 21 | `pretendard-bold-14` | Pretendard | 700 | 14px | 21px |
| 프리텐다드 / M / 16 / 24 | `pretendard-medium-16` | Pretendard | 500 | 16px | 24px |
| 프리텐다드 / B / 16 / 24 | `pretendard-bold-16` | Pretendard | 700 | 16px | 24px |
| 프리텐다드 / M / 18 / 26 | `pretendard-medium-18` | Pretendard | 500 | 18px | 26px |
| 프리텐다드 / B / 18 / 26 | `pretendard-bold-18` | Pretendard | 700 | 18px | 26px |
| 프리텐다드 / M / 20 / 30 | `pretendard-medium-20` | Pretendard | 500 | 20px | 30px |
| 프리텐다드 / B / 20 / 30 | `pretendard-bold-20` | Pretendard | 700 | 20px | 30px |
| 프리텐다드 / M / 22 / 32 | `pretendard-medium-22` | Pretendard | 500 | 22px | 32px |
| 프리텐다드 / B / 22 / 32 | `pretendard-bold-22` | Pretendard | 700 | 22px | 32px |
| 프리텐다드 / M / 24 / 32 | `pretendard-medium-24` | Pretendard | 500 | 24px | 32px |
| 프리텐다드 / B / 24 / 32 | `pretendard-bold-24` | Pretendard | 700 | 24px | 32px |
| 프리텐다드 / M / 28 / 36 | `pretendard-medium-28` | Pretendard | 500 | 28px | 36px |
| 프리텐다드 / B / 28 / 36 | `pretendard-bold-28` | Pretendard | 700 | 28px | 36px |
| 프리텐다드 / M / 32 / 40 | `pretendard-medium-32` | Pretendard | 500 | 32px | 40px |
| 프리텐다드 / B / 32 / 40 | `pretendard-bold-32` | Pretendard | 700 | 32px | 40px |

# Iconography

Icons must be imported and used as SVG assets only. Do not use PNG, JPG, webfont, emoji, or rasterized icon sources for product UI icons.

Downloaded icon assets must live under `apps/web/public/icons`. Component-specific icons should be grouped by component, for example `apps/web/public/icons/button/arrow-right-solid.svg`.

Before downloading a new icon, always check `apps/web/public/icons` and `apps/web/components/icons.tsx` first. If an icon with the same name already exists, reuse the existing icon instead of downloading or creating another copy.

## 아이콘 규칙

- 아이콘 SVG를 사용하되, 24px 박스에 `100%`로 꽉 채워 넣지 않는다.
- 래퍼는 기본 24px 고정이고, 특이한 경우에만 `frameSize`(아이콘 래퍼)로 개별 조정한다.
- 특수 케이스에서는 SVG 크기를 `glyphSize`로 보정한다.
- `object-fit: fill/cover` 같은 강제 확대 대신 `contain` 또는 고정 `width/height`로 비율을 유지한다.
- 아이콘 자체를 다른 타입의 텍스트/이미지와 같은 방식으로 다루지 않고, 레이아웃 간격 규칙(`padding`, `gap`, `center`)을 유지한다.

## Icons 규격

- SVG asset 저장 위치: `apps/web/public/icons`
- 버튼 아이콘 저장 위치: `apps/web/public/icons/button`
- 신규 아이콘 다운로드 전 `apps/web/public/icons`와 `apps/web/components/icons.tsx`에 동일 이름 아이콘이 있는지 먼저 확인한다.
- 동일 이름 아이콘이 이미 있으면 기존 아이콘을 꺼내서 사용하고, 중복 SVG 파일을 만들지 않는다.
- 단일 파일 규격: `apps/web/components/icons.tsx`
- 파일 내 항목
  - 아이콘 타입: `FigmaIconAsset`
  - 아이콘 데이터 배열: `figmaArrowIcons`
  - 갤러리 컴포넌트: `FigmaArrowGallery`
  - 개별 아이콘 컴포넌트: `ArrowCurveLeftDownIcon`
- 컴포넌트명 규칙
  - 개별 아이콘 컴포넌트는 `*Icon` 접미사를 사용한다 (`ArrowCurveLeftDownIcon`).
  - 갤러리 컴포넌트는 `FigmaArrowGallery`를 사용한다.
- CSS 규격
  - 별도 모듈 파일을 사용하지 않고 `icons.tsx`의 `styles` 객체로 관리한다.
