"use client";

import { Button } from "@repo/ui/button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNavHref, setActiveNavHref] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia("(min-width: 1080px)");
    const closeMenuOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    desktopMediaQuery.addEventListener("change", closeMenuOnDesktop);

    return () => {
      desktopMediaQuery.removeEventListener("change", closeMenuOnDesktop);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const closeMenuWithFocus = () => {
      setIsMenuOpen(false);
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    };
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenuWithFocus();
      }
    };

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    window.addEventListener("keydown", closeMenuOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeMenuOnEscape);
    };
  }, [isMenuOpen]);

  const closeMenuAndRestoreFocus = () => {
    setIsMenuOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

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
        aria-controls="mobile-navigation"
        aria-expanded={isMenuOpen}
        aria-label="메뉴 열기"
        className={styles.mobileMenuButton}
        onClick={() => setIsMenuOpen(true)}
        ref={menuButtonRef}
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

      {isMenuOpen ? (
        <div
          className={styles.mobileNavOverlay}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeMenuAndRestoreFocus();
            }
          }}
        >
          <div
            aria-label="모바일 메뉴"
            aria-modal="true"
            className={styles.mobileNavPanel}
            id="mobile-navigation"
            role="dialog"
          >
            <div className={styles.mobileNavCloseRow}>
              <button
                aria-label="메뉴 닫기"
                className={styles.mobileNavCloseButton}
                onClick={closeMenuAndRestoreFocus}
                ref={closeButtonRef}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className={styles.mobileNavCloseIcon}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M16 8L8 16M16 16L8 8"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>

            <nav aria-label="모바일 주요 메뉴" className={styles.mobileNavLinks}>
              {navItems.map((item) => (
                <a
                  aria-current={activeNavHref === item.href ? "location" : undefined}
                  className={`${styles.mobileNavLink} ${
                    activeNavHref === item.href ? styles.mobileNavLinkActive : ""
                  }`}
                  href={item.href}
                  key={item.label}
                  onClick={() => {
                    setActiveNavHref(item.href);
                    setIsMenuOpen(false);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
