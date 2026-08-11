import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronLeft, ChevronRight, HeartPulse, Activity, ShieldCheck, Zap } from 'lucide-react'

const INSIGHT_SLIDES = [
  {
    id: 1,
    category: "Cardiovascular Telemetry",
    title: "Optimal Subglottic & Arterial Perfusion",
    description: "Heart rate (76 BPM) and blood pressure (118/78 mmHg) show 98% alignment with longevity baseline.",
    badge: "Cardiac Score: 98/100",
    color: "from-cyan-500 to-blue-600",
    icon: HeartPulse
  },
  {
    id: 2,
    category: "Metabolic Glycemic Sensitivity",
    title: "Normal Fasting Glucose Baseline",
    description: "Fasting blood sugar (98 mg/dL) is within optimal insulin sensitivity range (<100 mg/dL).",
    badge: "Glycemic Index: Optimal",
    color: "from-emerald-500 to-teal-600",
    icon: Zap
  },
  {
    id: 3,
    category: "Sleep Architecture & Recovery",
    title: "Deep REM Sleep Cycle Efficiency",
    description: "7.5 hours duration with 82% sleep recovery score promotes cellular repair and brain clearance.",
    badge: "Recovery: 82%",
    color: "from-indigo-500 to-purple-600",
    icon: Activity
  },
  {
    id: 4,
    category: "Preventive Longevity Forecast",
    title: "Zero Multi-Organ Risk Escalation",
    description: "AI neural modeling predicts optimal organ function over the next 5 years with current habits.",
    badge: "5-Yr Risk: Low (4%)",
    color: "from-amber-500 to-orange-600",
    icon: ShieldCheck
  }
]

export default function InsightsCarousel(){
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % INSIGHT_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const current = INSIGHT_SLIDES[currentIndex]
  const Icon = current.icon

  return (
    <div className="w-full p-5 rounded-2xl bg-slate-900 text-white shadow-xl relative overflow-hidden border border-slate-800">
      
      {/* Background Ambient Glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin duration-3000" />
          <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
            Real-Time AI Telemetry Slide ({currentIndex + 1}/{INSIGHT_SLIDES.length})
          </span>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentIndex(prev => (prev - 1 + INSIGHT_SLIDES.length) % INSIGHT_SLIDES.length)}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer border border-slate-700"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          
          <button
            onClick={() => setCurrentIndex(prev => (prev + 1) % INSIGHT_SLIDES.length)}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer border border-slate-700"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Slide Content with Framer Motion AnimatePresence */}
      <div className="min-h-[70px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${current.color} flex items-center justify-center flex-shrink-0 shadow-md mt-0.5`}>
                <Icon className="w-5 h-5 text-white" />
              </div>

              <div>
                <div className="text-[11px] text-cyan-400 font-extrabold uppercase tracking-wider">{current.category}</div>
                <h4 className="font-extrabold text-sm text-white mt-0.5">{current.title}</h4>
                <p className="text-xs text-slate-200 font-semibold mt-1 max-w-xl leading-relaxed">{current.description}</p>
              </div>
            </div>

            <div className="flex-shrink-0">
              <span className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${current.color} text-white font-extrabold text-xs shadow-md border border-white/20`}>
                {current.badge}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {INSIGHT_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              currentIndex === idx ? 'w-6 bg-cyan-400' : 'w-1.5 bg-slate-700 hover:bg-slate-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
