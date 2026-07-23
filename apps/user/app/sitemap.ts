import type { MetadataRoute } from "next";
import { getPublicAssetUrl } from "@repo/supabase/files";
import { listPublishedPortfolioItems } from "@repo/supabase/portfolio";

import { createUserSupabaseClient } from "../lib/supabase";
import { blogPosts } from "./(site)/blog/_data/blogPosts";
import { getNoticePageData } from "./(site)/notice/_data/notices";
import { getCustomerReviewPageData } from "./_content/customerReviews";
import { mapPortfolioRows, portfolioItems } from "./_content/portfolio";
import {
  createSitemapEntries,
  type SitemapDynamicRoute,
} from "./_content/sitemap";

async function loadSitemapPortfolioRoutes(): Promise<SitemapDynamicRoute[]> {
  const supabase = await createUserSupabaseClient();

  if (!supabase) {
    return portfolioItems.map((item) => ({
      changeFrequency: "monthly",
      path: `/portfolio/${item.slug}`,
      priority: 0.7,
    }));
  }

  try {
    const rows = await listPublishedPortfolioItems(supabase);
    return mapPortfolioRows(rows, (path) => getPublicAssetUrl(supabase, path)).map(
      (item) => ({
        changeFrequency: "monthly",
        path: `/portfolio/${item.slug}`,
        priority: 0.7,
      }),
    );
  } catch (error) {
    console.error("Failed to load sitemap portfolio routes.", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [portfolioRoutes, noticePageData, reviewPageData] = await Promise.all([
    loadSitemapPortfolioRoutes(),
    getNoticePageData("all"),
    getCustomerReviewPageData(),
  ]);

  const blogRoutes = blogPosts.map((post) => ({
    changeFrequency: "monthly",
    lastModified: post.publishedAtIso,
    path: `/blog/${post.slug}`,
    priority: 0.65,
  })) satisfies SitemapDynamicRoute[];
  const noticeRoutes = noticePageData.notices.map((notice) => ({
    changeFrequency: "monthly",
    lastModified: notice.publishedAt,
    path: `/notice/${notice.id}`,
    priority: notice.isPinned ? 0.65 : 0.55,
  })) satisfies SitemapDynamicRoute[];
  const reviewRoutes = reviewPageData.customerInterviews.map((interview) => ({
    changeFrequency: "monthly",
    lastModified: interview.publishedAt,
    path: `/reviews/${interview.detailSlug}`,
    priority: 0.6,
  })) satisfies SitemapDynamicRoute[];

  return createSitemapEntries([
    ...portfolioRoutes,
    ...blogRoutes,
    ...reviewRoutes,
    ...noticeRoutes,
  ]);
}
