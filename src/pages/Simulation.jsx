import React, { useState, useMemo } from 'react'

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
  const [values, setValues] = useState(() => {
    const init = {}
    sliderConfigs.forEach(s => { init[s.id] = s.defaultVal })
    return init
  })
  const [comparing, setComparing] = useState(false)

  const predictions = useMemo(() => computePredictions(values), [values])

  const handleSliderChange = (id, val) => {
    setValues(prev => ({ ...prev, [id]: parseFloat(val) }))
  }

  const handleReset = () => {
    const init = {}
    sliderConfigs.forEach(s => { init[s.id] = s.defaultVal })
    setValues(init)
  }

  const riskColor = (risk) =>
    risk === 'Low' ? '#34d399' : risk === 'Moderate' ? '#fbbf24' : '#ef4444'

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🔮</span> Future Health Simulator
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Adjust lifestyle parameters and see predicted health outcomes in real-time</p>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-white/5 text-sm font-semibold text-slate-400 hover:bg-white/10 transition-colors"
          >
            ↺ Reset All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Sliders */}
          <div className="lg:col-span-3 space-y-4">
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">Lifestyle Parameters</h3>
              <div className="space-y-6">
                {sliderConfigs.map(config => (
                  <div key={config.id}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-white flex items-center gap-2">
                        <span>{config.icon}</span> {config.label}
                      </label>
                      <span className="px-3 py-1 rounded-lg bg-white/5 text-sm font-bold text-cyan-400">
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
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #22d3ee ${((values[config.id] - config.min) / (config.max - config.min)) * 100}%, rgba(255,255,255,0.05) ${((values[config.id] - config.min) / (config.max - config.min)) * 100}%)`,
                      }}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-slate-600">{config.min} {config.unit}</span>
                      <span className="text-[10px] text-slate-600">{config.max} {config.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Predictions */}
          <div className="lg:col-span-2 space-y-5">
            {/* Health Score */}
            <div className="glass rounded-2xl p-6 border border-white/5 flex flex-col items-center">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Predicted Health Score</h3>
              <div className="relative w-32 h-32 mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle cx="60" cy="60" r="52" fill="none" strokeWidth="10" strokeLinecap="round"
                    stroke={predictions.healthScore >= 80 ? '#34d399' : predictions.healthScore >= 60 ? '#fbbf24' : '#ef4444'}
                    strokeDasharray={`${(predictions.healthScore / 100) * 327} 327`}
                    style={{ transition: 'stroke-dasharray 0.6s ease, stroke 0.6s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">{predictions.healthScore}</span>
                  <span className="text-[10px] text-slate-400">/ 100</span>
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
              ].map(pred => (
                <div key={pred.label} className="glass rounded-xl p-4 border border-white/5 flex items-center justify-between">
                  <span className="text-sm text-slate-300">{pred.label}</span>
                  <span className="text-sm font-bold px-3 py-1 rounded-lg" style={{
                    color: riskColor(pred.value),
                    background: `${riskColor(pred.value)}15`
                  }}>
                    {pred.value}
                  </span>
                </div>
              ))}
            </div>

            {/* AI Insight */}
            <div className="glass rounded-2xl p-4 border border-cyan-500/15">
              <div className="flex items-start gap-3">
                <span className="text-lg">🤖</span>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">AI Recommendation</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
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
