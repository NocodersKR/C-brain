import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
  forwardRef,
} from "react";

export interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fontSize?: CSSProperties["fontSize"];
  fontWeight?: CSSProperties["fontWeight"];
  leftIcon?: ReactNode;
  letterSpacing?: CSSProperties["letterSpacing"];
  lineHeight?: CSSProperties["lineHeight"];
  rightIcon?: ReactNode;
  textColor?: CSSProperties["color"];
  underline?: boolean;
}

const baseStyle: CSSProperties = {
  maxWidth: 390,
  padding: 0,
  border: 0,
  borderRadius: 16,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  background: "transparent",
  color: "#0360ef",
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "21px",
  letterSpacing: "-0.21px",
  whiteSpace: "nowrap",
  cursor: "pointer",
};

const iconStyle: CSSProperties = {
  width: 16,
  height: 16,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "0 0 auto",
};

export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(
  (
    {
      children,
      className,
      disabled,
      fontSize,
      fontWeight,
      leftIcon,
      letterSpacing,
      lineHeight,
      rightIcon,
      style,
      textColor,
      type = "button",
      underline = false,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        {...props}
        ref={ref}
        className={className}
        disabled={disabled}
        type={type}
        style={{
          ...baseStyle,
          color: textColor ?? baseStyle.color,
          fontSize: fontSize ?? baseStyle.fontSize,
          fontWeight: fontWeight ?? baseStyle.fontWeight,
          lineHeight: lineHeight ?? baseStyle.lineHeight,
          letterSpacing: letterSpacing ?? baseStyle.letterSpacing,
          opacity: disabled ? 0.4 : undefined,
          cursor: disabled ? "not-allowed" : baseStyle.cursor,
          textDecoration: underline ? "underline" : "none",
          textUnderlineOffset: underline ? 3 : undefined,
          ...style,
          fontFamily: baseStyle.fontFamily,
        }}
      >
        {leftIcon ? <span style={iconStyle}>{leftIcon}</span> : null}
        {children}
        {rightIcon ? <span style={iconStyle}>{rightIcon}</span> : null}
      </button>
    );
  },
);

TextButton.displayName = "TextButton";
