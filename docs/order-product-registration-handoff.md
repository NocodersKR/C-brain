# 주문 상품 등록 데이터 구조 인수인계

## 현재 상태

주문·결제 페이지 UI는 프론트엔드 기준으로 구현되어 있으며, 상품 등록 데이터는 현재 `apps/user/app/_content/order.ts`의 정적 데이터로 관리합니다.

추후 어드민에서 상품을 등록하면 어드민 저장 데이터가 `OrderProductRegistration` 형태로 내려오도록 맞추면 됩니다. 프론트엔드는 이 원본 상품 등록 데이터를 `OrderOptionConfig`로 변환해 옵션 선택 UI에 사용합니다.

- 상품 등록 원본 데이터: `orderProductRegistrations`
- UI용 옵션 데이터: `orderOptionCatalog`
- 단일 상품 조회 함수: `getOrderOptionConfig(serviceId)`
- 선택한 페이지·용지 기준 수량/단가 계산 함수: `getOrderQuantityOptions(optionConfig, pageId, paperId)`

## 데이터 흐름

1. 카테고리 선택 카드에서 `serviceId`를 선택합니다.
2. `getOrderOptionConfig(serviceId)`로 해당 상품의 옵션 설정을 가져옵니다.
3. 사용자가 페이지 수와 용지를 선택하면 `getOrderQuantityOptions`가 해당 조합에 맞는 수량별 단가표를 반환합니다.
4. 결제하기를 누르면 선택값이 `OrderSelectionSummary`로 정리됩니다.
5. 주문자 정보 입력 단계에서 `OrderPaymentSubmitPayload`로 고객 정보, 동의값, 주문 요약을 결제 연동 함수에 넘깁니다.

## 어드민 등록 구조

어드민의 신규 상품 등록 화면은 아래 구조로 저장하면 됩니다.

```ts
type OrderProductRegistration = {
  serviceId: string;
  designPrintService: OrderServiceOption;
  planningService: OrderServiceOption;
  paperOptions: ReadonlyArray<OrderOptionChoice>;
  pageOptions: ReadonlyArray<OrderOptionChoice>;
  quantities: ReadonlyArray<OrderQuantityInput>;
  unitPriceQuotes: ReadonlyArray<OrderUnitPriceQuote>;
  paperSectionTitle: string;
  pageSectionTitle: string;
};
```

현재 코드에서는 입력 편의를 위해 `createProductRegistration`이 `unitPrices`를 받아 `unitPriceQuotes`로 변환합니다. 실제 API 응답에서는 둘 중 하나로 확정하면 됩니다. 프론트와 맞추기에는 `unitPriceQuotes`를 내려주는 방식이 가장 명확합니다.

## 필드 설명

| 필드 | 형식 | 설명 |
| --- | --- | --- |
| `serviceId` | string | 카테고리 카드의 상품 ID와 매칭되는 값입니다. 예: `brochure-catalog` |
| `designPrintService` | `OrderServiceOption` | 디자인+인쇄 기본 서비스 카드 정보입니다. |
| `planningService` | `OrderServiceOption` | 기획 추가 선택 카드 정보입니다. |
| `paperOptions` | `OrderOptionChoice[]` | 용지 선택 버튼 목록입니다. |
| `pageOptions` | `OrderOptionChoice[]` | 페이지 수 선택 버튼 목록입니다. |
| `quantities` | `OrderQuantityInput[]` | 주문 수량 목록입니다. 예: 500부, 1,000부 |
| `unitPriceQuotes` | `OrderUnitPriceQuote[]` | 페이지·용지·수량 조합별 인쇄 단가입니다. |
| `paperSectionTitle` | string | UI 섹션 제목입니다. 기본값은 `IV. 용지 선택`입니다. |
| `pageSectionTitle` | string | UI 섹션 제목입니다. 기본값은 `III. 페이지 수 선택`입니다. |

## 세부 타입

```ts
type OrderServiceOption = {
  badge: string;
  title: string;
  description: string;
  fee: number;
  priceLabel: string;
  note: string;
};

type OrderOptionChoice = {
  id: string;
  label: string;
};

type OrderQuantityInput = {
  id: string;
  amount: number;
  unit: string;
};

type OrderUnitPriceQuote = {
  pageId: string;
  paperId?: string;
  quantityId: string;
  unitPrice: number;
  totalPrice?: number;
};
```

## 예시

브로슈어·카탈로그 상품은 아래처럼 등록하면 됩니다.

```ts
{
  serviceId: "brochure-catalog",
  designPrintService: {
    badge: "기본 포함",
    title: "디자인 + 인쇄",
    description: "편집 디자인·후가공·인쇄 원스톱 진행",
    fee: 160000,
    priceLabel: "160,000원 ~",
    note: "용지·페이지·수량에 따라 상이",
  },
  planningService: {
    badge: "+ 선택 추가",
    title: "기획",
    description: "컨셉 방향·구성안·카피라이팅",
    fee: 100000,
    priceLabel: "+100,000원 ~",
    note: "규모에 따라 별도 상담",
  },
  paperOptions: [
    { id: "snow", label: "일반지 (스노우지 유광)" },
    { id: "rendezvous", label: "고급지 (랑데뷰 무광)" },
  ],
  pageOptions: [
    { id: "8p", label: "8p" },
    { id: "16p", label: "16p" },
    { id: "24p", label: "24p" },
  ],
  quantities: [
    { id: "500", amount: 500, unit: "부" },
    { id: "1000", amount: 1000, unit: "부" },
    { id: "2000", amount: 2000, unit: "부" },
    { id: "3000", amount: 3000, unit: "부" },
  ],
  unitPriceQuotes: [
    { pageId: "8p", paperId: "snow", quantityId: "500", unitPrice: 1040 },
    { pageId: "8p", paperId: "snow", quantityId: "1000", unitPrice: 700 },
    { pageId: "8p", paperId: "snow", quantityId: "2000", unitPrice: 520 },
    {
      pageId: "8p",
      paperId: "snow",
      quantityId: "3000",
      unitPrice: 463,
      totalPrice: 1390000,
    },
  ],
}
```

`totalPrice`가 없으면 프론트는 `unitPrice * amount`로 총액을 계산합니다. 463원처럼 단가 곱셈과 최종 합계가 반올림 때문에 다를 수 있는 경우에는 `totalPrice`를 함께 내려주세요.

## 용지 공통 단가

용지별 단가가 같다면 `paperId`를 생략할 수 있습니다.

```ts
{ pageId: "8p", quantityId: "500", unitPrice: 1040 }
```

이 경우 `8p / 모든 용지 / 500부`에 공통 적용됩니다. 특정 용지만 다른 단가가 필요하면 같은 `pageId`, `quantityId`에 `paperId`를 포함한 값을 추가하면 그 값이 우선 적용됩니다.

## 결제 단계 payload

주문자 정보 입력 단계에서 결제하기를 누르면 아래 구조가 `onPaymentSubmit`으로 전달됩니다.

```ts
type OrderPaymentSubmitPayload = {
  summary: OrderSelectionSummary;
  customer: OrderCustomerInfo;
  agreements: Record<AgreementId, boolean>;
};
```

`summary.ids`에는 실제 결제 API에 넘기기 좋은 원본 ID가 들어갑니다.

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

화면 표시용 값은 `summary.serviceLabel`, `summary.paperLabel`, `summary.pageLabel`, `summary.quantityLabel`, `summary.priceRows`, `summary.totalPrice`에 들어갑니다.

## 결제 연동 지점

현재 결제 API 호출은 아직 연결되어 있지 않습니다. 연결 지점은 `apps/user/app/(site)/order/page.tsx`의 `handlePaymentSubmit`입니다.

```ts
const handlePaymentSubmit = (payload: OrderPaymentSubmitPayload) => {
  void payload;
};
```

결제 개발자는 이 함수에서 결제 요청을 호출하고, 결과에 따라 `/order/success` 또는 `/order/fail`로 이동시키면 됩니다.

## 개인 결제창 데이터

어드민의 신규 링크페이 등록 화면에서 고객사명, 결제명, 결제 금액을 저장하면 사용자에게 `/linkpay/{id}` 형태의 결제 링크를 전달합니다.

사용자 결제창은 `apps/user/app/_content/linkPay.ts`의 `LinkPayPayment` 구조를 기준으로 렌더링합니다. 현재는 정적 예시 데이터지만, 추후 API 응답을 같은 형태로 내려주면 화면 코드는 그대로 사용할 수 있습니다.

```ts
type LinkPayPayment = {
  id: string;
  clientName: string;
  paymentName: string;
  amount: number;
  status: "pending" | "paid";
  detailRows: ReadonlyArray<{
    label: string;
    value: string;
  }>;
};
```

`detailRows`는 결제 내역 카드 안에 들어가는 행입니다. 어드민 입력이 고객사명, 결제명, 금액만 있는 단순 결제라면 `결제명` 같은 1개 행만 내려도 되고, 주문형 결제처럼 서비스·용지·페이지 수 / 수량이 있으면 여러 행을 내려주면 됩니다.

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

사용자가 개인 결제창에서 결제하기를 누르면 `LinkPayPaymentSubmitPayload`가 결제 연동 함수로 전달됩니다.

```ts
type LinkPayPaymentSubmitPayload = {
  linkPayId: string;
  customer: LinkPayCustomerInfo;
  agreements: Record<AgreementId, boolean>;
};
```

결제 연동 지점은 `apps/user/app/(site)/linkpay/[id]/payment.ts`의 `submitLinkPayPayment`입니다. 이 함수는 서버 액션이며, 클라이언트에서 전달한 `linkPayId`로 서버가 개인 결제 정보를 다시 조회합니다.

```ts
type LinkPayPaymentSubmitResult =
  | { status: "success"; redirectHref?: string }
  | { status: "failure"; redirectHref?: string; failureReason?: string };
```

현재 함수는 UI 확인을 위해 성공 상태를 반환합니다. 결제 개발자는 이 함수 내부에서 서버 기준 결제 금액과 상태를 조회한 뒤 실제 결제 요청을 호출하고, 결과에 따라 `status`를 반환하면 됩니다. `redirectHref`가 없으면 프론트는 자동으로 아래 기본 결과 페이지로 이동합니다.

- 성공: `/linkpay/{id}/success`
- 실패: `/linkpay/{id}/fail`

개인결제 성공·실패 결과 페이지는 주문 스텝리스트를 표시하지 않는 독립 결과 화면입니다. 결과 화면 결제 내역은 `detailRows`, `clientName`, `amount`를 사용해 동적으로 렌더링합니다.

## 서버 검증 권장 사항

클라이언트 계산값은 화면 표시와 UX를 위한 값이므로 서버에서 다시 검증해야 합니다.

- `serviceId`, `pageId`, `paperId`, `quantityId` 조합이 실제 등록 상품에 존재하는지 확인
- 단가와 총액을 서버 기준으로 재계산
- `hasPlanning`이 true일 때 기획 비용 반영
- 주문자 필수값, 이메일 형식, 국내 이동전화 번호 형식 검증
- 필수 약관 동의 여부 검증

서버 응답에는 결제 추적에 필요한 `orderId`, `paymentId`, `paymentMethod`, `companyName`, `paidAt` 같은 값을 포함하는 것을 권장합니다.
