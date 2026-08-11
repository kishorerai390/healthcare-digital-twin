import React from 'react'
import Sidebar from '../components/Sidebar'
import MedicineScannerView from '../components/MedicineScannerView'
import LanguageSelector from '../components/LanguageSelector'
import { Pill, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function MedicineScannerPage(){
  const nav = useNavigate()

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar activeMode="meds" />

      <main className="flex-1 p-6 sm:p-10 space-y-6 max-w-7xl mx-auto overflow-y-auto">
        
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => nav('/dashboard')}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all text-xs font-bold cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              <div className="text-xs font-bold text-purple-600 uppercase tracking-wider font-display">
                Dedicated Standalone Module
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2 font-display">
              <Pill className="w-7 h-7 text-purple-600" />
              <span>AI Prescription Pill & Medicine Scanner</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              OCR label recognition, narrow-therapeutic index danger warnings & dosage schedule alarms
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
          </div>
        </header>

        {/* Render Main Medicine Scanner Component */}
        <MedicineScannerView />

      </main>
    </div>
  )
}
