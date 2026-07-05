"use client";

import {
  type CSSProperties,
  type ChangeEvent,
  type InputHTMLAttributes,
  forwardRef,
  useId,
  useState,
} from "react";

export interface ToggleProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
  offLabel?: string;
  onLabel?: string;
  showStateLabel?: boolean;
}

const wrapStyle: CSSProperties = {
  height: 40,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontFamily: "var(--font-sans)",
  cursor: "pointer",
};

const hiddenInputStyle: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  border: 0,
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  overflow: "hidden",
  whiteSpace: "nowrap",
};

const trackStyle: CSSProperties = {
  position: "relative",
  width: 48,
  height: 24,
  borderRadius: 12,
  flex: "0 0 auto",
};

const thumbStyle: CSSProperties = {
  position: "absolute",
  top: 2,
  width: 20,
  height: 20,
  borderRadius: 12,
  background: "#f8faff",
};

const textStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "21px",
  letterSpacing: "-0.21px",
  whiteSpace: "nowrap",
};

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      checked,
      className,
      defaultChecked = false,
      disabled,
      id,
      offLabel = "OFF",
      onChange,
      onLabel = "ON",
      showStateLabel = true,
      style,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const toggleId = id ?? generatedId;
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isChecked = isControlled ? checked : internalChecked;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalChecked(event.target.checked);
      onChange?.(event);
    };

    return (
      <label
        className={className}
        htmlFor={toggleId}
        style={{
          ...wrapStyle,
          cursor: disabled ? "not-allowed" : wrapStyle.cursor,
          ...style,
        }}
      >
        <input
          {...props}
          checked={checked}
          defaultChecked={isControlled ? undefined : defaultChecked}
          disabled={disabled}
          id={toggleId}
          onChange={handleChange}
          ref={ref}
          role="switch"
          style={hiddenInputStyle}
          type="checkbox"
        />
        <span
          aria-hidden="true"
          style={{
            ...trackStyle,
            background: disabled ? "#d1d7e2" : "#0360ef",
            opacity: disabled || isChecked ? 1 : 0.5,
          }}
        >
          <span
            style={{
              ...thumbStyle,
              boxShadow: isChecked ? "0 2px 2px rgba(0, 0, 0, 0.5)" : undefined,
              left: isChecked ? 26 : 2,
            }}
          />
        </span>
        {showStateLabel ? (
          <span
            style={{
              ...textStyle,
              color: disabled ? "#d1d7e2" : "#1b1f2a",
            }}
          >
            {isChecked ? onLabel : offLabel}
          </span>
        ) : null}
      </label>
    );
  },
);

Toggle.displayName = "Toggle";
