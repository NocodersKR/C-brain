import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

const read = (relativePath) =>
  readFileSync(path.join(repoRoot, relativePath), "utf8");

const extractBetween = (source, start, end) => {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex);

  assert.notEqual(startIndex, -1, `${start} marker should exist`);
  assert.notEqual(endIndex, -1, `${end} marker should exist`);

  return source.slice(startIndex, endIndex);
};

const countMatches = (source, pattern) => source.match(pattern)?.length ?? 0;

test("order page route, content, responsive styles, and navigation are wired", () => {
  const routePath = "apps/user/app/(site)/order/page.tsx";
  const stylesPath = "apps/user/app/(site)/order/page.module.css";
  const contentPath = "apps/user/app/_content/order.ts";

  assert.equal(existsSync(path.join(repoRoot, routePath)), true);
  assert.equal(existsSync(path.join(repoRoot, stylesPath)), true);
  assert.equal(existsSync(path.join(repoRoot, contentPath)), true);

  const routeSource = read(routePath);
  const stylesSource = read(stylesPath);
  const contentSource = read(contentPath);
  const headerSource = read("apps/user/app/_components/Header.tsx");
  const orderMethodsSource = extractBetween(
    contentSource,
    "export const orderMethods",
    "] as const satisfies ReadonlyArray<OrderMethod>;",
  );
  const orderProductsSource = extractBetween(
    contentSource,
    "export const orderProducts",
    "] as const satisfies ReadonlyArray<OrderProduct>;",
  );

  assert.match(routeSource, /export default function OrderPage/);
  assert.match(routeSource, /orderProducts\.map/);
  assert.match(routeSource, /order-hero-background\.png/);
  assert.match(routeSource, /landing-cta-background\.jpg/);
  assert.match(stylesSource, /grid-template-columns:\s*repeat\(3,/);
  assert.match(stylesSource, /grid-template-columns:\s*repeat\(2,/);
  assert.match(stylesSource, /grid-template-columns:\s*1fr/);
  assert.match(stylesSource, /@media \(min-width:\s*1100px\)/);
  assert.equal(countMatches(orderMethodsSource, /title:/g), 2);
  assert.equal(countMatches(orderProductsSource, /title:/g), 9);
  assert.match(contentSource, /브로슈어 · 카탈로그/);
  assert.match(contentSource, /견적 후 주문\(카카오톡\)/);
  assert.match(headerSource, /usePathname/);
  assert.match(headerSource, /href:\s*"\/order"/);
  assert.match(headerSource, /aria-current/);
  assert.doesNotMatch(
    [routeSource, stylesSource, contentSource, headerSource].join("\n"),
    /figma\.com\/api\/mcp\/asset|https:\/\/www\.figma\.com\/api/,
  );
});
