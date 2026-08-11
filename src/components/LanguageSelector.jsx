import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Globe } from 'lucide-react'

const LANG_OPTIONS = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'hi', label: 'Hindi (हिंदी)', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil (தமிழ்)', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu (తెలుగు)', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali (বাংলা)', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam (മലയാളം)', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati (ગુજરાતી)', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi (मराठी)', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi (ਪੰਜਾਬੀ)', flag: '🇮🇳' },
  { code: 'es', label: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'fr', label: 'French (Français)', flag: '🇫🇷' },
  { code: 'de', label: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'zh', label: 'Mandarin (中文)', flag: '🇨🇳' },
  { code: 'ar', label: 'Arabic (العربية)', flag: '🇦🇪' },
  { code: 'ja', label: 'Japanese (日本語)', flag: '🇯🇵' },
  { code: 'ru', label: 'Russian (Русский)', flag: '🇷🇺' },
  { code: 'ko', label: 'Korean (한국어)', flag: '🇰🇷' },
  { code: 'pt', label: 'Portuguese (Português)', flag: '🇵🇹' },
  { code: 'it', label: 'Italian (Italiano)', flag: '🇮🇹' },
  { code: 'tr', label: 'Turkish (Türkçe)', flag: '🇹🇷' },
  { code: 'vi', label: 'Vietnamese (Tiếng Việt)', flag: '🇻🇳' },
  { code: 'id', label: 'Indonesian (Bahasa Indonesia)', flag: '🇮🇩' },
  { code: 'nl', label: 'Dutch (Nederlands)', flag: '🇳🇱' }
]

export default function LanguageSelector(){
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm text-xs font-bold">
      <Globe className="w-4 h-4 text-cyan-600 flex-shrink-0" />
      <span className="text-slate-500 hidden sm:inline">Translate Page:</span>
      
      {/* Custom Selector */}
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="bg-transparent text-slate-900 font-extrabold focus:outline-none cursor-pointer"
      >
        {LANG_OPTIONS.map(l => (
          <option key={l.code} value={l.code}>
            {l.flag} {l.label}
          </option>
        ))}
      </select>
    </div>
  )
}

