import React, { useState } from 'react'
import { Activity, Mic, Camera, ShieldAlert, Pill, Sparkles, Folder, ChevronUp, ChevronDown, Home, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function MobileNavigationFolder({ activeMode, setActiveMode }) {
  const nav = useNavigate()
  const [isFolderOpen, setIsFolderOpen] = useState(false)

  const modes = [
    { id: 'twin', name: '3D Living Digital Twin', icon: <Activity className="w-4 h-4 text-blue-600" />, badge: 'Core' },
    { id: 'voice', name: '30s Voice Heart Scan', icon: <Mic className="w-4 h-4 text-teal-600" />, badge: 'AI Voice' },
    { id: 'wound', name: 'Wound Healing Tracker', icon: <Camera className="w-4 h-4 text-emerald-600" />, badge: 'Vision' },
    { id: 'risk', name: 'Preventive Risk Hub', icon: <ShieldAlert className="w-4 h-4 text-amber-600" />, badge: 'PDF' },
    { id: 'meds', name: 'AI Medicine Scanner', icon: <Pill className="w-4 h-4 text-purple-600" />, badge: 'Rx Scan' },
    { id: 'consult', name: 'Live AI Consultation', icon: <Sparkles className="w-4 h-4 text-indigo-600" />, badge: 'Live Chat' }
  ]

  const currentMode = modes.find(m => m.id === activeMode) || modes[0]

  return (
    <div className="md:hidden w-full mb-6">
      {/* Collapsible Mobile Navigation Folder Card */}
      <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div 
          onClick={() => setIsFolderOpen(!isFolderOpen)}
          className="p-3.5 flex items-center justify-between cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Active Feature Folder</div>
              <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                {currentMode.icon}
                <span>{currentMode.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md border border-blue-200">
              {isFolderOpen ? 'Close Folder' : 'Tap to Switch'}
            </span>
            {isFolderOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </div>
        </div>

        {/* Folder Content Items */}
        {isFolderOpen && (
          <div className="p-3 border-t border-slate-200 bg-white grid grid-cols-1 gap-2 animate-in slide-in-from-top-2 duration-200">
            {modes.map(mode => {
              const isActive = activeMode === mode.id
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    setActiveMode(mode.id)
                    setIsFolderOpen(false)
                  }}
                  className={`w-full p-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md border border-blue-500' 
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {mode.icon}
                    <span>{mode.name}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {mode.badge}
                  </span>
                </button>
              )
            })}

            <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-200">
              <button
                onClick={() => nav('/')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 shadow-xs"
              >
                <Home className="w-3.5 h-3.5 text-blue-600" />
                <span>Home Page</span>
              </button>

              <button
                onClick={() => nav('/admin')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin Portal</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
