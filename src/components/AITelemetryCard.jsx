import React, { useState } from 'react'
import { Sparkles, Bot, Brain, RefreshCw } from 'lucide-react'

export default function AITelemetryCard({
  title = "AI Telemetry & Physiological Analysis",
  promptText = "Select options above or click 'Analyse by AI Now' for real-time analysis.",
  isComplete = false,
  statusLevel = "Optimal Baseline",
  statusColor = "emerald", // 'emerald' | 'cyan' | 'amber' | 'rose'
  metrics = [], // [{ label: 'BMI', value: '22.4 kg/m²' }, ...]
  insight = "",
  onAnalyze = null,
  analyzing = false
}) {
  const [localAnalyzing, setLocalAnalyzing] = useState(false)
  const [localComplete, setLocalComplete] = useState(false)

  const isExecuting = analyzing || localAnalyzing
  const showComplete = isComplete || localComplete

  const handleRunAnalysis = () => {
    if (onAnalyze) {
      onAnalyze()
      return
    }
    setLocalAnalyzing(true)
    setTimeout(() => {
      setLocalAnalyzing(false)
      setLocalComplete(true)
    }, 1200)
  }

  const colorBadgeClasses = {
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    rose: 'bg-rose-100 text-rose-800 border-rose-200'
  }[statusColor] || 'bg-cyan-100 text-cyan-800 border-cyan-200'

  return (
    <div className="p-5 rounded-2xl border-2 border-cyan-400/50 bg-white shadow-md space-y-4 transition-all">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Brain className="w-5 h-5 animate-pulse text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">{title}</span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-600 text-white text-[9px] font-extrabold tracking-wider uppercase shadow-xs">
                AI LOGO ENGINE
              </span>
            </div>
            <p className="text-slate-600 font-semibold text-xs mt-0.5">
              {showComplete ? 'Real-time AI diagnostic telemetry and risk forecasting.' : promptText}
            </p>
          </div>
        </div>

        {/* Action Button: Always Enabled & Clickable */}
        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={isExecuting}
          style={{ backgroundColor: '#0284c7', color: '#ffffff' }}
          className="w-full sm:w-auto py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md hover:opacity-90 border border-sky-400 disabled:opacity-50 flex-shrink-0"
        >
          {isExecuting ? (
            <>
              <RefreshCw className="w-4 h-4 text-white animate-spin" />
              <span style={{ color: '#ffffff' }}>Running AI Analysis...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white fill-white" />
              <span style={{ color: '#ffffff' }}>Analyse by AI Now</span>
            </>
          )}
        </button>
      </div>

      {/* Metrics & Insight Output (Visible when complete or user clicks Analyse by AI) */}
      {showComplete && (
        <div className="space-y-3 pt-1 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Physiological Status</span>
            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${colorBadgeClasses}`}>
              {statusLevel}
            </span>
          </div>

          {/* Metric Cards Grid */}
          {metrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {metrics.map((m, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                  <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{m.label}</div>
                  <div className="text-sm font-black text-slate-900 truncate">{m.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* AI Insight Text Box */}
          {insight && (
            <div className="text-xs text-cyan-950 bg-cyan-50/90 p-3.5 rounded-xl border border-cyan-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-cyan-900">AI Physiological Insight: </span>
                <span className="leading-relaxed font-semibold text-slate-800">{insight}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
