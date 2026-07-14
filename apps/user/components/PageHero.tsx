import type { CSSProperties, ReactNode } from "react";

import styles from "./PageHero.module.css";

type PageHeroProps = {
  actions?: ReactNode;
  backgroundImage: string;
  backgroundPosition?: CSSProperties["backgroundPosition"];
  badge: ReactNode;
  description: ReactNode;
  title: ReactNode;
  tone?: "dark" | "light";
  variant?: "landing" | "subpage";
};

export function PageHero({
  actions,
  backgroundImage,
  backgroundPosition = "center",
  badge,
  description,
  title,
  tone = "light",
  variant = "subpage",
}: PageHeroProps) {
  return (
    <section
      className={`${styles.hero} ${styles[variant]} ${styles[tone]}`}
    >
      <div
        aria-hidden="true"
        className={styles.background}
        style={{
          backgroundImage: `url("${backgroundImage}")`,
          backgroundPosition,
        }}
      />
      <div aria-hidden="true" className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.badge}>{badge}</p>
          <div className={styles.heading}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.description}>{description}</div>
          </div>
        </div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </section>
  );
}
