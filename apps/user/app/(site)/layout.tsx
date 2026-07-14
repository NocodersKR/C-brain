import type { ReactNode } from "react";

import { Footer } from "../_components/Footer";
import { Header } from "../_components/Header";
import styles from "../page.module.css";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.siteMain}>{children}</main>
      <Footer />
    </div>
  );
}
