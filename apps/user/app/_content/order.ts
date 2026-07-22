type OrderStepState = "active" | "inactive";
type OrderMethodTone = "brand" | "quote";

export type OrderStepId = "category" | "option" | "customer";

export type OrderMethod = {
  description: string;
  id: string;
  label: string;
  state: OrderStepState;
  title: string;
  tone: OrderMethodTone;
};

export const orderSteps = [
  { label: "Ⅰ. 카테고리 선택", state: "active" },
  { label: "Ⅱ. 옵션 선택", state: "inactive" },
  { label: "Ⅲ. 정보 입력", state: "inactive" },
  { label: "Ⅳ. 결제 완료", state: "inactive" },
] as const satisfies ReadonlyArray<{
  label: string;
  state: OrderStepState;
}>;

export const orderMethods = [
  {
    description:
      "규격·사양이 정해진 표준 제품\n사양 선택 → 가격 확인 → 카드 즉시결제",
    id: "direct",
    label: "바로 주문",
    state: "active",
    title: "정찰제 즉시결제",
    tone: "brand",
  },
  {
    description:
      "규격 협의 필요하거나 대량 주문\n카카오톡 1:1 상담으로 빠른 견적",
    id: "quote",
    label: "견적 후 주문",
    state: "inactive",
    title: "맞춤·대량·촬영",
    tone: "quote",
  },
] as const satisfies ReadonlyArray<OrderMethod>;

export type OrderOptionChoice = {
  id: string;
  label: string;
};

export type OrderQuantityInput = {
  amount: number;
  id: string;
  unit: string;
};

export type OrderUnitPriceQuote = {
  pageId: string;
  paperId?: string;
  quantityId: string;
  totalPrice?: number;
  unitPrice: number;
};

export type OrderQuantityOption = {
  id: string;
  printFee: number;
  quantity: string;
  total: number;
  unitPrice: string;
  unitPriceAmount: number;
};

export type OrderServiceOption = {
  badge: string;
  description: string;
  fee: number;
  note: string;
  priceLabel: string;
  title: string;
};

export type OrderOptionConfig = {
  defaultPageId: string;
  defaultPaperId: string;
  defaultQuantityId: string;
  pageOptions: ReadonlyArray<OrderOptionChoice>;
  pageSectionTitle: string;
  paperOptions: ReadonlyArray<OrderOptionChoice>;
  paperSectionTitle: string;
  planningService: OrderServiceOption;
  quantities: ReadonlyArray<OrderQuantityInput>;
  quantityOptions: ReadonlyArray<OrderQuantityOption>;
  selectedService: OrderServiceOption;
  serviceId: string;
  unitPriceQuotes: ReadonlyArray<OrderUnitPriceQuote>;
};

export type OrderProductRegistration = {
  designPrintService: OrderServiceOption;
  pageOptions: ReadonlyArray<OrderOptionChoice>;
  pageSectionTitle: string;
  paperOptions: ReadonlyArray<OrderOptionChoice>;
  paperSectionTitle: string;
  planningService: OrderServiceOption;
  quantities: ReadonlyArray<OrderQuantityInput>;
  serviceId: string;
  unitPriceQuotes: ReadonlyArray<OrderUnitPriceQuote>;
};

export type OrderSelectedOptionIds = {
  hasPlanning: boolean;
  pageId: string;
  paperId: string;
  quantityId: string;
  serviceId: string;
  unitPrice: number;
};

export type OrderSelectionSummary = {
  ids: OrderSelectedOptionIds;
  pageLabel: string;
  paperLabel: string;
  priceRows: ReadonlyArray<{
    label: string;
    value: number;
  }>;
  quantityLabel: string;
  serviceLabel: string;
  totalPrice: number;
};

export const formatOrderCurrency = (amount: number) =>
  `${amount.toLocaleString("ko-KR")}원`;

const defaultPlanningService = {
  badge: "+ 선택 추가",
  description: "컨셉 방향·구성안·카피라이팅",
  fee: 100000,
  note: "규모에 따라 별도 상담",
  priceLabel: "+100,000원 ~",
  title: "기획",
} as const satisfies OrderServiceOption;

type OrderUnitPriceInput = Omit<OrderUnitPriceQuote, "pageId"> & {
  pageId?: string;
};

type OrderProductRegistrationInput = Omit<
  OrderProductRegistration,
  "pageSectionTitle" | "paperSectionTitle" | "planningService" | "unitPriceQuotes"
> & {
  pageSectionTitle?: string;
  paperSectionTitle?: string;
  planningService?: OrderServiceOption;
  unitPrices: ReadonlyArray<OrderUnitPriceInput>;
};

const formatOrderQuantity = ({ amount, unit }: OrderQuantityInput) =>
  `${amount.toLocaleString("ko-KR")}${unit}`;

const createUnitPriceQuotes = (
  pageOptions: ReadonlyArray<OrderOptionChoice>,
  unitPrices: ReadonlyArray<OrderUnitPriceInput>,
): ReadonlyArray<OrderUnitPriceQuote> =>
  unitPrices.flatMap((unitPrice) => {
    if (unitPrice.pageId) {
      return [{ ...unitPrice, pageId: unitPrice.pageId }];
    }

    return pageOptions.map((pageOption) => ({
      ...unitPrice,
      pageId: pageOption.id,
    }));
  });

const createProductRegistration = ({
  pageSectionTitle = "III. 페이지 수 선택",
  paperSectionTitle = "IV. 용지 선택",
  planningService = defaultPlanningService,
  unitPrices,
  ...registration
}: OrderProductRegistrationInput): OrderProductRegistration => ({
  ...registration,
  pageSectionTitle,
  paperSectionTitle,
  planningService,
  unitPriceQuotes: createUnitPriceQuotes(registration.pageOptions, unitPrices),
});

const findUnitPriceQuote = (
  unitPriceQuotes: ReadonlyArray<OrderUnitPriceQuote>,
  pageId: string,
  paperId: string,
  quantityId: string,
) =>
  unitPriceQuotes.find(
    (quote) =>
      quote.pageId === pageId &&
      quote.paperId === paperId &&
      quote.quantityId === quantityId,
  ) ??
  unitPriceQuotes.find(
    (quote) =>
      quote.pageId === pageId &&
      quote.paperId === undefined &&
      quote.quantityId === quantityId,
  );

function createQuantityOption(
  selectedService: OrderServiceOption,
  quantity: OrderQuantityInput,
  quote: OrderUnitPriceQuote,
): OrderQuantityOption {
  const total = quote.totalPrice ?? quote.unitPrice * quantity.amount;

  return {
    id: quantity.id,
    printFee: Math.max(total - selectedService.fee, 0),
    quantity: formatOrderQuantity(quantity),
    total,
    unitPrice: formatOrderCurrency(quote.unitPrice),
    unitPriceAmount: quote.unitPrice,
  };
}

const createQuantityOptions = (
  source: Pick<
    OrderOptionConfig,
    "quantities" | "selectedService" | "unitPriceQuotes"
  >,
  pageId: string,
  paperId: string,
): ReadonlyArray<OrderQuantityOption> =>
  source.quantities.flatMap((quantity) => {
    const quote = findUnitPriceQuote(
      source.unitPriceQuotes,
      pageId,
      paperId,
      quantity.id,
    );

    return quote ? [createQuantityOption(source.selectedService, quantity, quote)] : [];
  });

function createOrderOptionConfig(
  product: OrderProductRegistration,
): OrderOptionConfig {
  const selectedService = product.designPrintService;
  const defaultPage = product.pageOptions[0];
  const defaultPaper = product.paperOptions[0];

  if (!defaultPage || !defaultPaper) {
    throw new Error(`Order option config for ${product.serviceId} needs defaults.`);
  }

  const quantityOptions = createQuantityOptions(
    {
      quantities: product.quantities,
      selectedService,
      unitPriceQuotes: product.unitPriceQuotes,
    },
    defaultPage.id,
    defaultPaper.id,
  );
  const defaultQuantity = quantityOptions[0];

  if (!defaultQuantity) {
    throw new Error(`Order option config for ${product.serviceId} needs prices.`);
  }

  return {
    defaultPageId: defaultPage.id,
    defaultPaperId: defaultPaper.id,
    defaultQuantityId: defaultQuantity.id,
    pageOptions: product.pageOptions,
    pageSectionTitle: product.pageSectionTitle,
    paperOptions: product.paperOptions,
    paperSectionTitle: product.paperSectionTitle,
    planningService: product.planningService,
    quantities: product.quantities,
    quantityOptions,
    selectedService,
    serviceId: product.serviceId,
    unitPriceQuotes: product.unitPriceQuotes,
  };
}

export const getOrderQuantityOptions = (
  optionConfig: OrderOptionConfig,
  pageId: string,
  paperId: string,
): ReadonlyArray<OrderQuantityOption> =>
  createQuantityOptions(optionConfig, pageId, paperId);

export const orderProductRegistrations = {
  "brochure-catalog": createProductRegistration({
    pageOptions: [
      { id: "8p", label: "8p" },
      { id: "12p", label: "12p" },
      { id: "16p", label: "16p" },
    ],
    paperOptions: [
      { id: "snow", label: "일반지 (스노우지 유광)" },
      { id: "rendezvous", label: "고급지 (랑데뷰 무광)" },
    ],
    quantities: [
      { id: "500", amount: 500, unit: "부" },
      { id: "1000", amount: 1000, unit: "부" },
      { id: "2000", amount: 2000, unit: "부" },
      { id: "3000", amount: 3000, unit: "부" },
    ],
    serviceId: "brochure-catalog",
    unitPrices: [
      { quantityId: "500", unitPrice: 1040 },
      { quantityId: "1000", unitPrice: 700 },
      { quantityId: "2000", unitPrice: 520 },
      { quantityId: "3000", totalPrice: 1390000, unitPrice: 463 },
    ],
    designPrintService: {
      badge: "기본 포함",
      description: "편집 디자인·후가공·인쇄 원스톱 진행",
      fee: 160000,
      note: "용지·페이지·수량에 따라 상이",
      priceLabel: "160,000원 ~",
      title: "디자인 + 인쇄",
    },
  }),
  "leaflet-pamphlet": createProductRegistration({
    pageOptions: [
      { id: "2fold", label: "2단" },
      { id: "3fold", label: "3단" },
      { id: "4fold", label: "4단" },
    ],
    paperOptions: [
      { id: "art", label: "아트지 150g" },
      { id: "snow", label: "스노우지 180g" },
    ],
    quantities: [
      { id: "500", amount: 500, unit: "부" },
      { id: "1000", amount: 1000, unit: "부" },
      { id: "2000", amount: 2000, unit: "부" },
      { id: "3000", amount: 3000, unit: "부" },
    ],
    serviceId: "leaflet-pamphlet",
    unitPrices: [
      { quantityId: "500", unitPrice: 840 },
      { quantityId: "1000", unitPrice: 560 },
      { quantityId: "2000", unitPrice: 410 },
      { quantityId: "3000", totalPrice: 1090000, unitPrice: 363 },
    ],
    designPrintService: {
      badge: "기본 포함",
      description: "접지 구성·편집 디자인·인쇄 진행",
      fee: 160000,
      note: "접지·수량에 따라 상이",
      priceLabel: "160,000원 ~",
      title: "디자인 + 인쇄",
    },
  }),
  "poster-flyer": createProductRegistration({
    pageOptions: [
      { id: "a3", label: "A3" },
      { id: "a2", label: "A2" },
      { id: "a1", label: "A1" },
    ],
    paperOptions: [
      { id: "standard", label: "일반지 (스노우지 유광)" },
      { id: "thick", label: "고급지 250g" },
    ],
    quantities: [
      { id: "100", amount: 100, unit: "부" },
      { id: "300", amount: 300, unit: "부" },
      { id: "500", amount: 500, unit: "부" },
      { id: "1000", amount: 1000, unit: "부" },
    ],
    serviceId: "poster-flyer",
    unitPrices: [
      { quantityId: "100", unitPrice: 3000 },
      { quantityId: "300", totalPrice: 400000, unitPrice: 1333 },
      { quantityId: "500", unitPrice: 960 },
      { quantityId: "1000", unitPrice: 680 },
    ],
    designPrintService: {
      badge: "기본 포함",
      description: "포스터·전단 편집 디자인 및 인쇄",
      fee: 160000,
      note: "규격·수량에 따라 상이",
      priceLabel: "160,000원 ~",
      title: "디자인 + 인쇄",
    },
  }),
  "banner-display": createProductRegistration({
    pageOptions: [
      { id: "basic", label: "기본형" },
      { id: "wide", label: "와이드" },
      { id: "custom", label: "맞춤형" },
    ],
    paperOptions: [
      { id: "pet", label: "PET 배너" },
      { id: "fabric", label: "패브릭 현수막" },
    ],
    quantities: [
      { id: "1", amount: 1, unit: "개" },
      { id: "3", amount: 3, unit: "개" },
      { id: "5", amount: 5, unit: "개" },
      { id: "10", amount: 10, unit: "개" },
    ],
    serviceId: "banner-display",
    unitPrices: [
      { quantityId: "1", unitPrice: 250000 },
      { quantityId: "3", totalPrice: 370000, unitPrice: 123333 },
      { quantityId: "5", unitPrice: 96000 },
      { quantityId: "10", unitPrice: 72000 },
    ],
    designPrintService: {
      badge: "기본 포함",
      description: "배너 디자인·출력·후가공 진행",
      fee: 160000,
      note: "규격·소재에 따라 상이",
      priceLabel: "160,000원 ~",
      title: "디자인 + 출력",
    },
  }),
  "business-card-envelope": createProductRegistration({
    pageOptions: [
      { id: "business-card", label: "명함" },
      { id: "envelope", label: "봉투" },
      { id: "letterhead", label: "레터헤드" },
    ],
    paperOptions: [
      { id: "standard", label: "일반지" },
      { id: "premium", label: "고급지" },
    ],
    quantities: [
      { id: "200", amount: 200, unit: "매" },
      { id: "500", amount: 500, unit: "매" },
      { id: "1000", amount: 1000, unit: "매" },
      { id: "2000", amount: 2000, unit: "매" },
    ],
    serviceId: "business-card-envelope",
    unitPrices: [
      { quantityId: "200", unitPrice: 1150 },
      { quantityId: "500", unitPrice: 560 },
      { quantityId: "1000", unitPrice: 370 },
      { quantityId: "2000", unitPrice: 260 },
    ],
    designPrintService: {
      badge: "기본 포함",
      description: "명함·봉투 편집 디자인 및 인쇄",
      fee: 160000,
      note: "품목·수량에 따라 상이",
      priceLabel: "160,000원 ~",
      title: "디자인 + 인쇄",
    },
  }),
  logo: createProductRegistration({
    pageOptions: [
      { id: "basic", label: "베이직" },
      { id: "standard", label: "스탠다드" },
      { id: "premium", label: "프리미엄" },
    ],
    paperOptions: [
      { id: "digital", label: "디지털 파일" },
      { id: "guide", label: "가이드 포함" },
    ],
    quantities: [
      { id: "1", amount: 1, unit: "식" },
      { id: "2", amount: 2, unit: "안" },
      { id: "3", amount: 3, unit: "안" },
      { id: "4", amount: 4, unit: "안" },
    ],
    serviceId: "logo",
    unitPrices: [
      { quantityId: "1", unitPrice: 360000 },
      { quantityId: "2", unitPrice: 260000 },
      { quantityId: "3", totalPrice: 680000, unitPrice: 226667 },
      { quantityId: "4", unitPrice: 210000 },
    ],
    designPrintService: {
      badge: "기본 포함",
      description: "로고 콘셉트 설계 및 디자인",
      fee: 360000,
      note: "제안안 수에 따라 상이",
      priceLabel: "360,000원 ~",
      title: "로고 디자인",
    },
  }),
  "package-shopping-bag": createProductRegistration({
    pageOptions: [
      { id: "label", label: "라벨" },
      { id: "box", label: "박스" },
      { id: "bag", label: "쇼핑백" },
    ],
    paperOptions: [
      { id: "standard", label: "일반 패키지지" },
      { id: "premium", label: "고급 패키지지" },
    ],
    quantities: [
      { id: "500", amount: 500, unit: "개" },
      { id: "1000", amount: 1000, unit: "개" },
      { id: "2000", amount: 2000, unit: "개" },
      { id: "3000", amount: 3000, unit: "개" },
    ],
    serviceId: "package-shopping-bag",
    unitPrices: [
      { quantityId: "500", unitPrice: 1240 },
      { quantityId: "1000", unitPrice: 940 },
      { quantityId: "2000", unitPrice: 740 },
      { quantityId: "3000", totalPrice: 1990000, unitPrice: 663 },
    ],
    designPrintService: {
      badge: "기본 포함",
      description: "패키지 지기구조 디자인 및 인쇄",
      fee: 160000,
      note: "형태·후가공에 따라 상이",
      priceLabel: "160,000원 ~",
      title: "디자인 + 제작",
    },
  }),
} as const satisfies Record<string, OrderProductRegistration>;

export const orderOptionCatalog = {
  "brochure-catalog": createOrderOptionConfig(
    orderProductRegistrations["brochure-catalog"],
  ),
  "leaflet-pamphlet": createOrderOptionConfig(
    orderProductRegistrations["leaflet-pamphlet"],
  ),
  "poster-flyer": createOrderOptionConfig(
    orderProductRegistrations["poster-flyer"],
  ),
  "banner-display": createOrderOptionConfig(
    orderProductRegistrations["banner-display"],
  ),
  "business-card-envelope": createOrderOptionConfig(
    orderProductRegistrations["business-card-envelope"],
  ),
  logo: createOrderOptionConfig(orderProductRegistrations.logo),
  "package-shopping-bag": createOrderOptionConfig(
    orderProductRegistrations["package-shopping-bag"],
  ),
} as const satisfies Record<string, OrderOptionConfig>;

export const getOrderOptionConfig = (serviceId: string): OrderOptionConfig =>
  orderOptionCatalog[serviceId as keyof typeof orderOptionCatalog] ??
  orderOptionCatalog["brochure-catalog"];
