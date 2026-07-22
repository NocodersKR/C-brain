"use client";

import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useRef, useState } from "react";

import type { LinkPayPayment } from "../../../_content/linkPay";
import { formatOrderCurrency } from "../../../_content/order";
import { Icon } from "../../../../components/Icon";
import {
  type LinkPayAgreementId,
  type LinkPayPaymentSubmitPayload,
  submitLinkPayPayment,
} from "./payment";
import styles from "./page.module.css";

type AgreementId = LinkPayAgreementId;
type CustomerFieldId =
  | "customerName"
  | "customerCompany"
  | "customerPhone"
  | "customerEmail";
type RequiredCustomerFieldId = Exclude<CustomerFieldId, "customerCompany">;
type LinkPayValidationTarget = CustomerFieldId | AgreementId;

type LinkPayPaymentFormProps = {
  payment: LinkPayPayment;
};

const agreementItems = [
  {
    id: "privacyCollection",
    label: "개인정보 수집 및 이용에 동의합니다.",
  },
  {
    id: "privacyPolicy",
    label: "개인정보 처리방침에 동의합니다.",
  },
] as const satisfies ReadonlyArray<{
  id: AgreementId;
  label: string;
}>;

const requiredCustomerFieldIds = [
  "customerName",
  "customerPhone",
  "customerEmail",
] as const satisfies ReadonlyArray<RequiredCustomerFieldId>;

const validationTargetsInOrder = [
  "customerName",
  "customerPhone",
  "customerEmail",
  "privacyCollection",
  "privacyPolicy",
] as const satisfies ReadonlyArray<LinkPayValidationTarget>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const koreanMobilePhonePattern = /^01[016789]\d{7,8}$/;

const customerFields = [
  {
    autoComplete: "name",
    id: "linkpay-customer-name",
    label: "이름(담당자명)*",
    name: "customerName",
    placeholder: "이름을 입력해주세요.",
    required: true,
    type: "text",
  },
  {
    autoComplete: "organization",
    id: "linkpay-customer-company",
    label: "회사명",
    name: "customerCompany",
    placeholder: "회사명을 입력해주세요.",
    type: "text",
  },
  {
    autoComplete: "tel",
    helper: "카카오톡 상담 연락처",
    id: "linkpay-customer-phone",
    label: "연락처*",
    name: "customerPhone",
    placeholder: "연락처를 입력해주세요.",
    required: true,
    type: "tel",
  },
  {
    autoComplete: "email",
    helper: "영수증·파일 전달",
    id: "linkpay-customer-email",
    label: "이메일*",
    name: "customerEmail",
    placeholder: "이메일을 입력해주세요.",
    required: true,
    type: "email",
  },
] as const;

const customerFieldDefaultValues = {
  customerCompany: "",
  customerEmail: "",
  customerName: "",
  customerPhone: "",
} satisfies Record<CustomerFieldId, string>;

function normalizeCustomerPhoneNumber(value: string) {
  return value.replace(/\D/g, "");
}

function isRequiredCustomerFieldId(
  fieldName: CustomerFieldId,
): fieldName is RequiredCustomerFieldId {
  return requiredCustomerFieldIds.some(
    (requiredFieldName) => requiredFieldName === fieldName,
  );
}

function isCustomerFieldValid(fieldName: RequiredCustomerFieldId, value: string) {
  if (fieldName === "customerEmail") {
    return emailPattern.test(value.trim());
  }

  if (fieldName === "customerPhone") {
    return koreanMobilePhonePattern.test(normalizeCustomerPhoneNumber(value));
  }

  return value.trim().length > 0;
}

function AgreementCheckIcon() {
  return (
    <svg
      className={styles.agreementCheckboxIcon}
      fill="none"
      height="10"
      viewBox="0 0 12 10"
      width="12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.6 1L3.44048 8.2L1 5.74572"
        stroke="#F8FAFC"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function LinkPayPaymentForm({
  payment,
}: LinkPayPaymentFormProps) {
  const router = useRouter();
  const validationTargetRefs = useRef<
    Partial<Record<LinkPayValidationTarget, HTMLElement>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldValues, setFieldValues] = useState(customerFieldDefaultValues);
  const [invalidTargets, setInvalidTargets] = useState<
    Partial<Record<LinkPayValidationTarget, boolean>>
  >({});
  const [agreements, setAgreements] = useState<Record<AgreementId, boolean>>({
    privacyCollection: true,
    privacyPolicy: true,
  });
  const isAllAgreed = agreementItems.every((item) => agreements[item.id]);
  const isTargetInvalid = (target: LinkPayValidationTarget) =>
    Boolean(invalidTargets[target]);

  const setValidationTargetRef =
    (target: LinkPayValidationTarget) => (node: HTMLElement | null) => {
      if (node) {
        validationTargetRefs.current[target] = node;
        return;
      }

      delete validationTargetRefs.current[target];
    };

  const clearInvalidTarget = (target: LinkPayValidationTarget) => {
    setInvalidTargets((current) => {
      if (!current[target]) return current;

      const nextTargets = { ...current };
      delete nextTargets[target];

      return nextTargets;
    });
  };

  const scrollToValidationTarget = (target: LinkPayValidationTarget) => {
    window.requestAnimationFrame(() => {
      const field = validationTargetRefs.current[target];
      const control = field?.querySelector("input");

      field?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (control instanceof HTMLElement) {
        control.focus({ preventScroll: true });
      }
    });
  };

  const handleCustomerFieldChange =
    (fieldName: CustomerFieldId) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;

      setFieldValues((current) => ({
        ...current,
        [fieldName]: value,
      }));

      if (
        isRequiredCustomerFieldId(fieldName) &&
        isCustomerFieldValid(fieldName, value)
      ) {
        clearInvalidTarget(fieldName);
      }
    };

  const toggleAllAgreements = () => {
    const nextValue = !isAllAgreed;

    setAgreements({
      privacyCollection: nextValue,
      privacyPolicy: nextValue,
    });

    if (nextValue) {
      clearInvalidTarget("privacyCollection");
      clearInvalidTarget("privacyPolicy");
    }
  };

  const toggleAgreement = (id: AgreementId) => {
    if (!agreements[id]) {
      clearInvalidTarget(id);
    }

    setAgreements((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const handlePaymentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextInvalidTargets: Partial<
      Record<LinkPayValidationTarget, boolean>
    > = {};

    for (const fieldName of requiredCustomerFieldIds) {
      if (!isCustomerFieldValid(fieldName, fieldValues[fieldName])) {
        nextInvalidTargets[fieldName] = true;
      }
    }

    for (const item of agreementItems) {
      if (!agreements[item.id]) {
        nextInvalidTargets[item.id] = true;
      }
    }

    setInvalidTargets(nextInvalidTargets);

    const firstInvalidTarget = validationTargetsInOrder.find(
      (target) => nextInvalidTargets[target],
    );

    if (firstInvalidTarget) {
      scrollToValidationTarget(firstInvalidTarget);
      return;
    }

    const payload: LinkPayPaymentSubmitPayload = {
      agreements,
      customer: fieldValues,
      linkPayId: payment.id,
    };

    setIsSubmitting(true);

    try {
      const result = await submitLinkPayPayment(payload);
      const fallbackHref =
        result.status === "success"
          ? `/linkpay/${payment.id}/success`
          : `/linkpay/${payment.id}/fail`;

      router.push(result.redirectHref ?? fallbackHref);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.linkPaySection} aria-labelledby="linkpay-title">
      <div className={styles.linkPayInner}>
        <div className={styles.linkPayHeader}>
          <h1 id="linkpay-title">
            {payment.clientName}의 {payment.paymentName} 카드 결제
          </h1>
          <p>
            결제 완료 후 영업일 기준 1일 이내 배정 담당자가 카카오톡으로 집중
            상담 및 제작 일정을 안내드립니다.
          </p>
        </div>

        <section
          className={styles.paymentCard}
          aria-labelledby="linkpay-payment-title"
        >
          <h2 id="linkpay-payment-title">결제 내역</h2>
          <dl className={styles.paymentDetailList}>
            {payment.detailRows.map((row) => (
              <div key={`${row.label}-${row.value}`}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.paymentDivider} />
          <div className={styles.paymentTotal}>
            <span>합계</span>
            <strong>{formatOrderCurrency(payment.amount)}</strong>
          </div>
        </section>

        <form
          className={styles.customerForm}
          noValidate
          onSubmit={handlePaymentSubmit}
        >
          {customerFields.map((field) => (
            <div
              className={styles.customerField}
              data-invalid={isTargetInvalid(field.name)}
              key={field.id}
              ref={setValidationTargetRef(field.name)}
            >
              <div className={styles.customerLabelRow}>
                <label htmlFor={field.id}>{field.label}</label>
                {"helper" in field ? <span>{field.helper}</span> : null}
              </div>
              <input
                aria-invalid={isTargetInvalid(field.name)}
                autoComplete={field.autoComplete}
                className={styles.customerInput}
                id={field.id}
                name={field.name}
                onChange={handleCustomerFieldChange(field.name)}
                placeholder={field.placeholder}
                required={"required" in field ? field.required : undefined}
                type={field.type}
                value={fieldValues[field.name]}
              />
            </div>
          ))}

          <section className={styles.agreementList} aria-label="약관 동의">
            <label className={styles.agreementRow}>
              <input
                checked={isAllAgreed}
                className={styles.agreementCheckboxInput}
                onChange={toggleAllAgreements}
                type="checkbox"
              />
              <span className={styles.agreementCheckboxMark} aria-hidden="true">
                <AgreementCheckIcon />
              </span>
              <strong>전체 동의</strong>
            </label>

            <div className={styles.agreementDivider} />

            {agreementItems.map((item) => (
              <div className={styles.agreementDetailRow} key={item.id}>
                <label
                  className={styles.agreementRow}
                  data-invalid={isTargetInvalid(item.id)}
                  ref={setValidationTargetRef(item.id)}
                >
                  <input
                    aria-invalid={isTargetInvalid(item.id)}
                    checked={agreements[item.id]}
                    className={styles.agreementCheckboxInput}
                    onChange={() => toggleAgreement(item.id)}
                    required
                    type="checkbox"
                  />
                  <span
                    className={styles.agreementCheckboxMark}
                    aria-hidden="true"
                  >
                    <AgreementCheckIcon />
                  </span>
                  <span>{item.label}</span>
                </label>
                <a
                  className={styles.agreementViewButton}
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                >
                  보기
                </a>
              </div>
            ))}
          </section>

          <button
            aria-busy={isSubmitting}
            className={styles.paymentButton}
            disabled={isSubmitting}
            type="submit"
          >
            <span>결제하기</span>
            <Icon name="arrow-right" size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
