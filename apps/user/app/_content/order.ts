import type { IconName } from "../../components/Icon";

type OrderStepState = "active" | "inactive";
type OrderProductActionTone = "brand" | "quote";

export type OrderMethod = {
  description: string;
  label: string;
  state: OrderStepState;
  title: string;
};

export type OrderProduct = {
  actionLabel: string;
  actionTone: OrderProductActionTone;
  description: string;
  icon: IconName;
  price?: string;
  title: string;
};

export const orderSteps = [
  { label: "Ⅰ. 카테고리 선택", state: "active" },
  { label: "Ⅱ. 옵션 선택", state: "inactive" },
  { label: "Ⅲ. 정보 선택", state: "inactive" },
  { label: "Ⅳ. 결제 완료", state: "inactive" },
] as const satisfies ReadonlyArray<{
  label: string;
  state: OrderStepState;
}>;

export const orderMethods = [
  {
    description:
      "구조·레이아웃에 맞춰 바로 제작\n사양 선택 + 가격 확인 + 카드 즉시결제",
    label: "바로 주문",
    state: "active",
    title: "정찰제 즉시결제",
  },
  {
    description:
      "규격 범위 외 맞춤이나 대량 주문\n카카오톡 1:1 상담으로 빠른 견적",
    label: "견적 후 주문",
    state: "inactive",
    title: "맞춤·대량·촬영",
  },
] as const satisfies ReadonlyArray<OrderMethod>;

export const orderProducts = [
  {
    actionLabel: "정찰제 즉시결제",
    actionTone: "brand",
    description:
      "기업소개, 제품 카탈로그 등 핵심 홍보물.\n기획부터 인쇄까지 원스톱",
    icon: "book-open",
    price: "160,000원 ~",
    title: "브로슈어 · 카탈로그",
  },
  {
    actionLabel: "정찰제 즉시결제",
    actionTone: "brand",
    description: "단면, 양면, 접지 등\n다양한 형태의 소책자 및 안내물 제작",
    icon: "file-text",
    price: "160,000원 ~",
    title: "리플렛 · 팜플렛",
  },
  {
    actionLabel: "정찰제 즉시결제",
    actionTone: "brand",
    description: "행사·이벤트·홍보용 포스터와 전단지.\n빠른 납기 대응 가능.",
    icon: "megaphone",
    price: "160,000원 ~",
    title: "포스터 · 전단지",
  },
  {
    actionLabel: "정찰제 즉시결제",
    actionTone: "brand",
    description: "박람회, 매장, 행사장용 대형 출력물.\n설치·운송 상담 가능.",
    icon: "flag",
    price: "160,000원 ~",
    title: "배너 · 족자 · 현수막",
  },
  {
    actionLabel: "정찰제 즉시결제",
    actionTone: "brand",
    description: "소량 명함부터 기업용 봉투 · 레터헤드까지\n정찰제 가격 제공.",
    icon: "credit-card",
    price: "160,000원 ~",
    title: "명함 · 봉투",
  },
  {
    actionLabel: "정찰제 즉시결제",
    actionTone: "brand",
    description:
      "브랜드의 첫인상을 결정하는 로고.\n전략적 기획 + 감각적 디자인.",
    icon: "pen-tool",
    price: "160,000원 ~",
    title: "로고",
  },
  {
    actionLabel: "정찰제 즉시결제",
    actionTone: "brand",
    description: "브랜드 아이덴티티를 담은\n패키지 디자인 및 쇼핑백 제작.",
    icon: "package",
    price: "160,000원 ~",
    title: "패키지 · 쇼핑백",
  },
  {
    actionLabel: "견적 후 주문(카카오톡)",
    actionTone: "quote",
    description: "제품·공간·인물 등 홍보물에 필요한 사진 촬영.\n견적 후 진행.",
    icon: "camera",
    price: undefined,
    title: "촬영",
  },
  {
    actionLabel: "견적 후 주문(카카오톡)",
    actionTone: "quote",
    description:
      "다이어리·캘린더, 스티커, 초청장 등 기타 맞춤 홍보물 제작.\n외 품목은 카카오톡 1:1 문의.",
    icon: "dots-horizontal",
    price: undefined,
    title: "기타",
  },
] as const satisfies ReadonlyArray<OrderProduct>;
