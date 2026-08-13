import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

// Generate mock vital history data
function generateVitalData(baseValue, variance, count = 24) {
  return Array.from({ length: count }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    value: Math.round(baseValue + (Math.random() * variance * 2 - variance)),
  }))
}

const vitalsConfig = [
  { id: 'heartRate', label: 'Heart Rate', unit: 'bpm', icon: '❤️', color: '#ef4444', base: 72, variance: 8, normal: '60-100 bpm' },
  { id: 'bloodPressureSys', label: 'Blood Pressure (Systolic)', unit: 'mmHg', icon: '🩸', color: '#ea580c', base: 120, variance: 10, normal: '90-120 mmHg' },
  { id: 'spo2', label: 'Oxygen Saturation', unit: '%', icon: '🫁', color: '#0284c7', base: 97, variance: 2, normal: '95-100%' },
  { id: 'temperature', label: 'Body Temperature', unit: '°F', icon: '🌡️', color: '#7c3aed', base: 98.4, variance: 0.5, normal: '97.8-99.1°F' },
  { id: 'respRate', label: 'Respiratory Rate', unit: '/min', icon: '💨', color: '#059669', base: 16, variance: 3, normal: '12-20 /min' },
  { id: 'glucose', label: 'Blood Glucose', unit: 'mg/dL', icon: '🍬', color: '#d97706', base: 95, variance: 15, normal: '70-100 mg/dL (fasting)' },
]

export default function VitalsView() {
  const [selectedVital, setSelectedVital] = useState('heartRate')
  const [timeRange, setTimeRange] = useState('24h')
  const [vitalsData, setVitalsData] = useState({})
  const [liveValues, setLiveValues] = useState({})

  useEffect(() => {
    const data = {}
    const live = {}
    vitalsConfig.forEach(v => {
      data[v.id] = generateVitalData(v.base, v.variance)
      live[v.id] = v.base + Math.round((Math.random() * v.variance * 2 - v.variance) * 10) / 10
    })
    setVitalsData(data)
    setLiveValues(live)
  }, [])

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveValues(prev => {
        const updated = { ...prev }
        vitalsConfig.forEach(v => {
          const delta = (Math.random() * v.variance * 0.4) - (v.variance * 0.2)
          updated[v.id] = Math.round((prev[v.id] + delta) * 10) / 10
        })
        return updated
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const activeVital = vitalsConfig.find(v => v.id === selectedVital)
  const chartData = vitalsData[selectedVital] || []

  return (
    <div className="min-h-screen p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <span className="text-3xl">📊</span> Vitals Monitor
          </h1>
          <p className="text-slate-600 mt-1 text-sm font-semibold">Real-time vital signs tracking & historical trends</p>
        </div>

        {/* Live Vitals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {vitalsConfig.map(vital => (
            <button
              key={vital.id}
              onClick={() => setSelectedVital(vital.id)}
              className={`bg-white/95 rounded-2xl p-4 text-center transition-all duration-300 border cursor-pointer ${
                selectedVital === vital.id
                  ? 'border-cyan-500 scale-[1.03] shadow-md ring-2 ring-cyan-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-2xl mb-1">{vital.icon}</div>
              <div className="text-xl font-black text-slate-900">{liveValues[vital.id] || vital.base}</div>
              <div className="text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mt-0.5">{vital.unit}</div>
              <div className="text-xs font-bold text-slate-800 mt-1 truncate">{vital.label.split('(')[0].trim()}</div>
            </button>
          ))}
        </div>

        {/* Chart Section */}
        <div className="bg-white/95 rounded-2xl p-6 border border-slate-200 shadow-md mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>{activeVital?.icon}</span> {activeVital?.label}
              </h2>
              <p className="text-xs text-slate-600 font-bold mt-0.5">Normal range: {activeVital?.normal}</p>
            </div>
            <div className="flex gap-1.5">
              {['6h', '12h', '24h', '7d'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                    timeRange === range
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="vitalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeVital?.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={activeVital?.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', color: '#ffffff', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="value" stroke={activeVital?.color} fill="url(#vitalGradient)" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: activeVital?.color }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Current', value: liveValues[selectedVital] || activeVital?.base, suffix: activeVital?.unit },
            { label: 'Average (24h)', value: activeVital?.base, suffix: activeVital?.unit },
            { label: 'Min (24h)', value: Math.round((activeVital?.base - activeVital?.variance) * 10) / 10, suffix: activeVital?.unit },
            { label: 'Max (24h)', value: Math.round((activeVital?.base + activeVital?.variance) * 10) / 10, suffix: activeVital?.unit },
          ].map(stat => (
            <div key={stat.label} className="bg-white/95 rounded-2xl p-4 border border-slate-200 shadow-md">
              <div className="text-[10px] text-slate-600 font-black uppercase tracking-wider">{stat.label}</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{stat.value} <span className="text-xs text-slate-600 font-extrabold">{stat.suffix}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
