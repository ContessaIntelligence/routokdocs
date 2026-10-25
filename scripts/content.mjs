/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { spawnSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { Transpiler } from 'bun'
import { marked } from 'marked'
import { parse } from 'yaml'

import { searchDocumentation } from '../assets/search.mjs'

const web = fileURLToPath(new URL('../', import.meta.url))
const root = path.join(web, 'content')
const catalog = JSON.parse(
  await fs.readFile(path.join(root, 'catalog.json'), 'utf8')
)
const settings = JSON.parse(
  await fs.readFile(path.join(root, 'site.config.json'), 'utf8')
)
const articles = []
const sections = new Set(catalog.sections.map((section) => section.id))
const slugs = new Set()
let examples = 0
for (const entry of catalog.articles) {
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) ||
    slugs.has(entry.slug) ||
    !sections.has(entry.section)
  ) {
    throw new Error(`Invalid documentation entry: ${entry.slug}`)
  }
  slugs.add(entry.slug)
  const source = (
    await fs.readFile(path.join(root, 'zh', `${entry.slug}.md`), 'utf8')
  ).replaceAll('\r\n', '\n')
  // Preserve source code groups for the standalone static reader.
  const sourceParts = source.split(/^::: code-group\s*$|^:::\s*$/m)
  const blocks = []
  const headings = []
  const ids = new Map()
  let title = ''
  let description = ''
  for (const [partIndex, part] of sourceParts.entries()) {
    const tokens = marked.lexer(part)
    const group = []
    for (const token of tokens) {
      if (token.type === 'space') continue
      if (token.type === 'heading') {
        const text = marked.parseInline(token.text).replaceAll(/<[^>]*>/g, '')
        const base = text
          .normalize('NFKD')
          .toLowerCase()
          .replaceAll(/[^\p{L}\p{N}_-]+/gu, '-')
          .replaceAll(/-+/g, '-')
          .replaceAll(/^-|-$/g, '')
          .replace(/^(\d)/, '_$1')
        const count = ids.get(base) || 0
        ids.set(base, count + 1)
        const id = base + (count ? '-' + count : '')
        if (token.depth === 1) {
          if (title) throw new Error(`Multiple article titles: ${entry.slug}`)
          title = text
        }
        if (token.depth === 2 || token.depth === 3) {
          headings.push({ id, title: text, depth: token.depth })
        }
        blocks.push({
          type: 'heading',
          id,
          depth: token.depth,
          text: token.text,
        })
      } else if (token.type === 'code') {
        const [language = 'text'] = (token.lang || '').split(/\s+/)
        const label = token.lang?.match(/\[(.+)\]/)?.[1] || language
        const code = { type: 'code', code: token.text, language, label }
        if (language === 'json') JSON.parse(token.text)
        if (['javascript', 'js'].includes(language)) {
          try {
            new Transpiler({ loader: 'js' }).transformSync(token.text)
          } catch {
            throw new Error(`${entry.slug}: invalid JavaScript example`)
          }
        }
        if (process.argv.includes('--examples')) {
          let command, args
          if (language === 'python') {
            command = process.platform === 'win32' ? 'python' : 'python3'
            args = ['-c', 'import ast,sys; ast.parse(sys.stdin.read())']
          } else if (language === 'bash' && process.platform !== 'win32') {
            command = 'bash'
            args = ['-n']
          } else if (
            language === 'powershell' &&
            process.platform === 'win32'
          ) {
            command = 'pwsh'
            args = [
              '-NoProfile',
              '-Command',
              '$source=[Console]::In.ReadToEnd();$e=$null;$t=$null;[void][System.Management.Automation.Language.Parser]::ParseInput($source,[ref]$t,[ref]$e);if($e.Count){exit 1}',
            ]
          }
          if (command) {
            const result = spawnSync(command, args, {
              input: token.text,
              encoding: 'utf8',
            })
            if (result.error || result.status !== 0) {
              throw new Error(`${entry.slug}: invalid ${language} example`)
            }
          }
        }
        examples++
        if (partIndex % 2) group.push(code)
        else blocks.push(code)
      } else {
        if (!description && token.type === 'paragraph') {
          description = marked
            .parseInline(token.text)
            .replaceAll(/<[^>]*>/g, '')
        }
        blocks.push({
          type: 'markdown',
          markdown: token.raw.replaceAll(
            '](/images/',
            '](/static/docs/images/'
          ),
        })
      }
    }
    if (group.length) blocks.push({ type: 'code-group', codes: group })
  }
  if (!title || !source.startsWith('# ')) {
    throw new Error(`Article must begin with its title: ${entry.slug}`)
  }
  articles.push({
    ...entry,
    title,
    description,
    headings,
    blocks: blocks.map((block, index) => ({
      ...block,
      key: `${entry.slug}-${index}`,
    })),
    searchText: source.replaceAll(/```[\s\S]*?```/g, ''),
  })
}
const files = (await fs.readdir(path.join(root, 'zh'))).filter(
  (name) => name.endsWith('.md') && name !== 'index.md'
)
if (
  files.length !== slugs.size ||
  files.some((name) => !slugs.has(name.slice(0, -3)))
) {
  throw new Error('Article files and catalog differ')
}
const homeSource = await fs.readFile(path.join(root, 'zh/index.md'), 'utf8')
const home = parse(homeSource.split(/^---\s*$/m)[1])
for (const article of articles) {
  const source = await fs.readFile(
    path.join(root, 'zh', `${article.slug}.md`),
    'utf8'
  )
  for (const match of source.matchAll(/\]\(([^)]+)\)/g)) {
    const url = new URL(match[1], `https://docs.invalid/docs/${article.slug}`)
    if (url.origin !== 'https://docs.invalid') continue
    if (url.pathname.startsWith('/images/')) {
      await fs.access(path.join(root, 'zh/public', url.pathname))
      continue
    }
    if (settings.platformPaths.includes(url.pathname)) continue
    const target = articles.find(
      (item) => `/docs/${item.slug}` === url.pathname
    )
    if (
      !target ||
      (url.hash &&
        !target.headings.some(
          (heading) => heading.id === decodeURIComponent(url.hash.slice(1))
        ))
    ) {
      throw new Error(`${article.slug}: invalid link ${match[1]}`)
    }
  }
}
for (const item of [...home.hero.actions, ...home.features]) {
  if (!articles.some((article) => `/docs/${article.slug}` === item.link)) {
    throw new Error(`Invalid home link: ${item.link}`)
  }
}
for (const [query, slug] of [
  ['创建密钥', 'keys'],
  ['新建 API Key', 'keys'],
  ['找回密码', 'account'],
  ['余额不足', 'wallet'],
  ['密钥泄露', 'keys'],
  ['充值不到账', 'wallet'],
  ['验证码', 'account'],
  ['工具调用', 'tools'],
  ['401', 'troubleshooting'],
]) {
  if (
    !searchDocumentation(articles, query)
      .slice(0, 5)
      .some((article) => article.slug === slug)
  ) {
    throw new Error(`Search regression: ${query}`)
  }
}
export const documentation = { sections: catalog.sections, articles, home, reviewedAt: settings.reviewedAt, sourceRevision: settings.sourceRevision }
console.log(`Documentation checked: ${articles.length} articles, ${examples} examples, links, images and 9 search scenarios`)
