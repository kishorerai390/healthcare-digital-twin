import React from 'react'
import { Sun, Moon, Sparkles } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ className = '', compact = false }) {
  const { theme, toggleTheme, isLight } = useTheme()

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
          isLight
            ? 'bg-amber-500/10 text-amber-700 border-amber-500/30 hover:bg-amber-500/20'
            : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20'
        } ${className}`}
        title={isLight ? 'Switch to Midnight Cyber Dark Theme' : 'Switch to Serene Pastel Light Theme'}
      >
        {isLight ? <Sun className="w-4 h-4 text-amber-600 animate-spin-slow" /> : <Moon className="w-4 h-4 text-cyan-400" />}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
        isLight
          ? 'bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-orange-500/15 border-amber-500/40 text-slate-900 hover:border-amber-500/60 shadow-amber-500/5'
          : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-cyan-500/50 shadow-cyan-500/10'
      } ${className}`}
      title="Toggle Website Theme"
    >
      {isLight ? (
        <>
          <div className="w-5 h-5 rounded-lg bg-amber-400/20 text-amber-700 flex items-center justify-center">
            <Sun className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span className="flex items-center gap-1 font-extrabold text-slate-900">
            <span>Serene Pastel</span>
            <Sparkles className="w-3 h-3 text-amber-600" />
          </span>
        </>
      ) : (
        <>
          <div className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Moon className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="flex items-center gap-1 font-extrabold text-cyan-300">
            <span>Midnight Cyber</span>
            <Sparkles className="w-3 h-3 text-cyan-400" />
          </span>
        </>
      )}
    </button>
  )
}
