import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const sliderConfigs = [
  { id: 'exercise', label: 'Daily Exercise', unit: 'min', min: 0, max: 120, step: 5, defaultVal: 30, icon: '🏃' },
  { id: 'sleep', label: 'Sleep Duration', unit: 'hrs', min: 3, max: 12, step: 0.5, defaultVal: 7, icon: '😴' },
  { id: 'calories', label: 'Daily Calories', unit: 'kcal', min: 1000, max: 4000, step: 100, defaultVal: 2000, icon: '🍽️' },
  { id: 'water', label: 'Water Intake', unit: 'L', min: 0.5, max: 5, step: 0.25, defaultVal: 2.5, icon: '💧' },
  { id: 'stress', label: 'Stress Level', unit: '/10', min: 1, max: 10, step: 1, defaultVal: 5, icon: '🧠' },
  { id: 'smoking', label: 'Smoking (cigarettes)', unit: '/day', min: 0, max: 20, step: 1, defaultVal: 0, icon: '🚬' },
]

function computePredictions(values) {
  const exerciseScore = Math.min(values.exercise / 60, 1) * 20
  const sleepScore = values.sleep >= 7 && values.sleep <= 9 ? 20 : values.sleep >= 6 ? 12 : 5
  const caloriesScore = values.calories >= 1800 && values.calories <= 2400 ? 15 : 8
  const waterScore = values.water >= 2 ? 15 : values.water >= 1.5 ? 10 : 5
  const stressScore = Math.max(0, 15 - values.stress * 1.5)
  const smokingScore = values.smoking === 0 ? 15 : Math.max(0, 15 - values.smoking * 2)
  const total = Math.round(exerciseScore + sleepScore + caloriesScore + waterScore + stressScore + smokingScore)

  return {
    healthScore: Math.min(100, total),
    heartRisk: values.smoking > 5 ? 'High' : values.stress > 7 ? 'Moderate' : values.exercise > 20 ? 'Low' : 'Moderate',
    diabetesRisk: values.calories > 3000 && values.exercise < 15 ? 'High' : values.calories > 2500 ? 'Moderate' : 'Low',
    lifeExpectancy: `${Math.round(75 + total * 0.12 - values.smoking * 0.5)} years`,
    bmi: values.calories > 2800 ? 'Overweight risk' : values.calories < 1500 ? 'Underweight risk' : 'Normal range',
    sleepQuality: values.sleep >= 7 && values.sleep <= 9 && values.stress < 6 ? 'Excellent' : values.sleep >= 6 ? 'Good' : 'Poor',
  }
}

export default function Simulation() {
  const nav = useNavigate()
  const [values, setValues] = useState(() => {
    const init = {}
    sliderConfigs.forEach(s => { init[s.id] = s.defaultVal })
    return init
  })

  const predictions = useMemo(() => computePredictions(values), [values])

  const handleSliderChange = (id, val) => {
    setValues(prev => ({ ...prev, [id]: parseFloat(val) }))
  }

  const handleReset = () => {
    const init = {}
    sliderConfigs.forEach(s => { init[s.id] = s.defaultVal })
    setValues(init)
  }

  const riskBadgeStyle = (risk) => {
    if (risk === 'Low' || risk === 'Excellent' || risk === 'Normal range') {
      return { color: '#047857', background: '#d1fae5', borderColor: '#6ee7b7' }
    }
    if (risk === 'Moderate' || risk === 'Good' || risk === 'Overweight risk' || risk === 'Underweight risk') {
      return { color: '#b45309', background: '#fef3c7', borderColor: '#fde68a' }
    }
    return { color: '#b91c1c', background: '#fee2e2', borderColor: '#fca5a5' }
  }

  return (
    <div className="min-h-screen p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <button
              onClick={() => nav('/dashboard')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs border border-slate-300 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:-translate-x-0.5"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-600" />
              <span>Back to Dashboard</span>
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                <span className="text-3xl">🔮</span> Future Health Simulator
              </h1>
              <p className="text-slate-600 mt-1 text-sm font-semibold">Adjust lifestyle parameters and see predicted health outcomes in real-time</p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xs transition-colors border border-slate-300 shadow-xs cursor-pointer"
          >
            ↺ Reset All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Sliders */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white/95 rounded-2xl p-6 border border-slate-200 shadow-lg">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-5">Lifestyle Parameters</h3>
              <div className="space-y-6">
                {sliderConfigs.map(config => (
                  <div key={config.id}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <span>{config.icon}</span> {config.label}
                      </label>
                      <span className="px-3 py-1 rounded-lg bg-cyan-100 text-cyan-950 border border-cyan-300 text-xs font-black">
                        {values[config.id]} {config.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={config.min}
                      max={config.max}
                      step={config.step}
                      value={values[config.id]}
                      onChange={(e) => handleSliderChange(config.id, e.target.value)}
                      className="w-full h-2.5 rounded-full appearance-none cursor-pointer accent-cyan-600 bg-slate-200 border border-slate-300"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-[11px] font-bold text-slate-600">{config.min} {config.unit}</span>
                      <span className="text-[11px] font-bold text-slate-600">{config.max} {config.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Predictions */}
          <div className="lg:col-span-2 space-y-5">
            {/* Health Score */}
            <div className="bg-white/95 rounded-2xl p-6 border border-slate-200 shadow-lg flex flex-col items-center">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4">Predicted Health Score</h3>
              <div className="relative w-36 h-36 mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle cx="60" cy="60" r="52" fill="none" strokeWidth="10" strokeLinecap="round"
                    stroke={predictions.healthScore >= 80 ? '#10b981' : predictions.healthScore >= 60 ? '#f59e0b' : '#ef4444'}
                    strokeDasharray={`${(predictions.healthScore / 100) * 327} 327`}
                    style={{ transition: 'stroke-dasharray 0.6s ease, stroke 0.6s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900">{predictions.healthScore}</span>
                  <span className="text-xs font-extrabold text-slate-600">/ 100</span>
                </div>
              </div>
            </div>

            {/* Risk Cards */}
            <div className="space-y-3">
              {[
                { label: '❤️ Heart Disease Risk', value: predictions.heartRisk },
                { label: '🍬 Diabetes Risk', value: predictions.diabetesRisk },
                { label: '⏳ Est. Life Expectancy', value: predictions.lifeExpectancy },
                { label: '⚖️ BMI Prediction', value: predictions.bmi },
                { label: '😴 Sleep Quality', value: predictions.sleepQuality },
              ].map(pred => {
                const style = riskBadgeStyle(pred.value)
                return (
                  <div key={pred.label} className="bg-white/95 rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900">{pred.label}</span>
                    <span className="text-xs font-black px-3 py-1 rounded-xl border shadow-xs" style={{
                      color: style.color,
                      backgroundColor: style.background,
                      borderColor: style.borderColor
                    }}>
                      {pred.value}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* AI Insight */}
            <div className="bg-cyan-50/90 rounded-2xl p-4 border border-cyan-200 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-xl">🤖</span>
                <div>
                  <h4 className="text-xs font-black text-cyan-950 mb-1 uppercase tracking-wider">AI Recommendation</h4>
                  <p className="text-xs text-slate-800 font-bold leading-relaxed">
                    {predictions.healthScore >= 80
                      ? 'Excellent lifestyle choices! Maintain your current routine for optimal long-term health.'
                      : predictions.healthScore >= 60
                        ? 'Good progress! Consider increasing daily exercise to 45+ minutes and reducing stress for better outcomes.'
                        : 'Action needed: Focus on improving sleep quality, reducing smoking, and increasing physical activity for significant health improvements.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
