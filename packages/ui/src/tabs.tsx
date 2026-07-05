"use client";

import {
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";

export type TabItem = {
  disabled?: boolean;
  label: ReactNode;
  value: string;
};

export interface TabsProps {
  "aria-label"?: string;
  className?: string;
  defaultValue?: string;
  items: TabItem[];
  onValueChange?: (value: string) => void;
  style?: CSSProperties;
  value?: string;
}

const tabListStyle: CSSProperties = {
  width: 390,
  display: "flex",
  alignItems: "center",
  fontFamily: "var(--font-sans)",
};

const tabStyle: CSSProperties = {
  minWidth: 0,
  flex: "1 1 0",
  height: 52,
  padding: 0,
  borderTop: 0,
  borderRight: 0,
  borderLeft: 0,
  background: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  lineHeight: "21px",
  whiteSpace: "nowrap",
  cursor: "pointer",
};

function getFirstEnabledValue(items: TabItem[]) {
  return items.find((item) => !item.disabled)?.value ?? items[0]?.value ?? "";
}

export function Tabs({
  "aria-label": ariaLabel = "탭",
  className,
  defaultValue,
  items,
  onValueChange,
  style,
  value,
}: TabsProps) {
  const firstEnabledValue = useMemo(() => getFirstEnabledValue(items), [items]);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? firstEnabledValue,
  );
  const selectedValue = isControlled ? value : internalValue;

  const selectValue = (item: TabItem) => {
    if (item.disabled) return;
    if (!isControlled) setInternalValue(item.value);
    onValueChange?.(item.value);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const enabledIndexes = items
      .map((item, itemIndex) => (item.disabled ? -1 : itemIndex))
      .filter((itemIndex) => itemIndex >= 0);

    if (!enabledIndexes.length) return;

    const currentPosition = enabledIndexes.indexOf(index);
    let nextPosition = currentPosition < 0 ? 0 : currentPosition;

    if (event.key === "ArrowRight") nextPosition += 1;
    else if (event.key === "ArrowLeft") nextPosition -= 1;
    else if (event.key === "Home") nextPosition = 0;
    else if (event.key === "End") nextPosition = enabledIndexes.length - 1;
    else return;

    event.preventDefault();

    const nextIndex =
      enabledIndexes[
        (nextPosition + enabledIndexes.length) % enabledIndexes.length
      ];
    if (nextIndex === undefined) return;

    const nextItem = items[nextIndex];
    if (!nextItem) return;

    selectValue(nextItem);
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [nextIndex]?.focus();
  };

  return (
    <div
      aria-label={ariaLabel}
      className={className}
      role="tablist"
      style={{ ...tabListStyle, ...style }}
    >
      {items.map((item, index) => {
        const isSelected = item.value === selectedValue;

        return (
          <button
            aria-selected={isSelected}
            disabled={item.disabled}
            key={item.value}
            onClick={() => selectValue(item)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            role="tab"
            style={{
              ...tabStyle,
              borderBottom: isSelected
                ? "2px solid #0360ef"
                : "1px solid #e9ecf2",
              color: isSelected
                ? "#0360ef"
                : item.disabled
                  ? "#d1d7e2"
                  : "#848da0",
              cursor: item.disabled ? "not-allowed" : tabStyle.cursor,
              fontWeight: isSelected ? 700 : 500,
              letterSpacing: isSelected ? 0 : "-0.21px",
            }}
            tabIndex={isSelected ? 0 : -1}
            type="button"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
