import type { SVGProps } from "react";

type SavedIconDefinition = {
  d: string;
  groupId: string;
};

type SavedIconRenderProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  icon: SavedIconDefinition;
  size?: number;
};

export type SavedIconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  size?: number;
};

const savedArrowIconVectors = {
  "arrow-curve-left-down": {
    d: "M8.91401 9.17198L3.6 14.486L8.91401 19.8M3.6 14.486H16.4C18.6091 14.486 20.4 12.6951 20.4 10.486V4.2",
    groupId: "arrow-curve-left-down",
  },
  "arrow-curve-left-right": {
    d: "M15.086 9.17198L20.4 14.486L15.086 19.8M20.4 14.486H7.60001C5.39087 14.486 3.6 12.6951 3.6 10.486V4.2",
    groupId: "arrow-curve-left-right",
  },
  "arrow-curve-left-up": {
    d: "M8.91401 14.828L3.6 9.51401L8.91401 4.2M3.6 9.51401L16.4 9.51401C18.6091 9.51401 20.4 11.3049 20.4 13.514L20.4 19.8",
    groupId: "arrow-curve-left-up",
  },
  "arrow-down-left": {
    d: "M14.828 15.086L9.51401 20.4L4.2 15.086M9.51401 20.4L9.51401 7.60001C9.51401 5.39087 11.3049 3.6 13.514 3.6L19.8 3.6",
    groupId: "arrow-down-left",
  },
  "arrow-curve-up-left": {
    d: "M14.828 8.91401L9.51401 3.6L4.2 8.91401M9.51401 3.6L9.51401 16.4C9.51401 18.6091 11.3049 20.4 13.514 20.4L19.8 20.4",
    groupId: "arrow-curve-up-left",
  },
  "arrow-curve-right-up": {
    d: "M15.086 14.828L20.4 9.51401L15.086 4.2M20.4 9.51401L7.60001 9.51401C5.39087 9.51401 3.6 11.3049 3.6 13.514L3.6 19.8",
    groupId: "arrow-curve-right-up",
  },
  "arrow-left-square-contained": {
    d: "M11.376 8.02252L7.49997 12L11.376 15.9775M7.49997 12H16.0164M20.9999 6.37498L20.9999 17.625C20.9999 19.489 19.4889 21 17.6249 21H6.37498C4.51103 21 3 19.489 3 17.625V6.37498C3 4.51103 4.51103 3 6.37498 3H17.6249C19.4889 3 20.9999 4.51103 20.9999 6.37498Z",
    groupId: "arrow-left-square-contained",
  },
  "arrow-right-square-contained": {
    d: "M12.6239 15.9775L16.4999 12L12.6239 8.02252M16.4999 12H7.98347M3 17.625L3 6.37498C3 4.51103 4.51103 3 6.37498 3L17.6249 3C19.4889 3 20.9999 4.51103 20.9999 6.37498V17.625C20.9999 19.489 19.4889 21 17.6249 21H6.37498C4.51103 21 3 19.489 3 17.625Z",
    groupId: "arrow-right-square-contained",
  },
  "arrow-up-square-contained": {
    d: "M15.2813 14.3828V8.75772H9.65625M15.2813 8.75772L9.1875 14.8515M17.625 21L6.37498 21C4.51103 21 3 19.489 3 17.625L3 6.375C3 4.51104 4.51103 3 6.37498 3L17.625 3C19.489 3 21 4.51104 21 6.375V17.625C21 19.489 19.489 21 17.625 21Z",
    groupId: "arrow-up-square-contained",
  },
  "arrow-down-square-contained": {
    d: "M8.02255 12.6239L12.0001 16.5L15.9776 12.6239M12.0001 16.5L12.0001 7.9835M6.375 3L17.6251 3C19.4891 3 21.0001 4.51104 21.0001 6.375L21.0001 17.625C21.0001 19.489 19.4891 21 17.6251 21L6.375 21C4.51104 21 3 19.489 3 17.625L3 6.375C3 4.51104 4.51104 3 6.375 3Z",
    groupId: "arrow-down-square-contained",
  },
} as const;

function SavedIcon({ size = 20, icon, ...props }: SavedIconRenderProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      {...props}
      data-name={icon.groupId}
    >
      <g id={icon.groupId}>
        <path
          d={icon.d}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

function createSavedIcon(iconName: keyof typeof savedArrowIconVectors) {
  const icon = savedArrowIconVectors[iconName];

  const SavedIconComponent = (props: SavedIconProps) => (
    <SavedIcon icon={icon} {...props} />
  );
  SavedIconComponent.displayName = `Saved${iconName
    .replace(/(^|-)([a-z])/g, (_, __, c: string) => c.toUpperCase())
    .replace("-", "")}Icon`;

  return SavedIconComponent;
}

export const SavedArrowCurveLeftDownIcon = createSavedIcon(
  "arrow-curve-left-down",
);
export const SavedArrowCurveLeftRightIcon = createSavedIcon(
  "arrow-curve-left-right",
);
export const SavedArrowCurveLeftUpIcon = createSavedIcon("arrow-curve-left-up");
export const SavedArrowDownLeftIcon = createSavedIcon("arrow-down-left");
export const SavedArrowCurveUpLeftIcon = createSavedIcon("arrow-curve-up-left");
export const SavedArrowCurveRightUpIcon = createSavedIcon(
  "arrow-curve-right-up",
);
export const SavedArrowLeftSquareContainedIcon = createSavedIcon(
  "arrow-left-square-contained",
);
export const SavedArrowRightSquareContainedIcon = createSavedIcon(
  "arrow-right-square-contained",
);
export const SavedArrowUpSquareContainedIcon = createSavedIcon(
  "arrow-up-square-contained",
);
export const SavedArrowDownSquareContainedIcon = createSavedIcon(
  "arrow-down-square-contained",
);
