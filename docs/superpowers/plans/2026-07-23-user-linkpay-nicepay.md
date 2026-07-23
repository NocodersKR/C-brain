# User LinkPay NICEPAY Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 공개 LinkPay URL에서 카드 결제창을 열고, NICEPAY Server 승인·웹훅 검증 후 결제 요청을 안전하게 완료 처리한다.

**Architecture:** `payment_links`는 관리자 결제 요청을 유지하고, 링크당 하나의 `payment_orders`가 NICEPAY 주문·거래 상태를 저장한다. 사용자 페이지는 Server Component가 service-role로 링크를 읽고 Client Component가 NICEPAY JS SDK를 호출하며, Route Handler가 주문 생성·인증 callback·웹훅을 처리한다.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, Supabase/PostgreSQL RLS/RPC, NICEPAY JS SDK/REST API, Node `crypto`/`fetch`

## Global Constraints

- NICEPAY 신형 `Server 승인` Client Key와 `Basic 인증` Secret Key만 사용한다.
- 1차 결제수단은 카드이며 링크 1개당 주문 1개만 허용한다.
- 금액·상품명·주문번호는 DB 값만 사용하고 브라우저 값을 신뢰하지 않는다.
- callback과 웹훅의 서명·주문번호·금액을 검증한 뒤에만 `paid` 처리한다.
- `NICEPAY_SECRET_KEY`, Basic credential, `authToken`, 카드정보를 브라우저·DB·로그에 노출하지 않는다.
- 승인 결과가 불확실하면 거래 조회 후 망취소를 시도하고 결제를 성공으로 단정하지 않는다.
- 새 의존성을 추가하지 않고 Node 표준 `crypto`, `fetch`, `AbortSignal.timeout()`을 사용한다.
- UI는 `design.md`의 Pretendard, parent `gap`, focus, SVG/asset 규칙을 따른다.

---

## File Map

| File                                                           | Responsibility                                                         |
| -------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `supabase/migrations/20260723000001_create_payment_orders.sql` | 링크별 주문, RLS, 잠금 trigger, 원자적 주문 생성/결제 완료 RPC         |
| `packages/supabase/src/types.ts`                               | `payment_orders`와 RPC 타입                                            |
| `packages/supabase/src/paymentLinks.ts`                        | 공개 링크/주문 조회와 service-role mutation helper                     |
| `packages/supabase/tests/payment-links-contract.test.mjs`      | migration/type 보안 계약                                               |
| `packages/supabase/tests/content-helpers.test.mjs`             | 주문 helper 호출 계약                                                  |
| `apps/user/lib/nicepay.ts`                                     | env, SHA-256/timing-safe 검증, 응답 파싱, 승인·조회·망취소 HTTP client |
| `apps/user/app/linkpay/[publicToken]/page.tsx`                 | 공개 결제 요청 Server Component                                        |
| `apps/user/app/linkpay/[publicToken]/PaymentButton.tsx`        | NICEPAY SDK 로딩·결제창 호출                                           |
| `apps/user/app/linkpay/[publicToken]/page.module.css`          | 독립 결제 화면 반응형 스타일                                           |
| `apps/user/app/linkpay/[publicToken]/result/page.tsx`          | DB 상태 기반 결제 결과 화면                                            |
| `apps/user/app/api/linkpay/[publicToken]/order/route.ts`       | DB 기준 주문 파라미터 발급                                             |
| `apps/user/app/api/payments/nicepay/return/route.ts`           | 인증 callback 검증·승인·DB 완료 처리                                   |
| `apps/user/app/api/payments/nicepay/webhook/route.ts`          | 서명 검증·idempotent 상태 동기화·`OK` 응답                             |
| `apps/user/__tests__/nicepay.test.mjs`                         | 서명·파싱·길이 제한 단위 검사                                          |
| `apps/user/__tests__/linkpay-payment.test.mjs`                 | 페이지/Route Handler 보안 wiring 검사                                  |

### Task 1: Payment Order Database Contract

**Files:**

- Create: `supabase/migrations/20260723000001_create_payment_orders.sql`
- Modify: `packages/supabase/src/types.ts`
- Modify: `packages/supabase/src/paymentLinks.ts`
- Modify: `packages/supabase/tests/payment-links-contract.test.mjs`
- Modify: `packages/supabase/tests/content-helpers.test.mjs`

**Interfaces:**

- Produces: `getPublicPaymentLink(client, publicToken)`
- Produces: `getPaymentOrderByLinkId(client, paymentLinkId)`
- Produces: `getPaymentOrderByOrderId(client, orderId)`
- Produces: `getOrCreatePaymentOrder(client, publicToken)`
- Produces: `completePaymentOrder(client, input)`
- Produces: `updatePaymentOrder(client, orderId, input)`

- [ ] **Step 1: Add a failing migration/type contract test**

```js
for (const field of [
  "payment_orders",
  "payment_link_id",
  "order_id",
  "nicepay_tid",
  "provider_status",
]) {
  assert.match(migration, new RegExp(`\\b${field}\\b`));
  assert.match(types, new RegExp(`\\b${field}\\b`));
}
assert.match(
  migration,
  /alter table public\.payment_orders enable row level security/,
);
assert.match(migration, /grant all on public\.payment_orders to service_role/);
assert.doesNotMatch(migration, /to anon|to authenticated/);
```

- [ ] **Step 2: Run the Supabase test and confirm it fails for the missing migration**

Run: `pnpm --filter @repo/supabase test`

Expected: FAIL with `ENOENT` for `20260723000001_create_payment_orders.sql`.

- [ ] **Step 3: Add the minimal table and RPC migration**

```sql
create table public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  payment_link_id uuid not null unique references public.payment_links(id),
  order_id text not null unique,
  amount bigint not null check (amount between 1 and 999999999999),
  nicepay_tid text unique,
  provider_status text not null default 'ready',
  result_code text,
  result_message text,
  pay_method text,
  receipt_url text,
  paid_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
```

Add service-role-only grants, a trigger that blocks editing a link after its order exists, `get_or_create_payment_order(public_token)` and `complete_payment_order(...)` RPCs. The completion RPC must compare the DB amount and allow duplicate completion only when the TID matches.

- [ ] **Step 4: Add TypeScript table/RPC types and helpers**

```ts
export async function getOrCreatePaymentOrder(client, publicToken: string) {
  const { data, error } = await client
    .rpc("get_or_create_payment_order", { p_public_token: publicToken })
    .single();
  return unwrapSupabaseData(data, error);
}
```

The public lookup helpers use `.maybeSingle()` and return `null` when no row exists. Mutations do not call `requireAdmin`; DB grants restrict them to the service-role client.

- [ ] **Step 5: Run Supabase tests**

Run: `pnpm --filter @repo/supabase test`

Expected: PASS.

### Task 2: NICEPAY Trust-Boundary Utilities

**Files:**

- Create: `apps/user/lib/nicepay.ts`
- Create: `apps/user/__tests__/nicepay.test.mjs`

**Interfaces:**

- Produces: `getNicepayConfig()`
- Produces: `parseNicepayAuthCallback(formData)`
- Produces: `verifyNicepayAuthCallback(callback, expected, secretKey)`
- Produces: `parseNicepayPayment(value)`
- Produces: `verifyNicepayPayment(payment, expected, secretKey)`
- Produces: `approveNicepayPayment`, `retrieveNicepayPayment`, `netCancelNicepayPayment`
- Produces: `toNicepayGoodsName(value)`

- [ ] **Step 1: Write failing tests for signature and provider input validation**

```js
assert.equal(
  createNicepaySignature(["token", "client", "1004"], "secret"),
  expectedSha256,
);
assert.equal(
  verifyNicepayAuthCallback(validCallback, expected, "secret"),
  true,
);
assert.equal(
  verifyNicepayAuthCallback(
    { ...validCallback, amount: 1005 },
    expected,
    "secret",
  ),
  false,
);
assert.ok(Buffer.byteLength(toNicepayGoodsName("가".repeat(20)), "utf8") <= 40);
```

- [ ] **Step 2: Run the user test and confirm it fails for the missing module**

Run: `pnpm --filter user test`

Expected: FAIL because `apps/user/lib/nicepay.ts` is missing.

- [ ] **Step 3: Implement standard-library signing, parsing, and HTTP calls**

Use `createHash("sha256")`, `timingSafeEqual`, `Buffer.from(`${clientKey}:${secretKey}`).toString("base64")`, `fetch`, and a 30-second `AbortSignal.timeout()`. API hosts are selected only from `NICEPAY_MODE`:

```ts
const NICEPAY_API_BASE_URL = {
  sandbox: "https://sandbox-api.nicepay.co.kr",
  production: "https://api.nicepay.co.kr",
} as const;
```

- [ ] **Step 4: Run user tests**

Run: `pnpm --filter user test`

Expected: PASS.

### Task 3: Public Page and NICEPAY Routes

**Files:**

- Create: `apps/user/app/linkpay/[publicToken]/page.tsx`
- Create: `apps/user/app/linkpay/[publicToken]/PaymentButton.tsx`
- Create: `apps/user/app/linkpay/[publicToken]/page.module.css`
- Create: `apps/user/app/linkpay/[publicToken]/result/page.tsx`
- Create: `apps/user/app/api/linkpay/[publicToken]/order/route.ts`
- Create: `apps/user/app/api/payments/nicepay/return/route.ts`
- Create: `apps/user/app/api/payments/nicepay/webhook/route.ts`
- Create: `apps/user/__tests__/linkpay-payment.test.mjs`

**Interfaces:**

- Consumes: Task 1 payment link/order helpers
- Consumes: Task 2 NICEPAY config, validation, and HTTP helpers
- Produces: `POST /api/linkpay/:publicToken/order`
- Produces: `POST /api/payments/nicepay/return?token=:publicToken`
- Produces: `POST /api/payments/nicepay/webhook`

- [ ] **Step 1: Write failing source-contract tests**

```js
assert.match(paymentButton, /AUTHNICE\.requestPay/);
assert.match(returnRoute, /verifyNicepayAuthCallback/);
assert.match(returnRoute, /completePaymentOrder/);
assert.match(webhookRoute, /verifyNicepayPayment/);
assert.match(webhookRoute, /text\/html/);
assert.doesNotMatch(paymentButton, /NICEPAY_SECRET_KEY/);
```

- [ ] **Step 2: Run the user test and confirm missing page/routes fail**

Run: `pnpm --filter user test`

Expected: FAIL with `ENOENT` for the new route files.

- [ ] **Step 3: Implement the public payment page and SDK button**

The Server Component awaits `params`, service-role loads the link, and calls `notFound()` for an invalid UUID or missing row. `PaymentButton` uses `next/script` with `https://pay.nicepay.co.kr/v1/js/`, requests server-created parameters, and calls `AUTHNICE.requestPay()` with `method: "card"`.

- [ ] **Step 4: Implement order, return, and webhook Route Handlers**

The order route returns only `{ clientId, method, orderId, amount, goodsName, returnUrl }`. The return route validates callback fields before approval, validates the approval response before the atomic completion RPC, then returns a 303 result redirect. The webhook verifies the provider signature and DB amount, updates idempotently, and returns `new Response("OK", { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } })`.

- [ ] **Step 5: Run user tests**

Run: `pnpm --filter user test`

Expected: PASS.

### Task 4: Verification

**Files:**

- Modify only files that fail the checks above.

- [ ] **Step 1: Run type, lint, test, and build checks**

```bash
pnpm --filter @repo/supabase test
pnpm --filter @repo/supabase check-types
pnpm --filter user test
pnpm --filter user check-types
pnpm --filter user lint
pnpm --filter user build
```

Expected: all commands exit 0.

- [ ] **Step 2: Run secret and Figma URL scans**

```bash
rg "NICEPAY_SECRET_KEY" apps/user/app apps/user/components
rg "figma.com/api/mcp/asset|https://www.figma.com/api" apps packages
```

Expected: no secret reference in Client Components and no Figma API URL matches.

- [ ] **Step 3: Apply the new SQL migration and run a sandbox smoke test**

Apply `supabase/migrations/20260723000001_create_payment_orders.sql`, then verify valid/invalid/paid links, card authentication, callback, duplicate callback, webhook TEST, and DB state. No production charge is made while `NICEPAY_MODE=sandbox`.
