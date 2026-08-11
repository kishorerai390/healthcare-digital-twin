import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('medtwin_theme') || 'dark'
    } catch (e) {
      return 'dark'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('medtwin_theme', theme)
    } catch (e) {}

    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('theme-light', 'light')
      root.classList.remove('theme-dark', 'dark')
    } else {
      root.classList.add('theme-dark', 'dark')
      root.classList.remove('theme-light', 'light')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isLight: theme === 'light' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    return { theme: 'dark', setTheme: () => {}, toggleTheme: () => {}, isLight: false }
  }
  return context
}

export default ThemeContext
