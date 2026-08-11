import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, Sparkles, Activity, Mic, Camera, FileText, ShieldCheck, 
  ChevronUp, ChevronDown, CheckCircle2, Play, Moon, Sun, X, Zap 
} from 'lucide-react'
import { saveHealthProfile } from '../utils/storage'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function JudgesHackathonDock() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeProfileId, setActiveProfileId] = useState('cardiac')
  const [toastMessage, setToastMessage] = useState('')
  const nav = useNavigate()
  const { guestLogin, setHealthProfile } = useAuth()
  const { theme, toggleTheme, isLight } = useTheme()

  const scenarios = [
    {
      id: 'cardiac',
      title: '🔴 Acute Ischemia Alert',
      desc: '112 BPM • 148/94 BP • 48% Vocal Cardiac Risk',
      profile: {
        twinId: 'TWIN-99104-ALERT',
        healthScore: 68,
        personalInfo: {
          fullName: 'Marcus Vance (Cardiac Risk Profile)',
          age: 58,
          gender: 'Male',
          height: 178,
          weight: 88,
          bloodGroup: 'A+',
          location: 'San Francisco, CA'
        },
        vitals: { heartRate: 112, systolic: 148, diastolic: 94, glucose: 142, spo2: 93 },
        risks: [
          { name: 'Cardiovascular Risk', level: 'High Risk', score: '78%' },
          { name: 'Hypertension Stage 2', level: 'High Risk', score: '82%' }
        ],
        voiceScanResult: {
          cardiacRiskProb: 48,
          riskLevel: 'High Risk',
          vocalJitter: '1.82% (Elevated)',
          acousticShimmer: '4.5% (High)',
          fundamentalFreq: '198 Hz (Unstable)',
          verdict: 'CRITICAL WARNING: Acoustic biomarkers of acute myocardial ischemia detected.'
        }
      }
    },
    {
      id: 'wound',
      title: '🟢 Diabetic Wound Closure',
      desc: 'Day 12 Wound • 92% Granulation • 1.8 cm²',
      profile: {
        twinId: 'TWIN-77402-WOUND',
        healthScore: 91,
        personalInfo: {
          fullName: 'Elena Rostova (Wound Recovery Profile)',
          age: 44,
          gender: 'Female',
          height: 165,
          weight: 62,
          bloodGroup: 'B+',
          location: 'San Jose, CA'
        },
        vitals: { heartRate: 72, systolic: 116, diastolic: 76, glucose: 104, spo2: 99 },
        woundScanResult: {
          area: '1.8 cm²',
          granulationPct: '92% Healthy Granulation',
          infectionRisk: '0.5% — Optimal',
          tissueType: 'Epithelial Edge Bridging',
          verdict: 'Rapid granulation velocity. Complete closure projected in 4 days.'
        }
      }
    },
    {
      id: 'drug',
      title: '🟣 Pharmacology Contraindication',
      desc: 'Warfarin Sodium 5mg + NSAID Danger Alert',
      profile: {
        twinId: 'TWIN-50493-PHARMA',
        healthScore: 82,
        personalInfo: {
          fullName: 'Sarah Jenkins (Pharmacology Profile)',
          age: 52,
          gender: 'Female',
          height: 168,
          weight: 65,
          bloodGroup: 'AB+',
          location: 'Oakland, CA'
        },
        vitals: { heartRate: 80, systolic: 124, diastolic: 82, glucose: 110, spo2: 97 },
        medicineScanResult: {
          name: 'Warfarin Sodium 5mg',
          category: 'Anticoagulant (Blood Thinner)',
          dangerLevel: 'CRITICAL',
          whenToTake: { exactTime: '8:00 PM Bedtime' },
          verdict: 'CRITICAL INTERACTION WARNING: High potency anticoagulant. Do not combine with Aspirin/NSAIDs.'
        }
      }
    }
  ]

  const handleLoadScenario = (sc, route = '/dashboard') => {
    guestLogin?.()
    saveHealthProfile(sc.profile)
    setHealthProfile?.(sc.profile)
    setActiveProfileId(sc.id)
    setToastMessage(`✓ Loaded ${sc.title}!`)
    setTimeout(() => setToastMessage(''), 2500)
    nav(route)
  }

  const handleNavFeature = (route) => {
    guestLogin?.()
    nav(route)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans select-none">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-2.5 px-4 py-2 rounded-2xl bg-cyan-600 text-white font-extrabold text-xs shadow-2xl border border-cyan-400 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Hackathon Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            className="mb-3 w-80 sm:w-96 rounded-3xl bg-slate-900/95 border-2 border-cyan-500/50 p-5 shadow-2xl text-white backdrop-blur-2xl space-y-4 shadow-cyan-500/20"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5 font-display">
                    <span>Hackathon Demo Dock</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono border border-cyan-500/30">
                      LIVE AI
                    </span>
                  </h4>
                  <p className="text-[10px] text-slate-400">1-Click Scenarios for Hackathon Judges</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Close Dock"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 1-Click Clinical Scenario Loaders */}
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                Select Clinical Preset:
              </div>

              <div className="space-y-1.5">
                {scenarios.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => handleLoadScenario(sc)}
                    className={`w-full p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      activeProfileId === sc.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-xs flex items-center gap-1.5">
                        <span>{sc.title}</span>
                        {activeProfileId === sc.id && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{sc.desc}</div>
                    </div>
                    <Play className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Launch Shortcuts */}
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <div className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                Quick Feature Launch:
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleNavFeature('/voice-analysis')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-cyan-400" />
                  <span>🎙️ Voice AI</span>
                </button>

                <button
                  onClick={() => handleNavFeature('/wound-tracker')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>👁️ Wound AI</span>
                </button>

                <button
                  onClick={() => handleNavFeature('/consultation')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>📄 AI Doctor</span>
                </button>

                <button
                  onClick={() => handleNavFeature('/admin')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>🔒 Admin Vault</span>
                </button>
              </div>
            </div>

            {/* Theme Toggle Bar */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Website Theme Mode:</span>
              <button
                onClick={toggleTheme}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-extrabold flex items-center gap-1.5 cursor-pointer"
              >
                {isLight ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{isLight ? 'Serene Pastel ☀️' : 'Midnight Cyber 🌙'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white font-black text-xs shadow-2xl shadow-cyan-500/40 border-2 border-cyan-400/60 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer animate-pulse"
        title="Open Hackathon Demo Controls"
      >
        <Trophy className="w-4 h-4 text-amber-300 animate-bounce" />
        <span>🏆 Hackathon Demo Dock</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>
    </div>
  )
}
