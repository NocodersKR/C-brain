"use client";

import { Button } from "@repo/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "../page.module.css";
import { createGradientBorderButtonStyle } from "./buttonStyles";

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

const priceButtonStyle = createGradientBorderButtonStyle({ width: 148 });

const kakaoButtonStyle = createGradientBorderButtonStyle({
  tone: "kakao",
  width: 148,
});

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
        <svg
          aria-hidden="true"
          className={styles.mobileMenuIcon}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M13.5 18H4M20 12H4M20 6H4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>
      </button>
    </header>
  );
}
