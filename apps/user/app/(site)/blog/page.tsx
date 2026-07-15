import { PageHero } from "../../../components/PageHero";

import styles from "./page.module.css";

export default function BlogPage() {
  return (
    <div className={styles.page}>
      <PageHero
        backgroundImage="/figma-assets/blog-hero-background.png"
        backgroundPosition="center"
        badge="C · Brain Blog"
        description={
          <p className={styles.description}>
            26년 경력 전문가 씨브레인이 직접 작성하는
            <br />
            브로슈어 · 카탈로그 · 인쇄물 제작에 관한 실전 정보
          </p>
        }
        title={
          <span className={styles.title}>
            홍보물 제작 · 디자인 · 인쇄 실무 꿀팁
          </span>
        }
      />
    </div>
  );
}
