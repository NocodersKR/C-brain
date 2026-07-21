type OrderStepState = "active" | "inactive";
type OrderMethodTone = "brand" | "quote";

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
  { label: "Ⅲ. 정보 선택", state: "inactive" },
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
    description: "규격 협의 필요하거나 대량 주문\n카카오톡 1:1 상담으로 빠른 견적",
    id: "quote",
    label: "견적 후 주문",
    state: "inactive",
    title: "맞춤·대량·촬영",
    tone: "quote",
  },
] as const satisfies ReadonlyArray<OrderMethod>;
