"use client";

import { Button } from "@repo/ui/button";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import styles from "../page.module.css";

const navItems = [
  { label: "회사소개", href: "#about" },
  { label: "포트폴리오", href: "#portfolio" },
  { label: "고객 후기", href: "#reviews" },
  { label: "주문 · 결제", href: "#services" },
  { label: "FAQ & 가이드", href: "#faq" },
  { label: "블로그", href: "#blog" },
  { label: "불편 접수", href: "#contact" },
  { label: "공지사항", href: "#notice" },
];

const headerButtonBorderStart =
  "linear-gradient(to bottom right, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.08) 30%, rgba(255, 255, 255, 0.08) 100%)";
const headerButtonBorderEnd =
  "linear-gradient(to bottom right, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.08) 70%, rgba(255, 255, 255, 0.8) 100%)";

const createHeaderButtonStyle = (
  fillGradient: string,
  color: string,
): CSSProperties => ({
  height: 52,
  width: 148,
  borderRadius: 32,
  border: "1px solid transparent",
  backgroundClip: "padding-box, border-box, border-box",
  backgroundColor: "transparent",
  backgroundImage: `${fillGradient}, ${headerButtonBorderEnd}, ${headerButtonBorderStart}`,
  backgroundOrigin: "padding-box, border-box, border-box",
  color,
  padding: "8px 24px",
});

const priceButtonStyle = createHeaderButtonStyle(
  "linear-gradient(90deg, #30bac3 0%, #269aa3 100%)",
  "#fefefe",
);

const kakaoButtonStyle = createHeaderButtonStyle(
  "linear-gradient(103.542563deg, #fae100 0%, #fae100 49.519%, #fac800 100%)",
  "#3b1d1d",
);

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeaderBackground = () => {
      setIsScrolled(window.scrollY > 0);
    };

    updateHeaderBackground();
    window.addEventListener("scroll", updateHeaderBackground, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateHeaderBackground);
    };
  }, []);

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}
    >
      <div className={styles.headerPrimary}>
        <a aria-label="씨브레인 홈" className={styles.logoLink} href="#">
          <span className={styles.logoMark}>
            <Image
              alt=""
              className={styles.logoMain}
              height={21}
              src="/figma-assets/cbrain-logo-main.svg"
              width={77}
            />
            <Image
              alt=""
              className={styles.logoTagline}
              height={4}
              src="/figma-assets/cbrain-logo-tagline.svg"
              width={76}
            />
          </span>
        </a>

        <nav aria-label="주요 메뉴" className={styles.desktopNav}>
          {navItems.map((item) => (
            <a className={styles.navLink} href={item.href} key={item.label}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className={styles.headerActions}>
        <Button style={priceButtonStyle}>정찰제 가격 보기</Button>
        <Button style={kakaoButtonStyle}>실시간 카톡상담</Button>
      </div>

      <button
        aria-label="메뉴 열기"
        className={styles.mobileMenuButton}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}
