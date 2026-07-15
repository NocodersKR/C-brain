import { Button } from "@repo/ui/button";
import type { Metadata } from "next";
import type { CSSProperties } from "react";

import { Icon } from "../../../components/Icon";
import { createGradientBorderButtonStyle } from "../../_components/buttonStyles";
import {
  getPortfolioCategoryIdFromValue,
  portfolioCategories,
  portfolioItems,
  portfolioPageSeo,
} from "../../_content/portfolio";
import { PortfolioGallery } from "./PortfolioGallery";
import styles from "./page.module.css";

type PortfolioPageProps = {
  searchParams?: Promise<{
    category?: string | string[];
  }>;
};

const contactButtonStyle: CSSProperties = {
  ...createGradientBorderButtonStyle({
    padding: "8px 23px",
    tone: "contactKakao",
  }),
  width: "var(--portfolio-cta-button-width)",
};

const priceButtonStyle: CSSProperties = {
  ...createGradientBorderButtonStyle({
    padding: "8px 23px",
  }),
  width: "var(--portfolio-cta-button-width)",
};

const ctaButtonIconStyle: CSSProperties = {
  flex: "0 0 auto",
};

export const metadata: Metadata = {
  description: portfolioPageSeo.description,
  keywords: portfolioPageSeo.keywords,
  openGraph: {
    description: portfolioPageSeo.description,
    locale: "ko_KR",
    siteName: "C-Brain",
    title: portfolioPageSeo.title,
    type: "website",
  },
  title: portfolioPageSeo.title,
  twitter: {
    card: "summary",
    description: portfolioPageSeo.description,
    title: portfolioPageSeo.title,
  },
};

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialCategoryId = getPortfolioCategoryIdFromValue(
    resolvedSearchParams?.category,
  );

  return (
    <div className={styles.portfolioPage}>
      <section className={styles.hero}>
        <div aria-hidden="true" className={styles.heroBackground} />
        <div aria-hidden="true" className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.badge}>Portfolio</p>
          <div className={styles.heroText}>
            <h1>
              <span>씨브레인 포트폴리오</span>
              <span>디자인 제작 사례</span>
            </h1>
            <p>
              <span>
                브로슈어 · 카탈로그 · 리플렛 · 팜플렛 · 포스터 · 명함 등
              </span>
              <span>씨브레인의 실제 제작물을 확인하세요.</span>
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="portfolio-work-title" className={styles.work}>
        <div className={styles.workInner}>
          <div className={styles.workHeader}>
            <p className={styles.badge}>4,000건+ 대표 디자인 제작 사례</p>
            <h2 id="portfolio-work-title">브로슈어 · 카탈로그 제작물</h2>
          </div>

          <PortfolioGallery
            categories={portfolioCategories}
            initialCategoryId={initialCategoryId}
            items={portfolioItems}
          />
        </div>
      </section>

      <section className={styles.cta} id="contact">
        <div aria-hidden="true" className={styles.ctaBackground} />
        <div className={styles.ctaContent}>
          <div className={styles.ctaText}>
            <h2>궁금하신 점, 지금 바로 문의하세요</h2>
            <p>견적부터 납기까지 빠르고 명확하게 안내드립니다.</p>
          </div>
          <div className={styles.ctaActions}>
            <Button style={contactButtonStyle}>
              <span>실시간 카톡상담</span>
              <Icon
                name="message-typing"
                size={24}
                style={ctaButtonIconStyle}
              />
            </Button>
            <Button style={priceButtonStyle}>
              <span>정찰제 가격 보기</span>
              <Icon name="arrow-right" size={24} style={ctaButtonIconStyle} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
