import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'site-theme'
const theme = ref('dark')

function applyTheme(val) {
  const v = val === 'light' ? 'light' : 'dark'
  theme.value = v
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = v
  }
}

function initTheme() {
  let saved = null
  try {
    saved = localStorage.getItem(STORAGE_KEY)
  } catch {}
  applyTheme(saved || 'dark')
}

watch(theme, (v) => {
  try { localStorage.setItem(STORAGE_KEY, v) } catch {}
  applyTheme(v)
})

export function useTheme() {
  const isLight = computed(() => theme.value === 'light')
  const setTheme = (v) => applyTheme(v)
  return { theme, isLight, setTheme, initTheme }
}

// auto-init when imported
initTheme()
