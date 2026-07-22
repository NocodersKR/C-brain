export type LinkPayDetailRow = {
  label: string;
  value: string;
};

export type LinkPayPaymentStatus = "pending" | "paid";

export type LinkPayPayment = {
  amount: number;
  clientName: string;
  detailRows: ReadonlyArray<LinkPayDetailRow>;
  id: string;
  paymentName: string;
  status: LinkPayPaymentStatus;
};

export const linkPayPayments: ReadonlyArray<LinkPayPayment> = [
  {
    amount: 520000,
    clientName: "CJ제일제당",
    detailRows: [
      { label: "서비스", value: "디자인 + 인쇄" },
      { label: "용지", value: "일반지 (스노우지 유광)" },
      { label: "페이지 수 / 수량", value: "12p / 500부" },
    ],
    id: "cj-draft-payment",
    paymentName: "민잇 플러스 개발 용역 위탁 결제",
    status: "pending",
  },
];

export function getLinkPayPayment(id: string) {
  return linkPayPayments.find((payment) => payment.id === id);
}
