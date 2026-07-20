import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ctaPath = new URL("../app/_components/CtaSection.tsx", import.meta.url);
const landingPagePath = new URL("../app/(site)/page.tsx", import.meta.url);
const stylesPath = new URL(
  "../app/_components/CtaSection.module.css",
  import.meta.url,
);

test("CTA section exposes only confirmed content variations", async () => {
  const source = await readFile(ctaPath, "utf8");

  assert.match(source, /badge\?: string/);
  assert.match(source, /description\?: string/);
  assert.match(source, /descriptionSize\?: "sm" \| "md"/);
  assert.match(source, /titleLines: readonly ReactNode\[\]/);
  assert.match(source, /secondaryAction\?: \{/);
  assert.match(source, /label: string/);
  assert.match(source, /href: string/);
  assert.doesNotMatch(source, /backgroundImage\?:/);
});

test("CTA section owns its styles and conditionally renders the second action", async () => {
  const source = await readFile(ctaPath, "utf8");
  const styles = await readFile(stylesPath, "utf8").catch(() => "");

  assert.match(source, /CtaSection\.module\.css/);
  assert.match(source, /secondaryAction \?/);
  assert.match(source, /<Link/);
  assert.match(styles, /\.descriptionSm/);
  assert.match(styles, /\.descriptionMd/);
});

test("landing page passes the landing CTA configuration explicitly", async () => {
  const source = await readFile(landingPagePath, "utf8");

  assert.match(source, /<CtaSection/);
  assert.match(source, /badge="지금 바로 시작하세요"/);
  assert.match(
    source,
    /description="빠른 상담 · 전국 납품 · 소량부터 대량까지"/,
  );
  assert.match(source, /descriptionSize="md"/);
  assert.match(source, /id="contact"/);
  assert.match(source, /label: "정찰제 가격 보기"/);
  assert.match(source, /href: "\/#services"/);
  assert.match(source, /실패 없는 홍보물 디자인 제작,/);
});
