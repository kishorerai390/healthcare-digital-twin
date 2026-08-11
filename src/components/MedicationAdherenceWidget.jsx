import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pill, CheckCircle2, RefreshCcw, Clock, AlertTriangle, ShieldCheck, ShoppingCart, Sparkles } from 'lucide-react'

const DAILY_MEDS = [
  { id: 1, name: 'Warfarin Sodium', dose: '5mg', time: '8:00 PM Bedtime', taken: true, category: 'Anticoagulant' },
  { id: 2, name: 'Atorvastatin', dose: '20mg', time: '9:00 PM Bedtime', taken: false, category: 'Statins' },
  { id: 3, name: 'Omega-3 Fish Oil', dose: '1000mg', time: '8:00 AM Morning', taken: true, category: 'Supplement' }
]

export default function MedicationAdherenceWidget() {
  const [meds, setMeds] = useState(DAILY_MEDS)
  const [refillStatus, setRefillStatus] = useState(null)
  const [streak, setStreak] = useState(14)

  const toggleMedTaken = (id) => {
    setMeds(prev => prev.map(m => {
      if (m.id === id) {
        const nextState = !m.taken
        if (nextState) setStreak(s => s + 1)
        return { ...m, taken: nextState }
      }
      return m
    }))
  }

  const handleRequestRefill = (medName) => {
    setRefillStatus(`Processing 1-click pharmacy refill for ${medName}...`)
    setTimeout(() => {
      setRefillStatus(`✓ Refill order placed with CVS Pharmacy! Estimated pickup: Tomorrow 10:00 AM.`)
      setTimeout(() => setRefillStatus(null), 4000)
    }, 1500)
  }

  const completedCount = meds.filter(m => m.taken).length
  const totalCount = meds.length
  const pct = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="p-6 rounded-3xl bg-white text-slate-800 border border-slate-200 shadow-xl space-y-4 font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {refillStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 animate-spin" />
              <span>{refillStatus}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <span>Daily Medication Adherence</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black font-mono">
                {streak} Day Streak 🔥
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">Track doses & request 1-click pharmacy refills</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xl font-black text-blue-700 font-mono">{pct}%</span>
          <span className="text-[10px] text-slate-400 block font-semibold">Completed Today</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-600 to-teal-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Medication Item List */}
      <div className="space-y-2.5">
        {meds.map(med => (
          <div
            key={med.id}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              med.taken
                ? 'bg-slate-50 border-slate-200 text-slate-600'
                : 'bg-sky-50/60 border-sky-200 text-slate-900 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleMedTaken(med.id)}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition cursor-pointer ${
                  med.taken
                    ? 'bg-emerald-500 text-white'
                    : 'border-2 border-slate-300 hover:border-blue-500 bg-white'
                }`}
              >
                {med.taken && <CheckCircle2 className="w-4 h-4" />}
              </button>

              <div>
                <strong className={`text-xs block ${med.taken ? 'line-through text-slate-400' : 'text-slate-900 font-extrabold'}`}>
                  {med.name} {med.dose}
                </strong>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-600" />
                  <span>{med.time} • {med.category}</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => handleRequestRefill(med.name)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[11px] transition shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <ShoppingCart className="w-3 h-3 text-blue-600" />
              <span>Refill</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}
