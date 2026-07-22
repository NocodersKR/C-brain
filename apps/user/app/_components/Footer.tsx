import Image from "next/image";

import styles from "../page.module.css";

const socials = [
  {
    href: "#",
    icon: "/figma-assets/footer-instagram.png",
    imageClassName: styles.socialIconImageInstagram,
    imageHeight: 20,
    imageWidth: 20,
    label: "인스타그램",
  },
  {
    href: "#",
    icon: "/figma-assets/footer-naver-blog.png",
    imageClassName: styles.socialIconImageBlog,
    imageHeight: 29,
    imageWidth: 38,
    label: "네이버 블로그",
  },
  {
    href: "#",
    icon: "/figma-assets/footer-youtube.png",
    imageClassName: styles.socialIconImageYoutube,
    imageHeight: 14,
    imageWidth: 20,
    label: "유튜브",
  },
];

const policies = [
  { href: "#", label: "이용약관" },
  { href: "#", isStrong: true, label: "개인정보처리방침" },
  { href: "#", label: "취소 및 환불 규정" },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <a aria-label="씨브레인 홈" className={styles.footerLogo} href="#">
          <Image
            alt=""
            height={21}
            src="/figma-assets/cbrain-logo-main.svg"
            width={77}
          />
          <Image
            alt=""
            height={4}
            src="/figma-assets/cbrain-logo-tagline.svg"
            width={76}
          />
        </a>
        <div className={styles.socialLinks}>
          {socials.map((social) => (
            <a href={social.href} key={social.label}>
              <span aria-hidden="true" className={styles.socialIcon}>
                <Image
                  alt=""
                  className={`${styles.socialIconImage} ${social.imageClassName}`}
                  height={social.imageHeight}
                  src={social.icon}
                  width={social.imageWidth}
                />
              </span>
              {social.label}
            </a>
          ))}
        </div>
      </div>

      <div className={styles.footerDivider} />

      <div className={styles.footerInfo}>
        <div className={styles.policyLinks}>
          {policies.map((policy) => (
            <a
              className={policy.isStrong ? styles.policyStrong : undefined}
              href={policy.href}
              key={policy.label}
            >
              {policy.label}
            </a>
          ))}
        </div>
        <div className={styles.customerCenter}>
          <p className={styles.customerCenterLabel}>고객센터</p>
          <p>전화번호 : 070-8830-2219</p>
          <p>월~목 : 8:00 - 17:00 / 금 : 8:00 - 16:00</p>
          <p>점심시간 : 11:00 - 12:30</p>
        </div>
      </div>

      <div className={styles.footerDivider} />

      <div className={styles.companyInfo}>
        <p>
          씨브레인 | 대표자명 : 정혜영 | 사업자 등록번호 : 120-07-84415
        </p>
        <p>통신판매 신고번호 : 2022-성남중원-0006</p>
        <p>
          본사 : 경기도 성남시 중원구 사기막골로 99 센트럴비즈타워2차 B타워
          218호
        </p>
        <p>일산지사 : 경기도 고양시 일산동구 장발산로 15 드림월드빌딩 415호</p>
        <p>성수동 출고실(인쇄물) : 서울특별시 성동구 성수일로80</p>
        <p>파주 출고실(인쇄물) : 경기도 파주시 산업단지길 179</p>
        <p>오산 출고실(실사) : 경기도 오산시 독산성로 232번길 14-24</p>
        <p>개인정보관리책임자 : 김훈(jhy@cbrain.kr)</p>
        <p className={styles.copyrightText}>
          Copyright ⓒ 2026 C-Brain. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
