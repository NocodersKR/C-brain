const NOTICE_LIST_HISTORY_KEY = "cbrain:notice-list-history";
const NOTICE_LIST_ACTIVE_HISTORY_KEY = "cbrain:notice-list-active-history";
const NOTICE_LIST_SCROLL_RESTORE_KEY = "cbrain:notice-list-scroll-restore";
const NOTICE_DETAIL_HISTORY_TOKEN_KEY = "cbrainNoticeHistoryToken";

type NoticeListHistoryEntry = {
  detailHref: string;
  listHref: string;
  scrollY: number;
};

type NoticeListScrollRestoreEntry = {
  listHref: string;
  scrollY: number;
};

type ActiveNoticeListHistoryEntry = NoticeListHistoryEntry & {
  token: string;
};

export function rememberNoticeListHistory(
  listHref: string,
  detailHref: string,
  scrollY: number,
) {
  try {
    const entry: NoticeListHistoryEntry = {
      detailHref,
      listHref,
      scrollY,
    };
    window.sessionStorage.setItem(
      NOTICE_LIST_HISTORY_KEY,
      JSON.stringify(entry),
    );
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
}

export function consumeNoticeListHistory(listHref: string, detailHref: string) {
  try {
    const storedEntry = window.sessionStorage.getItem(NOTICE_LIST_HISTORY_KEY);
    window.sessionStorage.removeItem(NOTICE_LIST_HISTORY_KEY);

    if (!storedEntry) return null;

    const entry = JSON.parse(storedEntry) as Partial<NoticeListHistoryEntry>;
    if (
      entry.listHref === listHref &&
      entry.detailHref === detailHref &&
      typeof entry.scrollY === "number" &&
      Number.isFinite(entry.scrollY)
    ) {
      return entry.scrollY;
    }

    return null;
  } catch {
    return null;
  }
}

export function activateNoticeListHistory(
  listHref: string,
  detailHref: string,
) {
  try {
    const historyState = window.history.state as Record<string, unknown> | null;
    const historyToken = historyState?.[NOTICE_DETAIL_HISTORY_TOKEN_KEY];

    if (typeof historyToken === "string") {
      const storedEntry = window.sessionStorage.getItem(
        NOTICE_LIST_ACTIVE_HISTORY_KEY,
      );
      if (!storedEntry) return null;

      const entry = JSON.parse(
        storedEntry,
      ) as Partial<ActiveNoticeListHistoryEntry>;
      return entry.token === historyToken &&
        entry.listHref === listHref &&
        entry.detailHref === detailHref &&
        typeof entry.scrollY === "number" &&
        Number.isFinite(entry.scrollY)
        ? entry.scrollY
        : null;
    }

    const scrollY = consumeNoticeListHistory(listHref, detailHref);
    if (scrollY === null) return null;

    const token = window.crypto.randomUUID();
    const activeEntry: ActiveNoticeListHistoryEntry = {
      detailHref,
      listHref,
      scrollY,
      token,
    };
    window.sessionStorage.setItem(
      NOTICE_LIST_ACTIVE_HISTORY_KEY,
      JSON.stringify(activeEntry),
    );
    window.history.replaceState(
      {
        ...historyState,
        [NOTICE_DETAIL_HISTORY_TOKEN_KEY]: token,
      },
      "",
    );

    return scrollY;
  } catch {
    return null;
  }
}

export function clearActiveNoticeListHistory() {
  try {
    window.sessionStorage.removeItem(NOTICE_LIST_ACTIVE_HISTORY_KEY);
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
}

export function rememberNoticeListScrollRestore(
  listHref: string,
  scrollY: number,
) {
  try {
    const entry: NoticeListScrollRestoreEntry = { listHref, scrollY };
    window.sessionStorage.setItem(
      NOTICE_LIST_SCROLL_RESTORE_KEY,
      JSON.stringify(entry),
    );
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
}

export function consumeNoticeListScrollRestore(listHref: string) {
  try {
    const storedEntry = window.sessionStorage.getItem(
      NOTICE_LIST_SCROLL_RESTORE_KEY,
    );
    window.sessionStorage.removeItem(NOTICE_LIST_SCROLL_RESTORE_KEY);

    if (!storedEntry) return null;

    const entry = JSON.parse(
      storedEntry,
    ) as Partial<NoticeListScrollRestoreEntry>;
    return entry.listHref === listHref &&
      typeof entry.scrollY === "number" &&
      Number.isFinite(entry.scrollY)
      ? entry.scrollY
      : null;
  } catch {
    return null;
  }
}
