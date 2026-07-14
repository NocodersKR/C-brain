import { Button } from "@repo/ui/button";
import type { CSSProperties } from "react";

import { Icon } from "../../components/Icon";
import styles from "../page.module.css";
import { createGradientBorderButtonStyle } from "./buttonStyles";

const contactButtonPadding = "8px 23px";

const kakaoButtonStyle = createGradientBorderButtonStyle({
  padding: contactButtonPadding,
  tone: "contactKakao",
});

const priceButtonStyle = createGradientBorderButtonStyle({
  padding: contactButtonPadding,
});

const ctaButtonIconStyle: CSSProperties = {
  flex: "0 0 auto",
};

export function CtaSection() {
  return (
    <section className={styles.ctaSection} id="contact">
      <div className={styles.ctaBackground} />
      <div className={styles.ctaContent}>
        <p className={styles.ctaBadge}>지금 바로 시작하세요</p>
        <div className={styles.ctaText}>
          <h2>
            <span>실패 없는 홍보물 디자인 제작,</span>
            <span>
              지금 바로 <strong>씨브레인</strong>에 맡기세요
            </span>
          </h2>
          <p>빠른 상담 · 전국 납품 · 소량부터 대량까지</p>
        </div>
        <div className={styles.ctaRow}>
          <Button style={kakaoButtonStyle}>
            <span>실시간 카톡상담</span>
            <Icon name="message-typing" size={24} style={ctaButtonIconStyle} />
          </Button>
          <Button style={priceButtonStyle}>
            <span>정찰제 가격 보기</span>
            <Icon name="arrow-right" size={24} style={ctaButtonIconStyle} />
          </Button>
        </div>
      </div>
    </section>
  );
}
