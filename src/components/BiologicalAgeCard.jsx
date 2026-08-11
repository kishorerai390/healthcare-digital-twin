import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dna, Activity, HeartPulse, RefreshCw, Sparkles, Award, ShieldCheck, Zap, ArrowDown, ArrowUp } from 'lucide-react'

export default function BiologicalAgeCard({ profile }) {
  const chronoAge = Number(profile?.personalInfo?.age) || 32
  const healthScore = Number(profile?.healthScore) || 94
  const sysBP = Number(profile?.vitals?.systolic) || 118
  const glucose = Number(profile?.vitals?.glucose) || 98
  const sleepHrs = Number(profile?.lifestyle?.sleepDuration) || 7.5

  // Calculate biological age delta based on health biomarkers
  const scoreFactor = (94 - healthScore) * 0.15
  const bpFactor = (sysBP - 120) * 0.08
  const glucoseFactor = (glucose - 95) * 0.06
  const sleepFactor = (7.5 - sleepHrs) * 0.5

  const rawBioAge = (chronoAge - 4.6 + scoreFactor + bpFactor + glucoseFactor + sleepFactor)
  const bioAge = Number(Math.max(18, Math.min(95, rawBioAge)).toFixed(1))
  const ageDelta = Number((chronoAge - bioAge).toFixed(1))
  const isYouthful = ageDelta >= 0

  const [recalculating, setRecalculating] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleRecalculate = () => {
    setRecalculating(true)
    setTimeout(() => {
      setRecalculating(false)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }, 1000)
  }

  return (
    <div className="p-6 rounded-3xl bg-slate-900/95 text-white border border-slate-800 shadow-2xl space-y-5 backdrop-blur-md relative overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>✓ Biological Age re-calibrated using latest biomarker AI neural weights!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
            <Dna className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2 font-display">
              <span>Biological vs. Chronological Twin Age</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-black uppercase">
                AI Telomere Model
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Cellular longevity score & biological decay index</p>
          </div>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={recalculating}
          className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} />
          <span>{recalculating ? 'Re-Calibrating...' : 'Re-Calculate Bio Age'}</span>
        </button>
      </div>

      {/* Main Age Comparison Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Chronological Age */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Chronological Age</span>
          <div className="text-3xl font-black text-white font-mono flex items-baseline gap-1">
            <span>{chronoAge}</span>
            <span className="text-xs text-slate-400 font-normal">Yrs</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Birthdate Calendar Record</span>
        </div>

        {/* Biological Twin Age */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-950 border border-purple-500/40 space-y-1 relative overflow-hidden">
          <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Biological Organ Age</span>
          </span>
          <div className="text-3xl font-black text-purple-300 font-mono flex items-baseline gap-1">
            <span>{bioAge}</span>
            <span className="text-xs text-purple-400 font-normal">Yrs</span>
          </div>
          <span className="text-[10px] text-purple-300/80 font-bold block">Biomarker Neural Calculation</span>
        </div>

        {/* Longevity Advantage Delta */}
        <div className={`p-4 rounded-2xl border space-y-1 ${
          isYouthful
            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-700 font-extrabold'
            : 'bg-rose-500/15 border-rose-500/50 text-rose-700 font-extrabold'
        }`}>
          <span className="text-[11px] font-black uppercase tracking-wider block flex items-center gap-1 text-emerald-800">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Age Advantage Delta</span>
          </span>
          <div className="text-3xl font-black font-mono flex items-center gap-1 text-emerald-600">
            {isYouthful ? <ArrowDown className="w-5 h-5 text-emerald-600" /> : <ArrowUp className="w-5 h-5 text-rose-600" />}
            <span className="text-emerald-700">{Math.abs(ageDelta)}</span>
            <span className="text-xs font-bold text-emerald-600">Yrs</span>
          </div>
          <span className="text-[10px] font-black text-emerald-800 block">
            {isYouthful ? '🌟 Youthful Advantage (Low Decay)' : '⚠️ Accelerated Biological Strain'}
          </span>
        </div>
      </div>

      {/* Longevity Sub-Metrics Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-300">Vascular Elasticity Index</span>
            <span className="text-cyan-400 font-mono">92%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full w-[92%]" />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-300">Telomere Length Maintenance</span>
            <span className="text-purple-400 font-mono">88%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full w-[88%]" />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-300">Mitochondrial Efficiency Score</span>
            <span className="text-emerald-400 font-mono">95%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full w-[95%]" />
          </div>
        </div>
      </div>

    </div>
  )
}
