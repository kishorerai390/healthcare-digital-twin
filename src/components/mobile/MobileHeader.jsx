import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ShieldCheck, ArrowRight, Menu, X, Globe, Sparkles, Home, LogIn, UserPlus, 
  FileText, Bell, RefreshCw, User, Dna 
} from 'lucide-react'
import LanguageSelector from '../LanguageSelector'
import { useLanguage } from '../../context/LanguageContext'
import { clearAdminSession } from '../../utils/adminStorage'

export default function MobileHeader({ 
  onCreateTwin, 
  onExploreDemo,
  onOpenPDFModal,
  onOpenGuardianModal,
  onOpenEmergencyModal,
  onSyncHealthData,
  syncing = false
}) {
  const nav = useNavigate()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleAdminClick = () => {
    clearAdminSession()
    nav('/admin')
    setIsOpen(false)
  }

  const handleNav = (path) => {
    nav(path)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Top Navigation Bar (< md screens) */}
      <header className="md:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNav('/')}>
            <img src="/assets/logo.png" alt="MedTwin AI" className="w-8 h-8 object-contain rounded-lg border border-blue-200 bg-blue-50 p-0.5" />
            <div>
              <div className="text-slate-900 font-extrabold text-sm leading-tight flex items-center gap-1">
                <span>MedTwin AI</span>
                <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[9px] font-mono border border-blue-200">STUDIO</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Digital Twin Engine</div>
            </div>
          </div>

          {/* Quick Right Action & Mobile Folder Drawer Toggle */}
          <div className="flex items-center gap-2">
            <div className="scale-90 origin-right">
              <LanguageSelector />
            </div>

            {/* Folder / Drawer Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all cursor-pointer shadow-xs"
              aria-label="Toggle Mobile Menu Folder"
            >
              {isOpen ? <X className="w-5 h-5 text-rose-600" /> : <Menu className="w-5 h-5 text-slate-800" />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Icon Folder Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsOpen(false)}>
          <div 
            className="absolute top-14 right-3 left-3 bg-white rounded-3xl p-5 border border-slate-200 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-4 duration-300 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Mobile Studio Actions</span>
              <span className="text-[10px] font-extrabold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">100% Desktop Parity</span>
            </div>

            {/* Emergency Alert Button */}
            {onOpenEmergencyModal && (
              <button
                onClick={() => {
                  onOpenEmergencyModal()
                  setIsOpen(false)
                }}
                className="w-full p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-950 font-black text-xs shadow-xs flex items-center justify-between cursor-pointer animate-pulse"
              >
                <div className="flex items-center gap-2">
                  <span>🚨 Emergency AI Tele-Dispatch</span>
                </div>
                <ArrowRight className="w-4 h-4 text-rose-600" />
              </button>
            )}

            {/* Dashboard Specific Action Buttons */}
            {(onOpenPDFModal || onOpenGuardianModal || onSyncHealthData) && (
              <div className="grid grid-cols-2 gap-2">
                {onOpenPDFModal && (
                  <button
                    onClick={() => {
                      onOpenPDFModal()
                      setIsOpen(false)
                    }}
                    className="p-3 rounded-xl border border-blue-300 bg-sky-50 hover:bg-sky-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Clinical PDF</span>
                  </button>
                )}

                {onOpenGuardianModal && (
                  <button
                    onClick={() => {
                      onOpenGuardianModal()
                      setIsOpen(false)
                    }}
                    className="p-3 rounded-xl border border-teal-300 bg-teal-50 hover:bg-teal-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Bell className="w-3.5 h-3.5 text-teal-600" />
                    <span>Guardian Alerts</span>
                  </button>
                )}

                {onSyncHealthData && (
                  <button
                    onClick={() => {
                      onSyncHealthData()
                      setIsOpen(false)
                    }}
                    disabled={syncing}
                    className="p-3 rounded-xl border border-blue-300 bg-sky-50 hover:bg-sky-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs col-span-2 disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${syncing ? 'animate-spin' : ''}`} />
                    <span>{syncing ? 'Syncing Sensors...' : 'Sync Health Data'}</span>
                  </button>
                )}
              </div>
            )}

            {/* General Action Buttons */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              <button
                onClick={() => {
                  if (onCreateTwin) onCreateTwin()
                  else handleNav('/onboarding')
                  setIsOpen(false)
                }}
                className="w-full p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-600/20 flex items-center justify-between cursor-pointer border border-blue-500"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Create / Update Profile</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onExploreDemo && (
                <button
                  onClick={() => {
                    onExploreDemo()
                    setIsOpen(false)
                  }}
                  className="w-full p-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-extrabold text-xs flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>Explore Studio Dashboard</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal-600" />
                </button>
              )}

              <button
                onClick={handleAdminClick}
                className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-between cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Admin Portal</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Control Center →</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleNav('/login')}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-xs text-slate-800 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-blue-600" />
                  <span>{t('signIn')}</span>
                </button>

                <button
                  onClick={() => handleNav('/signup')}
                  className="p-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 font-bold text-xs text-blue-900 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>Register</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center font-medium">
              🔒 256-Bit HIPAA Encrypted • MedTwin AI Studio
            </div>
          </div>
        </div>
      )}
    </>
  )
}
