import type { BlogCategoryFilter } from "../_constants/blogCategories";
import type { BlogPost } from "../_types/blog";

export function filterBlogPosts(
  posts: readonly BlogPost[],
  category: BlogCategoryFilter,
) {
  if (category === "전체") return posts;

  return posts.filter((post) => post.category === category);
}
