import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>C-Brain Admin</h1>
        <ol>
          <li>
            Get started by editing <code>apps/admin/app/page.tsx</code>
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <Button className={styles.primary}>Primary action</Button>
          <Button className={styles.secondary} variant="outline">
            Open alert
          </Button>
        </div>
      </main>
    </div>
  );
}
