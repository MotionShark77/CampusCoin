import { useEffect } from 'react'

export function useTheme(theme) {
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      // auto — follow system
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.matches ? root.classList.add('dark') : root.classList.remove('dark')
      const handler = e => e.matches ? root.classList.add('dark') : root.classList.remove('dark')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])
}
