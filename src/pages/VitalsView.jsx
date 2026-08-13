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
  { id: 'bloodPressureSys', label: 'Blood Pressure (Systolic)', unit: 'mmHg', icon: '🩸', color: '#f97316', base: 120, variance: 10, normal: '90-120 mmHg' },
  { id: 'spo2', label: 'Oxygen Saturation', unit: '%', icon: '🫁', color: '#22d3ee', base: 97, variance: 2, normal: '95-100%' },
  { id: 'temperature', label: 'Body Temperature', unit: '°F', icon: '🌡️', color: '#a78bfa', base: 98.4, variance: 0.5, normal: '97.8-99.1°F' },
  { id: 'respRate', label: 'Respiratory Rate', unit: '/min', icon: '💨', color: '#34d399', base: 16, variance: 3, normal: '12-20 /min' },
  { id: 'glucose', label: 'Blood Glucose', unit: 'mg/dL', icon: '🍬', color: '#fbbf24', base: 95, variance: 15, normal: '70-100 mg/dL (fasting)' },
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
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">📊</span> Vitals Monitor
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Real-time vital signs tracking & historical trends</p>
        </div>

        {/* Live Vitals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {vitalsConfig.map(vital => (
            <button
              key={vital.id}
              onClick={() => setSelectedVital(vital.id)}
              className={`glass rounded-xl p-4 text-center transition-all duration-300 border ${
                selectedVital === vital.id
                  ? 'border-white/15 scale-[1.03] shadow-lg'
                  : 'border-transparent hover:border-white/10 hover:bg-white/5'
              }`}
              style={selectedVital === vital.id ? { borderColor: `${vital.color}40`, boxShadow: `0 4px 20px ${vital.color}15` } : {}}
            >
              <div className="text-xl mb-1">{vital.icon}</div>
              <div className="text-lg font-bold text-white">{liveValues[vital.id] || vital.base}</div>
              <div className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">{vital.unit}</div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">{vital.label.split('(')[0].trim()}</div>
            </button>
          ))}
        </div>

        {/* Chart Section */}
        <div className="glass rounded-2xl p-6 border border-white/5 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{activeVital?.icon}</span> {activeVital?.label}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Normal range: {activeVital?.normal}</p>
            </div>
            <div className="flex gap-1.5">
              {['6h', '12h', '24h', '7d'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    timeRange === range
                      ? 'bg-white/10 text-white'
                      : 'text-slate-500 hover:text-slate-300'
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="value" stroke={activeVital?.color} fill="url(#vitalGradient)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: activeVital?.color }} />
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
            <div key={stat.label} className="glass rounded-xl p-4 border border-white/5">
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{stat.label}</div>
              <div className="text-2xl font-bold text-white mt-1">{stat.value} <span className="text-sm text-slate-400 font-normal">{stat.suffix}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
