import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Activity, Cpu, FileText, Users, Mic, Camera, ShieldAlert, Pill, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { clearAdminSession } from '../utils/adminStorage'

export default function Sidebar({ activeMode = 'twin', setActiveMode }){
  const nav = useNavigate()
  const loc = useLocation()
  const { t } = useLanguage()

  const items = [
    { label: t('backToHome'), mode: null, icon: <Home className="w-4 h-4 text-blue-600"/>, to: '/' },
    { label: t('livingDigitalTwin'), mode: 'twin', icon: <Activity className="w-4 h-4 text-blue-600"/>, to: '/dashboard' },
    { label: '💬 AI Doctor Consult', mode: 'consult', icon: <Cpu className="w-4 h-4 text-teal-600"/>, to: '/consultation' },
    { label: t('voiceRiskScan'), mode: 'voice', icon: <Mic className="w-4 h-4 text-teal-600"/>, to: '/voice-analysis' },
    { label: t('woundTracker'), mode: 'wound', icon: <Camera className="w-4 h-4 text-emerald-600"/>, to: '/wound-tracker' },
    { label: t('preventiveRiskHub'), mode: 'risk', icon: <ShieldAlert className="w-4 h-4 text-amber-500"/>, to: '/risk-analysis' },
    { label: t('medicineScanner') || '💊 AI Medicine Scanner', mode: 'meds', icon: <Pill className="w-4 h-4 text-blue-600"/>, to: '/medicine-scanner' },
    { label: 'Admin Portal', mode: 'admin', icon: <ShieldCheck className="w-4 h-4 text-indigo-600"/>, to: '/admin' },
    { label: t('onboardingProfile'), mode: 'twin', icon: <Users className="w-4 h-4 text-slate-600"/>, to: '/onboarding' },
  ]

  const handleItemClick = (item) => {
    if (item.to === '/admin') {
      clearAdminSession()
      nav('/admin')
      return
    }
    if (setActiveMode && item.mode) {
      setActiveMode(item.mode)
    }
    nav(item.to)
  }

  return (
    <aside className="hidden md:flex w-72 p-6 bg-white/95 border-r border-slate-200 text-slate-800 shadow-xl flex-col justify-between min-h-screen backdrop-blur-xl relative z-20">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <img src="/assets/logo.png" alt="MedTwin AI Logo" className="w-10 h-10 object-contain rounded-xl border border-slate-200 bg-sky-50 p-1 shadow-sm" />
          <div>
            <div className="font-extrabold text-slate-900 text-base font-display">MedTwin AI</div>
            <div className="text-teal-600 text-xs font-bold font-mono">Digital Twin Studio</div>
          </div>
        </div>

        <nav className="space-y-1.5">
          {items.map(i => {
            const isActive = activeMode === i.mode && loc.pathname === i.to
            return (
              <div
                key={i.label}
                onClick={() => handleItemClick(i)}
                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer font-extrabold text-xs transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md shadow-blue-500/20 border border-blue-400/30'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div>{i.icon}</div>
                <div className="truncate">{i.label}</div>
              </div>
            )
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span>AI Engine:</span>
        <span className="text-emerald-600 font-extrabold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Online</span>
        </span>
      </div>
    </aside>
  )
}
