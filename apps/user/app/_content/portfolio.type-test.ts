import {
  PORTFOLIO_SCROLL_RESTORE_KEY,
  getPortfolioDetailSeo,
  getPortfolioCategoryIdFromValue,
  getPortfolioDetailBySlug,
  getPortfolioDetailHref,
  getPortfolioItemBySlug,
  getPortfolioListHref,
  getRelatedPortfolioItems,
  portfolioCategories,
  portfolioItems,
  portfolioPageSeo,
  type PortfolioDetailHref,
  type PortfolioListHref,
} from "./portfolio";

type Equal<Actual, Expected> = (<Value>() => Value extends Actual
  ? 1
  : 2) extends <Value>() => Value extends Expected ? 1 : 2
  ? true
  : false;

type Expect<Condition extends true> = Condition;

type PortfolioCategoryIds = (typeof portfolioCategories)[number]["id"];
type ExpectedPortfolioCategoryIds =
  | "brochure-catalog"
  | "leaflet-pamphlet"
  | "poster-flyer"
  | "banner-book"
  | "business-card-envelope"
  | "logo"
  | "package-shopping-bag"
  | "photo"
  | "etc";

type PortfolioCategoryIdContract = Expect<
  Equal<PortfolioCategoryIds, ExpectedPortfolioCategoryIds>
>;

type PortfolioCategoryLabels = (typeof portfolioCategories)[number]["label"];
type ExpectedPortfolioCategoryLabels =
  | "브로슈어 · 카탈로그"
  | "리플렛 · 팜플렛"
  | "포스터 · 전단지"
  | "배너 · 족자 · 현수막"
  | "명함 · 봉투"
  | "로고"
  | "패키지 · 쇼핑백"
  | "촬영"
  | "기타";

type PortfolioCategoryLabelContract = Expect<
  Equal<PortfolioCategoryLabels, ExpectedPortfolioCategoryLabels>
>;

type PortfolioItem = (typeof portfolioItems)[number];
type PortfolioItemContract = Expect<
  PortfolioItem extends {
    author: string;
    categoryId: PortfolioCategoryIds;
    client: string;
    description: string;
    detailImages: readonly {
      alt: string;
      src: string;
    }[];
    image: string;
    slug: string;
    summary: string;
    title: string;
  }
    ? true
    : false
>;

type PortfolioItemBySlugContract = Expect<
  Equal<ReturnType<typeof getPortfolioItemBySlug>, PortfolioItem | undefined>
>;

type RelatedPortfolioItemsContract = Expect<
  Equal<ReturnType<typeof getRelatedPortfolioItems>, PortfolioItem[]>
>;

type PortfolioDetailContract = Expect<
  Equal<
    ReturnType<typeof getPortfolioDetailBySlug>,
    | {
        categoryLabel: string;
        item: PortfolioItem;
        relatedItems: PortfolioItem[];
      }
    | undefined
  >
>;

type PortfolioCategoryIdFromValueContract = Expect<
  Equal<
    ReturnType<typeof getPortfolioCategoryIdFromValue>,
    PortfolioCategoryIds | undefined
  >
>;

type PortfolioListHrefContract = Expect<
  Equal<ReturnType<typeof getPortfolioListHref>, PortfolioListHref>
>;

type PortfolioDetailHrefContract = Expect<
  Equal<ReturnType<typeof getPortfolioDetailHref>, PortfolioDetailHref>
>;

type PortfolioPageSeoContract = Expect<
  Equal<
    typeof portfolioPageSeo,
    {
      description: string;
      keywords: string[];
      title: string;
    }
  >
>;

type PortfolioDetailSeoContract = Expect<
  Equal<
    ReturnType<typeof getPortfolioDetailSeo>,
    {
      description: string;
      keywords: string[];
      title: string;
    }
  >
>;

type PortfolioScrollRestoreKeyContract = Expect<
  Equal<typeof PORTFOLIO_SCROLL_RESTORE_KEY, "portfolio-scroll-restore">
>;

export type PortfolioContentContract = [
  PortfolioCategoryIdContract,
  PortfolioCategoryLabelContract,
  PortfolioItemContract,
  PortfolioItemBySlugContract,
  RelatedPortfolioItemsContract,
  PortfolioDetailContract,
  PortfolioCategoryIdFromValueContract,
  PortfolioListHrefContract,
  PortfolioDetailHrefContract,
  PortfolioPageSeoContract,
  PortfolioDetailSeoContract,
  PortfolioScrollRestoreKeyContract,
];
