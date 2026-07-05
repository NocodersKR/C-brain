import {
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { Button } from "./button";

type DialogActionVariant = "solid" | "outline";

export type DialogAction = {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: DialogActionVariant;
};

export interface DialogProps {
  actions: DialogAction[];
  className?: string;
  description?: ReactNode;
  onClose?: MouseEventHandler<HTMLButtonElement>;
  open?: boolean;
  style?: CSSProperties;
  title: string;
}

const wrapStyle: CSSProperties = {
  width: 350,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 8,
  fontFamily: "var(--font-sans)",
};

const closeButtonStyle: CSSProperties = {
  width: 24,
  height: 24,
  padding: 0,
  border: 0,
  background: "transparent",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const panelStyle: CSSProperties = {
  width: "100%",
  padding: "16px 20px",
  borderRadius: 16,
  background: "#ffffff",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const textWrapStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const titleStyle: CSSProperties = {
  color: "#1b1f2a",
  fontSize: 16,
  fontWeight: 700,
  lineHeight: "24px",
  letterSpacing: "-0.24px",
};

const descriptionStyle: CSSProperties = {
  color: "#262c3a",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "21px",
  letterSpacing: "-0.21px",
};

const actionsStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  gap: 8,
};

const neutralOutlineStyle: CSSProperties = {
  color: "#1b1f2a",
  borderColor: "#e9ecf2",
};

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 7L17 17M17 7L7 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function Dialog({
  actions,
  className,
  description,
  onClose,
  open = true,
  style,
  title,
}: DialogProps) {
  if (!open) return null;

  return (
    <section
      aria-label={title}
      className={className}
      role="dialog"
      style={{ ...wrapStyle, ...style }}
    >
      <button
        aria-label="닫기"
        onClick={onClose}
        style={closeButtonStyle}
        type="button"
      >
        <CloseIcon />
      </button>
      <div style={panelStyle}>
        <div style={textWrapStyle}>
          <strong style={titleStyle}>{title}</strong>
          {description ? (
            <div style={descriptionStyle}>{description}</div>
          ) : null}
        </div>
        <div style={actionsStyle}>
          {actions.slice(0, 2).map((action) => (
            <Button
              key={action.label}
              onClick={action.onClick}
              size="sm"
              style={
                action.variant === "outline" ? neutralOutlineStyle : undefined
              }
              variant={action.variant ?? "solid"}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
