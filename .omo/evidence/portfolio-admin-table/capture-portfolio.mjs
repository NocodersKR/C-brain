import { createRequire } from 'node:module'
import fs from 'node:fs/promises'
import path from 'node:path'

const require = createRequire(import.meta.url)
const { chromium } = require(
  '/Users/sangkun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright',
)

const repoRoot = '/Users/sangkun/nocoders/c-brain'
const evidenceDir = path.join(repoRoot, '.omo/evidence/portfolio-admin-table')
const baseUrl = 'http://127.0.0.1:5174'
const expectedHeaders = ['상태', '유형', '포트폴리오 제목', '고객사', '랜딩', '조회수', '등록일자', '상세']

await fs.mkdir(evidenceDir, { recursive: true })

const browser = await chromium.launch({ headless: true })

const page = await browser.newPage({ viewport: { width: 1440, height: 760 }, deviceScaleFactor: 1 })
const consoleErrors = []

page.on('console', (message) => {
  if (message.type() === 'error') {
    consoleErrors.push(message.text())
  }
})

await page.goto(`${baseUrl}/portfolio`, { waitUntil: 'networkidle' })
await page.screenshot({ path: path.join(evidenceDir, 'portfolio-1440.png'), fullPage: true })
await page.locator('.admin-data-table-section').screenshot({
  path: path.join(evidenceDir, 'portfolio-table-1440.png'),
})

const desktop = await page.evaluate(() => {
  const title = document.querySelector('.admin-data-table-section__title')
  const header = document.querySelector('.admin-data-table__header')
  const section = document.querySelector('.admin-data-table-section')
  const frame = document.querySelector('.admin-data-table-frame')
  const active = document.querySelector('.admin-header__menu-link--active')
  const table = document.querySelector('[role="table"]')
  const headers = Array.from(document.querySelectorAll('[role="columnheader"]')).map(
    (node) => node.textContent?.trim() ?? '',
  )
  const headerRect = header?.getBoundingClientRect()
  const sectionRect = section?.getBoundingClientRect()
  const frameRect = frame?.getBoundingClientRect()
  const text = document.body.innerText

  return {
    activeMenu: active?.textContent?.trim() ?? null,
    bodyHasCta: text.includes('신규 포폴 등록'),
    bodyHasTitle: text.includes('포트폴리오 등록 현황'),
    frameWidth: frameRect?.width ?? null,
    headerHeight: headerRect?.height ?? null,
    headers,
    sectionHeight: sectionRect?.height ?? null,
    sectionTitle: title?.textContent?.trim() ?? null,
    sectionWidth: sectionRect?.width ?? null,
    tableRoleExists: Boolean(table),
  }
})

await page.setViewportSize({ width: 1024, height: 760 })
await page.goto(`${baseUrl}/portfolio`, { waitUntil: 'networkidle' })
await page.screenshot({ path: path.join(evidenceDir, 'portfolio-1024.png'), fullPage: true })

const shrink = await page.evaluate(() => {
  const section = document.querySelector('.admin-data-table-section')
  const frame = document.querySelector('.admin-data-table-frame')
  const header = document.querySelector('.admin-data-table__header')
  const sectionRect = section?.getBoundingClientRect()
  const frameRect = frame?.getBoundingClientRect()
  const headerRect = header?.getBoundingClientRect()

  return {
    frameWidth: frameRect?.width ?? null,
    headerHeight: headerRect?.height ?? null,
    sectionWidth: sectionRect?.width ?? null,
    transform: section ? getComputedStyle(section).transform : '',
  }
})

await page.setViewportSize({ width: 1080, height: 760 })
await page.goto(`${baseUrl}/portfolio`, { waitUntil: 'networkidle' })
await page.screenshot({ path: path.join(evidenceDir, 'portfolio-1080.png'), fullPage: true })

const laptop = await page.evaluate(() => {
  const header = document.querySelector('.admin-header')
  const section = document.querySelector('.admin-data-table-section')
  const frame = document.querySelector('.admin-data-table-frame')
  const tableHeader = document.querySelector('.admin-data-table__header')
  const headerRect = header?.getBoundingClientRect()
  const sectionRect = section?.getBoundingClientRect()
  const frameRect = frame?.getBoundingClientRect()
  const tableHeaderRect = tableHeader?.getBoundingClientRect()

  return {
    frameWidth: frameRect?.width ?? null,
    headerBottom: headerRect?.bottom ?? null,
    headerHeight: headerRect?.height ?? null,
    headerRight: headerRect?.right ?? null,
    sectionTop: sectionRect?.top ?? null,
    sectionWidth: sectionRect?.width ?? null,
    tableHeaderHeight: tableHeaderRect?.height ?? null,
    transform: section ? getComputedStyle(section).transform : '',
    viewportWidth: window.innerWidth,
  }
})

const productsPage = await browser.newPage({ viewport: { width: 1440, height: 760 }, deviceScaleFactor: 1 })
await productsPage.goto(`${baseUrl}/products`, { waitUntil: 'networkidle' })
const productsRoute = await productsPage.evaluate(() => ({
  activeMenu: document.querySelector('.admin-header__menu-link--active')?.textContent?.trim() ?? null,
  title: document.querySelector('#page-title')?.textContent?.trim() ?? null,
}))
await productsPage.close()

await browser.close()

const qa = {
  consoleErrors,
  desktop,
  expectedHeadersPresent: expectedHeaders.every((header) => desktop.headers.includes(header)),
  productsRoute,
  screenshots: {
    laptopPage: path.join(evidenceDir, 'portfolio-1080.png'),
    desktopPage: path.join(evidenceDir, 'portfolio-1440.png'),
    desktopTable: path.join(evidenceDir, 'portfolio-table-1440.png'),
    shrinkPage: path.join(evidenceDir, 'portfolio-1024.png'),
  },
  laptop,
  shrink,
}

await fs.writeFile(path.join(evidenceDir, 'browser-qa.json'), JSON.stringify(qa, null, 2))
console.log(JSON.stringify(qa, null, 2))
