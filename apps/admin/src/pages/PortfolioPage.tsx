import { AdminDataTableSection } from '../components/admin-table/AdminDataTableSection'
import type {
  AdminTableColumn,
  AdminTableFilter,
} from '../components/admin-table/AdminDataTableSection'
import './PortfolioPage.css'

const portfolioStatusContent = {
  draft: {
    className: 'admin-data-table__status admin-data-table__status--draft',
    label: '임시저장',
  },
  published: {
    className: 'admin-data-table__status',
    label: '게시됨',
  },
} as const

type PortfolioStatus = keyof typeof portfolioStatusContent
type PortfolioLandingStatus = 'none' | 'published'

type PortfolioRow = {
  readonly client: string
  readonly createdAt: string
  readonly detailHref: string
  readonly id: string
  readonly landingStatus: PortfolioLandingStatus
  readonly status: PortfolioStatus
  readonly title: string
  readonly type: string
  readonly views: string
}

const portfolioFilters = [
  { id: 'type', label: '유형 필터', value: '전체' },
  { id: 'status', label: '상태 필터', value: '전체' },
] satisfies readonly AdminTableFilter[]

const portfolioRows = [
  {
    client: '대전화병원',
    createdAt: '26. 03. 16',
    detailHref: '/portfolio/draft-catalog',
    id: 'draft-catalog',
    landingStatus: 'published',
    status: 'draft',
    title: '제품 카탈로그 A4 16P',
    type: '브로슈어 · 카탈로그',
    views: '24',
  },
  {
    client: '대전화병원',
    createdAt: '26. 03. 16',
    detailHref: '/portfolio/leaflet-124',
    id: 'leaflet-124',
    landingStatus: 'none',
    status: 'published',
    title: '제품 카탈로그 A4 16P',
    type: '리플렛 · 팜플렛',
    views: '124',
  },
  {
    client: '대전화병원',
    createdAt: '26. 03. 16',
    detailHref: '/portfolio/catalog-34',
    id: 'catalog-34',
    landingStatus: 'published',
    status: 'published',
    title: '제품 카탈로그 A4 16P',
    type: '브로슈어 · 카탈로그',
    views: '34',
  },
  {
    client: '대전화병원',
    createdAt: '26. 03. 16',
    detailHref: '/portfolio/leaflet-65',
    id: 'leaflet-65',
    landingStatus: 'published',
    status: 'published',
    title: '제품 카탈로그 A4 16P',
    type: '리플렛 · 팜플렛',
    views: '65',
  },
  {
    client: '대전화병원',
    createdAt: '26. 03. 16',
    detailHref: '/portfolio/leaflet-256',
    id: 'leaflet-256',
    landingStatus: 'none',
    status: 'published',
    title: '제품 카탈로그 A4 16P',
    type: '리플렛 · 팜플렛',
    views: '256',
  },
  {
    client: '대전화병원',
    createdAt: '26. 03. 16',
    detailHref: '/portfolio/business-card-2',
    id: 'business-card-2',
    landingStatus: 'none',
    status: 'published',
    title: '제품 카탈로그 A4 16P',
    type: '명함 · 봉투',
    views: '2',
  },
  {
    client: '대전화병원',
    createdAt: '26. 03. 16',
    detailHref: '/portfolio/banner-0',
    id: 'banner-0',
    landingStatus: 'none',
    status: 'published',
    title: '제품 카탈로그 A4 16P',
    type: '배너 · 족자 · 현수막',
    views: '0',
  },
  {
    client: '대전화병원',
    createdAt: '26. 03. 16',
    detailHref: '/portfolio/photo-556',
    id: 'photo-556',
    landingStatus: 'published',
    status: 'published',
    title: '제품 카탈로그 A4 16P',
    type: '촬영',
    views: '556',
  },
] satisfies readonly PortfolioRow[]

function renderStatus(row: PortfolioRow) {
  const status = portfolioStatusContent[row.status]

  return (
    <span className={status.className}>
      <span className="admin-data-table__status-dot" />
      <span>{status.label}</span>
    </span>
  )
}

function renderLanding(row: PortfolioRow) {
  if (row.landingStatus === 'published') {
    return <span className="admin-data-table__brand-text">게시됨</span>
  }

  return <span>-</span>
}

const portfolioColumns = [
  {
    header: '상태',
    id: 'status',
    renderCell: renderStatus,
    track: '120fr',
  },
  {
    header: '유형',
    id: 'type',
    renderCell: (row) => row.type,
    track: '160fr',
  },
  {
    header: '포트폴리오 제목',
    id: 'title',
    renderCell: (row) => <span className="admin-data-table__title-cell">{row.title}</span>,
    track: '456fr',
  },
  {
    header: '고객사',
    id: 'client',
    renderCell: (row) => row.client,
    track: '160fr',
  },
  {
    header: '랜딩',
    id: 'landing',
    renderCell: renderLanding,
    track: '120fr',
  },
  {
    header: '조회수',
    id: 'views',
    renderCell: (row) => row.views,
    track: '120fr',
  },
  {
    header: '등록일자',
    id: 'createdAt',
    renderCell: (row) => row.createdAt,
    track: '120fr',
  },
  {
    header: '상세',
    id: 'detail',
    renderCell: (row) => (
      <a className="admin-data-table__link" href={row.detailHref}>
        상세
      </a>
    ),
    track: '120fr',
  },
] satisfies readonly AdminTableColumn<PortfolioRow>[]

function getPortfolioRowVariant(row: PortfolioRow) {
  if (row.status === 'draft') {
    return 'filled'
  }

  return 'default'
}

export function PortfolioPage() {
  return (
    <main className="portfolio-page" aria-label="포트폴리오 관리">
      <AdminDataTableSection
        bottomAction={{ href: '/portfolio/new', label: '신규 포폴 등록' }}
        columns={portfolioColumns}
        filters={portfolioFilters}
        getRowKey={(row) => row.id}
        getRowVariant={getPortfolioRowVariant}
        rows={portfolioRows}
        search={{ label: '검색', placeholder: '포트폴리오 제목으로 검색해주세요.' }}
        title="포트폴리오 등록 현황"
      />
    </main>
  )
}
