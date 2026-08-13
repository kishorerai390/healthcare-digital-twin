import React, { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const predictionCategories = [
  {
    id: 'cardiovascular',
    icon: '❤️',
    title: 'Cardiovascular',
    risk: 12,
    trend: 'stable',
    prediction: 'Based on your current vitals, exercise habits, and family history, your 10-year cardiovascular risk is estimated at 12%. This is within the low-risk range.',
    factors: ['Resting HR: 72 bpm (Normal)', 'BP: 120/80 mmHg (Normal)', 'Cholesterol: 215 mg/dL (Borderline)', 'Exercise: 30 min/day (Good)'],
    recommendation: 'Monitor cholesterol. Consider dietary changes to reduce LDL below 130 mg/dL.',
    color: '#ef4444',
    chartData: Array.from({ length: 12 }, (_, i) => ({ month: `M${i + 1}`, risk: 12 + Math.round(Math.sin(i * 0.5) * 3) })),
  },
  {
    id: 'diabetes',
    icon: '🍬',
    title: 'Type 2 Diabetes',
    risk: 8,
    trend: 'improving',
    prediction: 'Your fasting glucose levels and BMI suggest a low probability of developing Type 2 Diabetes in the next 5 years.',
    factors: ['Fasting Glucose: 95 mg/dL (Normal)', 'BMI: 23.1 (Normal)', 'HbA1c: 5.2% (Normal)', 'Family History: None'],
    recommendation: 'Continue maintaining a balanced diet. Keep sugar intake below 25g/day.',
    color: '#fbbf24',
    chartData: Array.from({ length: 12 }, (_, i) => ({ month: `M${i + 1}`, risk: 10 - Math.round(i * 0.2) })),
  },
  {
    id: 'respiratory',
    icon: '🫁',
    title: 'Respiratory',
    risk: 5,
    trend: 'stable',
    prediction: 'Lung function tests and SpO2 levels indicate excellent respiratory health. No concerns detected.',
    factors: ['SpO2: 98% (Excellent)', 'Respiratory Rate: 16/min (Normal)', 'Non-Smoker', 'No Asthma History'],
    recommendation: 'Maintain current lifestyle. Consider annual spirometry testing.',
    color: '#22d3ee',
    chartData: Array.from({ length: 12 }, (_, i) => ({ month: `M${i + 1}`, risk: 5 + Math.round(Math.random() * 2 - 1) })),
  },
  {
    id: 'mental',
    icon: '🧠',
    title: 'Mental Health',
    risk: 22,
    trend: 'needs-attention',
    prediction: 'Stress indicators and sleep patterns suggest moderate risk for anxiety and burnout. Early intervention recommended.',
    factors: ['Stress Level: 6/10 (Moderate)', 'Sleep: 6.5 hrs avg (Below optimal)', 'Screen Time: 8+ hrs/day', 'Mindfulness: Occasional'],
    recommendation: 'Increase sleep to 7-8 hours. Add daily 10-minute meditation. Consider reducing screen time before bed.',
    color: '#a78bfa',
    chartData: Array.from({ length: 12 }, (_, i) => ({ month: `M${i + 1}`, risk: 18 + Math.round(i * 0.4) })),
  },
]

export default function Predictions() {
  const [selectedCategory, setSelectedCategory] = useState('cardiovascular')
  const active = predictionCategories.find(c => c.id === selectedCategory)

  const trendLabel = (t) => t === 'improving' ? '📈 Improving' : t === 'stable' ? '➡️ Stable' : '⚠️ Needs Attention'
  const trendColor = (t) => t === 'improving' ? '#34d399' : t === 'stable' ? '#94a3b8' : '#f97316'

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🔮</span> AI Health Predictions
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Machine learning-powered risk assessment based on your digital twin data</p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {predictionCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`glass rounded-xl p-4 text-center transition-all duration-300 border ${
                selectedCategory === cat.id
                  ? 'border-white/15 scale-[1.02] shadow-lg'
                  : 'border-transparent hover:border-white/10'
              }`}
              style={selectedCategory === cat.id ? { borderColor: `${cat.color}40`, boxShadow: `0 4px 20px ${cat.color}15` } : {}}
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="text-sm font-bold text-white">{cat.title}</div>
              <div className="text-2xl font-black mt-1" style={{ color: cat.risk < 15 ? '#34d399' : cat.risk < 25 ? '#fbbf24' : '#ef4444' }}>
                {cat.risk}%
              </div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">Risk Score</div>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Prediction Summary */}
            <div className="glass rounded-2xl p-6 border border-white/5" style={{ borderLeftColor: `${active.color}40`, borderLeftWidth: '3px' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{active.icon}</span> {active.title} Risk Analysis
                </h2>
                <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ color: trendColor(active.trend), background: `${trendColor(active.trend)}15` }}>
                  {trendLabel(active.trend)}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{active.prediction}</p>
            </div>

            {/* Chart */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">12-Month Risk Trend</h3>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={active.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="risk" stroke={active.color} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: active.color }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="glass rounded-2xl p-5 border border-cyan-500/15">
              <div className="flex items-start gap-3">
                <span className="text-lg">🤖</span>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">AI Recommendation</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{active.recommendation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Factors */}
          <div>
            <div className="glass rounded-2xl p-5 border border-white/5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Contributing Factors</h3>
              <div className="space-y-3">
                {active.factors.map((factor, idx) => {
                  const [label, status] = factor.split('(')
                  const statusText = status?.replace(')', '').trim()
                  const statusColor = statusText === 'Normal' || statusText === 'Good' || statusText === 'Excellent' ? '#34d399'
                    : statusText === 'Borderline' || statusText === 'Moderate' || statusText === 'Below optimal' || statusText === 'Occasional' ? '#fbbf24'
                      : '#94a3b8'
                  return (
                    <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="text-xs font-semibold text-white">{label.trim()}</div>
                      {statusText && (
                        <span className="text-[10px] font-bold mt-0.5 inline-block" style={{ color: statusColor }}>
                          {statusText}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
