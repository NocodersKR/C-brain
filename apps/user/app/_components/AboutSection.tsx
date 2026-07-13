import Image from "next/image";

import styles from "../page.module.css";

const reasons = [
  {
    icon: "/figma-assets/about-calendar.svg",
    title: "26년+ 실전 업력",
    description:
      "2000년부터 홍보물 분야에만 집중. 누적된 노하우가 결과물의 퀄리티를 보장합니다.",
  },
  {
    icon: "/figma-assets/about-user.svg",
    title: "1:1 전담 디자이너 매칭",
    description:
      "담당 디자이너가 처음부터 끝까지 책임 진행. 중간에 담당자가 바뀌지 않습니다.",
  },
  {
    icon: "/figma-assets/about-star.svg",
    title: "기획·디자인·인쇄 원스톱",
    description:
      "기획부터 인쇄·납품까지 한 곳에서 완결. 별도 인쇄소·에이전시가 필요 없습니다.",
  },
  {
    icon: "/figma-assets/about-coin.svg",
    title: "투명한 정찰제 가격",
    description:
      "복잡한 견적 없이 합리적인 정찰제 가격 공개. 불필요한 가격 협상이 없습니다.",
  },
  {
    icon: "/figma-assets/about-bank.svg",
    title: "대형 박람회 15년 협업",
    description:
      "킨텍스 코리아나라장터엑스포 등 대형 박람회와 15년 연속 공식 협력.",
  },
] as const;

export function AboutSection() {
  return (
    <section className={styles.aboutSection} id="about">
      <div className={`${styles.sectionInner} ${styles.aboutInner}`}>
        <div className={styles.aboutHeader}>
          <p className={`${styles.sectionKicker} ${styles.aboutKicker}`}>
            씨브레인(C-Brain) 소개
          </p>
          <div className={styles.aboutHeadingText}>
            <h2 className={styles.aboutTitle}>
              <span>1,200여 기업이</span>
              <span>씨브레인을 선택한 이유</span>
            </h2>
            <p className={styles.aboutDescription}>
              씨브레인은 2000년 설립 이후 26년간 전국 1,200여 곳과의
              파트너십과 4,000건 이상의 제작 실적을 보유한
              <br className={styles.aboutDesktopBreak} /> 브로슈어 · 카탈로그 및
              각종 홍보물 기획 · 디자인 · 인쇄 원스톱 제작 전문 기업입니다.
            </p>
          </div>
        </div>

        <div className={styles.aboutContent}>
          <div className={styles.reasonGrid}>
            {reasons.map((reason) => (
              <article className={styles.reasonItem} key={reason.title}>
                <span className={styles.reasonIcon}>
                  <Image alt="" height={14} src={reason.icon} width={14} />
                </span>
                <div>
                  <h3>{reason.title}</h3>
                  <p>{reason.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.aboutMedia}>
            <Image
              alt="코리아 나라장터 엑스포와 씨브레인의 협업 영상"
              className={styles.aboutImage}
              fill
              sizes="(min-width: 1440px) 680px, calc(100vw - 40px)"
              src="/figma-assets/about-partnership.jpg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
