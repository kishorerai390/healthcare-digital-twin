import React, { useState } from 'react'
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
    color: '#f59e0b',
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
    color: '#06b6d4',
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
    color: '#8b5cf6',
    chartData: Array.from({ length: 12 }, (_, i) => ({ month: `M${i + 1}`, risk: 18 + Math.round(i * 0.4) })),
  },
]

export default function Predictions() {
  const [selectedCategory, setSelectedCategory] = useState('cardiovascular')
  const active = predictionCategories.find(c => c.id === selectedCategory)

  const trendLabel = (t) => t === 'improving' ? '📈 Improving' : t === 'stable' ? '➡️ Stable' : '⚠️ Needs Attention'
  const trendColor = (t) => t === 'improving' ? '#047857' : t === 'stable' ? '#0284c7' : '#b45309'

  return (
    <div className="min-h-screen p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <span className="text-3xl">🔮</span> AI Health Predictions
          </h1>
          <p className="text-slate-600 mt-1 text-sm font-semibold">Machine learning-powered risk assessment based on your digital twin data</p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {predictionCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`bg-white/95 rounded-2xl p-4 text-center transition-all duration-300 border cursor-pointer ${
                selectedCategory === cat.id
                  ? 'border-cyan-500 scale-[1.02] shadow-md ring-2 ring-cyan-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="text-sm font-extrabold text-slate-900">{cat.title}</div>
              <div className="text-2xl font-black mt-1" style={{ color: cat.risk < 15 ? '#047857' : cat.risk < 25 ? '#b45309' : '#b91c1c' }}>
                {cat.risk}%
              </div>
              <div className="text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mt-0.5">Risk Score</div>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Prediction Summary */}
            <div className="bg-white/95 rounded-2xl p-6 border border-slate-200 shadow-md" style={{ borderLeftColor: active.color, borderLeftWidth: '4px' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <span>{active.icon}</span> {active.title} Risk Analysis
                </h2>
                <span className="text-xs font-black px-3 py-1 rounded-full border shadow-xs" style={{ color: trendColor(active.trend), backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' }}>
                  {trendLabel(active.trend)}
                </span>
              </div>
              <p className="text-sm text-slate-800 font-bold leading-relaxed">{active.prediction}</p>
            </div>

            {/* Chart */}
            <div className="bg-white/95 rounded-2xl p-6 border border-slate-200 shadow-md">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4">12-Month Risk Trend</h3>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={active.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
                    <Tooltip contentStyle={{ background: '#0f172a', color: '#ffffff', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="risk" stroke={active.color} strokeWidth={3} dot={false} activeDot={{ r: 6, fill: active.color }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-cyan-50/90 rounded-2xl p-5 border border-cyan-200 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-xl">🤖</span>
                <div>
                  <h4 className="text-xs font-black text-cyan-950 mb-1 uppercase tracking-wider">AI Recommendation</h4>
                  <p className="text-xs text-slate-800 font-bold leading-relaxed">{active.recommendation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Factors */}
          <div>
            <div className="bg-white/95 rounded-2xl p-5 border border-slate-200 shadow-md">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4">Contributing Factors</h3>
              <div className="space-y-3">
                {active.factors.map((factor, idx) => {
                  const [label, status] = factor.split('(')
                  const statusText = status?.replace(')', '').trim()
                  const statusColor = statusText === 'Normal' || statusText === 'Good' || statusText === 'Excellent' ? '#047857'
                    : statusText === 'Borderline' || statusText === 'Moderate' || statusText === 'Below optimal' || statusText === 'Occasional' ? '#b45309'
                      : '#475569'
                  return (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-xs font-extrabold text-slate-900">{label.trim()}</div>
                      {statusText && (
                        <span className="text-[11px] font-black mt-0.5 inline-block" style={{ color: statusColor }}>
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
