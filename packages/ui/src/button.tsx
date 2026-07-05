import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
  forwardRef,
} from "react";

type ButtonVariant = "solid" | "outline";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const baseStyle: CSSProperties = {
  height: 52,
  padding: "8px 16px",
  borderRadius: 16,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  fontWeight: 700,
  lineHeight: "21px",
  letterSpacing: 0,
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

const variantStyles = {
  solid: {
    color: "#f8faff",
    background: "#0360ef",
    border: "1px solid #0360ef",
  },
  outline: {
    color: "#0360ef",
    background: "#ffffff",
    border: "1px solid #0360ef",
  },
} satisfies Record<ButtonVariant, CSSProperties>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled,
      leftIcon,
      rightIcon,
      style,
      type = "button",
      variant = "solid",
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
          ...variantStyles[variant],
          opacity: disabled ? 0.4 : undefined,
          cursor: disabled ? "not-allowed" : baseStyle.cursor,
          ...style,
        }}
      >
        {leftIcon ? <span style={iconStyle}>{leftIcon}</span> : null}
        {children}
        {rightIcon ? <span style={iconStyle}>{rightIcon}</span> : null}
      </button>
    );
  },
);

Button.displayName = "Button";
