import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Activity, Heart, ShieldCheck } from 'lucide-react'

export default function VitalsGraphView() {
  const heartData = [72, 75, 78, 74, 82, 76, 76]
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // SVG Points calculation
  const svgWidth = 500
  const svgHeight = 120
  const points = heartData.map((val, idx) => {
    const x = (idx / (heartData.length - 1)) * (svgWidth - 40) + 20
    const y = svgHeight - ((val - 60) / 30) * (svgHeight - 40) - 20
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="p-6 rounded-3xl bg-white/95 border border-slate-200/90 border-t-4 border-t-cyan-500 shadow-xl shadow-cyan-500/5 backdrop-blur-md space-y-4">
      
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <div className="text-xs font-bold text-cyan-600 uppercase tracking-wider flex items-center gap-1.5 font-display">
            <Activity className="w-4 h-4 text-cyan-600 animate-pulse" />
            <span>7-Day Continuous Telemetry Trend</span>
          </div>
          <div className="text-lg font-extrabold text-slate-900 font-display">Resting Heart Rate & HRV Baseline</div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-200">
          76 BPM Baseline Average
        </span>
      </div>

      {/* SVG Line Chart Graph */}
      <div className="relative h-32 w-full bg-slate-900 rounded-2xl p-4 overflow-hidden border border-slate-800 shadow-inner">
        <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          
          {/* Background Grid Lines */}
          <line x1="0" y1="30" x2={svgWidth} y2="30" stroke="#1e293b" strokeDasharray="4 4" />
          <line x1="0" y1="60" x2={svgWidth} y2="60" stroke="#1e293b" strokeDasharray="4 4" />
          <line x1="0" y1="90" x2={svgWidth} y2="90" stroke="#1e293b" strokeDasharray="4 4" />

          {/* Area Fill Gradient */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <polygon points={`20,${svgHeight} ${points} ${svgWidth - 20},${svgHeight}`} fill="url(#chartGradient)" />

          {/* Animated Graph Line */}
          <polyline
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Data Points Dots */}
          {heartData.map((val, idx) => {
            const x = (idx / (heartData.length - 1)) * (svgWidth - 40) + 20
            const y = svgHeight - ((val - 60) / 30) * (svgHeight - 40) - 20
            return (
              <g key={idx}>
                <circle cx={x} cy={y} r="5" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
              </g>
            )
          })}
        </svg>
      </div>

      {/* Days X-Axis */}
      <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500 font-mono">
        {days.map((day, i) => (
          <span key={i} className={i === 6 ? 'text-cyan-600 font-black' : ''}>{day}</span>
        ))}
      </div>

    </div>
  )
}
