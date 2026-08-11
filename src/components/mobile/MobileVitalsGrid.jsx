import React from 'react'
import { Heart, Activity, Zap, ShieldCheck } from 'lucide-react'

export default function MobileVitalsGrid({ vitals }) {
  const hr = vitals?.heartRate || 76
  const bp = vitals ? `${vitals.systolic || 118}/${vitals.diastolic || 78}` : '118/78'
  const glucose = vitals?.glucose || 98
  const spo2 = vitals?.spo2 || 98

  return (
    <div className="w-full max-w-xl">
      {/* Mobile Screen Layout (2x2 Grid) */}
      <div className="sm:hidden grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-white/95 border border-slate-200 shadow-lg backdrop-blur-md">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500 flex-shrink-0 animate-pulse" />
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Heart Rate</div>
            <div className="text-xs font-black text-slate-900 truncate">{hr} BPM</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Blood Pressure</div>
            <div className="text-xs font-black text-slate-900 truncate">{bp} mmHg</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Glucose</div>
            <div className="text-xs font-black text-slate-900 truncate">{glucose} mg/dL</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">SpO2</div>
            <div className="text-xs font-black text-slate-900 truncate">{spo2}% Saturation</div>
          </div>
        </div>
      </div>

      {/* Desktop Screen Layout (Original 1-Line Row Untouched) */}
      <div className="hidden sm:flex items-center justify-between p-4 rounded-2xl bg-white/90 border border-slate-200 text-xs font-bold shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-slate-800">
          <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
          <span>{hr} BPM</span>
        </div>
        <div className="w-px h-5 bg-slate-200" />
        <div className="flex items-center gap-2 text-slate-800">
          <Activity className="w-4 h-4 text-teal-600" />
          <span>{bp} mmHg</span>
        </div>
        <div className="w-px h-5 bg-slate-200" />
        <div className="flex items-center gap-2 text-slate-800">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>{glucose} mg/dL Glucose</span>
        </div>
        <div className="w-px h-5 bg-slate-200" />
        <div className="flex items-center gap-2 text-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{spo2}% SpO2</span>
        </div>
      </div>
    </div>
  )
}
