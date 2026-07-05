"use client";

import {
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  forwardRef,
  useState,
  useId,
} from "react";

type InputStatus = "default" | "error";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  helperText?: string;
  label?: string;
  status?: InputStatus;
}

const fieldWrapStyle: CSSProperties = {
  width: 350,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  fontFamily: "var(--font-sans)",
};

const controlWrapStyle: CSSProperties = {
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

const inputStyle: CSSProperties = {
  width: "100%",
  height: 52,
  padding: "0 16px",
  borderRadius: 16,
  border: "1px solid #dfe3ea",
  background: "#ffffff",
  color: "#1b1f2a",
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "21px",
  letterSpacing: "-0.21px",
  outline: "none",
};

const messageStyle: CSSProperties = {
  margin: 0,
  color: "#ef4444",
  fontSize: 12,
  fontWeight: 500,
  lineHeight: "18px",
  letterSpacing: "-0.18px",
};

const statusStyles = {
  default: {},
  error: {
    borderColor: "#ef4444",
  },
} satisfies Record<InputStatus, CSSProperties>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      disabled,
      errorMessage,
      helperText,
      id,
      label,
      onBlur,
      onFocus,
      readOnly,
      status = "default",
      style,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const message = errorMessage ?? helperText;
    const isError = Boolean(errorMessage) || status === "error";
    const [isFocused, setIsFocused] = useState(false);
    const borderColor = isError ? "#ef4444" : isFocused ? "#0360ef" : undefined;

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    return (
      <div style={fieldWrapStyle}>
        {label ? (
          <label htmlFor={inputId} style={labelStyle}>
            {label}
          </label>
        ) : null}
        <div style={controlWrapStyle}>
          <input
            {...props}
            ref={ref}
            disabled={disabled}
            id={inputId}
            onBlur={handleBlur}
            onFocus={handleFocus}
            readOnly={readOnly}
            style={{
              ...inputStyle,
              ...statusStyles[isError ? "error" : status],
              borderColor,
              background: disabled ? "#f3f4f6" : inputStyle.background,
              color: disabled ? "#9ca3af" : inputStyle.color,
              cursor: disabled ? "not-allowed" : undefined,
              opacity: disabled ? 0.4 : undefined,
              ...style,
            }}
          />
          {message ? (
            <p
              style={{
                ...messageStyle,
                color: isError ? "#ef4444" : "#667085",
              }}
            >
              {message}
            </p>
          ) : null}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";
