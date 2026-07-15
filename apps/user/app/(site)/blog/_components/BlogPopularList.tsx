import type { BlogPost } from "../_types/blog";

import styles from "../page.module.css";

type BlogPopularListProps = {
  posts: readonly BlogPost[];
};

export function BlogPopularList({ posts }: BlogPopularListProps) {
  const popularPosts = [...posts]
    .sort((first, second) => first.popularRank! - second.popularRank!)
    .slice(0, 5);

  return (
    <section className={styles.blogPopularList} aria-labelledby="blog-popular-title">
      <div className={styles.blogPopularHeading}>
        <p className={styles.blogPopularEyebrow}>Popular posts</p>
        <h2 id="blog-popular-title">TOP 5</h2>
      </div>
      <ol className={styles.blogPopularItems}>
        {popularPosts.map((post) => (
          <li className={styles.blogPopularItem} key={post.id}>
            <span className={styles.blogPopularRank}>{post.popularRank}</span>
            <span className={styles.blogPopularTitle}>{post.title}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
