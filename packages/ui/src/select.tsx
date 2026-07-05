"use client";

import {
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  forwardRef,
  useId,
  useMemo,
  useState,
} from "react";

export type SelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

export interface SelectProps {
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  id?: string;
  label?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  readOnly?: boolean;
  style?: CSSProperties;
  value?: string;
}

const fieldWrapStyle: CSSProperties = {
  width: 350,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  fontFamily: "var(--font-sans)",
};

const controlWrapStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const labelStyle: CSSProperties = {
  color: "#1b1f2a",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "21px",
  letterSpacing: "-0.21px",
};

const triggerStyle: CSSProperties = {
  width: "100%",
  height: 52,
  padding: "0 16px",
  borderRadius: 16,
  border: "1px solid #e9ecf2",
  background: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "21px",
  letterSpacing: "-0.21px",
  cursor: "pointer",
};

const valueStyle: CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const iconStyle: CSSProperties = {
  flex: "0 0 auto",
};

const dropdownStyle: CSSProperties = {
  position: "absolute",
  zIndex: 20,
  top: 56,
  left: 0,
  width: "100%",
  maxHeight: 256,
  padding: 0,
  border: "1px solid #f6f8fb",
  borderRadius: 16,
  background: "#ffffff",
  overflowX: "hidden",
  overflowY: "auto",
  listStyle: "none",
};

const optionStyle: CSSProperties = {
  width: "100%",
  height: 52,
  padding: "0 16px",
  border: 0,
  borderBottom: "1px solid #f6f8fb",
  background: "#ffffff",
  color: "#1b1f2a",
  display: "flex",
  alignItems: "center",
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "21px",
  letterSpacing: "-0.21px",
  textAlign: "left",
  cursor: "pointer",
};

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      style={iconStyle}
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
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

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      className,
      defaultValue = "",
      disabled,
      id,
      label,
      name,
      onValueChange,
      options,
      placeholder = "필요 내용을 선택해주세요.",
      readOnly,
      style,
      value,
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const listboxId = `${selectId}-listbox`;
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const currentValue = isControlled ? value : internalValue;
    const selectedIndex = options.findIndex(
      (option) => option.value === currentValue,
    );
    const selectedOption =
      selectedIndex >= 0 ? options[selectedIndex] : undefined;
    const firstEnabledIndex = useMemo(
      () => options.findIndex((option) => !option.disabled),
      [options],
    );
    const [activeIndex, setActiveIndex] = useState(
      selectedIndex >= 0 ? selectedIndex : firstEnabledIndex,
    );
    const isInactive = disabled || readOnly;
    const hasValue = Boolean(selectedOption);
    const activeOptionId =
      activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined;

    const openDropdown = () => {
      if (isInactive || firstEnabledIndex < 0) return;
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : firstEnabledIndex);
      setIsOpen(true);
    };

    const closeDropdown = () => {
      setIsOpen(false);
    };

    const selectOption = (option: SelectOption) => {
      if (option.disabled) return;
      if (!isControlled) setInternalValue(option.value);
      onValueChange?.(option.value);
      closeDropdown();
    };

    const moveActive = (direction: 1 | -1) => {
      const enabledIndexes = options
        .map((option, index) => (option.disabled ? -1 : index))
        .filter((index) => index >= 0);

      if (!enabledIndexes.length) return;

      const currentPosition = enabledIndexes.indexOf(activeIndex);
      const nextPosition =
        currentPosition < 0
          ? 0
          : (currentPosition + direction + enabledIndexes.length) %
            enabledIndexes.length;

      const nextIndex = enabledIndexes[nextPosition];
      if (nextIndex === undefined) return;

      setActiveIndex(nextIndex);
      setIsOpen(true);
    };

    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
      const nextTarget = event.relatedTarget as Node | null;
      if (!nextTarget || !event.currentTarget.contains(nextTarget))
        closeDropdown();
    };

    const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (isInactive) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveActive(1);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveActive(-1);
        return;
      }

      if (event.key === "Escape") {
        closeDropdown();
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!isOpen) {
          openDropdown();
          return;
        }

        const activeOption = options[activeIndex];
        if (activeOption) selectOption(activeOption);
      }
    };

    return (
      <div
        className={className}
        onBlur={handleBlur}
        style={{ ...fieldWrapStyle, ...style }}
      >
        {label ? (
          <label htmlFor={selectId} style={labelStyle}>
            {label}
          </label>
        ) : null}
        {name ? (
          <input
            disabled={disabled}
            name={name}
            type="hidden"
            value={currentValue}
          />
        ) : null}
        <div style={controlWrapStyle}>
          <button
            aria-activedescendant={isOpen ? activeOptionId : undefined}
            aria-controls={isOpen ? listboxId : undefined}
            aria-disabled={isInactive || undefined}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            disabled={disabled}
            id={selectId}
            onClick={() => (isOpen ? closeDropdown() : openDropdown())}
            onKeyDown={handleKeyDown}
            ref={ref}
            role="combobox"
            style={{
              ...triggerStyle,
              background: isInactive ? "#e9ecf2" : triggerStyle.background,
              borderColor: isInactive ? "#d1d7e2" : "#e9ecf2",
              color: disabled
                ? "#848da0"
                : readOnly
                  ? "#3f4759"
                  : hasValue
                    ? "#1b1f2a"
                    : "#848da0",
              cursor: isInactive ? "not-allowed" : triggerStyle.cursor,
            }}
            type="button"
          >
            <span style={valueStyle}>
              {selectedOption?.label ?? placeholder}
            </span>
            <ChevronDownIcon />
          </button>
          {isOpen ? (
            <ul id={listboxId} role="listbox" style={dropdownStyle}>
              {options.map((option, index) => {
                const isActive = index === activeIndex;
                const isSelected = option.value === currentValue;

                return (
                  <li
                    aria-disabled={option.disabled || undefined}
                    aria-selected={isSelected}
                    id={`${listboxId}-${index}`}
                    key={option.value}
                    role="option"
                  >
                    <button
                      disabled={option.disabled}
                      onClick={() => selectOption(option)}
                      onMouseDown={handleMouseDown}
                      style={{
                        ...optionStyle,
                        background: isActive
                          ? "#f6f8fb"
                          : optionStyle.background,
                        borderBottom:
                          index === options.length - 1
                            ? 0
                            : optionStyle.borderBottom,
                        color: option.disabled ? "#848da0" : optionStyle.color,
                        cursor: option.disabled
                          ? "not-allowed"
                          : optionStyle.cursor,
                      }}
                      type="button"
                    >
                      {option.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    );
  },
);

Select.displayName = "Select";
