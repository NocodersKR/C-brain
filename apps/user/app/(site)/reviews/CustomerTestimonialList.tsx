"use client";

import { TextButton } from "@repo/ui/text-button";
import { useState } from "react";

import { Icon } from "../../../components/Icon";
import type { CustomerTestimonial } from "../../_content/customerReviews";
import styles from "../../page.module.css";

const TESTIMONIALS_PER_PAGE = 6;

type CustomerTestimonialListProps = {
  testimonials: readonly CustomerTestimonial[];
};

export function CustomerTestimonialList({
  testimonials,
}: CustomerTestimonialListProps) {
  const [visibleCount, setVisibleCount] = useState(TESTIMONIALS_PER_PAGE);
  const visibleTestimonials = testimonials.slice(0, visibleCount);
  const hasMoreTestimonials = visibleCount < testimonials.length;

  const handleLoadMore = () => {
    setVisibleCount((currentCount) => currentCount + TESTIMONIALS_PER_PAGE);
  };

  return (
    <div className={styles.reviewsTestimonialList}>
      <ul className={styles.reviewsTestimonialGrid} id="customer-review-list">
        {visibleTestimonials.map((review) => (
          <li className={styles.reviewsTestimonialCard} key={review.id}>
            <article
              aria-label={`${review.title} 고객 후기`}
              className={styles.reviewsTestimonialArticle}
            >
              <div className={styles.reviewsTestimonialContent}>
                <p className={styles.reviewsStars} aria-label="별점 5점">
                  ★★★★★
                </p>
                <blockquote>{review.body}</blockquote>
              </div>
              <span className={styles.reviewsDivider} aria-hidden="true" />
              <footer className={styles.reviewsTestimonialMeta}>
                <p>{review.name}</p>
                <span>{review.company}</span>
              </footer>
            </article>
          </li>
        ))}
      </ul>

      {hasMoreTestimonials ? (
        <TextButton
          aria-controls="customer-review-list"
          lineHeight="20px"
          onClick={handleLoadMore}
          rightIcon={<Icon name="arrow-down" size={16} />}
          textColor="var(--landing-brand-500)"
        >
          더보기
        </TextButton>
      ) : null}
    </div>
  );
}
