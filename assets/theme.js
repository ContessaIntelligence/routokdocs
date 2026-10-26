// Resolve the appearance before loading styles to avoid a light flash.
// Menu appearance follows New API / QuantumNous ThemeSwitch (AGPL-3.0).
;(() => {
  const storageKey = 'routok-docs:theme'
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
  let preference = 'system'
  let switcher
  let trigger
  let menu
  let items = []
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved === 'light' || saved === 'dark') preference = saved
  } catch {}

  function applyTheme() {
    const theme = preference === 'system' ? (systemTheme.matches ? 'dark' : 'light') : preference
    document.documentElement.dataset.theme = theme
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.content = theme === 'dark' ? '#121c18' : '#f7f8f4'
    for (const item of items) item.setAttribute('aria-checked', String(item.dataset.themeValue === preference))
  }

  applyTheme()
  systemTheme.addEventListener('change', applyTheme)
  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return
    preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : 'system'
    applyTheme()
  })
  document.addEventListener('DOMContentLoaded', () => {
    switcher = document.querySelector('[data-theme-switch]')
    if (!switcher) return
    trigger = switcher.querySelector('.theme-toggle')
    menu = switcher.querySelector('[role="menu"]')
    items = [...menu.querySelectorAll('[data-theme-value]')]
    switcher.hidden = false
    applyTheme()

    function openMenu(index = items.findIndex(item => item.dataset.themeValue === preference)) {
      menu.hidden = false
      trigger.setAttribute('aria-expanded', 'true')
      items[Math.max(0, index)].focus()
    }

    function closeMenu(restoreFocus = false) {
      menu.hidden = true
      trigger.setAttribute('aria-expanded', 'false')
      if (restoreFocus) trigger.focus()
    }

    trigger.addEventListener('click', () => {
      if (menu.hidden) openMenu()
      else closeMenu()
    })
    menu.addEventListener('click', event => {
      const item = event.target.closest('[data-theme-value]')
      if (!item) return
      preference = item.dataset.themeValue
      try {
        if (preference === 'system') localStorage.removeItem(storageKey)
        else localStorage.setItem(storageKey, preference)
      } catch {}
      applyTheme()
      closeMenu(true)
    })
    switcher.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.hidden) {
        event.preventDefault()
        closeMenu(true)
      } else if (event.key === 'Tab' && !menu.hidden) {
        closeMenu(true)
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        const index = items.indexOf(document.activeElement)
        if (menu.hidden) openMenu(event.key === 'ArrowDown' ? 0 : items.length - 1)
        else items[(index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus()
      } else if (!menu.hidden && (event.key === 'Home' || event.key === 'End')) {
        event.preventDefault()
        items[event.key === 'Home' ? 0 : items.length - 1].focus()
      }
    })
    document.addEventListener('pointerdown', event => {
      if (!switcher.contains(event.target)) closeMenu()
    })
    switcher.addEventListener('focusout', event => {
      if (!switcher.contains(event.relatedTarget)) closeMenu()
    })
  })
})()
