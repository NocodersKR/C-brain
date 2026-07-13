import type { CSSProperties } from "react";

type GradientBorderButtonTone = "brand" | "kakao";

type GradientBorderButtonOptions = {
  height?: number;
  padding?: CSSProperties["padding"];
  tone?: GradientBorderButtonTone;
  width?: number;
};

const fillByTone = {
  brand: "var(--landing-button-brand-fill)",
  kakao: "var(--landing-button-kakao-fill)",
} satisfies Record<GradientBorderButtonTone, string>;

const colorByTone = {
  brand: "#fefefe",
  kakao: "#3b1d1d",
} satisfies Record<GradientBorderButtonTone, string>;

export function createGradientBorderButtonStyle({
  height = 52,
  padding = "8px 24px",
  tone = "brand",
  width = 164,
}: GradientBorderButtonOptions = {}): CSSProperties {
  return {
    height,
    width,
    borderRadius: 32,
    border: "1px solid transparent",
    backgroundClip: "padding-box, border-box, border-box",
    backgroundColor: "transparent",
    backgroundImage: `${fillByTone[tone]}, var(--landing-button-border-end), var(--landing-button-border-start)`,
    backgroundOrigin: "padding-box, border-box, border-box",
    color: colorByTone[tone],
    padding,
  };
}
