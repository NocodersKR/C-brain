import { BLOG_CATEGORY_VALUES } from "../_types/blog";

export const BLOG_CATEGORIES = ["전체", ...BLOG_CATEGORY_VALUES] as const;

export type BlogCategoryFilter = (typeof BLOG_CATEGORIES)[number];
