import Image from "next/image";

import styles from "../page.module.css";

const reviews = [
  {
    body: "씨브레인에 카탈로그 제작할 때 당사의 브로슈어 니즈를 정확하게 파악해서 만족스러운 결과물이 나왔습니다. 9월 전시회를 앞두고 시간이 많지 않은 상황에서 빠른 인쇄를 해주셔서 감사했습니다.",
    name: "최수* 책임님",
    company: "서진인스텍 · 제조업 · 경기도 성남",
  },
  {
    body: "씨브레인의 가장 큰 장점은 가독성 있는 브로슈어 디자인입니다. 빠른 피드백과 원하는 방향을 신속하게 파악하여 효율적인 커뮤니케이션과 고품질 브로셔 디자인으로 만족스러운 결과물을 얻을 수 있었습니다.",
    name: "김윤* 팀장님",
    company: "나인벨 헬스케어 · 헬스케어/제조업 · 경기도 성남",
  },
  {
    body: "씨브레인에 학생들의 졸업 작품 완료 보고서 인쇄 제작을 의뢰했습니다. 표지와 내지의 퀄리티가 정말 좋았고, 인쇄는 3일 만에 완성되었습니다. 시간적으로나 퀄리티 측면에서 지난해보다 매우 만족스럽게 진행되었습니다.",
    name: "김현* 교수님",
    company: "청강문화산업대학교 · 교육기관 · 경기도 이천",
  },
] as const;

const featuredClients = [
  {
    src: "/images/partners/hyundai-rotem-partner-logo.png",
    alt: "현대로템 씨브레인 고객사",
    width: 121,
    height: 41,
  },
  {
    src: "/images/partners/lotte-global-logistics-partner-logo.png",
    alt: "롯데글로벌로지스 씨브레인 고객사",
    width: 129,
    height: 41,
  },
  {
    src: "/images/partners/hanwha-life-financial-service-partner-logo.png",
    alt: "한화생명금융서비스 씨브레인 고객사",
    width: 156,
    height: 30,
  },
] as const;

const clientRows = [
  [
    {
      src: "/images/partners/gyeonggi-office-of-education-partner-logo.png",
      alt: "경기도교육청 씨브레인 고객사",
      width: 140,
      height: 36,
    },
    {
      src: "/images/partners/sogang-university-partner-logo.png",
      alt: "서강대학교 씨브레인 고객사",
      width: 144,
      height: 44,
    },
    {
      src: "/images/partners/ppta-partner-logo.png",
      alt: "정부조달기술진흥협회 PPTA 씨브레인 고객사",
      width: 170,
      height: 25,
    },
    {
      src: "/images/partners/seongnam-city-hall-partner-logo.png",
      alt: "성남시청 씨브레인 고객사",
      width: 106,
      height: 36,
    },
    {
      src: "/images/partners/seven-eleven-partner-logo.png",
      alt: "세븐일레븐 씨브레인 고객사",
      width: 153,
      height: 22,
    },
  ],
  [
    {
      src: "/images/partners/ajou-university-hospital-partner-logo.png",
      alt: "아주대학교병원 씨브레인 고객사",
      width: 118,
      height: 42,
    },
    {
      src: "/images/partners/hwahospital-partner-logo.png",
      alt: "대전한방병원 씨브레인 고객사",
      width: 118,
      height: 32,
    },
    {
      src: "/images/partners/ninebell-partner-logo.png",
      alt: "나인벨 씨브레인 고객사",
      width: 125,
      height: 18,
    },
    {
      src: "/images/partners/gafi-partner-logo.png",
      alt: "경기도수산진흥원 GAFI 씨브레인 고객사",
      width: 92,
      height: 48,
    },
    {
      src: "/images/partners/chungkang-college-partner-logo.png",
      alt: "청강문화산업대학교 씨브레인 고객사",
      width: 165,
      height: 24,
    },
    {
      src: "/images/partners/seongnam-senior-innovation-center-partner-logo.png",
      alt: "성남시니어산업혁신센터 씨브레인 고객사",
      width: 157,
      height: 31,
    },
  ],
  [
    {
      src: "/images/partners/laminar-partner-logo.png",
      alt: "라미나 씨브레인 고객사",
      width: 122,
      height: 25,
    },
    {
      src: "/images/partners/hangyeol-it-partner-logo.png",
      alt: "한결정보기술 씨브레인 고객사",
      width: 140,
      height: 27,
    },
    {
      src: "/images/partners/flow-tax-accounting-partner-logo.png",
      alt: "플로우세무회계 씨브레인 고객사",
      width: 152,
      height: 22,
    },
    {
      src: "/images/partners/purom-partner-logo.png",
      alt: "퓨롬 씨브레인 고객사",
      width: 124,
      height: 30,
    },
    {
      src: "/images/partners/seojin-instech-partner-logo.png",
      alt: "서진인스텍 씨브레인 고객사",
      width: 138,
      height: 27,
    },
  ],
] as const;

export function CustomerReviewSection() {
  return (
    <section
      className={`${styles.section} ${styles.reviewSection}`}
      id="reviews"
    >
      <div className={`${styles.sectionInner} ${styles.reviewInner}`}>
        <div className={`${styles.sectionHeader} ${styles.reviewHeader}`}>
          <p className={`${styles.sectionKicker} ${styles.reviewKicker}`}>
            고객 후기
          </p>
          <h2 className={`${styles.sectionTitle} ${styles.reviewTitle}`}>
            <span>왜 다양한 산업군의 기업들이</span>
            <span>씨브레인을 다시 찾을까요?</span>
          </h2>
        </div>

        <div className={styles.reviewGrid}>
          {reviews.map((review) => (
            <article className={styles.reviewCard} key={review.name}>
              <div className={styles.reviewContent}>
                <p className={styles.reviewStars} aria-label="별점 5점">
                  ★★★★★
                </p>
                <p className={styles.reviewBody}>{review.body}</p>
              </div>
              <span className={styles.reviewDivider} aria-hidden="true" />
              <div className={styles.reviewMeta}>
                <p>{review.name}</p>
                <span>{review.company}</span>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.reviewLogoCloud} aria-label="고객사 로고">
          <div className={styles.featuredClientLogos}>
            {featuredClients.map((client) => (
              <span className={styles.featuredClientLogo} key={client.src}>
                <Image
                  alt={client.alt}
                  className={styles.partnerLogoImage}
                  height={client.height}
                  loading="eager"
                  src={client.src}
                  unoptimized
                  width={client.width}
                />
              </span>
            ))}
          </div>
          <div className={styles.reviewClientLogoRows}>
            {clientRows.map((row) => (
              <div className={styles.reviewClientLogoRow} key={row[0].src}>
                {row.map((client) => (
                  <span className={styles.reviewClientLogo} key={client.src}>
                    <Image
                      alt={client.alt}
                      className={styles.partnerLogoImage}
                      height={client.height}
                      loading="eager"
                      src={client.src}
                      unoptimized
                      width={client.width}
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
