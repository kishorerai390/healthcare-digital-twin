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
    <div className="w-full p-6 rounded-3xl bg-slate-950 text-white shadow-2xl relative overflow-hidden border-2 border-slate-800">
      
      {/* Background Ambient Glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin duration-3000" />
          <span className="text-xs font-black uppercase tracking-wider text-cyan-400 font-mono">
            Real-Time AI Telemetry Slide ({currentIndex + 1}/{INSIGHT_SLIDES.length})
          </span>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentIndex(prev => (prev - 1 + INSIGHT_SLIDES.length) % INSIGHT_SLIDES.length)}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer border border-slate-700 shadow-sm"
            title="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          <button
            onClick={() => setCurrentIndex(prev => (prev + 1) % INSIGHT_SLIDES.length)}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer border border-slate-700 shadow-sm"
            title="Next Slide"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Slide Content with Framer Motion AnimatePresence */}
      <div className="min-h-[80px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${current.color} flex items-center justify-center flex-shrink-0 shadow-lg mt-0.5 border border-white/20`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              <div>
                <div className="text-xs text-cyan-300 font-mono font-black uppercase tracking-wider">{current.category}</div>
                <h4 className="font-black text-base sm:text-lg text-white mt-0.5 tracking-tight">{current.title}</h4>
                <p className="text-sm text-slate-100 font-bold mt-1 max-w-xl leading-relaxed">{current.description}</p>
              </div>
            </div>

            <div className="flex-shrink-0">
              <span className={`px-4 py-2 rounded-xl bg-gradient-to-r ${current.color} text-white font-black text-xs shadow-lg border border-white/30`}>
                {current.badge}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {INSIGHT_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              currentIndex === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
