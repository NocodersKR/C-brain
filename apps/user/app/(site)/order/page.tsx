import type { CSSProperties } from "react";

import { CtaSection } from "../../_components/CtaSection";
import { OrderFlowSection } from "./OrderFlowSection";
import styles from "./page.module.css";

const heroStyle = {
  "--order-hero-background": 'url("/figma-assets/order-hero-background.png")',
} as CSSProperties;

export default function OrderPage() {
  return (
    <div className={styles.orderPage}>
      <section className={styles.hero} style={heroStyle}>
        <div className={styles.heroBackground} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.heroBadge}>주문·결제</p>
            <div className={styles.heroHeading}>
              <h1>
                씨브레인 홍보물 제작
                <br className={styles.heroTitleMobileBreak} />
                <span className={styles.heroTitleDesktopSpace}> </span>
                가격·주문 안내
              </h1>
              <div className={styles.heroDescription}>
                <p>
                  브로슈어·카탈로그·리플렛·팜플렛·포스터·명함 등 모든 홍보물을
                  정찰제 투명한 가격으로 바로 주문하거나,
                </p>
                <p>
                  맞춤 견적 후 제작하실 수 있습니다. 기획 및 디자인부터
                  인쇄까지, 1:1 담당자 배정으로 처음부터 끝까지 함께합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OrderFlowSection />

      <CtaSection
        description="규격·수량·사양이 정해지지 않아도 괜찮습니다. 카카오톡으로 편하게 문의해 주세요."
        id="contact"
        secondaryAction={{ label: "FAQ 보기", href: "/faq" }}
        titleLines={["원하는 홍보물이 따로 있으신가요?"]}
      />
    </div>
  );
}
