import { Button } from "@repo/ui/button";

import { Icon } from "../../../../components/Icon";

import styles from "../page.module.css";

type BlogConsultCardProps = {
  className?: string;
};

export function BlogConsultCard({ className }: BlogConsultCardProps) {
  const cardClassName = className
    ? `${styles.blogConsultCard} ${className}`
    : styles.blogConsultCard;

  return (
    <aside className={cardClassName} aria-label="카카오톡 1:1 상담">
      <div className={styles.blogConsultCopy}>
        <p className={styles.blogConsultEyebrow}>카카오톡으로 1:1 상담하기</p>
        <h3 className={styles.blogConsultTitle}>
          홍보물 제작, 무엇이든 물어보세요.
        </h3>
        <p className={styles.blogConsultDescription}>
          26년 경력 전문가가 제작 목적과 예산에 맞는 방법을 안내합니다.
        </p>
      </div>
      <Button
        className={styles.blogConsultButton}
        rightIcon={<Icon name="arrow-right" size={16} />}
      >
        지금 상담 시작하기
      </Button>
    </aside>
  );
}
