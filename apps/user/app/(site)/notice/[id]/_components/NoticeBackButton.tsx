"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import {
  activateNoticeListHistory,
  clearActiveNoticeListHistory,
  rememberNoticeListScrollRestore,
} from "../../_utils/noticeListHistory";

type NoticeBackButtonProps = {
  className?: string;
  fallbackHref: string;
  restoreListHistory: boolean;
};

export function NoticeBackButton({
  className,
  fallbackHref,
  restoreListHistory,
}: NoticeBackButtonProps) {
  const router = useRouter();
  const listScrollYRef = useRef<number | null>(null);
  const hasConsumedListHistoryRef = useRef(false);

  useEffect(() => {
    if (hasConsumedListHistoryRef.current) return;

    hasConsumedListHistoryRef.current = true;
    if (!restoreListHistory) return;

    const detailHref = `${window.location.pathname}${window.location.search}`;
    listScrollYRef.current = activateNoticeListHistory(
      fallbackHref,
      detailHref,
    );
  }, [fallbackHref, restoreListHistory]);

  const handleClick = () => {
    const listScrollY = listScrollYRef.current;
    listScrollYRef.current = null;

    if (listScrollY !== null) {
      rememberNoticeListScrollRestore(fallbackHref, listScrollY);
      clearActiveNoticeListHistory();
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <button className={className} onClick={handleClick} type="button">
      목록으로
    </button>
  );
}
