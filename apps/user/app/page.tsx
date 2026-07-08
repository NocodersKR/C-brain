import { Accordion } from "@repo/ui/accordion";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Category } from "@repo/ui/category";
import { Checkbox } from "@repo/ui/checkbox";
import { Code } from "@repo/ui/code";
import { Dialog } from "@repo/ui/dialog";
import { Input } from "@repo/ui/input";
import { Radio } from "@repo/ui/radio";
import { SearchInput } from "@repo/ui/search-input";
import { Select } from "@repo/ui/select";
import { Tabs } from "@repo/ui/tabs";
import { TextButton } from "@repo/ui/text-button";
import { Toggle } from "@repo/ui/toggle";

import styles from "./page.module.css";

const typographySamples = [
  { className: styles.typeMedium12, text: "Pretendard medium 12" },
  { className: styles.typeBold12, text: "Pretendard bold 12" },
  { className: styles.typeMedium14, text: "Pretendard medium 14" },
  { className: styles.typeBold14, text: "Pretendard bold 14" },
  { className: styles.typeMedium16, text: "Pretendard medium 16" },
  { className: styles.typeBold16, text: "Pretendard bold 16" },
  { className: styles.typeMedium18, text: "Pretendard medium 18" },
  { className: styles.typeBold18, text: "Pretendard bold 18" },
  { className: styles.typeMedium20, text: "Pretendard medium 20" },
  { className: styles.typeBold20, text: "Pretendard bold 20" },
  { className: styles.typeMedium22, text: "Pretendard medium 22" },
  { className: styles.typeBold22, text: "Pretendard bold 22" },
  { className: styles.typeMedium24, text: "Pretendard medium 24" },
  { className: styles.typeBold24, text: "Pretendard bold 24" },
  { className: styles.typeMedium28, text: "Pretendard medium 28" },
  { className: styles.typeBold28, text: "Pretendard bold 28" },
  { className: styles.typeMedium32, text: "Pretendard medium 32" },
  { className: styles.typeBold32, text: "Pretendard bold 32" },
];

const colorSamples = [
  { name: "Brand", token: "--color-brand-500" },
  { name: "Gray", token: "--color-gray-500" },
  { name: "Error", token: "--color-error-500" },
  { name: "Warning", token: "--color-warning-500" },
  { name: "Success", token: "--color-success-500" },
  { name: "Info", token: "--color-info-500" },
];

const selectOptions = [
  { label: "브랜드 사이트", value: "brand-site" },
  { label: "운영 도구", value: "ops-tool" },
  { disabled: true, label: "준비 중", value: "disabled" },
];

const categoryItems = [
  { label: "All", value: "all" },
  { label: "Design", value: "design" },
  { label: "Build", value: "build" },
];

const tabItems = [
  { label: "Overview", value: "overview" },
  { label: "Components", value: "components" },
  { disabled: true, label: "Archive", value: "archive" },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>Typography</p>
            <h1 className={styles.title}>Pretendard type scale</h1>
          </div>
          <div className={styles.typographyGrid}>
            {typographySamples.map((sample) => (
              <p
                className={`${styles.typeSample} ${sample.className}`}
                key={sample.text}
              >
                {sample.text}
              </p>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>Color Tokens</p>
            <h2 className={styles.sectionTitle}>Core 500 colors</h2>
          </div>
          <div className={styles.colorGrid}>
            {colorSamples.map((sample) => (
              <div className={styles.colorItem} key={sample.token}>
                <span
                  className={styles.swatch}
                  style={{ backgroundColor: `var(${sample.token})` }}
                />
                <span className={styles.colorName}>{sample.name}</span>
                <Code className={styles.inlineCode}>{sample.token}</Code>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>Components</p>
            <h2 className={styles.sectionTitle}>Shared UI examples</h2>
          </div>
          <div className={styles.componentGrid}>
            <article className={styles.componentPanel}>
              <h3 className={styles.panelTitle}>Button</h3>
              <div className={styles.controlRow}>
                <Button>Solid</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </article>

            <article className={styles.componentPanel}>
              <h3 className={styles.panelTitle}>TextButton</h3>
              <div className={styles.controlRow}>
                <TextButton>자세히 보기</TextButton>
                <TextButton underline>밑줄 버튼</TextButton>
              </div>
            </article>

            <article className={styles.componentPanel}>
              <h3 className={styles.panelTitle}>Input</h3>
              <Input
                helperText="입력 예시입니다."
                label="프로젝트명"
                placeholder="C-Brain"
                style={{ width: "100%" }}
              />
            </article>

            <article className={styles.componentPanel}>
              <h3 className={styles.panelTitle}>SearchInput</h3>
              <SearchInput
                placeholder="컴포넌트 검색"
                style={{ width: "100%" }}
              />
            </article>

            <article className={styles.componentPanel}>
              <h3 className={styles.panelTitle}>Select</h3>
              <Select
                defaultValue="brand-site"
                label="프로젝트 유형"
                options={selectOptions}
                style={{ width: "100%" }}
              />
            </article>

            <article className={styles.componentPanel}>
              <h3 className={styles.panelTitle}>Checkbox</h3>
              <Checkbox
                actionLabel="보기"
                defaultChecked
                label="디자인 시스템 확인"
                style={{ width: "100%" }}
              />
              <Checkbox disabled label="비활성 상태" style={{ width: "100%" }} />
            </article>

            <article className={styles.componentPanel}>
              <h3 className={styles.panelTitle}>Radio</h3>
              <Radio
                defaultChecked
                label="기본 옵션"
                name="catalog-radio"
                style={{ width: "100%" }}
                value="default"
              />
              <Radio
                label="보조 옵션"
                name="catalog-radio"
                style={{ width: "100%" }}
                value="secondary"
              />
            </article>

            <article className={styles.componentPanel}>
              <h3 className={styles.panelTitle}>Toggle</h3>
              <div className={styles.controlRow}>
                <Toggle defaultChecked offLabel="OFF" onLabel="ON" />
                <Toggle disabled offLabel="OFF" onLabel="ON" />
              </div>
            </article>

            <article className={styles.componentPanel}>
              <h3 className={styles.panelTitle}>Category</h3>
              <Category
                defaultValue="design"
                items={categoryItems}
                style={{ flexWrap: "wrap" }}
              />
            </article>

            <article className={styles.componentPanel}>
              <h3 className={styles.panelTitle}>Tabs</h3>
              <Tabs
                defaultValue="components"
                items={tabItems}
                style={{ width: "100%" }}
              />
            </article>

            <article className={styles.componentPanel}>
              <h3 className={styles.panelTitle}>Accordion</h3>
              <Accordion
                answer="공용 UI 컴포넌트는 packages/ui/src에서 관리합니다."
                defaultOpen
                question="컴포넌트 위치"
                style={{ width: "100%" }}
              />
            </article>

            <article className={styles.componentPanel}>
              <h3 className={styles.panelTitle}>Dialog</h3>
              <Dialog
                actions={[
                  { label: "취소", variant: "outline" },
                  { label: "확인" },
                ]}
                description="작은 확인 모달 예시입니다."
                title="Dialog title"
                style={{ width: "100%" }}
              />
            </article>

            <article className={styles.componentPanel}>
              <h3 className={styles.panelTitle}>Card</h3>
              <Card
                className={styles.cardPreview}
                href="https://github.com/NocodersKR/C-brain"
                title="Card"
              >
                링크형 카드 컴포넌트입니다.
              </Card>
            </article>

            <article className={styles.componentPanel}>
              <h3 className={styles.panelTitle}>Code</h3>
              <Code className={styles.codeBlock}>pnpm dev --filter=user</Code>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
