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

test("personal link pay page is driven by admin-style payment data", () => {
  const contentPath = "apps/user/app/_content/linkPay.ts";
  const routePath = "apps/user/app/(site)/linkpay/[id]/page.tsx";
  const formPath = "apps/user/app/(site)/linkpay/[id]/LinkPayPaymentForm.tsx";
  const paymentPath = "apps/user/app/(site)/linkpay/[id]/payment.ts";
  const successRoutePath = "apps/user/app/(site)/linkpay/[id]/success/page.tsx";
  const failureRoutePath = "apps/user/app/(site)/linkpay/[id]/fail/page.tsx";
  const resultPath = "apps/user/app/(site)/order/OrderPaymentResult.tsx";
  const stylesPath = "apps/user/app/(site)/linkpay/[id]/page.module.css";

  assert.equal(existsSync(path.join(repoRoot, contentPath)), true);
  assert.equal(existsSync(path.join(repoRoot, routePath)), true);
  assert.equal(existsSync(path.join(repoRoot, formPath)), true);
  assert.equal(existsSync(path.join(repoRoot, paymentPath)), true);
  assert.equal(existsSync(path.join(repoRoot, successRoutePath)), true);
  assert.equal(existsSync(path.join(repoRoot, failureRoutePath)), true);
  assert.equal(existsSync(path.join(repoRoot, stylesPath)), true);

  const contentSource = read(contentPath);
  const routeSource = read(routePath);
  const formSource = read(formPath);
  const paymentSource = read(paymentPath);
  const successRouteSource = read(successRoutePath);
  const failureRouteSource = read(failureRoutePath);
  const resultSource = read(resultPath);
  const stylesSource = read(stylesPath);

  assert.match(contentSource, /export type LinkPayPayment/);
  assert.match(contentSource, /detailRows:\s*ReadonlyArray<LinkPayDetailRow>/);
  assert.match(contentSource, /clientName:\s*"CJ제일제당"/);
  assert.match(contentSource, /paymentName:\s*"민잇 플러스 개발 용역 위탁 결제"/);
  assert.match(contentSource, /amount:\s*520000/);
  assert.match(contentSource, /export function getLinkPayPayment/);

  assert.match(routeSource, /getLinkPayPayment\(id\)/);
  assert.match(routeSource, /notFound\(\)/);
  assert.match(routeSource, /redirect\(`\/linkpay\/\$\{payment\.id\}\/success`\)/);
  assert.match(routeSource, /<LinkPayPaymentForm payment=\{payment\} \/>/);

  assert.match(formSource, /"use client"/);
  assert.match(formSource, /payment\.clientName/);
  assert.match(formSource, /payment\.paymentName/);
  assert.match(formSource, /카드 결제/);
  assert.match(
    formSource,
    /결제 완료 후 영업일 기준 1일 이내 배정 담당자가/,
  );
  assert.match(formSource, /payment\.detailRows\.map/);
  assert.match(formSource, /formatOrderCurrency\(payment\.amount\)/);
  assert.match(formSource, /이름\(담당자명\)\*/);
  assert.match(formSource, /연락처\*/);
  assert.match(formSource, /이메일\*/);
  assert.match(formSource, /koreanMobilePhonePattern/);
  assert.match(formSource, /emailPattern/);
  assert.match(formSource, /linkPayId:\s*payment\.id/);
  assert.doesNotMatch(formSource, /linkPayId:\s*payment\.id,\s*payment,/s);
  assert.match(formSource, /privacyCollection:\s*false/);
  assert.match(formSource, /privacyPolicy:\s*false/);
  assert.doesNotMatch(formSource, /privacyCollection:\s*true/);
  assert.doesNotMatch(formSource, /privacyPolicy:\s*true/);
  assert.doesNotMatch(formSource, /href="#"/);
  assert.match(formSource, /href=\{item\.href\}/);
  assert.match(formSource, /useRouter/);
  assert.match(formSource, /submitLinkPayPayment/);
  assert.match(formSource, /await submitLinkPayPayment\(payload\)/);
  assert.match(formSource, /router\.push/);
  assert.match(formSource, /target="_blank"/);

  assert.match(paymentSource, /export type LinkPayPaymentSubmitResult/);
  assert.match(paymentSource, /export async function submitLinkPayPayment/);
  assert.match(paymentSource, /"use server"/);
  assert.match(paymentSource, /getLinkPayPayment\(payload\.linkPayId\)/);
  assert.doesNotMatch(paymentSource, /payment:\s*LinkPayPayment/);
  assert.match(paymentSource, /status:\s*"failure"/);
  assert.match(paymentSource, /결제 연동 준비 중/);
  assert.doesNotMatch(paymentSource, /return \{ status: "success" \}/);

  assert.match(successRouteSource, /getLinkPayPayment\(id\)/);
  assert.match(successRouteSource, /notFound\(\)/);
  assert.match(successRouteSource, /payment\.status !== "paid"/);
  assert.match(successRouteSource, /redirect\(`\/linkpay\/\$\{payment\.id\}`\)/);
  assert.match(successRouteSource, /variant="success"/);
  assert.match(successRouteSource, /showProgress=\{false\}/);
  assert.match(failureRouteSource, /variant="failure"/);
  assert.match(failureRouteSource, /contentHeight=\{true\}/);
  assert.match(failureRouteSource, /showProgress=\{false\}/);
  assert.match(failureRouteSource, /failureRetryHref=\{`\/linkpay\/\$\{payment\.id\}`\}/);

  assert.match(resultSource, /contentHeight = false/);
  assert.match(resultSource, /showProgress = true/);
  assert.match(resultSource, /styles\.resultPageContentHeight/);
  assert.match(resultSource, /successPrimaryHref/);
  assert.match(resultSource, /failureRetryHref/);
  assert.match(resultSource, /showProgress \? \(/);
  assert.match(resultSource, /if \(!showProgress\) return/);
  assert.match(resultSource, /\[showProgress\]/);

  assert.match(stylesSource, /\.linkPaySection/);
  assert.match(stylesSource, /max-width:\s*640px/);
  assert.match(stylesSource, /\.paymentCard/);
  assert.match(stylesSource, /background:\s*var\(--landing-gray-50\)/);
  assert.match(stylesSource, /repeating-linear-gradient/);
  assert.match(stylesSource, /\.agreementCheckboxMark/);
  assert.match(stylesSource, /border-radius:\s*8px/);
});
