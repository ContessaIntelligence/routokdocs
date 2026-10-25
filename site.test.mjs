import { afterAll, expect, test } from 'bun:test'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'
import { documentation } from './scripts/content.mjs'

const root = fileURLToPath(new URL('./', import.meta.url))
const manifest = JSON.parse(await fs.readFile(path.join(root, 'generated-files.json'), 'utf8'))
const pages = new Map()
for (const file of manifest.filter(name => name.endsWith('.html'))) {
  pages.set(file, new JSDOM(await fs.readFile(path.join(root, file), 'utf8')).window.document)
}

test('all generated pages work as static files, with valid links, anchors and images', async () => {
  expect(pages.size).toBe(33)
  for (const [name, document] of pages) {
    expect(document.querySelector('html').lang).toBe('zh-CN')
    expect(document.querySelector('title').textContent).toContain('RouTok')
    const ids = [...document.querySelectorAll('[id]')].map(node => node.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const node of document.querySelectorAll('a[href], link[href], script[src], img[src]')) {
      const href = node.getAttribute('href') || node.getAttribute('src')
      const url = new URL(href, `https://docs.routok.com/${name}`)
      if (url.origin !== 'https://docs.routok.com') continue
      const target = decodeURIComponent(url.pathname.slice(1))
      expect(await fs.exists(path.join(root, target))).toBe(true)
      if (url.hash) {
        expect(pages.get(target)?.getElementById(decodeURIComponent(url.hash.slice(1)))).toBeTruthy()
      }
      if (node.tagName === 'IMG') expect(node.getAttribute('alt').length).toBeGreaterThan(0)
    }
    expect(document.querySelector('footer').textContent).toContain('New API · QuantumNous')
  }
})

test('article rendering preserves all 52 code examples and sends platform links to the main site', () => {
  let count = 0
  for (const article of documentation.articles) {
    const document = pages.get(`docs/${article.slug}/index.html`)
    const examples = article.blocks.flatMap(block => block.type === 'code' ? [block.code] : block.type === 'code-group' ? block.codes.map(code => code.code) : [])
    expect([...document.querySelectorAll('article .code code')].map(node => node.textContent)).toEqual(examples)
    count += examples.length
    expect(document.querySelector('[aria-current="page"]').textContent).toBe(article.title)
  }
  expect(count).toBe(52)
  const overview = pages.get('docs/overview/index.html')
  expect(overview.querySelector('a[href="https://routok.com/dashboard"]')).toBeTruthy()
  expect(overview.querySelector('a[href="https://routok.com/keys"]')).toBeTruthy()
  expect(overview.querySelector('a[href="/docs/account/index.html"]')).toBeTruthy()
})

const globals = ['document', 'navigator', 'location', 'fetch'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)])
afterAll(() => {
  for (const [key, descriptor] of globals) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor)
    else delete globalThis[key]
  }
})

test('browser search loads lazily, handles failures and stale requests, and copies exact code', async () => {
  const dom = new JSDOM(await fs.readFile(path.join(root, 'docs/quickstart/index.html'), 'utf8'), { url: 'https://docs.routok.com/docs/quickstart/index.html' })
  const document = dom.window.document
  let copied = ''
  let requests = 0
  let rejectSearch
  let resolveSearch
  for (const [key, value] of Object.entries({ document, location: dom.window.location, navigator: { clipboard: { writeText: async value => { copied = value } } }, fetch: () => {
    requests++
    return new Promise((resolve, reject) => { resolveSearch = resolve; rejectSearch = reject })
  } })) Object.defineProperty(globalThis, key, { configurable: true, value })
  await import('./assets/site.mjs')
  expect(requests).toBe(0)
  const input = document.querySelector('#search')
  const status = document.querySelector('#search-status')
  function changed(node) {
    return new Promise(resolve => {
      const observer = new dom.window.MutationObserver(() => { observer.disconnect(); resolve() })
      observer.observe(node, { childList: true, subtree: true, characterData: true })
    })
  }
  input.value = '新建 API Key'
  input.dispatchEvent(new dom.window.Event('input'))
  let update = changed(status)
  rejectSearch(new Error('offline'))
  await update
  expect(status.textContent).toContain('搜索暂时不可用')
  input.dispatchEvent(new dom.window.Event('input'))
  const searchData = JSON.parse(await fs.readFile(path.join(root, 'assets/search-data.json'), 'utf8'))
  update = changed(status)
  resolveSearch({ ok: true, json: async () => searchData })
  await update
  expect([...document.querySelectorAll('#results a')].map(node => node.getAttribute('href'))).toContain('/docs/keys/index.html')
  expect(requests).toBe(2)
  input.value = '余额不足'
  input.dispatchEvent(new dom.window.Event('input'))
  input.value = ''
  input.dispatchEvent(new dom.window.Event('input'))
  await Promise.resolve()
  expect(document.querySelector('#results').hidden).toBe(true)
  expect(status.textContent).toBe('')
  const button = document.querySelector('[data-copy]')
  update = changed(button)
  button.click()
  await update
  expect(copied).toBe(button.closest('.code').querySelector('code').textContent)
  expect(button.textContent).toBe('已复制')
})
