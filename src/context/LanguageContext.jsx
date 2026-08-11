import React, { createContext, useContext, useState, useEffect } from 'react'
import { TRANSLATIONS } from '../utils/translations'

const LanguageContext = createContext()

export function useLanguage(){
  return useContext(LanguageContext)
}

export function triggerGoogleTranslate(code) {
  if (!code) return
  const cookieVal = code === 'en' ? '' : `/en/${code}`
  const domain = window.location.hostname

  // Set googtrans cookie
  document.cookie = `googtrans=${cookieVal}; path=/;`
  if (domain) {
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${domain};`
  }

  const applyCombo = () => {
    const selectElem = document.querySelector('.goog-te-combo')
    if (selectElem) {
      selectElem.value = code === 'en' ? '' : code
      selectElem.dispatchEvent(new Event('change'))
      return true
    }
    return false
  }

  if (!applyCombo()) {
    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      if (applyCombo() || attempts > 15) {
        clearInterval(interval)
      }
    }, 300)
  }
}

export function LanguageProvider({ children }){
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('app_lang') || 'en'
  })

  const setLang = (code) => {
    setLangState(code)
    localStorage.setItem('app_lang', code)
    triggerGoogleTranslate(code)
  }

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') || 'en'
    if (savedLang !== 'en') {
      triggerGoogleTranslate(savedLang)
    }
  }, [])

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

