import type { NoticeCategory, NoticeCategoryValue } from "../_types/notice";

type PublishedNoticeCategory = Exclude<NoticeCategoryValue, "all">;

const noticeCategoryLabels = {
  event: "이벤트",
  holiday: "휴무 안내",
  news: "수상 · 소식",
  notice: "공지",
  service: "서비스 변경",
} satisfies Record<PublishedNoticeCategory, string>;

export const noticeCategories = [
  { label: "전체", value: "all" },
  { label: noticeCategoryLabels.notice, value: "notice" },
  { label: noticeCategoryLabels.event, value: "event" },
  { label: noticeCategoryLabels.holiday, value: "holiday" },
  { label: noticeCategoryLabels.service, value: "service" },
  { label: noticeCategoryLabels.news, value: "news" },
] as const satisfies readonly NoticeCategory[];

export function getNoticeCategoryLabel(category: PublishedNoticeCategory) {
  return noticeCategoryLabels[category];
}
