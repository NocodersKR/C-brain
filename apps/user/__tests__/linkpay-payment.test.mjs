import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const orderRoutePath = new URL(
  "../app/api/linkpay/[publicToken]/order/route.ts",
  import.meta.url,
);
const returnRoutePath = new URL(
  "../app/api/payments/nicepay/return/route.ts",
  import.meta.url,
);
const webhookRoutePath = new URL(
  "../app/api/payments/nicepay/webhook/route.ts",
  import.meta.url,
);

test("order and callback routes keep amount and approval on the server", async () => {
  const [orderRoute, returnRoute] = await Promise.all([
    readFile(orderRoutePath, "utf8"),
    readFile(returnRoutePath, "utf8"),
  ]);

  assert.match(orderRoute, /getOrCreatePaymentOrder/);
  assert.match(orderRoute, /toNicepayGoodsName/);
  assert.match(orderRoute, /link\.amount/);
  assert.match(orderRoute, /method: "card"/);
  assert.match(returnRoute, /verifyNicepayAuthCallback/);
  assert.match(returnRoute, /approveNicepayPayment/);
  assert.match(returnRoute, /retrieveNicepayPayment/);
  assert.match(returnRoute, /netCancelNicepayPayment/);
  assert.match(returnRoute, /verifyNicepayPayment/);
  assert.match(returnRoute, /completePaymentOrder/);
  assert.match(
    returnRoute,
    /payment\.status === "paid" && payment\.resultCode !== "0000"/,
  );
  assert.match(returnRoute, /const paidAt = toProviderTimestamp/);
  assert.match(returnRoute, /status: 303/);
});

test("webhook verifies provider data and returns NICEPAY's exact acknowledgement", async () => {
  const webhookRoute = await readFile(webhookRoutePath, "utf8");

  assert.match(webhookRoute, /parseNicepayPayment/);
  assert.match(webhookRoute, /verifyNicepayPayment/);
  assert.match(webhookRoute, /payment\.amount !== order\.amount/);
  assert.match(webhookRoute, /completePaymentOrder/);
  assert.match(webhookRoute, /updatePaymentOrder/);
  assert.match(webhookRoute, /Invalid paid result/);
  assert.match(webhookRoute, /Invalid paid timestamp/);
  assert.match(webhookRoute, /new Response\("OK"/);
  assert.match(webhookRoute, /text\/html; charset=utf-8/);
  assert.doesNotMatch(
    webhookRoute,
    /console\.(?:log|info)\([^)]*(?:request|payload|body)/,
  );
});
