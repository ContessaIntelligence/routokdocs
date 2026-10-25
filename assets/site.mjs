const input = document.querySelector('#search')
const form = document.querySelector('form[role="search"]')
const results = document.querySelector('#results')
const status = document.querySelector('#search-status')
let searchPromise
let revision = 0

async function search() {
  const current = ++revision
  const query = input.value.trim()
  results.replaceChildren()
  results.hidden = !query
  status.textContent = ''
  if (!query) return
  status.textContent = '正在搜索…'
  searchPromise ??= Promise.all([
    import('./search.mjs'),
    fetch('/assets/search-data.json').then(response => {
      if (!response.ok) throw new Error('Search data unavailable')
      return response.json()
    }),
  ]).catch(error => {
    searchPromise = undefined
    throw error
  })
  try {
    const [{ searchDocumentation }, articles] = await searchPromise
    if (current !== revision) return
    const matches = searchDocumentation(articles, query)
    status.textContent = matches.length ? `找到 ${matches.length} 篇相关指南` : '没有找到相关指南，请尝试其他关键词'
    for (const article of matches) {
      const link = document.createElement('a')
      link.href = `/docs/${article.slug}/index.html`
      const title = document.createElement('h2')
      title.textContent = article.title
      const description = document.createElement('p')
      description.textContent = article.description
      link.append(title, description)
      results.append(link)
    }
  } catch {
    if (current === revision) status.textContent = '搜索暂时不可用，请使用左侧文档目录，或重新搜索'
  }
}

input.addEventListener('input', search)
form.addEventListener('submit', event => {
  event.preventDefault()
  void search()
})
input.value = new URLSearchParams(location.search).get('q') || ''
if (input.value) void search()

document.addEventListener('click', async event => {
  const button = event.target.closest('[data-copy]')
  if (!button) return
  try {
    await navigator.clipboard.writeText(button.closest('.code').querySelector('code').textContent)
    button.textContent = '已复制'
  } catch {
    button.textContent = '复制失败，请手动选择代码'
  }
})
