import type { ElementType, ReactNode } from "react";

import styles from "./SectionLayout.module.css";

type SectionLayoutProps = {
  align?: "center" | "start";
  badge: ReactNode;
  badgeAs?: "h1" | "p";
  badgeClassName?: string;
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  descriptionClassName?: string;
  headerClassName?: string;
  headingClassName?: string;
  id?: string;
  innerClassName?: string;
  title: ReactNode;
  titleClassName?: string;
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function SectionLayout({
  align = "start",
  badge,
  badgeAs = "p",
  badgeClassName,
  children,
  className,
  description,
  descriptionClassName,
  headerClassName,
  headingClassName,
  id,
  innerClassName,
  title,
  titleClassName,
}: SectionLayoutProps) {
  const Badge = badgeAs as ElementType;
  const isCentered = align === "center";

  return (
    <section className={joinClassNames(styles.section, className)} id={id}>
      <div className={joinClassNames(styles.inner, innerClassName)}>
        <div
          className={joinClassNames(
            styles.header,
            isCentered ? styles.centered : undefined,
            headerClassName,
          )}
        >
          <Badge className={joinClassNames(styles.badge, badgeClassName)}>
            {badge}
          </Badge>
          <div className={joinClassNames(styles.heading, headingClassName)}>
            <h2 className={joinClassNames(styles.title, titleClassName)}>
              {title}
            </h2>
            {description ? (
              <p
                className={joinClassNames(
                  styles.description,
                  descriptionClassName,
                )}
              >
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
