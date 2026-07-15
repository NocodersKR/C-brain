import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Icon } from "../../../../components/Icon";
import {
  getPortfolioCategoryIdFromValue,
  getPortfolioCategoryLabel,
  getPortfolioDetailBySlug,
  getPortfolioDetailHref,
  getPortfolioDetailSeo,
  getPortfolioListHref,
  portfolioItems,
} from "../../../_content/portfolio";
import styles from "./page.module.css";

type PortfolioDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    category?: string | string[];
  }>;
};

export function generateStaticParams() {
  return portfolioItems.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: PortfolioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = getPortfolioDetailBySlug(slug);

  if (!detail) {
    return {
      title: "포트폴리오 상세 | C-Brain",
    };
  }

  const seo = getPortfolioDetailSeo(detail);

  return {
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      description: seo.description,
      locale: "ko_KR",
      siteName: "C-Brain",
      title: seo.title,
      type: "article",
    },
    title: seo.title,
    twitter: {
      card: "summary",
      description: seo.description,
      title: seo.title,
    },
  };
}

export default async function PortfolioDetailPage({
  params,
  searchParams,
}: PortfolioDetailPageProps) {
  const { slug } = await params;
  const detail = getPortfolioDetailBySlug(slug);

  if (!detail) {
    notFound();
  }

  const { categoryLabel, item, relatedItems } = detail;
  const resolvedSearchParams = await searchParams;
  const listCategoryId =
    getPortfolioCategoryIdFromValue(resolvedSearchParams?.category) ??
    item.categoryId;
  const listHref = getPortfolioListHref(listCategoryId);

  return (
    <article className={styles.detailPage}>
      <div className={styles.detailInner}>
        <header className={styles.detailHeader}>
          <p className={styles.categoryBadge}>{categoryLabel}</p>
          <div className={styles.titleGroup}>
            <h1>
              {item.title} - {item.client}
            </h1>
            <p className={styles.authorLine}>
              <span>작성자</span>
              <Icon
                className={styles.authorIcon}
                name="cbrain-author"
                size={20}
              />
              <span>{item.author}</span>
            </p>
          </div>
        </header>

        <div className={styles.detailContent}>
          <div className={styles.detailImageList}>
            {item.detailImages.map((image) => (
              <div className={styles.detailImageFrame} key={image.src}>
                <Image
                  alt={image.alt}
                  className={styles.detailImage}
                  fill
                  priority={image.src === item.detailImages[0]?.src}
                  sizes="(min-width: 768px) 640px, calc(100vw - 40px)"
                  src={image.src}
                />
              </div>
            ))}
          </div>

          <p className={styles.description}>{item.description}</p>
        </div>

        <Link className={styles.backLink} href={listHref}>
          목록으로
        </Link>

        <section
          aria-labelledby="related-portfolio-title"
          className={styles.relatedSection}
        >
          <h2 id="related-portfolio-title">더 많은 포트폴리오</h2>
          <div className={styles.relatedList}>
            {relatedItems.map((relatedItem) => (
              <Link
                aria-label={`${relatedItem.client} ${relatedItem.title} 상세 보기`}
                className={styles.relatedCard}
                href={getPortfolioDetailHref(relatedItem, listCategoryId)}
                key={relatedItem.slug}
              >
                <div className={styles.relatedImageFrame}>
                  <Image
                    alt={`${relatedItem.client} ${relatedItem.title}`}
                    className={styles.relatedImage}
                    fill
                    sizes="(min-width: 640px) 200px, calc(100vw - 40px)"
                    src={relatedItem.image}
                  />
                </div>
                <div className={styles.relatedCardBody}>
                  <span className={styles.relatedTag}>
                    {getPortfolioCategoryLabel(relatedItem.categoryId)}
                  </span>
                  <div className={styles.relatedText}>
                    <p>{relatedItem.client}</p>
                    <h3>{relatedItem.title}</h3>
                    <span>{relatedItem.summary}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
