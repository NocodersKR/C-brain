import type { ReactElement, SVGProps } from "react";
import {
  SavedArrowCurveLeftDownIcon,
  SavedArrowCurveLeftRightIcon,
  SavedArrowCurveLeftUpIcon,
  SavedArrowCurveRightUpIcon,
  SavedArrowCurveUpLeftIcon,
  SavedArrowDownLeftIcon,
  SavedArrowDownSquareContainedIcon,
  SavedArrowLeftSquareContainedIcon,
  SavedArrowRightSquareContainedIcon,
  SavedArrowUpSquareContainedIcon,
} from "./icons";

type IconName =
  | "arrow-left"
  | "arrow-right"
  | "chevron-down"
  | "arrow-curve-left-down"
  | "arrow-curve-left-right"
  | "arrow-curve-left-up"
  | "arrow-down-left"
  | "arrow-curve-up-left"
  | "arrow-curve-right-up"
  | "arrow-left-square-contained"
  | "arrow-right-square-contained"
  | "arrow-up-square-contained"
  | "arrow-down-square-contained";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  name: IconName;
  size?: number;
};
type IconComponentProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  size?: number;
};
type IconComponent = (props: IconComponentProps) => ReactElement;

function ArrowLeftIcon({ size = 24, ...props }: Omit<IconProps, "name">) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 16 16"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.11088 3.33333L2.66644 8L7.11088 12.6667M2.66644 8L13.3331 8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ArrowRightIcon({ size = 24, ...props }: Omit<IconProps, "name">) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 16 16"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.88889 12.6667L13.3333 8L8.88889 3.33333M13.3333 8L2.66667 8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ChevronDownIcon({ size = 24, ...props }: Omit<IconProps, "name">) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7 10L12 15L17 10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

const icons = {
  "arrow-left": ArrowLeftIcon,
  "arrow-right": ArrowRightIcon,
  "chevron-down": ChevronDownIcon,
  "arrow-curve-left-down": SavedArrowCurveLeftDownIcon,
  "arrow-curve-left-right": SavedArrowCurveLeftRightIcon,
  "arrow-curve-left-up": SavedArrowCurveLeftUpIcon,
  "arrow-down-left": SavedArrowDownLeftIcon,
  "arrow-curve-up-left": SavedArrowCurveUpLeftIcon,
  "arrow-curve-right-up": SavedArrowCurveRightUpIcon,
  "arrow-left-square-contained": SavedArrowLeftSquareContainedIcon,
  "arrow-right-square-contained": SavedArrowRightSquareContainedIcon,
  "arrow-up-square-contained": SavedArrowUpSquareContainedIcon,
  "arrow-down-square-contained": SavedArrowDownSquareContainedIcon,
} satisfies Record<IconName, IconComponent>;

export function Icon({ name, size = 24, ...props }: IconProps) {
  const IconComponent = icons[name];

  return (
    <IconComponent
      aria-hidden="true"
      focusable="false"
      size={size}
      {...props}
    />
  );
}
