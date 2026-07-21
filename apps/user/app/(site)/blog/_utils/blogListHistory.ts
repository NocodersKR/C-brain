const BLOG_LIST_HISTORY_KEY = "cbrain:blog-list-history";
const BLOG_LIST_ACTIVE_HISTORY_KEY = "cbrain:blog-list-active-history";
const BLOG_LIST_SCROLL_RESTORE_KEY = "cbrain:blog-list-scroll-restore";
const BLOG_DETAIL_HISTORY_TOKEN_KEY = "cbrainBlogHistoryToken";

type BlogListHistoryEntry = {
  detailHref: string;
  listHref: string;
  scrollY: number;
};

type BlogListScrollRestoreEntry = {
  listHref: string;
  scrollY: number;
};

type ActiveBlogListHistoryEntry = BlogListHistoryEntry & {
  token: string;
};

export function rememberBlogListHistory(
  listHref: string,
  detailHref: string,
  scrollY: number,
) {
  try {
    const entry: BlogListHistoryEntry = {
      detailHref,
      listHref,
      scrollY,
    };

    window.sessionStorage.setItem(BLOG_LIST_HISTORY_KEY, JSON.stringify(entry));
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
}

export function consumeBlogListHistory(listHref: string, detailHref: string) {
  try {
    const storedEntry = window.sessionStorage.getItem(BLOG_LIST_HISTORY_KEY);
    window.sessionStorage.removeItem(BLOG_LIST_HISTORY_KEY);

    if (!storedEntry) return null;

    const entry = JSON.parse(storedEntry) as Partial<BlogListHistoryEntry>;
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

export function activateBlogListHistory(listHref: string, detailHref: string) {
  try {
    const historyState = window.history.state as Record<string, unknown> | null;
    const historyToken = historyState?.[BLOG_DETAIL_HISTORY_TOKEN_KEY];

    if (typeof historyToken === "string") {
      const storedEntry = window.sessionStorage.getItem(
        BLOG_LIST_ACTIVE_HISTORY_KEY,
      );
      if (!storedEntry) return null;

      const entry = JSON.parse(
        storedEntry,
      ) as Partial<ActiveBlogListHistoryEntry>;
      return entry.token === historyToken &&
        entry.listHref === listHref &&
        entry.detailHref === detailHref &&
        typeof entry.scrollY === "number" &&
        Number.isFinite(entry.scrollY)
        ? entry.scrollY
        : null;
    }

    const scrollY = consumeBlogListHistory(listHref, detailHref);
    if (scrollY === null) return null;

    const token = window.crypto.randomUUID();
    const activeEntry: ActiveBlogListHistoryEntry = {
      detailHref,
      listHref,
      scrollY,
      token,
    };

    window.sessionStorage.setItem(
      BLOG_LIST_ACTIVE_HISTORY_KEY,
      JSON.stringify(activeEntry),
    );
    window.history.replaceState(
      {
        ...historyState,
        [BLOG_DETAIL_HISTORY_TOKEN_KEY]: token,
      },
      "",
    );

    return scrollY;
  } catch {
    return null;
  }
}

export function clearActiveBlogListHistory() {
  try {
    window.sessionStorage.removeItem(BLOG_LIST_ACTIVE_HISTORY_KEY);
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
}

export function rememberBlogListScrollRestore(
  listHref: string,
  scrollY: number,
) {
  try {
    const entry: BlogListScrollRestoreEntry = { listHref, scrollY };

    window.sessionStorage.setItem(
      BLOG_LIST_SCROLL_RESTORE_KEY,
      JSON.stringify(entry),
    );
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
}

export function consumeBlogListScrollRestore(listHref: string) {
  try {
    const storedEntry = window.sessionStorage.getItem(
      BLOG_LIST_SCROLL_RESTORE_KEY,
    );
    window.sessionStorage.removeItem(BLOG_LIST_SCROLL_RESTORE_KEY);

    if (!storedEntry) return null;

    const entry = JSON.parse(
      storedEntry,
    ) as Partial<BlogListScrollRestoreEntry>;
    return entry.listHref === listHref &&
      typeof entry.scrollY === "number" &&
      Number.isFinite(entry.scrollY)
      ? entry.scrollY
      : null;
  } catch {
    return null;
  }
}
