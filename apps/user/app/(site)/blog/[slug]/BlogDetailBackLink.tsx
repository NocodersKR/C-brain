"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import {
  activateBlogListHistory,
  clearActiveBlogListHistory,
  rememberBlogListScrollRestore,
} from "../_utils/blogListHistory";
import styles from "./page.module.css";

type BlogDetailBackLinkProps = {
  href: string;
};

export function BlogDetailBackLink({ href }: BlogDetailBackLinkProps) {
  const router = useRouter();
  const listScrollYRef = useRef<number | null>(null);
  const hasActivatedListHistoryRef = useRef(false);

  useEffect(() => {
    if (hasActivatedListHistoryRef.current) return;

    hasActivatedListHistoryRef.current = true;
    const detailHref = `${window.location.pathname}${window.location.search}`;
    listScrollYRef.current = activateBlogListHistory(href, detailHref);
  }, [href]);

  const handleClick = () => {
    const scrollY = listScrollYRef.current;
    listScrollYRef.current = null;

    if (scrollY !== null) {
      rememberBlogListScrollRestore(href, scrollY);
      clearActiveBlogListHistory();
      router.back();
      return;
    }

    router.push(href);
  };

  return (
    <button className={styles.backLink} onClick={handleClick} type="button">
      목록으로
    </button>
  );
}
