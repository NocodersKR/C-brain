import Image from "next/image";

import type { BlogPost } from "../_types/blog";

import { BlogAuthorMeta } from "./BlogAuthorMeta";
import styles from "../page.module.css";

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className={styles.blogCard}>
      <div className={styles.blogCardImage}>
        <Image
          alt={post.title}
          className={styles.blogCardImageAsset}
          fill
          sizes="(min-width: 1080px) 340px, (min-width: 640px) 50vw, 100vw"
          src={post.image}
        />
      </div>
      <div className={styles.blogCardBody}>
        <p className={styles.blogCardCategory}>{post.category}</p>
        <div className={styles.blogCardCopy}>
          <h3 className={styles.blogCardTitle}>{post.title}</h3>
          <p className={styles.blogCardSummary}>{post.summary}</p>
        </div>
        <BlogAuthorMeta author={post.author} publishedAt={post.publishedAt} />
      </div>
    </article>
  );
}
