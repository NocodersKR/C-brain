import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const appPath = new URL('../src/App.tsx', import.meta.url)
const formPath = new URL('../src/pages/LinkPayFormPage.tsx', import.meta.url)

test('LinkPay creation route exposes the Figma fields and numeric amount input', async () => {
  const [appSource, formSource] = await Promise.all([
    readFile(appPath, 'utf8'),
    readFile(formPath, 'utf8'),
  ])

  assert.match(appSource, /<Route element=\{<LinkPayFormPage \/>\} path="\/linkpay\/new" \/>/)
  assert.match(formSource, /신규 링크페이 등록/)
  assert.match(formSource, /고객사명/)
  assert.match(formSource, /결제명/)
  assert.match(formSource, /결제 금액/)
  assert.match(formSource, /inputMode="numeric"/)
  assert.match(formSource, /replace\(\/\\D\/g, ''\)/)
  assert.match(formSource, /pattern="\[0-9,\]\+"/)
  assert.match(formSource, /to="\/linkpay"/)
})
