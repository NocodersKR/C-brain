import assert from "node:assert/strict";
import test from "node:test";

import { filterBlogPosts } from "../../apps/user/app/(site)/blog/_utils/filterBlogPosts.ts";

const posts = [
  {
    id: "brochure",
    category: "브로슈어·카탈로그",
    title: "브로슈어 게시글",
    summary: "브로슈어 요약",
    publishedAt: "2026. 07. 15",
    author: "씨브레인",
    image: "/figma-assets/blog-brochure.png",
    featured: true,
  },
  {
    id: "printing",
    category: "인쇄 실무팁",
    title: "인쇄 게시글",
    summary: "인쇄 요약",
    publishedAt: "2026. 07. 14",
    author: "씨브레인",
    image: "/figma-assets/blog-print-guide.png",
    featured: false,
  },
] as const;

test("전체 필터는 입력 게시글 배열을 그대로 반환한다", () => {
  assert.equal(filterBlogPosts(posts, "전체"), posts);
});

test("카테고리 필터는 일치하는 게시글만 반환한다", () => {
  assert.deepEqual(filterBlogPosts(posts, "인쇄 실무팁"), [posts[1]]);
});

test("일치하는 카테고리가 없으면 빈 배열을 반환한다", () => {
  assert.deepEqual(filterBlogPosts(posts, "리플렛·팜플렛"), []);
});
