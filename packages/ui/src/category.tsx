"use client";

import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  forwardRef,
  useState,
} from "react";

export type CategoryItem = {
  label: string;
  value: string;
};

export interface CategoryProps {
  className?: string;
  defaultValue?: string;
  items: CategoryItem[];
  onValueChange?: (value: string) => void;
  style?: CSSProperties;
  value?: string;
}

const rootStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  fontFamily: "var(--font-sans)",
};

const itemStyle: CSSProperties = {
  height: 40,
  padding: "0 16px",
  border: 0,
  borderRadius: 16,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  lineHeight: "21px",
  whiteSpace: "nowrap",
  cursor: "pointer",
};

export const Category = forwardRef<HTMLDivElement, CategoryProps>(
  ({ className, defaultValue, items, onValueChange, style, value }, ref) => {
    const firstValue = items[0]?.value ?? "";
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(
      defaultValue ?? firstValue,
    );
    const currentValue = isControlled ? value : internalValue;

    const selectValue = (nextValue: string) => {
      if (!isControlled) setInternalValue(nextValue);
      onValueChange?.(nextValue);
    };

    return (
      <div className={className} ref={ref} style={{ ...rootStyle, ...style }}>
        {items.map((item) => {
          const isSelected = item.value === currentValue;

          return (
            <CategoryButton
              isSelected={isSelected}
              key={item.value}
              onClick={() => selectValue(item.value)}
            >
              {item.label}
            </CategoryButton>
          );
        })}
      </div>
    );
  },
);

Category.displayName = "Category";

interface CategoryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected: boolean;
}

function CategoryButton({ isSelected, style, ...props }: CategoryButtonProps) {
  return (
    <button
      {...props}
      style={{
        ...itemStyle,
        background: isSelected ? "#0360ef" : "#ffffff",
        color: isSelected ? "#f8faff" : "#848da0",
        fontWeight: isSelected ? 700 : 500,
        letterSpacing: isSelected ? 0 : "-0.21px",
        ...style,
      }}
      type="button"
    />
  );
}
