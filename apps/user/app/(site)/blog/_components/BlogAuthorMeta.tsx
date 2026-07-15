import type { BlogPost } from "../_types/blog";

import styles from "../page.module.css";

type BlogAuthorMetaProps = Pick<BlogPost, "author" | "publishedAt">;

export function BlogAuthorMeta({ author, publishedAt }: BlogAuthorMetaProps) {
  return (
    <div className={styles.blogAuthorMeta}>
      <span aria-hidden="true" className={styles.blogAuthorMark}>
        C
      </span>
      <span className={styles.blogAuthorName}>{author}</span>
      <time className={styles.blogPublishedAt}>{publishedAt}</time>
    </div>
  );
}
