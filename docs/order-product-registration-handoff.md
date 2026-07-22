# 주문/개인결제 데이터 인수인계

## 핵심 방향

주문 페이지의 원본 상품 데이터는 어드민 상품 등록 구조를 기준으로 맞춥니다. 프론트 화면은 어드민 원본을 그대로 쓰지 않고, `fromAdminProductToOrderRegistration`으로 UI가 쓰기 좋은 옵션 구조로 변환해서 사용합니다.

- 어드민 원본 상품: `AdminOrderProduct`
- 정적 샘플 위치: `apps/user/app/_content/order.ts`
- UI 변환 함수: `fromAdminProductToOrderRegistration(product)`
- 옵션 화면 데이터: `orderOptionCatalog`
- 단일 상품 조회: `getOrderOptionConfig(serviceId)`
- 수량별 가격 조회: `getOrderQuantityOptions(optionConfig, pageId, paperId)`

## 어드민 상품 저장 구조

어드민에서 상품을 등록할 때는 아래처럼 저장하면 됩니다.

```ts
type AdminOrderProduct = {
  id: string;
  name: string;
  type: string;
  design_print_estimate: number;
  planning_estimate: number;
  paper_types: string[];
  page_counts: number[];
  order_quantities: number[];
  unit_prices: Record<string, number>;
};
```

| 필드 | 예시 | 설명 |
| --- | --- | --- |
| `id` | `brochure-catalog` | 주문 카드와 결제 payload에서 쓰는 상품 ID입니다. |
| `name` | `브로슈어 · 카탈로그` | 카테고리 카드 제목입니다. |
| `type` | `기업소개, 제품 카탈로그...` | 카테고리 카드 설명입니다. |
| `design_print_estimate` | `160000` | 디자인+인쇄 기본 금액입니다. |
| `planning_estimate` | `100000` | 기획 추가 금액입니다. |
| `paper_types` | `["일반지", "고급지"]` | 용지 탭 목록입니다. |
| `page_counts` | `[8, 16, 24]` | 페이지 수 탭 목록입니다. 화면에서는 `8p`처럼 표시됩니다. |
| `order_quantities` | `[500, 1000, 2000, 3000]` | 수량 목록입니다. 화면에서는 `500부`처럼 표시됩니다. |
| `unit_prices` | `{ "0:0:0": 1040 }` | 용지/페이지/수량 조합별 인쇄 단가입니다. |

## 단가 키 규칙

`unit_prices` 키는 `paperIndex:pageIndex:quantityIndex` 형식입니다.

```ts
const key = `${paperIndex}:${pageIndex}:${quantityIndex}`;
```

예를 들어 아래 상품에서:

```ts
paper_types: ["일반지 (스노우지 유광)", "고급지 (랑데뷰 무광)"],
page_counts: [8, 16, 24],
order_quantities: [500, 1000, 2000, 3000],
unit_prices: {
  "0:0:0": 1040,
  "0:0:1": 700,
}
```

- `"0:0:0"`은 첫 번째 용지 / 첫 번째 페이지 수 / 첫 번째 수량입니다.
- 즉 `일반지 (스노우지 유광) / 8p / 500부`의 단가는 `1,040원`입니다.
- `"0:0:1"`은 `일반지 (스노우지 유광) / 8p / 1,000부`의 단가 `700원`입니다.

## 프론트 변환 결과

프론트는 어드민 원본을 아래 UI용 구조로 바꿔서 옵션 선택 화면에 전달합니다.

```ts
type OrderProductRegistration = {
  serviceId: string;
  designPrintService: OrderServiceOption;
  planningService: OrderServiceOption;
  paperOptions: OrderOptionChoice[];
  pageOptions: OrderOptionChoice[];
  quantities: number[];
  unitPriceQuotes: OrderUnitPriceQuote[];
  paperSectionTitle: string;
  pageSectionTitle: string;
};
```

`unit_prices`는 화면에서 찾기 쉬운 `unitPriceQuotes`로 변환됩니다.

```ts
type OrderUnitPriceQuote = {
  pageId: string;
  paperId: string;
  quantityId: string;
  unitPrice: number;
};
```

## 결제 payload

주문자 정보 입력 후 결제하기를 누르면 `submitOrderPayment`에 아래 payload가 전달됩니다.

```ts
type OrderPaymentSubmitPayload = {
  summary: OrderSelectionSummary;
  customer: OrderCustomerInfo;
  agreements: Record<AgreementId, boolean>;
};
```

`summary.ids`에는 서버 검증과 결제 요청에 필요한 원본 ID가 들어갑니다.

```ts
type OrderSelectedOptionIds = {
  serviceId: string;
  pageId: string;
  paperId: string;
  quantityId: string;
  hasPlanning: boolean;
  unitPrice: number;
};
```

서버 액션 `submitOrderPayment`는 현재 실제 결제사가 연결되기 전 상태입니다. 그래서 상품 존재 여부와 금액 재계산만 검증한 뒤, 성공처럼 보내지 않고 `/order/fail?reason=payment-not-ready`로 보냅니다.

결제 개발자가 붙일 위치:

- 주문 결제: `apps/user/app/(site)/order/payment.ts`
- 개인결제: `apps/user/app/(site)/linkpay/[id]/payment.ts`

## 개인결제 데이터

어드민에서 개인 결제창을 만들면 사용자에게 `/linkpay/{id}` 주소를 전달합니다.

```ts
type LinkPayPayment = {
  id: string;
  clientName: string;
  paymentName: string;
  amount: number;
  status: "pending" | "paid";
  detailRows: Array<{
    label: string;
    value: string;
  }>;
};
```

예시:

```ts
{
  id: "cj-draft-payment",
  clientName: "CJ제일제당",
  paymentName: "민잇 플러스 개발 용역 위탁 결제",
  amount: 520000,
  status: "pending",
  detailRows: [
    { label: "서비스", value: "디자인 + 인쇄" },
    { label: "용지", value: "일반지 (스노우지 유광)" },
    { label: "페이지 수 / 수량", value: "12p / 500부" },
  ],
}
```

개인결제도 실제 결제사가 연결되기 전에는 가짜 성공을 만들지 않습니다. `pending` 상태에서 결제하기를 누르면 `/linkpay/{id}/fail`로 이동합니다. 결제 연동 후에는 실제 결제 성공 시 상태를 `paid`로 바꾸고 `/linkpay/{id}/success`로 보내면 됩니다.

## 서버에서 꼭 다시 확인할 것

클라이언트 값은 화면 표시와 UX를 위한 값입니다. 실제 결제 전에는 서버에서 다시 확인해야 합니다.

- `serviceId`, `pageId`, `paperId`, `quantityId` 조합이 실제 상품에 있는지 확인
- `unit_prices` 기준으로 금액 재계산
- `hasPlanning`이 true이면 기획비 반영
- 고객 필수값, 이메일 형식, 국내 휴대폰 번호 형식 확인
- 필수 약관 동의 여부 확인
- 결제 완료 후 결과 페이지에 넘길 `companyName`, `paymentMethod`, `detailRows`, `totalPrice` 구성

## 결과 페이지 연결

결제 결과 페이지는 동적 데이터를 받기 좋게 열려 있습니다.

- 주문 성공 화면은 결제 연동 전 직접 접근을 막기 위해 현재 `/order`로 리다이렉트합니다.
- 주문 실패 화면은 `/order/fail?reason=invalid-product`처럼 실패 이유를 받을 수 있습니다.
- 개인결제 성공 화면은 `status: "paid"`일 때만 열립니다.
- 개인결제 실패 화면은 스텝리스트 없이 글로벌 헤더가 있는 결과 화면으로 표시됩니다.
