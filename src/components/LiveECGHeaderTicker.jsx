import React, { useState, useEffect } from 'react'
import { Activity, Heart, ShieldCheck, Zap, Radio } from 'lucide-react'

export default function LiveECGHeaderTicker({ heartRate = 78, systolic = 118, diastolic = 78, spo2 = 98 }) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-slate-950/90 text-white border-b border-slate-800 px-4 py-2 text-xs font-mono flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md relative z-30 overflow-hidden">
      
      {/* Background Animated ECG Waveform Overlay */}
      <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
        <svg className="w-full h-8 stroke-cyan-400 fill-none" strokeWidth="2" viewBox="0 0 500 40">
          <path d="M0,20 L80,20 L90,10 L100,30 L110,5 L120,35 L130,20 L210,20 L220,10 L230,30 L240,5 L250,35 L260,20 L340,20 L350,10 L360,30 L370,5 L380,35 L390,20 L500,20" />
        </svg>
      </div>

      {/* Left: Active Telemetry Signal */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>LIVE ECG TELEMETRY ACTIVE</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Biometric Mesh Synchronized</span>
        </div>
      </div>

      {/* Center: Live Vitals Ticker */}
      <div className="flex items-center gap-4 sm:gap-6 relative z-10 font-black">
        {/* HR BPM */}
        <div className="flex items-center gap-1.5 text-white">
          <Heart className={`w-3.5 h-3.5 text-rose-500 transition-transform duration-300 ${pulse ? 'scale-125' : 'scale-100'}`} />
          <span className="text-slate-400 text-[10px]">HR:</span>
          <span className="text-cyan-400 font-mono">{heartRate}</span>
          <span className="text-[9px] text-slate-500 font-normal">BPM</span>
        </div>

        {/* Blood Pressure */}
        <div className="flex items-center gap-1.5 text-white">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 text-[10px]">BP:</span>
          <span className="text-emerald-400 font-mono">{systolic}/{diastolic}</span>
          <span className="text-[9px] text-slate-500 font-normal">mmHg</span>
        </div>

        {/* SpO2 Oxygen */}
        <div className="flex items-center gap-1.5 text-white">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 text-[10px]">SpO2:</span>
          <span className="text-purple-400 font-mono">{spo2}%</span>
        </div>
      </div>

      {/* Right: Security Checksum */}
      <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-slate-400 font-bold relative z-10">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>AES-256 Encrypted Stream</span>
      </div>
    </div>
  )
}
