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
  const flowSectionPath = "apps/user/app/(site)/order/OrderFlowSection.tsx";
  const methodSelectorPath =
    "apps/user/app/(site)/order/OrderMethodSelector.tsx";
  const dialogPath = "apps/user/app/(site)/order/OrderConsultDialog.tsx";
  const stylesPath = "apps/user/app/(site)/order/page.module.css";
  const contentPath = "apps/user/app/_content/order.ts";

  assert.equal(existsSync(path.join(repoRoot, routePath)), true);
  assert.equal(existsSync(path.join(repoRoot, flowSectionPath)), true);
  assert.equal(existsSync(path.join(repoRoot, methodSelectorPath)), true);
  assert.equal(existsSync(path.join(repoRoot, dialogPath)), true);
  assert.equal(existsSync(path.join(repoRoot, stylesPath)), true);
  assert.equal(existsSync(path.join(repoRoot, contentPath)), true);

  const routeSource = read(routePath);
  const flowSectionSource = read(flowSectionPath);
  const methodSelectorSource = read(methodSelectorPath);
  const dialogSource = read(dialogPath);
  const stylesSource = read(stylesPath);
  const landingStylesSource = read("apps/user/app/page.module.css");
  const contentSource = read(contentPath);
  const headerSource = read("apps/user/app/_components/Header.tsx");
  const orderMethodsSource = extractBetween(
    contentSource,
    "export const orderMethods",
    "] as const satisfies ReadonlyArray<OrderMethod>;",
  );
  const servicesSource = read("apps/user/app/_content/services.ts");
  const servicesArraySource = extractBetween(
    servicesSource,
    "export const services",
    "] as const satisfies ReadonlyArray<ServiceItem>;",
  );
  const serviceCardsSource = read("apps/user/app/_components/ServiceCards.tsx");

  assert.match(routeSource, /export default function OrderPage/);
  assert.match(routeSource, /import \{ OrderFlowSection \}/);
  assert.match(routeSource, /<OrderFlowSection/);
  assert.doesNotMatch(routeSource, /orderProducts\.map/);
  assert.match(routeSource, /order-hero-background\.png/);
  assert.match(routeSource, /씨브레인 홍보물 제작/);
  assert.match(routeSource, /<br className=\{styles\.heroTitleMobileBreak\} \/>/);
  assert.match(routeSource, /heroTitleDesktopSpace/);
  assert.match(routeSource, /가격·주문 안내/);
  assert.match(routeSource, /import \{ CtaSection \}/);
  assert.match(routeSource, /<CtaSection/);
  assert.match(routeSource, /id="contact"/);
  assert.match(routeSource, /titleLines=\{\["원하는 홍보물이 따로 있으신가요\?"\]\}/);
  assert.match(routeSource, /label: "FAQ 보기"/);
  assert.doesNotMatch(routeSource, /styles\.cta/);
  assert.match(flowSectionSource, /"use client"/);
  assert.match(flowSectionSource, /useState/);
  assert.match(flowSectionSource, /import \{ OrderMethodSelector \}/);
  assert.match(flowSectionSource, /import \{ OrderConsultDialog \}/);
  assert.match(flowSectionSource, /<OrderMethodSelector onQuoteSelect=/);
  assert.match(flowSectionSource, /<ServiceCards onQuoteServiceSelect=/);
  assert.match(flowSectionSource, /setIsConsultDialogOpen\(true\)/);
  assert.match(flowSectionSource, /onClose=\{\(\) => setIsConsultDialogOpen\(false\)\}/);
  assert.match(methodSelectorSource, /"use client"/);
  assert.match(methodSelectorSource, /useState/);
  assert.match(methodSelectorSource, /onQuoteSelect\?: \(\) => void/);
  assert.match(methodSelectorSource, /aria-pressed/);
  assert.match(methodSelectorSource, /setSelectedMethodId\(method\.id\)/);
  assert.match(methodSelectorSource, /onQuoteSelect\?\.\(\)/);
  assert.match(methodSelectorSource, /methodCardActiveQuote/);
  assert.match(serviceCardsSource, /"use client"/);
  assert.match(serviceCardsSource, /onQuoteServiceSelect\?:/);
  assert.match(serviceCardsSource, /serviceCardClickable/);
  assert.match(serviceCardsSource, /onQuoteServiceSelect\(service\.title\)/);
  assert.match(dialogSource, /role="dialog"/);
  assert.match(dialogSource, /aria-modal="true"/);
  assert.match(dialogSource, /handleOverlayMouseDown/);
  assert.match(dialogSource, /event\.target === event\.currentTarget/);
  assert.match(dialogSource, /맞춤·대량·촬영/);
  assert.match(dialogSource, /카카오톡 1:1 상담으로 이동합니다/);
  assert.match(dialogSource, /https:\/\/pf\.kakao\.com\/_JAFAG/);
  assert.match(stylesSource, /\.stepList\s*\{[^}]*display:\s*none/s);
  assert.match(stylesSource, /\.heroTitleMobileBreak\s*\{[^}]*display:\s*inline/s);
  assert.match(stylesSource, /\.heroTitleDesktopSpace\s*\{[^}]*display:\s*none/s);
  assert.match(
    stylesSource,
    /@media \(min-width:\s*640px\)[\s\S]*?\.stepList\s*\{[\s\S]*?display:\s*grid[\s\S]*?grid-template-columns:\s*repeat\(4,/,
  );
  assert.match(
    stylesSource,
    /@media \(min-width:\s*640px\)[\s\S]*?\.heroTitleMobileBreak\s*\{[^}]*display:\s*none/s,
  );
  assert.match(
    stylesSource,
    /@media \(min-width:\s*640px\)[\s\S]*?\.heroTitleDesktopSpace\s*\{[^}]*display:\s*inline/s,
  );
  assert.match(stylesSource, /\.methodCard\s*\{[^}]*border-radius:\s*16px/s);
  assert.match(stylesSource, /\.methodCard\s*\{[^}]*cursor:\s*pointer/s);
  assert.match(stylesSource, /\.methodLabel\s*\{[^}]*border:\s*1px solid transparent/s);
  assert.match(stylesSource, /\.methodLabel\s*\{[^}]*background-clip:\s*padding-box/s);
  assert.match(stylesSource, /\.methodLabel\s*\{[^}]*background-color:\s*var\(--method-label-background\)/s);
  assert.doesNotMatch(stylesSource, /\.methodLabel\s*\{[^}]*background-image:/s);
  assert.match(stylesSource, /\.methodLabel::before\s*\{[^}]*background-image:/s);
  assert.match(
    stylesSource,
    /\.methodLabelBrand\s*\{[^}]*--method-label-background:\s*rgba\(48,\s*186,\s*195,\s*0\.1\)/s,
  );
  assert.match(
    stylesSource,
    /\.methodLabelBrand\s*\{[^}]*--method-label-border-start:\s*var\(--landing-brand-border-start\)/s,
  );
  assert.match(
    stylesSource,
    /\.methodLabelQuote\s*\{[^}]*--method-label-background:\s*rgba\(67,\s*160,\s*245,\s*0\.1\)/s,
  );
  assert.match(
    stylesSource,
    /\.methodLabelQuote\s*\{[^}]*--method-label-border-start:\s*var\(--landing-info-border-start\)/s,
  );
  assert.match(
    stylesSource,
    /\.methodCardActiveQuote\s*\{[^}]*border-color:\s*var\(--landing-info-500\)[^}]*background:\s*var\(--landing-info-50\)/s,
  );
  assert.match(
    stylesSource,
    /\.methodCardActiveQuote\s+\.methodTitle\s*\{[^}]*color:\s*var\(--landing-info-500\)/s,
  );
  assert.match(
    stylesSource,
    /\.consultDialogOverlay\s*\{[^}]*background:\s*rgba\(0,\s*0,\s*0,\s*0\.5\)/s,
  );
  assert.match(stylesSource, /\.consultDialogPanel\s*\{[^}]*gap:\s*8px/s);
  assert.match(stylesSource, /\.consultDialogCard\s*\{[^}]*border-radius:\s*12px/s);
  assert.match(stylesSource, /\.consultDialogAction\s*\{[^}]*width:\s*148px/s);
  assert.match(stylesSource, /grid-template-columns:\s*repeat\(2,/);
  assert.match(stylesSource, /grid-template-columns:\s*1fr/);
  assert.match(landingStylesSource, /\.serviceGrid/);
  assert.match(landingStylesSource, /--landing-brand-border-start:\s*linear-gradient/);
  assert.match(landingStylesSource, /--landing-info-border-start:\s*linear-gradient/);
  assert.match(landingStylesSource, /rgba\(67,\s*160,\s*245,\s*0\.8\)/);
  assert.match(landingStylesSource, /grid-template-columns:\s*repeat\(3,/);
  assert.match(landingStylesSource, /grid-template-columns:\s*repeat\(2,/);
  assert.match(landingStylesSource, /grid-template-columns:\s*1fr/);
  assert.equal(countMatches(orderMethodsSource, /title:/g), 2);
  assert.match(orderMethodsSource, /id:\s*"direct"/);
  assert.match(orderMethodsSource, /id:\s*"quote"/);
  assert.match(orderMethodsSource, /tone:\s*"brand"/);
  assert.match(orderMethodsSource, /tone:\s*"quote"/);
  assert.match(contentSource, /규격·사양이 정해진 표준 제품/);
  assert.match(contentSource, /규격 협의 필요하거나 대량 주문/);
  assert.equal(countMatches(servicesArraySource, /title:/g), 9);
  assert.match(servicesSource, /브로슈어 · 카탈로그/);
  assert.match(serviceCardsSource, /serviceGrid/);
  assert.match(serviceCardsSource, /serviceCard/);
  assert.match(serviceCardsSource, /견적 후 주문\(카카오톡\)/);
  assert.match(headerSource, /usePathname/);
  assert.match(headerSource, /href:\s*"\/order"/);
  assert.match(headerSource, /aria-current/);
  assert.doesNotMatch(
    [routeSource, stylesSource, contentSource, headerSource].join("\n"),
    /figma\.com\/api\/mcp\/asset|https:\/\/www\.figma\.com\/api/,
  );
});
