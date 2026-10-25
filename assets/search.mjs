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
const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' })
const indexes = new WeakMap()

export function tokenize(text) {
  const normalized = text
    .toLowerCase()
    .replaceAll(/\bapi[\s_-]*(?:key|token)s?\b/g, '密钥')
    .replaceAll('令牌', '密钥')
    .replaceAll('余额', '额度')
    .replaceAll('新建', '创建')
  return [...segmenter.segment(normalized)]
    .filter((part) => part.isWordLike)
    .map((part) => part.segment)
}

export function searchDocumentation(articles, query) {
  const terms = tokenize(query.trim())
  if (!terms.length) return []
  let index = indexes.get(articles)
  if (!index) {
    index = articles.map((article) => ({
      article,
      title: tokenize(article.title).join(' '),
      text: tokenize(article.searchText).join(' '),
    }))
    indexes.set(articles, index)
  }
  return index
    .map(({ article, title, text }) => {
      if (!terms.every((term) => text.includes(term) || title.includes(term))) {
        return null
      }
      const score = terms.reduce(
        (sum, term) =>
          sum +
          (title.includes(term) ? 20 : 0) +
          Math.min(text.split(term).length - 1, 8),
        0
      )
      return { article, score }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((result) => result.article)
}
