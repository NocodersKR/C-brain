import { Button } from "@repo/ui/button";
import type { CSSProperties } from "react";

import { Icon } from "../../../components/Icon";
import { orderMethods, orderProducts, orderSteps } from "../../_content/order";
import { createGradientBorderButtonStyle } from "../../_components/buttonStyles";
import styles from "./page.module.css";

const heroStyle = {
  "--order-hero-background": 'url("/figma-assets/order-hero-background.png")',
} as CSSProperties;

const ctaStyle = {
  "--order-cta-background": 'url("/figma-assets/landing-cta-background.jpg")',
} as CSSProperties;

const textButtonBaseStyle: CSSProperties = {
  height: 20,
  padding: 0,
  border: 0,
  background: "transparent",
  fontFamily: '"Pretendard GOV Variable", var(--font-sans)',
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "20px",
  letterSpacing: 0,
};

const productButtonStyles = {
  brand: {
    ...textButtonBaseStyle,
    color: "#30bac3",
  },
  quote: {
    ...textButtonBaseStyle,
    color: "#43a0f5",
  },
} satisfies Record<"brand" | "quote", CSSProperties>;

const kakaoButtonStyle: CSSProperties = {
  ...createGradientBorderButtonStyle({
    padding: "8px 23px",
    tone: "contactKakao",
  }),
  width: "var(--order-cta-button-width)",
};

const faqButtonStyle: CSSProperties = {
  ...createGradientBorderButtonStyle({
    padding: "8px 23px",
  }),
  width: "var(--order-cta-button-width)",
};

const ctaButtonIconStyle: CSSProperties = {
  flex: "0 0 auto",
};

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
              <h1>씨브레인 홍보물 제작 가격·주문 안내</h1>
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

      <section className={styles.orderFlow} aria-labelledby="order-flow-title">
        <div className={styles.orderInner}>
          <h2 className={styles.visuallyHidden} id="order-flow-title">
            상품유형 주문 단계
          </h2>

          <ol className={styles.stepList} aria-label="주문 진행 단계">
            {orderSteps.map((step) => (
              <li
                className={`${styles.stepItem} ${
                  step.state === "active" ? styles.stepItemActive : ""
                }`}
                key={step.label}
              >
                {step.label}
              </li>
            ))}
          </ol>

          <div className={styles.methodGrid}>
            {orderMethods.map((method) => (
              <article
                className={`${styles.methodCard} ${
                  method.state === "active" ? styles.methodCardActive : ""
                }`}
                key={method.title}
              >
                <p className={styles.methodLabel}>{method.label}</p>
                <div className={styles.methodCopy}>
                  <h3>{method.title}</h3>
                  <p>{method.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.productSectionHeader}>
            <p>Ⅰ. 카테고리 선택</p>
          </div>

          <div className={styles.productGrid}>
            {orderProducts.map((product, index) => (
              <article
                className={`${styles.productCard} ${
                  index === 0 ? styles.productCardActive : ""
                }`}
                key={product.title}
              >
                <div className={styles.productContent}>
                  <span
                    className={`${styles.productIcon} ${
                      product.actionTone === "quote"
                        ? styles.productIconQuote
                        : ""
                    }`}
                  >
                    <Icon name={product.icon} size={24} />
                  </span>
                  <div className={styles.productCopy}>
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                  </div>
                </div>

                <div
                  className={`${styles.productMeta} ${
                    product.actionTone === "quote"
                      ? styles.productMetaQuote
                      : ""
                  }`}
                >
                  {product.price ? <strong>{product.price}</strong> : null}
                  <Button
                    rightIcon={<Icon name="arrow-right" size={16} />}
                    style={productButtonStyles[product.actionTone]}
                  >
                    {product.actionLabel}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection} style={ctaStyle}>
        <div className={styles.ctaBackground} />
        <div className={styles.ctaContent}>
          <div className={styles.ctaText}>
            <h2>원하는 홍보물이 따로 있으신가요?</h2>
            <p>
              규격·수량·사양이 정해지지 않아도 괜찮습니다. 카카오톡으로 편하게
              문의해 주세요.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <Button style={kakaoButtonStyle}>
              <span>카카오톡 1:1문의</span>
              <Icon
                name="message-typing"
                size={24}
                style={ctaButtonIconStyle}
              />
            </Button>
            <Button style={faqButtonStyle}>
              <span>FAQ 보기</span>
              <Icon name="arrow-right" size={24} style={ctaButtonIconStyle} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
