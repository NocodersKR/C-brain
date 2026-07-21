"use client";

import { useState } from "react";

import { ServiceCards } from "../../_components/ServiceCards";
import { orderSteps } from "../../_content/order";
import { OrderConsultDialog } from "./OrderConsultDialog";
import { OrderMethodSelector } from "./OrderMethodSelector";
import styles from "./page.module.css";

export function OrderFlowSection() {
  const [isConsultDialogOpen, setIsConsultDialogOpen] = useState(false);
  const openConsultDialog = () => setIsConsultDialogOpen(true);

  return (
    <section className={styles.orderFlow} aria-labelledby="order-flow-title">
      <div className={styles.orderInner}>
        <h2 className={styles.visuallyHidden} id="order-flow-title">
          상품유형 주문 단계
        </h2>

        <ol className={styles.stepList} aria-label="주문 진행 단계">
          {orderSteps.map((step) => (
            <li
              className={`${styles.stepItem} ${
                step.state === "active" ? styles.stepItemActive : ""
              }`}
              key={step.label}
            >
              {step.label}
            </li>
          ))}
        </ol>

        <OrderMethodSelector onQuoteSelect={openConsultDialog} />

        <div className={styles.productSectionHeader}>
          <p>Ⅰ. 카테고리 선택</p>
        </div>

        <ServiceCards onQuoteServiceSelect={openConsultDialog} />
      </div>

      <OrderConsultDialog
        isOpen={isConsultDialogOpen}
        onClose={() => setIsConsultDialogOpen(false)}
      />
    </section>
  );
}
