import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFile } from "node:fs/promises";
import process from "node:process";
import test from "node:test";

const modulePath = new URL("../lib/nicepay.ts", import.meta.url);

async function importNicepayModule() {
  const source = await readFile(modulePath, "utf8");
  const ts = await import("typescript");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });

  return import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
}

test("NICEPAY signatures use the documented field order and timing-safe checks", async () => {
  const {
    createNicepaySignature,
    parseNicepayAuthCallback,
    verifyNicepayAuthCallback,
  } = await importNicepayModule();
  const formData = new FormData();
  const signature =
    "ee2c345281e236e84fbe3685d2eebd5e5fcd7f480c3a2f13b2628d0e5ab1be63";

  for (const [key, value] of Object.entries({
    amount: "120000",
    authResultCode: "0000",
    authResultMsg: "인증 성공",
    authToken: "auth-token",
    clientId: "client-key",
    orderId: "LPORDER",
    signature,
    tid: "tid",
  })) {
    formData.set(key, value);
  }

  const callback = parseNicepayAuthCallback(formData);

  assert.equal(
    createNicepaySignature(["token", "client", "1004"], "secret"),
    "9ea1a6011963571e22738c184b982ea32510e86856a717a8bfe5e4d0f158ff2e",
  );
  assert.ok(callback);
  assert.equal(
    verifyNicepayAuthCallback(
      callback,
      { amount: 120000, clientKey: "client-key", orderId: "LPORDER" },
      "secret-key",
    ),
    true,
  );
  assert.equal(
    verifyNicepayAuthCallback(
      callback,
      { amount: 120001, clientKey: "client-key", orderId: "LPORDER" },
      "secret-key",
    ),
    false,
  );
});

test("NICEPAY payment responses reject tampered amount and signature", async () => {
  const { parseNicepayPayment, verifyNicepayPayment } =
    await importNicepayModule();
  const payment = parseNicepayPayment({
    amount: 120000,
    ediDate: "2026-07-23T12:00:00.000+0900",
    orderId: "LPORDER",
    paidAt: "2026-07-23T12:00:00.000+0900",
    payMethod: "card",
    receiptUrl: "https://example.com/receipt",
    resultCode: "0000",
    resultMsg: "정상 처리되었습니다.",
    signature:
      "d61081bd25eb2f4841defe5c6e270c52608ae9137b85d5a1fea426ffe8e0c425",
    status: "paid",
    tid: "tid",
  });

  assert.ok(payment);
  assert.equal(
    verifyNicepayPayment(
      payment,
      { amount: 120000, orderId: "LPORDER", tid: "tid" },
      "secret-key",
    ),
    true,
  );
  assert.equal(
    verifyNicepayPayment(
      payment,
      { amount: 120001, orderId: "LPORDER", tid: "tid" },
      "secret-key",
    ),
    false,
  );
  assert.equal(parseNicepayPayment({ ...payment, signature: "not-hex" }), null);
});

test("NICEPAY config is allowlisted and goods names fit the provider byte limit", async () => {
  const { createNicepayAuthorization, getNicepayConfig, toNicepayGoodsName } =
    await importNicepayModule();
  const previous = {
    clientKey: process.env.NEXT_PUBLIC_NICEPAY_CLIENT_KEY,
    mode: process.env.NICEPAY_MODE,
    secretKey: process.env.NICEPAY_SECRET_KEY,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  };

  process.env.NICEPAY_MODE = "sandbox";
  process.env.NEXT_PUBLIC_NICEPAY_CLIENT_KEY = "client-key";
  process.env.NICEPAY_SECRET_KEY = "secret-key";
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";

  try {
    const config = getNicepayConfig();
    const goodsName = toNicepayGoodsName("가".repeat(20));

    assert.equal(config.apiBaseUrl, "https://sandbox-api.nicepay.co.kr");
    assert.equal(
      createNicepayAuthorization(config),
      `Basic ${Buffer.from("client-key:secret-key").toString("base64")}`,
    );
    assert.ok(Buffer.byteLength(goodsName, "utf8") <= 40);
    assert.ok(goodsName.length > 0);
  } finally {
    for (const [name, value] of Object.entries({
      NEXT_PUBLIC_NICEPAY_CLIENT_KEY: previous.clientKey,
      NICEPAY_MODE: previous.mode,
      NICEPAY_SECRET_KEY: previous.secretKey,
      NEXT_PUBLIC_SITE_URL: previous.siteUrl,
    })) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});
