import { SectionLayout } from "../../components/SectionLayout";
import styles from "../page.module.css";
import { ServiceCards } from "./ServiceCards";

export function ServicesSection() {
  return (
    <SectionLayout
      badge="서비스"
      badgeClassName={styles.serviceKicker}
      description="투명한 정찰 견적으로 바로 주문하거나, 맞춤 견적 상담 후, 제작할 수 있습니다."
      descriptionClassName={styles.serviceDescription}
      id="services"
      innerClassName={styles.serviceInner}
      title="어떤 홍보물 제작이 필요하신가요?"
      titleClassName={styles.serviceTitle}
    >
      <div className={styles.serviceBody}>
        <ServiceCards showConsultAction />
      </div>
    </SectionLayout>
  );
}
