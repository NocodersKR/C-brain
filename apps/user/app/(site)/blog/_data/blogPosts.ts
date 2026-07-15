import type { BlogPost } from "../_types/blog";

export const blogPosts = [
  {
    id: "brochure-production-checklist",
    category: "브로슈어·카탈로그",
    title: "브로슈어 제작 전 반드시 확인해야 할 5가지 체크리스트",
    summary:
      "박람회와 전시회에 참가하기 전, 브로슈어 제작에서 실패하지 않으려면 이것만은 꼭 확인하세요.",
    publishedAt: "2026. 11. 02",
    author: "씨브레인",
    image: "/figma-assets/blog-featured.png",
    featured: true,
    popularRank: 1,
  },
  {
    id: "catalog-coating-guide",
    category: "인쇄 실무팁",
    title: "카탈로그 인쇄, 코팅 종류별 차이점과 선택 기준",
    summary:
      "유광, 무광, 소프트 터치 코팅. 인쇄물의 완성도를 결정짓는 코팅 선택 가이드입니다.",
    publishedAt: "2026. 10. 28",
    author: "씨브레인",
    image: "/figma-assets/blog-brochure.png",
    featured: false,
    popularRank: 2,
  },
  {
    id: "leaflet-message-order",
    category: "리플렛·팜플렛",
    title: "한 장의 리플렛에 꼭 담아야 할 핵심 메시지 구성법",
    summary:
      "짧은 시간 안에 읽히는 리플렛은 정보의 우선순위부터 다릅니다. 메시지 구조를 정리해 보세요.",
    publishedAt: "2026. 10. 21",
    author: "씨브레인",
    image: "/figma-assets/blog-print-guide.png",
    featured: false,
    popularRank: 3,
  },
  {
    id: "design-request-mistakes",
    category: "디자인 실무팁",
    title: "홍보물 디자인 발주 시 자주 하는 실수 TOP 5",
    summary:
      "디자인 발주 경험이 없는 담당자를 위해 씨브레인이 정리한 실수 방지 가이드입니다.",
    publishedAt: "2026. 10. 15",
    author: "씨브레인",
    image: "/figma-assets/blog-brochure.png",
    featured: false,
    popularRank: 4,
  },
  {
    id: "print-paper-selection",
    category: "인쇄 실무팁",
    title: "홍보물 인쇄용지, 목적에 맞게 고르는 방법",
    summary:
      "종이의 두께와 질감, 색상은 인쇄물의 첫인상을 바꿉니다. 용도별 선택 기준을 알려드립니다.",
    publishedAt: "2026. 10. 08",
    author: "씨브레인",
    image: "/figma-assets/blog-print-guide.png",
    featured: false,
    popularRank: 5,
  },
  {
    id: "catalog-page-flow",
    category: "브로슈어·카탈로그",
    title: "카탈로그 페이지 구성, 처음부터 끝까지 읽히게 만드는 순서",
    summary:
      "기업과 제품의 강점을 자연스럽게 전달하는 카탈로그 페이지 흐름을 실제 제작 기준으로 살펴봅니다.",
    publishedAt: "2026. 09. 30",
    author: "씨브레인",
    image: "/figma-assets/blog-brochure.png",
    featured: false,
  },
  {
    id: "pamphlet-size-guide",
    category: "리플렛·팜플렛",
    title: "팜플렛 규격 선택 전 알아두면 좋은 접지 방식",
    summary:
      "2단, 3단, 대문 접지까지. 전달할 정보량과 배포 환경에 맞는 접지 방식을 비교해 보세요.",
    publishedAt: "2026. 09. 23",
    author: "씨브레인",
    image: "/figma-assets/blog-print-guide.png",
    featured: false,
  },
  {
    id: "brand-color-printing",
    category: "디자인 실무팁",
    title: "브랜드 컬러가 인쇄물에서 다르게 보이는 이유",
    summary:
      "화면의 RGB와 인쇄의 CMYK 차이를 이해하면 브랜드 컬러의 오차를 줄일 수 있습니다.",
    publishedAt: "2026. 09. 16",
    author: "씨브레인",
    image: "/figma-assets/blog-brochure.png",
    featured: false,
  },
] satisfies readonly BlogPost[];
