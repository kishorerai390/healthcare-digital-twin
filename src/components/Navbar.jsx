import React from 'react'
import { useNavigate } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'
import { ShieldCheck } from 'lucide-react'
import { clearAdminSession } from '../utils/adminStorage'

export default function Navbar(){
  const nav = useNavigate()

  const handleAdminClick = () => {
    clearAdminSession()
    nav('/admin')
  }

  return (
    <div className="w-full glass p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => nav('/')}>
        <img src="/assets/logo.png" alt="MedTwin AI Logo" className="w-9 h-9 object-contain rounded-xl border border-slate-200 bg-white p-1 shadow-xs" />
        <div>
          <div className="font-extrabold text-slate-900 text-sm">MedTwin AI</div>
          <div className="text-[10px] text-slate-500 font-semibold">Healthcare Digital Twin</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSelector />
        
        {/* Admin User Switch Button */}
        <button
          onClick={handleAdminClick}
          className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          title="Switch to Admin Portal"
        >
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Admin Portal</span>
        </button>
      </div>
    </div>
  )
}
