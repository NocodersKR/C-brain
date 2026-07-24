import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const faqContentPath = new URL("../app/_content/faqs.ts", import.meta.url);

test("FAQ answers do not begin with the company name", async () => {
  const source = await readFile(faqContentPath, "utf8");

  assert.doesNotMatch(source, /answer\s*:\s*(?:\n\s*)?"씨브레인/);
  assert.match(
    source,
    /"홈페이지에서 원하는 제품 카테고리를 선택해 사양·수량을 고르면 즉시 카드결제로 주문하실 수 있습니다\./,
  );
});
