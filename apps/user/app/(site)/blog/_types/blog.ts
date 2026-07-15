export const BLOG_CATEGORY_VALUES = [
  "브로슈어·카탈로그",
  "리플렛·팜플렛",
  "디자인 실무팁",
  "인쇄 실무팁",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORY_VALUES)[number];

export type BlogPost = {
  id: string;
  category: BlogCategory;
  title: string;
  summary: string;
  publishedAt: string;
  author: string;
  image: string;
  featured: boolean;
  popularRank?: number;
};
