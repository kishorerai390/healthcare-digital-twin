import React, { useState, useEffect } from 'react'

const bodyPartData = {
  brain: { label: 'Brain', status: 'Optimal', detail: 'Cognitive function normal. No anomalies detected.', risk: 'Low', color: '#0284c7' },
  heart: { label: 'Heart', status: 'Good', detail: 'Heart rate: 72 bpm. ECG rhythm: Normal sinus. BP: 120/80 mmHg.', risk: 'Low', color: '#059669' },
  lungs: { label: 'Lungs', status: 'Good', detail: 'SpO2: 98%. Respiratory rate: 16/min. No congestion.', risk: 'Low', color: '#059669' },
  liver: { label: 'Liver', status: 'Monitor', detail: 'ALT: 42 U/L (slightly elevated). Recommend follow-up in 3 months.', risk: 'Medium', color: '#d97706' },
  kidneys: { label: 'Kidneys', status: 'Optimal', detail: 'GFR: 95 mL/min. Creatinine: 0.9 mg/dL. Normal function.', risk: 'Low', color: '#0284c7' },
  stomach: { label: 'Stomach', status: 'Good', detail: 'Digestion normal. No acid reflux indicators. BMI: 23.1', risk: 'Low', color: '#059669' },
}

function HumanBody({ activeOrgan, onSelectOrgan }) {
  return (
    <div className="relative w-[280px] h-[520px] mx-auto">
      {/* Body outline */}
      <svg viewBox="0 0 200 400" className="w-full h-full opacity-30">
        <ellipse cx="100" cy="35" rx="30" ry="35" fill="none" stroke="#475569" strokeWidth="2" />
        <line x1="100" y1="70" x2="100" y2="220" stroke="#475569" strokeWidth="2" />
        <line x1="100" y1="100" x2="40" y2="180" stroke="#475569" strokeWidth="2" />
        <line x1="100" y1="100" x2="160" y2="180" stroke="#475569" strokeWidth="2" />
        <line x1="100" y1="220" x2="60" y2="360" stroke="#475569" strokeWidth="2" />
        <line x1="100" y1="220" x2="140" y2="360" stroke="#475569" strokeWidth="2" />
      </svg>

      {/* Organ hotspots */}
      {[
        { id: 'brain', top: '2%', left: '50%' },
        { id: 'heart', top: '25%', left: '44%' },
        { id: 'lungs', top: '22%', left: '60%' },
        { id: 'liver', top: '35%', left: '40%' },
        { id: 'stomach', top: '40%', left: '55%' },
        { id: 'kidneys', top: '45%', left: '45%' },
      ].map(organ => (
        <button
          key={organ.id}
          onClick={() => onSelectOrgan(organ.id)}
          className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{ top: organ.top, left: organ.left }}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            activeOrgan === organ.id
              ? 'scale-125 shadow-lg'
              : 'hover:scale-110'
          }`} style={{
            background: activeOrgan === organ.id
              ? `${bodyPartData[organ.id].color}30`
              : 'rgba(15, 23, 42, 0.08)',
            border: `2px solid ${activeOrgan === organ.id ? bodyPartData[organ.id].color : 'rgba(15, 23, 42, 0.2)'}`,
            boxShadow: activeOrgan === organ.id ? `0 0 20px ${bodyPartData[organ.id].color}40` : 'none'
          }}>
            <div className={`w-3 h-3 rounded-full transition-all`} style={{
              background: bodyPartData[organ.id].color,
              boxShadow: `0 0 8px ${bodyPartData[organ.id].color}`
            }} />
          </div>
          <span className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 text-xs font-extrabold whitespace-nowrap transition-opacity ${
            activeOrgan === organ.id ? 'opacity-100 text-slate-900 font-black' : 'opacity-70 text-slate-700 font-bold'
          }`}>
            {bodyPartData[organ.id].label}
          </span>
        </button>
      ))}
    </div>
  )
}

export default function DigitalTwinView() {
  const [activeOrgan, setActiveOrgan] = useState('heart')
  const [vitalPulse, setVitalPulse] = useState(72)
  const organ = bodyPartData[activeOrgan]

  useEffect(() => {
    const interval = setInterval(() => {
      setVitalPulse(prev => prev + Math.floor(Math.random() * 5) - 2)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <span className="text-3xl">🧬</span> Digital Twin Visualization
          </h1>
          <p className="text-slate-600 mt-1 text-sm font-semibold">Interactive 3D body model — click organs to inspect health status</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Body Model */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 rounded-2xl p-6 border border-slate-200 shadow-md">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4">Body Map</h3>
              <HumanBody activeOrgan={activeOrgan} onSelectOrgan={setActiveOrgan} />
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Selected Organ Card */}
            <div className="bg-white/95 rounded-2xl p-6 border-2 border-slate-200 shadow-md" style={{ borderColor: `${organ.color}60` }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold text-slate-900">{organ.label} Analysis</h2>
                <span className="px-3.5 py-1 rounded-full text-xs font-black border shadow-xs" style={{
                  background: `${organ.color}15`,
                  color: organ.color,
                  borderColor: `${organ.color}40`
                }}>
                  {organ.status}
                </span>
              </div>
              <p className="text-slate-800 text-sm font-bold leading-relaxed mb-4">{organ.detail}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-700 font-extrabold">Risk Level:</span>
                <div className="flex-1 h-2.5 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                  <div className="h-full rounded-full transition-all duration-700" style={{
                    width: organ.risk === 'Low' ? '20%' : organ.risk === 'Medium' ? '55%' : '85%',
                    background: organ.color
                  }} />
                </div>
                <span className="text-xs font-black" style={{ color: organ.color }}>{organ.risk}</span>
              </div>
            </div>

            {/* Live Vitals Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Heart Rate', value: `${vitalPulse} bpm`, icon: '❤️' },
                { label: 'Blood Pressure', value: '120/80', icon: '🩸' },
                { label: 'SpO2', value: '98%', icon: '🫁' },
                { label: 'Temperature', value: '98.4°F', icon: '🌡️' },
              ].map(vital => (
                <div key={vital.label} className="bg-white/95 rounded-2xl p-4 border border-slate-200 shadow-md text-center">
                  <div className="text-2xl mb-1">{vital.icon}</div>
                  <div className="text-xl font-black text-slate-900">{vital.value}</div>
                  <div className="text-[10px] text-slate-600 font-black uppercase tracking-wider mt-1">{vital.label}</div>
                </div>
              ))}
            </div>

            {/* All Organs Summary */}
            <div className="bg-white/95 rounded-2xl p-6 border border-slate-200 shadow-md">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4">All Organs Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(bodyPartData).map(([id, data]) => (
                  <button
                    key={id}
                    onClick={() => setActiveOrgan(id)}
                    className={`p-3 rounded-xl text-left transition-all duration-200 border cursor-pointer ${
                      activeOrgan === id
                        ? 'bg-cyan-50 border-cyan-400 scale-[1.02] shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900">{data.label}</span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: data.color }} />
                    </div>
                    <span className="text-[10px] font-black mt-1 inline-block" style={{ color: data.color }}>{data.status}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
