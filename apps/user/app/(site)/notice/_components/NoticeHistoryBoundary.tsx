"use client";

import type { MouseEvent, ReactNode } from "react";
import { useEffect } from "react";

import {
  consumeNoticeListScrollRestore,
  rememberNoticeListHistory,
} from "../_utils/noticeListHistory";

type NoticeHistoryBoundaryProps = {
  children: ReactNode;
  className?: string;
  listHref: string;
};

export function NoticeHistoryBoundary({
  children,
  className,
  listHref,
}: NoticeHistoryBoundaryProps) {
  useEffect(() => {
    const scrollY = consumeNoticeListScrollRestore(listHref);

    if (scrollY !== null) {
      window.scrollTo(0, scrollY);
    }
  }, [listHref]);

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !(event.target instanceof Element)
    ) {
      return;
    }

    const noticeLink = event.target.closest<HTMLAnchorElement>(
      "[data-notice-detail-href]",
    );
    const detailHref = noticeLink?.dataset.noticeDetailHref;

    if (
      !noticeLink ||
      !detailHref ||
      !event.currentTarget.contains(noticeLink)
    ) {
      return;
    }

    rememberNoticeListHistory(listHref, detailHref, window.scrollY);
  };

  return (
    <div className={className} onClickCapture={handleClickCapture}>
      {children}
    </div>
  );
}
