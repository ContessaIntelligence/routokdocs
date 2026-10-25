import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'
import { documentation as data } from './content.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const settings = JSON.parse(await fs.readFile(path.join(root, 'content/site.config.json'), 'utf8'))
const check = process.argv.includes('--check')
const generated = new Map()

function escape(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}

function articleUrl(slug) {
  return `/docs/${slug}/index.html`
}

function resolveLink(href) {
  if (href.startsWith('/static/docs/images/')) return href.replace('/static/docs/images/', '/assets/images/')
  if (href.startsWith('/images/')) return href.replace('/images/', '/assets/images/')
  const url = new URL(href, settings.siteUrl)
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error(`Unsupported link: ${href}`)
  if (url.origin !== settings.siteUrl) return href
  if (settings.platformPaths.includes(url.pathname)) return `${settings.platformUrl}${url.pathname}${url.search}${url.hash}`
  const slug = url.pathname.match(/^\/docs\/([^/]+)\/?$/)?.[1]
  if (slug) return `${articleUrl(slug)}${url.search}${url.hash}`
  if (url.pathname === '/docs') return `/index.html${url.hash}`
  return href
}

// Markdown is maintained in Git. Raw HTML is escaped; generated code is escaped too.
marked.use({ renderer: {
  html({ text }) { return escape(text) },
  link({ href, tokens }) {
    return `<a href="${escape(resolveLink(href))}">${this.parser.parseInline(tokens)}</a>`
  },
  image({ href, text }) {
    return `<img src="${escape(resolveLink(href))}" alt="${escape(text)}" loading="lazy">`
  }
}})

function codeBlock(code) {
  return `<div class="code"><div class="code-bar"><span>${escape(code.label)}</span><button type="button" data-copy>复制代码</button></div><pre><code class="language-${escape(code.language)}">${escape(code.code)}</code></pre></div>`
}

function renderArticle(article) {
  return article.blocks.map(block => {
    if (block.type === 'heading') return `<h${block.depth} id="${escape(block.id)}">${marked.parseInline(block.text)}</h${block.depth}>`
    if (block.type === 'code') return codeBlock(block)
    if (block.type === 'code-group') {
      // Native disclosure controls work with keyboard input and without JavaScript.
      return `<div class="code-group">${block.codes.map(code => `<details open><summary>${escape(code.label)}</summary>${codeBlock(code)}</details>`).join('')}</div>`
    }
    return marked.parse(block.markdown)
  }).join('\n')
}

function page({ title, description, body, slug = '', headings = [], canonical = '/index.html' }) {
  const navigation = data.sections.map(section => `<section><h2>${escape(section.title)}</h2>${data.articles.filter(article => article.section === section.id).map(article => `<a href="${articleUrl(article.slug)}"${article.slug === slug ? ' aria-current="page"' : ''}>${escape(article.title)}</a>`).join('')}</section>`).join('')
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)} · RouTok 文档</title><meta name="description" content="${escape(description)}">
<link rel="canonical" href="${escape(settings.siteUrl + canonical)}">
<link rel="stylesheet" href="/assets/site.css"><script type="module" src="/assets/site.mjs"></script>
</head>
<body>
<a class="skip" href="#content">跳到正文</a>
<header><a class="brand" href="/index.html">RouTok <span>文档</span></a><nav aria-label="网站导航"><a href="/docs/quickstart/index.html">首次调用</a><a href="${escape(settings.platformUrl)}">返回平台 ↗</a></nav></header>
<div class="layout"><aside class="sidebar"><nav class="desktop-navigation" aria-label="文档目录">${navigation}</nav><details class="mobile-navigation"><summary>文档目录</summary><nav aria-label="文档目录">${navigation}</nav></details></aside>
<main id="content"><form role="search"><label for="search">搜索文档</label><div class="search-input"><input id="search" name="q" type="search" placeholder="搜索密钥、模型、错误信息…" autocomplete="off"><button type="submit">搜索</button></div><p id="search-status" role="status"></p></form>
<section id="results" aria-label="搜索结果" hidden></section>
<article>${body}</article>
<footer><p>内容核验：${escape(data.reviewedAt)} · 简体中文</p><p><a href="https://github.com/QuantumNous/new-api">New API · QuantumNous</a> · <a href="https://docs.newapi.ai/zh/docs">官方文档</a> · <a href="https://github.com/QuantumNous/new-api/tree/${escape(data.sourceRevision)}">依据源码版本</a> · <a href="https://github.com/ContessaIntelligence/routokdocs">文档源码</a> · <a href="/tools/index.html">工具配置速查</a> · <a href="/LICENSE">AGPL-3.0</a></p></footer></main>
<aside class="toc"><nav aria-label="本页目录"><h2>本页目录</h2>${headings.map(heading => `<a class="depth-${heading.depth}" href="#${escape(heading.id)}">${escape(heading.title)}</a>`).join('')}</nav></aside></div>
</body></html>\n`
}

for (const [index, article] of data.articles.entries()) {
  const previous = data.articles[index - 1]
  const next = data.articles[index + 1]
  const pagination = `<nav class="pagination" aria-label="文章导航">${previous ? `<a href="${articleUrl(previous.slug)}">← 上一篇<br>${escape(previous.title)}</a>` : '<span></span>'}${next ? `<a href="${articleUrl(next.slug)}">下一篇 →<br>${escape(next.title)}</a>` : ''}</nav>`
  generated.set(`docs/${article.slug}/index.html`, page({ ...article, body: renderArticle(article) + pagination, canonical: articleUrl(article.slug) }))
}
const hero = data.home.hero
const home = `<div class="hero"><p class="eyebrow">ROUTOK DOCUMENTATION</p><h1>${escape(hero.name)}<br>${escape(hero.text)}</h1><p>${escape(hero.tagline)}</p><div class="actions">${hero.actions.map(action => `<a class="button" href="${resolveLink(action.link)}">${escape(action.text)} →</a>`).join('')}</div></div><div class="cards">${data.home.features.map(feature => `<section><h2>${escape(feature.title)}</h2><p>${escape(feature.details)}</p><a href="${resolveLink(feature.link)}">${escape(feature.linkText)} →</a></section>`).join('')}</div><h2>完整阅读目录</h2><div class="home-catalog">${data.sections.map(section => `<section><h3>${escape(section.title)}</h3><ul>${data.articles.filter(article => article.section === section.id).map(article => `<li><a href="${articleUrl(article.slug)}">${escape(article.title)}</a></li>`).join('')}</ul></section>`).join('')}</div>`
const homePage = page({ title: '使用指南', description: hero.tagline, body: home })
generated.set('index.html', homePage)
generated.set('docs/index.html', homePage)
generated.set('404.html', page({ title: '页面未找到', description: '返回 RouTok 文档查找指南', body: '<h1>页面未找到</h1><p>请使用搜索或文档目录查找指南。</p><a href="/index.html">返回文档首页</a>', canonical: '/404.html' }))
generated.set('assets/search-data.json', JSON.stringify(data.articles.map(({ slug, title, description, searchText }) => ({ slug, title, description, searchText }))) + '\n')
generated.set('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${settings.siteUrl}/sitemap.xml\n`)
generated.set('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/index.html', ...data.articles.map(article => articleUrl(article.slug))].map(url => `<url><loc>${escape(settings.siteUrl + url)}</loc></url>`).join('')}</urlset>\n`)
for (const name of await fs.readdir(path.join(root, 'content/zh/public/images'))) {
  generated.set(`assets/images/${name}`, await fs.readFile(path.join(root, 'content/zh/public/images', name)))
}
generated.set('generated-files.json', JSON.stringify([...generated.keys()], null, 2) + '\n')
for (const [name, content] of generated) {
  const target = path.join(root, name)
  if (check) {
    const actual = await fs.readFile(target).catch(() => null)
    if (!actual?.equals(Buffer.from(content))) throw new Error(`Stale output: ${name}; run bun run build`)
  } else {
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, content)
  }
}
console.log(`${check ? 'Verified' : 'Generated'} ${generated.size} static files; no application server or SPA fallback required`)
