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
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../content/', import.meta.url))
const [slug, title, section = 'help'] = process.argv.slice(2)
const catalogFile = path.join(root, 'catalog.json')
const catalog = JSON.parse(await fs.readFile(catalogFile, 'utf8'))
if (
  !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '') ||
  !title?.trim() ||
  /[\r\n]/.test(title)
) {
  throw new Error(
    '用法：bun run docs:new -- article-slug "文章标题" help（slug 仅限小写字母、数字和连字符）'
  )
}
if (!catalog.sections.some((item) => item.id === section)) {
  throw new Error(
    `章节不存在，可选：${catalog.sections.map((item) => item.id).join(', ')}`
  )
}
if (catalog.articles.some((item) => item.slug === slug)) {
  throw new Error(`文章已存在：${slug}`)
}
const article = path.join(root, 'zh', `${slug}.md`)
await fs.writeFile(
  article,
  `# ${title.trim()}\n\n用一两句话说明读完这篇文章可以完成什么。\n\n## 开始前的准备\n\n- 列出需要准备的账号、额度或工具。\n\n## 操作步骤\n\n1. 写明进入哪个页面。\n2. 写明填写什么、点击什么。\n\n## 怎样确认成功\n\n说明用户会看到什么结果。\n\n## 遇到问题\n\n说明检查方法，或链接到[错误排查](/docs/troubleshooting)。\n`,
  { flag: 'wx' }
)
catalog.articles.push({ slug, section })
await fs.writeFile(catalogFile, `${JSON.stringify(catalog, null, 2)}\n`)
console.log(`已创建 ${article}，并加入导航。编辑后运行 bun run build。`)
