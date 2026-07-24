# Admin LinkPay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 관리자가 결제 요청을 생성·조회·검색·수정하고, 추후 사용자 결제 페이지가 사용할 공개 LinkPay URL을 복사할 수 있게 한다.

**Architecture:** 기존 Vite 관리자 앱은 로그인한 Supabase 브라우저 클라이언트와 관리자 RLS를 그대로 사용한다. 일반 상품의 복잡한 가격표와 수명주기가 다르므로 `products`를 재사용하지 않고, 결제 요청에 필요한 다섯 필드만 가진 `payment_links` 테이블을 추가한다. 이번 계획은 관리자 CRUD와 URL 계약까지만 구현하며, 공개 페이지·NICEPAY 승인·결제 상태 갱신은 사용자 앱 후속 계획으로 분리한다.

**Tech Stack:** React 19, React Router 7, Vite 8, TypeScript 6, Supabase/PostgreSQL RLS, Node test runner, Sonner

## Global Constraints

- 이번 범위에는 NICEPAY 키, SDK, 승인 API, 웹훅을 추가하지 않는다.
- 링크 1개는 결제 요청 1건을 뜻하며 상태는 `pending | paid`만 저장한다.
- 관리자 생성 시 상태는 항상 `pending`; `paid` 전환은 사용자 결제 단계에서만 수행한다.
- 공개 URL 형식은 `${VITE_USER_APP_URL}/linkpay/{public_token}`으로 고정한다.
- `public_token`은 DB가 생성하는 UUID이며 관리자가 입력하거나 수정하지 않는다.
- 금액은 1원 이상 999,999,999,999원 이하 정수로 저장하고 URL·브라우저 입력값을 신뢰하지 않는다.
- `payment_links`에는 공개 `anon` 읽기 정책을 만들지 않는다. 사용자 페이지는 후속 단계에서 서버 전용 접근을 추가한다.
- 결제 기록 보존을 위해 관리자 삭제 기능과 DELETE RLS 정책을 만들지 않는다.
- 기존 `AdminDataTableSection`, `AdminFormLayout`, `AdminIcon`, Supabase auth helper, 숫자 포맷 helper를 재사용한다.
- UI 변경은 `design.md`의 Pretendard GOV Variable, SVG icon, parent `gap`, form focus 규칙을 따른다.
- Figma MCP asset URL이나 새 이미지 asset을 추가하지 않는다.

---

## File Map

| File | Responsibility |
| --- | --- |
| `supabase/migrations/20260722000000_create_payment_links.sql` | LinkPay 상태 enum, 테이블, timestamp trigger, 관리자 전용 RLS |
| `packages/supabase/src/types.ts` | `payment_links` DB 타입과 `PaymentLinkStatus` |
| `packages/supabase/src/paymentLinks.ts` | 관리자 목록·단건·생성·수정 data access |
| `packages/supabase/src/index.ts` | payment link helper 공개 export |
| `packages/supabase/tests/payment-links-contract.test.mjs` | migration/type 계약 검사 |
| `packages/supabase/tests/content-helpers.test.mjs` | payment link query/mutation 호출 검사 |
| `apps/admin/src/pages/linkPayData.ts` | 폼 변환, 금액 검증, 목록 변환, 검색/필터, 공개 URL 생성 |
| `apps/admin/tests/linkPayData.test.mjs` | LinkPay 순수 로직 검사 |
| `apps/admin/src/pages/LinkPayFormPage.tsx` | 신규 생성 및 상세 수정 폼 |
| `apps/admin/src/App.tsx` | `/linkpay/:linkPayId` 상세 route |
| `apps/admin/tests/linkPayFormPage.test.mjs` | 생성/수정 route와 persistence wiring smoke test |
| `apps/admin/src/pages/LinkPayPage.tsx` | 실데이터 목록, 상태/고객사 필터, 검색, URL 복사, 상세 link |
| `apps/admin/src/pages/LinkPayPage.css` | 복사 text button의 최소 reset |
| `apps/admin/tests/linkPayPage.test.mjs` | 목록 조회와 clipboard wiring smoke test |

### Task 1: Payment Link Database Contract and Data Access

**Files:**

- Create: `supabase/migrations/20260722000000_create_payment_links.sql`
- Modify: `packages/supabase/src/types.ts`
- Create: `packages/supabase/src/paymentLinks.ts`
- Modify: `packages/supabase/src/index.ts`
- Create: `packages/supabase/tests/payment-links-contract.test.mjs`
- Modify: `packages/supabase/tests/content-helpers.test.mjs`

**Interfaces:**

- Produces: `PaymentLinkStatus = 'pending' | 'paid'`
- Produces: `listAdminPaymentLinks(client): Promise<TableRow<'payment_links'>[]>`
- Produces: `getAdminPaymentLink(client, id): Promise<TableRow<'payment_links'>>`
- Produces: `createPaymentLink(client, input): Promise<TableRow<'payment_links'>>`
- Produces: `updatePaymentLink(client, id, input): Promise<TableRow<'payment_links'>>`
- Security: authenticated administrator select/insert/update only; no anonymous read and no delete

- [ ] **Step 1: Write the failing migration/type contract test**

Create `packages/supabase/tests/payment-links-contract.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrl = new URL(
  "../../../supabase/migrations/20260722000000_create_payment_links.sql",
  import.meta.url,
);
const typesUrl = new URL("../src/types.ts", import.meta.url);

test("payment links migration defines the minimal admin contract", async () => {
  const [migration, types] = await Promise.all([
    readFile(migrationUrl, "utf8"),
    readFile(typesUrl, "utf8"),
  ]);

  for (const field of [
    "payment_link_status",
    "payment_links",
    "public_token",
    "client_name",
    "payment_name",
    "amount",
    "status",
  ]) {
    assert.match(migration, new RegExp(`\\b${field}\\b`));
    assert.match(types, new RegExp(`\\b${field}\\b`));
  }

  assert.match(migration, /check \(amount between 1 and 999999999999\)/);
  assert.match(migration, /alter table public\.payment_links enable row level security/);
  assert.match(migration, /create policy "admins select payment links"/);
  assert.match(migration, /create policy "admins insert payment links"/);
  assert.match(migration, /create policy "admins update payment links"/);
  assert.doesNotMatch(migration, /anon/);
  assert.doesNotMatch(migration, /delete payment links/);
  assert.match(types, /payment_link_status: "pending" \| "paid"/);
});
```

- [ ] **Step 2: Run the contract test and verify the missing migration failure**

Run:

```bash
pnpm --filter @repo/supabase test
```

Expected: FAIL with `ENOENT` for `20260722000000_create_payment_links.sql`.

- [ ] **Step 3: Add the payment link migration**

Create `supabase/migrations/20260722000000_create_payment_links.sql`:

```sql
create type public.payment_link_status as enum ('pending', 'paid');

create table public.payment_links (
  id uuid primary key default gen_random_uuid(),
  public_token uuid not null unique default gen_random_uuid(),
  client_name text not null check (char_length(trim(client_name)) > 0),
  payment_name text not null check (char_length(trim(payment_name)) > 0),
  amount bigint not null check (amount between 1 and 999999999999),
  status public.payment_link_status not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index payment_links_created_at_desc_idx
on public.payment_links (created_at desc);

create index payment_links_client_name_idx
on public.payment_links (client_name);

create index payment_links_status_idx
on public.payment_links (status);

create function public.set_payment_links_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger payment_links_set_updated_at
before update on public.payment_links
for each row
execute function public.set_payment_links_updated_at();

alter table public.payment_links enable row level security;

create policy "admins select payment links"
on public.payment_links
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "admins insert payment links"
on public.payment_links
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "admins update payment links"
on public.payment_links
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);
```

- [ ] **Step 4: Mirror the database contract in TypeScript**

In `packages/supabase/src/types.ts`, add the exported enum alias beside `ProductStatus`:

```ts
export type PaymentLinkStatus = PublicEnums["payment_link_status"];
```

Add this table entry immediately before `products`:

```ts
      payment_links: {
        Row: {
          amount: number;
          client_name: string;
          created_at: string;
          id: string;
          payment_name: string;
          public_token: string;
          status: PaymentLinkStatus;
          updated_at: string;
        };
        Insert: {
          amount: number;
          client_name: string;
          created_at?: string;
          id?: string;
          payment_name: string;
          public_token?: string;
          status?: PaymentLinkStatus;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          client_name?: string;
          created_at?: string;
          id?: string;
          payment_name?: string;
          public_token?: string;
          status?: PaymentLinkStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
```

Add the enum entry beside `product_status`:

```ts
      payment_link_status: "pending" | "paid";
```

- [ ] **Step 5: Add administrator data-access helpers**

Create `packages/supabase/src/paymentLinks.ts`:

```ts
import { requireAdmin } from "./auth.ts";
import { unwrapSupabaseData } from "./result.ts";
import type { CBrainSupabaseClient } from "./server.ts";
import type { TableInsert, TableUpdate } from "./types.ts";

type PaymentLinkInput = Pick<
  TableInsert<"payment_links">,
  "amount" | "client_name" | "payment_name"
>;

export async function listAdminPaymentLinks(client: CBrainSupabaseClient) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("payment_links")
    .select("*")
    .order("created_at", { ascending: false });

  return unwrapSupabaseData(data, error);
}

export async function getAdminPaymentLink(
  client: CBrainSupabaseClient,
  id: string,
) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("payment_links")
    .select("*")
    .eq("id", id)
    .single();

  return unwrapSupabaseData(data, error);
}

export async function createPaymentLink(
  client: CBrainSupabaseClient,
  input: PaymentLinkInput,
) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("payment_links")
    .insert(input)
    .select("*")
    .single();

  return unwrapSupabaseData(data, error);
}

export async function updatePaymentLink(
  client: CBrainSupabaseClient,
  id: string,
  input: Pick<
    TableUpdate<"payment_links">,
    "amount" | "client_name" | "payment_name"
  >,
) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("payment_links")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  return unwrapSupabaseData(data, error);
}
```

Export it from `packages/supabase/src/index.ts`:

```ts
export * from "./paymentLinks.ts";
```

- [ ] **Step 6: Add query and mutation assertions to the existing fake-client test**

In `packages/supabase/tests/content-helpers.test.mjs`, add this import with the other dynamic imports:

```js
const { createPaymentLink, listAdminPaymentLinks } = await import(
  "../src/paymentLinks.ts"
);
```

Append this test:

```js
test("payment link helpers use admin-scoped newest-first access", async () => {
  const { calls, client } = createFakeClient({ payment_links: [] });
  const input = {
    amount: 120000,
    client_name: "테스트 고객사",
    payment_name: "브로슈어 제작비",
  };

  await listAdminPaymentLinks(client);
  await createPaymentLink(client, input);

  assert.deepEqual(orderCalls(calls, "payment_links"), [
    ["created_at", { ascending: false }],
  ]);
  assert.deepEqual(
    calls.find(
      (call) =>
        call.method === "insert" && call.table === "payment_links",
    )?.value,
    input,
  );
});
```

- [ ] **Step 7: Run package verification**

Run:

```bash
pnpm --filter @repo/supabase test
pnpm --filter @repo/supabase check-types
pnpm --filter @repo/supabase lint
```

Expected: all commands exit 0 and the new contract/helper tests pass.

- [ ] **Step 8: Commit the database contract**

```bash
git add supabase/migrations/20260722000000_create_payment_links.sql packages/supabase/src/types.ts packages/supabase/src/paymentLinks.ts packages/supabase/src/index.ts packages/supabase/tests/payment-links-contract.test.mjs packages/supabase/tests/content-helpers.test.mjs
git commit -m "feat(linkpay): add admin payment link data contract"
```

### Task 2: LinkPay Form and List Domain Logic

**Files:**

- Create: `apps/admin/src/pages/linkPayData.ts`
- Create: `apps/admin/tests/linkPayData.test.mjs`

**Interfaces:**

- Consumes: `TableRow<'payment_links'>`, `TableInsert<'payment_links'>`, `PaymentLinkStatus`
- Reuses: `formatNumericValue` from `productData.ts`
- Produces: `LinkPayFormState`, `LinkPayListRow`, `createInitialLinkPayForm`, `toPaymentLinkInput`, `toLinkPayFormState`, `toLinkPayListRow`, `filterLinkPayRows`, `buildLinkPayUrl`

- [ ] **Step 1: Write failing tests for validation, mapping, filtering, and URL construction**

Create `apps/admin/tests/linkPayData.test.mjs`:

```js
import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildLinkPayUrl,
  createInitialLinkPayForm,
  filterLinkPayRows,
  toLinkPayFormState,
  toLinkPayListRow,
  toPaymentLinkInput,
} from '../src/pages/linkPayData.ts'

const paymentLink = {
  amount: 120000,
  client_name: '테스트 고객사',
  created_at: '2026-07-21T16:00:00.000Z',
  id: 'payment-link-id',
  payment_name: '브로슈어 제작비',
  public_token: '11111111-1111-4111-8111-111111111111',
  status: 'pending',
  updated_at: '2026-07-21T16:00:00.000Z',
}

test('payment link input trims text and stores integer won', () => {
  assert.deepEqual(
    toPaymentLinkInput({
      amount: '120,000',
      client: ' 테스트 고객사 ',
      paymentName: ' 브로슈어 제작비 ',
    }),
    {
      amount: 120000,
      client_name: '테스트 고객사',
      payment_name: '브로슈어 제작비',
    },
  )
})

test('payment link input rejects empty text and invalid amount', () => {
  for (const form of [
    { amount: '0', client: '고객사', paymentName: '결제명' },
    { amount: '1,000,000,000,000', client: '고객사', paymentName: '결제명' },
    { amount: '1,000', client: ' ', paymentName: '결제명' },
    { amount: '1,000', client: '고객사', paymentName: ' ' },
  ]) {
    assert.throws(() => toPaymentLinkInput(form), {
      message: '링크페이 정보를 확인해주세요.',
    })
  }
})

test('database rows map to editable form and formatted list values', () => {
  assert.deepEqual(toLinkPayFormState(paymentLink), {
    amount: '120,000',
    client: '테스트 고객사',
    paymentName: '브로슈어 제작비',
  })

  assert.deepEqual(toLinkPayListRow(paymentLink), {
    amount: '120,000원',
    client: '테스트 고객사',
    detailHref: '/linkpay/payment-link-id',
    id: 'payment-link-id',
    paymentName: '브로슈어 제작비',
    publicToken: '11111111-1111-4111-8111-111111111111',
    status: 'pending',
  })
})

test('list filtering combines client, payment status, and name query', () => {
  const rows = [
    toLinkPayListRow(paymentLink),
    {
      ...toLinkPayListRow(paymentLink),
      client: '완료 고객사',
      id: 'paid-id',
      paymentName: '명함 제작비',
      status: 'paid',
    },
  ]

  assert.deepEqual(
    filterLinkPayRows(rows, {
      client: '테스트 고객사',
      query: '브로',
      status: '결제전',
    }),
    [rows[0]],
  )
  assert.deepEqual(
    filterLinkPayRows(rows, {
      client: '전체',
      query: '',
      status: '결제완료',
    }),
    [rows[1]],
  )
})

test('public URL uses the configured user app origin and UUID token', () => {
  assert.equal(
    buildLinkPayUrl(
      paymentLink.public_token,
      'https://www.cbrain.co.kr/admin-path',
    ),
    'https://www.cbrain.co.kr/linkpay/11111111-1111-4111-8111-111111111111',
  )
})

test('initial form is empty', () => {
  assert.deepEqual(createInitialLinkPayForm(), {
    amount: '',
    client: '',
    paymentName: '',
  })
})
```

- [ ] **Step 2: Run the focused test and verify the missing module failure**

Run:

```bash
node --experimental-strip-types --test apps/admin/tests/linkPayData.test.mjs
```

Expected: FAIL because `linkPayData.ts` does not exist.

- [ ] **Step 3: Implement the minimum domain logic**

Create `apps/admin/src/pages/linkPayData.ts`:

```ts
import type {
  PaymentLinkStatus,
  TableInsert,
  TableRow,
} from '@repo/supabase/types'
import { formatNumericValue } from './productData.ts'

export type LinkPayFormState = {
  amount: string
  client: string
  paymentName: string
}

export type LinkPayListRow = {
  amount: string
  client: string
  detailHref: string
  id: string
  paymentName: string
  publicToken: string
  status: PaymentLinkStatus
}

export type PaymentLinkInput = Pick<
  TableInsert<'payment_links'>,
  'amount' | 'client_name' | 'payment_name'
>

export type LinkPayFilters = {
  client: string
  query: string
  status: '전체' | '결제전' | '결제완료'
}

export function createInitialLinkPayForm(): LinkPayFormState {
  return {
    amount: '',
    client: '',
    paymentName: '',
  }
}

export function toPaymentLinkInput(form: LinkPayFormState): PaymentLinkInput {
  const amountText = form.amount.replace(/\D/g, '')
  const amount = Number(amountText)
  const clientName = form.client.trim()
  const paymentName = form.paymentName.trim()

  if (
    !clientName ||
    !paymentName ||
    !amountText ||
    !Number.isSafeInteger(amount) ||
    amount < 1 ||
    amount > 999_999_999_999
  ) {
    throw new Error('링크페이 정보를 확인해주세요.')
  }

  return {
    amount,
    client_name: clientName,
    payment_name: paymentName,
  }
}

export function toLinkPayFormState(
  paymentLink: TableRow<'payment_links'>,
): LinkPayFormState {
  return {
    amount: formatNumericValue(String(paymentLink.amount)),
    client: paymentLink.client_name,
    paymentName: paymentLink.payment_name,
  }
}

export function toLinkPayListRow(
  paymentLink: TableRow<'payment_links'>,
): LinkPayListRow {
  return {
    amount: `${new Intl.NumberFormat('ko-KR').format(paymentLink.amount)}원`,
    client: paymentLink.client_name,
    detailHref: `/linkpay/${paymentLink.id}`,
    id: paymentLink.id,
    paymentName: paymentLink.payment_name,
    publicToken: paymentLink.public_token,
    status: paymentLink.status,
  }
}

export function filterLinkPayRows(
  rows: readonly LinkPayListRow[],
  filters: LinkPayFilters,
) {
  const query = filters.query.trim().toLocaleLowerCase('ko-KR')
  const status =
    filters.status === '결제전'
      ? 'pending'
      : filters.status === '결제완료'
        ? 'paid'
        : '전체'

  return rows.filter(
    (row) =>
      (filters.client === '전체' || row.client === filters.client) &&
      (status === '전체' || row.status === status) &&
      row.paymentName.toLocaleLowerCase('ko-KR').includes(query),
  )
}

export function buildLinkPayUrl(publicToken: string, userAppUrl: string) {
  return new URL(`/linkpay/${encodeURIComponent(publicToken)}`, userAppUrl).toString()
}
```

- [ ] **Step 4: Run the focused and full administrator tests**

Run:

```bash
node --experimental-strip-types --test apps/admin/tests/linkPayData.test.mjs
pnpm --filter admin test
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit the domain logic**

```bash
git add apps/admin/src/pages/linkPayData.ts apps/admin/tests/linkPayData.test.mjs
git commit -m "feat(linkpay): add admin form and list logic"
```

### Task 3: Persist the Create and Detail Form

**Files:**

- Modify: `apps/admin/src/App.tsx`
- Modify: `apps/admin/src/pages/LinkPayFormPage.tsx`
- Modify: `apps/admin/tests/linkPayFormPage.test.mjs`

**Interfaces:**

- Consumes: Task 1 payment link data access
- Consumes: Task 2 form conversion and validation
- Produces: `/linkpay/new` create flow
- Produces: `/linkpay/:linkPayId` load/update flow

- [ ] **Step 1: Extend the source smoke test for persistence and detail routing**

In `apps/admin/tests/linkPayFormPage.test.mjs`, replace the assertion for the removed inline digit replacement:

```js
  assert.match(
    formSource,
    /formatNumericValue\(event\.currentTarget\.value\)/,
  )
```

Then add these assertions after the existing route assertion:

```js
  assert.match(
    appSource,
    /<Route element=\{<LinkPayFormPage \/>\} path="\/linkpay\/:linkPayId" \/>/,
  )
  assert.match(formSource, /createPaymentLink/)
  assert.match(formSource, /getAdminPaymentLink/)
  assert.match(formSource, /updatePaymentLink/)
  assert.match(formSource, /toPaymentLinkInput/)
  assert.match(formSource, /disabled=\{isSaving\}/)
```

- [ ] **Step 2: Run the form smoke test and verify it fails on the detail route**

Run:

```bash
node --test apps/admin/tests/linkPayFormPage.test.mjs
```

Expected: FAIL because `/linkpay/:linkPayId` and persistence calls are absent.

- [ ] **Step 3: Register the detail route**

In `apps/admin/src/App.tsx`, place the detail route after `/linkpay/new`:

```tsx
          <Route element={<LinkPayFormPage />} path="/linkpay/:linkPayId" />
```

- [ ] **Step 4: Replace the static form behavior with create/update persistence**

Replace `apps/admin/src/pages/LinkPayFormPage.tsx` with:

```tsx
import {
  createPaymentLink,
  getAdminPaymentLink,
  updatePaymentLink,
} from '@repo/supabase'
import { useEffect, useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AdminIcon } from '../components/AdminIcon'
import { AdminFormLayout } from '../components/admin-form/AdminFormLayout'
import { supabase } from '../lib/supabase'
import {
  createInitialLinkPayForm,
  toLinkPayFormState,
  toPaymentLinkInput,
} from './linkPayData'
import type { LinkPayFormState } from './linkPayData'
import { formatNumericValue } from './productData'
import './BlogFormPage.css'
import './LinkPayFormPage.css'

export function LinkPayFormPage() {
  const formId = useId().replaceAll(':', '')
  const navigate = useNavigate()
  const { linkPayId } = useParams<{ linkPayId: string }>()
  const isEditing = linkPayId !== undefined
  const [form, setForm] = useState(createInitialLinkPayForm)
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    let isCurrent = true
    const id = linkPayId

    if (!id) return

    void getAdminPaymentLink(supabase, id)
      .then((paymentLink) => {
        if (isCurrent) setForm(toLinkPayFormState(paymentLink))
      })
      .catch(() => {
        if (!isCurrent) return
        setLoadError('링크페이 정보를 불러오지 못했습니다.')
        toast.error('링크페이 정보를 불러오지 못했습니다.')
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [linkPayId])

  function updateForm<Key extends keyof LinkPayFormState>(
    key: Key,
    value: LinkPayFormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSaving) return

    setIsSaving(true)
    setSaveError('')

    try {
      const input = toPaymentLinkInput(form)

      if (linkPayId) {
        await updatePaymentLink(supabase, linkPayId, input)
      } else {
        await createPaymentLink(supabase, input)
      }

      toast.success(isEditing ? '링크페이를 수정했습니다.' : '링크페이를 생성했습니다.')
      navigate('/linkpay')
    } catch {
      setSaveError('링크페이를 저장하지 못했습니다. 입력값과 권한을 확인해주세요.')
      toast.error('링크페이를 저장하지 못했습니다.')
      window.alert('링크페이를 저장하지 못했습니다. 다시 시도해주세요.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || loadError) {
    return (
      <AdminFormLayout
        actions={
          <Link className="admin-form__button admin-form__button--outline" to="/linkpay">
            목록으로
          </Link>
        }
        onSubmit={(event) => event.preventDefault()}
        title={isEditing ? '링크페이 수정' : '신규 링크페이 등록'}
      >
        <p className="blog-form__error" role={loadError ? 'alert' : 'status'}>
          {loadError || '링크페이 정보를 불러오는 중입니다.'}
        </p>
      </AdminFormLayout>
    )
  }

  return (
    <AdminFormLayout
      actions={
        <>
          <Link className="admin-form__button admin-form__button--outline" to="/linkpay">
            목록으로
          </Link>
          <button
            className="admin-form__button admin-form__button--solid"
            disabled={isSaving}
            type="submit"
          >
            <span>{isSaving ? '저장 중...' : isEditing ? '수정하기' : '등록하기'}</span>
            <AdminIcon name="arrow-right" />
          </button>
        </>
      }
      onSubmit={handleSubmit}
      title={isEditing ? '링크페이 수정' : '신규 링크페이 등록'}
    >
      {saveError ? (
        <p className="blog-form__error" role="alert">
          {saveError}
        </p>
      ) : null}

      <label className="blog-form__field" htmlFor={`${formId}-client`}>
        <span className="blog-form__label">고객사명</span>
        <input
          autoComplete="organization"
          className="blog-form__control"
          id={`${formId}-client`}
          name="client"
          onChange={(event) => updateForm('client', event.currentTarget.value)}
          placeholder="고객사명을 입력해주세요."
          required
          type="text"
          value={form.client}
        />
      </label>

      <label className="blog-form__field" htmlFor={`${formId}-payment-name`}>
        <span className="blog-form__label">결제명</span>
        <input
          autoComplete="off"
          className="blog-form__control"
          id={`${formId}-payment-name`}
          name="paymentName"
          onChange={(event) => updateForm('paymentName', event.currentTarget.value)}
          placeholder="결제명을 입력해주세요."
          required
          type="text"
          value={form.paymentName}
        />
      </label>

      <label className="blog-form__field" htmlFor={`${formId}-amount`}>
        <span className="blog-form__label">결제 금액</span>
        <span className="linkpay-form__amount">
          <input
            autoComplete="off"
            className="blog-form__control linkpay-form__amount-input"
            id={`${formId}-amount`}
            inputMode="numeric"
            name="amount"
            onChange={(event) =>
              updateForm('amount', formatNumericValue(event.currentTarget.value))
            }
            pattern="[0-9,]+"
            placeholder="결제 금액을 입력해주세요.(숫자만 입력)"
            required
            type="text"
            value={form.amount}
          />
          <span className="linkpay-form__amount-unit">원</span>
        </span>
      </label>
    </AdminFormLayout>
  )
}
```

- [ ] **Step 5: Run form tests, type-check, and build**

Run:

```bash
node --test apps/admin/tests/linkPayFormPage.test.mjs
pnpm --filter admin test
pnpm --filter admin build
```

Expected: all commands exit 0; both LinkPay routes compile.

- [ ] **Step 6: Commit the persisted form**

```bash
git add apps/admin/src/App.tsx apps/admin/src/pages/LinkPayFormPage.tsx apps/admin/tests/linkPayFormPage.test.mjs
git commit -m "feat(linkpay): persist admin create and edit form"
```

### Task 4: Load, Filter, Copy, and Navigate the LinkPay List

**Files:**

- Modify: `apps/admin/src/pages/LinkPayPage.tsx`
- Create: `apps/admin/src/pages/LinkPayPage.css`
- Create: `apps/admin/tests/linkPayPage.test.mjs`

**Interfaces:**

- Consumes: `listAdminPaymentLinks`, `toLinkPayListRow`, `filterLinkPayRows`, `buildLinkPayUrl`
- Consumes: `VITE_USER_APP_URL`, defaulting to `http://localhost:3000`
- Produces: live list, status/client filters, name search, clipboard copy, `/linkpay/:id` detail links

- [ ] **Step 1: Write a failing list wiring smoke test**

Create `apps/admin/tests/linkPayPage.test.mjs`:

```js
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const pagePath = new URL('../src/pages/LinkPayPage.tsx', import.meta.url)

test('LinkPay list loads rows, filters them, copies public URLs, and links details', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /listAdminPaymentLinks\(supabase\)/)
  assert.match(source, /filterLinkPayRows/)
  assert.match(source, /buildLinkPayUrl/)
  assert.match(source, /navigator\.clipboard\.writeText/)
  assert.match(source, /VITE_USER_APP_URL/)
  assert.match(source, /to=\{row\.detailHref\}/)
  assert.match(source, /결제전/)
  assert.match(source, /결제완료/)
})
```

- [ ] **Step 2: Run the smoke test and verify the static page failure**

Run:

```bash
node --test apps/admin/tests/linkPayPage.test.mjs
```

Expected: FAIL because the current page uses an empty constant row array.

- [ ] **Step 3: Replace the static list with live data and actions**

Replace `apps/admin/src/pages/LinkPayPage.tsx` with:

```tsx
import { listAdminPaymentLinks } from '@repo/supabase'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { AdminDataTableSection } from '../components/admin-table/AdminDataTableSection'
import type {
  AdminTableColumn,
  AdminTableFilter,
} from '../components/admin-table/AdminDataTableSection'
import { supabase } from '../lib/supabase'
import {
  buildLinkPayUrl,
  filterLinkPayRows,
  toLinkPayListRow,
} from './linkPayData'
import type { LinkPayFilters, LinkPayListRow } from './linkPayData'
import './PortfolioPage.css'
import './LinkPayPage.css'

const statusFilterOptions = ['전체', '결제전', '결제완료'] as const
const userAppUrl = import.meta.env.VITE_USER_APP_URL || 'http://localhost:3000'

function renderPaymentStatus(status: LinkPayListRow['status']) {
  const isPaid = status === 'paid'

  return (
    <span
      className={
        isPaid
          ? 'admin-data-table__status'
          : 'admin-data-table__status admin-data-table__status--draft'
      }
    >
      <span className="admin-data-table__status-dot" />
      <span>{isPaid ? '결제완료' : '결제전'}</span>
    </span>
  )
}

export function LinkPayPage() {
  const [rows, setRows] = useState<readonly LinkPayListRow[]>([])
  const [filters, setFilters] = useState<Pick<LinkPayFilters, 'client' | 'status'>>({
    client: '전체',
    status: '전체',
  })
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const tableFilters = useMemo(
    () =>
      [
        {
          id: 'client',
          label: '고객사 필터',
          options: ['전체', ...new Set(rows.map((row) => row.client))],
        },
        { id: 'status', label: '상태 필터', options: statusFilterOptions },
      ] satisfies readonly AdminTableFilter[],
    [rows],
  )
  const filteredRows = useMemo(
    () => filterLinkPayRows(rows, { ...filters, query }),
    [filters, query, rows],
  )

  useEffect(() => {
    let isCurrent = true

    void listAdminPaymentLinks(supabase)
      .then((paymentLinks) => {
        if (isCurrent) setRows(paymentLinks.map(toLinkPayListRow))
      })
      .catch(() => {
        if (!isCurrent) return
        setLoadError('링크페이를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
        toast.error('링크페이 목록을 불러오지 못했습니다.')
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  function handleFilterValueChange(filterId: string, value: string) {
    if (filterId === 'client') {
      setFilters((current) => ({ ...current, client: value }))
      return
    }

    if (filterId === 'status') {
      setFilters((current) => ({
        ...current,
        status: value as (typeof statusFilterOptions)[number],
      }))
    }
  }

  async function handleCopy(row: LinkPayListRow) {
    try {
      await navigator.clipboard.writeText(buildLinkPayUrl(row.publicToken, userAppUrl))
      toast.success('링크페이 URL을 복사했습니다.')
    } catch {
      toast.error('링크페이 URL을 복사하지 못했습니다.')
      window.alert('링크페이 URL을 복사하지 못했습니다. 다시 시도해주세요.')
    }
  }

  const columns = [
    {
      header: '상태',
      id: 'status',
      renderCell: (row) => renderPaymentStatus(row.status),
      track: '160fr',
    },
    {
      header: '고객사명',
      id: 'client',
      renderCell: (row) => row.client,
      track: '240fr',
    },
    {
      header: '결제명',
      id: 'paymentName',
      renderCell: (row) => (
        <span className="admin-data-table__title-cell">{row.paymentName}</span>
      ),
      track: '496fr',
    },
    {
      header: '결제금액',
      id: 'amount',
      renderCell: (row) => row.amount,
      track: '200fr',
    },
    {
      header: '복사',
      id: 'copy',
      renderCell: (row) => (
        <button
          aria-label={`${row.paymentName} 링크 복사`}
          className="admin-data-table__link linkpay-page__copy-button"
          onClick={() => void handleCopy(row)}
          type="button"
        >
          복사
        </button>
      ),
      track: '140fr',
    },
    {
      header: '상세',
      id: 'detail',
      renderCell: (row) => (
        <Link className="admin-data-table__link" to={row.detailHref}>
          상세
        </Link>
      ),
      track: '140fr',
    },
  ] satisfies readonly AdminTableColumn<LinkPayListRow>[]

  return (
    <main className="portfolio-page" aria-label="링크페이 관리">
      <AdminDataTableSection
        bottomAction={{ href: '/linkpay/new', label: '링크페이 생성하기' }}
        columns={columns}
        emptyMessage={
          loadError ||
          (isLoading ? '링크페이를 불러오는 중입니다.' : '조회할 데이터가 없습니다.')
        }
        filters={tableFilters}
        filterValues={filters}
        getRowKey={(row) => row.id}
        onFilterValueChange={handleFilterValueChange}
        onSearchValueChange={setQuery}
        rows={filteredRows}
        search={{ label: '검색', placeholder: '결제명으로 검색해주세요.' }}
        searchValue={query}
        title="링크페이 등록 현황"
      />
    </main>
  )
}
```

- [ ] **Step 4: Add only the native button reset needed by the copy action**

Create `apps/admin/src/pages/LinkPayPage.css`:

```css
.linkpay-page__copy-button {
  padding: 0;
  border: 0;
  background: transparent;
  font: inherit;
  cursor: pointer;
}
```

- [ ] **Step 5: Run the focused test and administrator verification**

Run:

```bash
node --test apps/admin/tests/linkPayPage.test.mjs
pnpm --filter admin test
pnpm --filter admin lint
pnpm --filter admin build
```

Expected: all commands exit 0.

- [ ] **Step 6: Commit the functional list**

```bash
git add apps/admin/src/pages/LinkPayPage.tsx apps/admin/src/pages/LinkPayPage.css apps/admin/tests/linkPayPage.test.mjs
git commit -m "feat(linkpay): connect admin list and URL copy"
```

### Task 5: Apply the Schema and Verify the Administrator Flow

**Files:**

- Verify: `supabase/migrations/20260722000000_create_payment_links.sql`
- Verify: all files changed in Tasks 1–4

**Interfaces:**

- Requires: linked Supabase project with the existing administrator profile migration applied
- Requires: `apps/admin/.env` or deployment variables for `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_USER_APP_URL`
- Does not require: `NICEPAY_CLIENT_KEY`, `NICEPAY_SECRET_KEY`, user payment route

- [ ] **Step 1: Apply and lint the migration against the linked Supabase project**

Run:

```bash
supabase db push
supabase db lint --linked
```

Expected: `20260722000000_create_payment_links.sql` applies once and the linked database linter reports no errors.

- [ ] **Step 2: Run the complete automated verification**

Run:

```bash
pnpm --filter @repo/supabase test
pnpm --filter @repo/supabase check-types
pnpm --filter @repo/supabase lint
pnpm --filter admin test
pnpm --filter admin lint
pnpm --filter admin build
rg "figma.com/api/mcp/asset|https://www.figma.com/api" apps packages
```

Expected: all pnpm commands exit 0; the final `rg` command prints no matches.

- [ ] **Step 3: Smoke-test the authenticated administrator flow**

Run:

```bash
pnpm --filter admin dev
```

In the browser:

1. Sign in with an administrator account and open `/linkpay`.
2. Confirm the empty/loading state resolves without an error toast.
3. Open `/linkpay/new`, enter `테스트 고객사`, `브로슈어 제작비`, `120000`, and submit.
4. Confirm the list renders `결제전`, `테스트 고객사`, `브로슈어 제작비`, `120,000원`.
5. Search `브로`, select the client filter, and select `결제전`; confirm the row remains.
6. Click `복사` and confirm the clipboard value is `${VITE_USER_APP_URL}/linkpay/{UUID}`.
7. Click `상세`, change the amount to `130000`, save, and confirm the list renders `130,000원` after navigation.
8. Refresh `/linkpay` and confirm the edited row remains.

Expected: create, reload, filter, copy, detail, update, and persistence all work. Opening the copied URL may return 404 until the user-app LinkPay plan is implemented.

- [ ] **Step 4: Confirm the final diff contains no payment integration or secrets**

Run:

```bash
git diff --check
git status --short
rg -n "NICEPAY|nicepay|secretKey|MerchantKey" apps/admin packages/supabase supabase/migrations/20260722000000_create_payment_links.sql
```

Expected: `git diff --check` exits 0; status contains only planned files before their commits; the final `rg` prints no LinkPay payment-integration credentials or code.

## Deferred User-App Scope

- Public `/linkpay/[publicToken]` product/payment page
- Server-only lookup by `public_token`
- Unique order creation and server-side amount snapshot
- NICEPAY Client Key/Secret Key, checkout SDK, return URL, approval API, signature verification, network cancel
- Webhook reconciliation and idempotent `pending → paid` transition
- Paid-link edit lock and payment history/receipt display
