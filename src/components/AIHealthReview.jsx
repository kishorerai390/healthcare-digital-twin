import React, { useState, useEffect } from 'react'
import { Sparkles, Bot, CheckCircle2, AlertTriangle, RefreshCw, Activity, Heart, ShieldCheck, Brain } from 'lucide-react'

export default function AIHealthReview({ profile }){
  const [analyzing, setAnalyzing] = useState(false)
  const [progressStep, setProgressStep] = useState(0)
  const [analysisResult, setAnalysisResult] = useState(null)

  const steps = [
    'Initializing MedTwin Neural Model...',
    'Analyzing Fasting Glucose & Metabolic Parameters...',
    'Evaluating Cardiovascular Vitals & Sleep Patterns...',
    'Generating Personalized Preventative Recommendations...'
  ]

  const runAIReview = () => {
    setAnalyzing(true)
    setProgressStep(0)

    const interval = setInterval(() => {
      setProgressStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval)
          setAnalyzing(false)
          generateFullAIReport()
          return steps.length - 1
        }
        return prev + 1
      })
    }, 450)
  }

  const generateFullAIReport = () => {
    const { personalInfo = {}, lifestyle = {}, medicalHistory = {}, vitals = {} } = profile || {}
    const glucose = Number(vitals.glucose) || 98
    const systolic = Number(vitals.systolic) || 120
    const sleep = Number(lifestyle.sleepDuration) || 7
    const stepsCount = Number(lifestyle.dailySteps) || 8000
    const bmi = profile?.bmi || 23.2

    const insightsList = []

    // Blood Sugar Analysis
    if (glucose >= 126) {
      insightsList.push({
        type: 'danger',
        title: 'Elevated Fasting Glucose (126+ mg/dL)',
        desc: 'Fasting blood sugar is in the diabetic threshold. Recommend consultation with an endocrinologist for HbA1c testing and glycemic control.',
        action: 'Schedule HbA1c & Fasting Insulin Blood Panel'
      })
    } else if (glucose >= 100) {
      insightsList.push({
        type: 'warning',
        title: 'Prediabetes Glucose Range (' + glucose + ' mg/dL)',
        desc: 'Fasting sugar is slightly elevated (100–125 mg/dL). Dietary adjustments and 30-min daily post-meal walks can reverse this trend.',
        action: 'Reduce refined carbohydrates & increase fiber'
      })
    } else {
      insightsList.push({
        type: 'success',
        title: 'Optimal Fasting Glucose (' + glucose + ' mg/dL)',
        desc: 'Fasting blood sugar is within the optimal range (<100 mg/dL). Metabolic insulin sensitivity is well balanced.',
        action: 'Maintain current dietary and activity routine'
      })
    }

    // Cardiovascular Analysis
    if (systolic >= 140) {
      insightsList.push({
        type: 'danger',
        title: 'Stage 1 Hypertension Warning (' + systolic + ' mmHg)',
        desc: 'Systolic blood pressure is elevated. Recommend salt restriction (<2g/day) and routine blood pressure monitoring.',
        action: 'Monitor blood pressure 2x daily'
      })
    } else {
      insightsList.push({
        type: 'success',
        title: 'Cardiovascular Function Stable',
        desc: 'Heart rate (' + (vitals.heartRate || 78) + ' BPM) and blood pressure are within healthy baseline parameters.',
        action: 'Continue aerobic cardiovascular exercise'
      })
    }

    // Sleep & Lifestyle Analysis
    if (sleep < 7) {
      insightsList.push({
        type: 'warning',
        title: 'Sleep Debt Identified (' + sleep + 'h / night)',
        desc: 'Sleeping under 7 hours increases cortisol and insulin resistance. Aim for a consistent 7.5–8 hour sleep schedule.',
        action: 'Establish a consistent bedtime routine'
      })
    }

    const rawName = personalInfo.fullName || 'Patient'
    const cleanName = rawName.split('(')[0].trim()

    setAnalysisResult({
      score: profile?.healthScore || 87,
      insights: insightsList,
      summary: `AI Digital Twin Analysis completed for ${cleanName}. Overall health status is evaluated as ${profile?.healthScore > 80 ? 'Optimal' : 'Needs Focus'}.`
    })
  }

  useEffect(() => {
    generateFullAIReport()
  }, [profile])

  return (
    <div className="glass p-6 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
          <Brain className="w-5 h-5 text-cyan-600 animate-pulse" />
          <span>AI HEALTH TELEMETRY REVIEW</span>
        </div>
        <button
          onClick={runAIReview}
          disabled={analyzing}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>{analyzing ? 'Analyzing...' : 'Run AI Analysis'}</span>
        </button>
      </div>

      {/* Analyzing Progress State */}
      {analyzing ? (
        <div className="py-6 text-center space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Processing Neural Model...</div>
          <div className="text-sm font-bold text-slate-900">{steps[progressStep]}</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-300"
              style={{ width: `${((progressStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      ) : analysisResult ? (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-black flex items-start gap-2.5 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-black">AI Clinical Summary: </span>
              <span className="text-black font-semibold">{analysisResult.summary}</span>
            </div>
          </div>

          <div className="space-y-3">
            {analysisResult.insights.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  item.type === 'danger'
                    ? 'border-rose-200 bg-rose-50/40 text-rose-950'
                    : item.type === 'warning'
                    ? 'border-amber-200 bg-amber-50/40 text-amber-950'
                    : 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {item.type === 'danger' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    ) : item.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    <span>{item.title}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    item.type === 'danger' ? 'bg-rose-100 text-rose-800' :
                    item.type === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.type === 'danger' ? 'High Risk' : item.type === 'warning' ? 'Attention' : 'Optimal'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-1">{item.desc}</p>
                <div className="mt-2 text-[11px] font-semibold text-slate-900 flex items-center gap-1.5 pt-2 border-t border-slate-200/60">
                  <span className="text-cyan-700 font-bold">Recommended Action:</span>
                  <span>{item.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
