import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Sparkles, ShieldAlert, Heart, Camera, Pill, Play, Zap, CheckCircle2, Stethoscope, Sliders } from 'lucide-react'
import { saveHealthProfile } from '../utils/storage'

export default function PitchDemoMode({ onScenarioSelect }) {
  const [activeScenario, setActiveScenario] = useState('baseline')

  const scenarios = [
    {
      id: 'cardiac',
      title: '🔴 Profile 1: Acute Ischemic Risk Monitoring',
      desc: 'Vocal acoustic biomarker cardiac risk (48%), 142 BPM, 148/94 BP, arterial strain alert',
      color: 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30',
      profile: {
        twinId: 'TWIN-99104-ALERT',
        healthScore: 68,
        personalInfo: {
          fullName: 'Marcus Vance (High Risk Profile)',
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
      title: '🟢 Profile 2: Diabetic Wound Recovery Tracking',
      desc: 'Day 12 wound trajectory, -64% surface area reduction (1.8 cm²), 92% healthy tissue',
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30',
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
          verdict: 'Rapid granulation velocity. Complete epithelial closure projected in 4 days.'
        }
      }
    },
    {
      id: 'drug',
      title: '🟣 Profile 3: Anticoagulant Interaction Screen',
      desc: 'Warfarin Sodium 5mg narrow-therapeutic index + NSAID contraindication alert',
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30',
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

  const triggerScenario = (scenario) => {
    setActiveScenario(scenario.id)
    saveHealthProfile(scenario.profile)
    if (onScenarioSelect) onScenarioSelect(scenario.profile, scenario.id)
  }

  return (
    <div className="p-4.5 rounded-3xl bg-slate-950 border-2 border-slate-800 shadow-2xl space-y-3.5 font-sans relative overflow-hidden">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2 font-display">
            <span>🏥 CLINICAL DIGITAL TWIN SIMULATION SUITE</span>
            <span
              style={{ backgroundColor: '#0284c7', color: '#ffffff' }}
              className="px-2.5 py-0.5 rounded text-xs font-black font-mono border border-cyan-300 flex items-center gap-1 shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5 text-white" />
              <span className="text-white font-black">CLINICAL PROFILES</span>
            </span>
          </span>
        </div>

        <span className="text-xs text-slate-300 font-mono font-bold">1-Click Clinical Patient Profiles</span>
      </div>

      {/* 3 Clinical Profiles Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scenarios.map(sc => {
          const isCardiac = sc.id === 'cardiac'
          const isWound = sc.id === 'wound'
          const isDrug = sc.id === 'drug'

          let containerStyle = 'bg-slate-900 border-slate-700 text-white'
          let titleStyle = 'text-slate-900 dark:text-white font-black'
          let descStyle = 'text-slate-900 dark:text-slate-100 font-extrabold'
          let badgeStyle = 'text-blue-900 dark:text-cyan-300 font-black'

          if (isCardiac) {
            containerStyle = 'bg-rose-100/95 dark:bg-rose-950/70 border-rose-300 dark:border-rose-500/60 hover:bg-rose-200'
            titleStyle = 'text-rose-950 dark:text-rose-200 font-black'
            descStyle = 'text-slate-950 dark:text-slate-100 font-extrabold'
            badgeStyle = 'text-rose-950 dark:text-rose-300 font-black'
          } else if (isWound) {
            containerStyle = 'bg-emerald-100/95 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-500/60 hover:bg-emerald-200'
            titleStyle = 'text-emerald-950 dark:text-emerald-200 font-black'
            descStyle = 'text-slate-950 dark:text-slate-100 font-extrabold'
            badgeStyle = 'text-emerald-950 dark:text-emerald-300 font-black'
          } else if (isDrug) {
            containerStyle = 'bg-purple-100/95 dark:bg-purple-950/70 border-purple-300 dark:border-purple-500/60 hover:bg-purple-200'
            titleStyle = 'text-purple-950 dark:text-purple-200 font-black'
            descStyle = 'text-slate-950 dark:text-slate-100 font-extrabold'
            badgeStyle = 'text-purple-950 dark:text-purple-300 font-black'
          }

          return (
            <motion.button
              key={sc.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => triggerScenario(sc)}
              className={`p-4 rounded-2xl border-2 transition-all text-left cursor-pointer flex flex-col justify-between ${containerStyle} ${
                activeScenario === sc.id ? 'ring-2 ring-cyan-400 scale-[1.02] shadow-xl' : ''
              }`}
            >
              <div>
                <div className={`text-xs flex items-center justify-between ${titleStyle}`}>
                  <span>{sc.title}</span>
                  {activeScenario === sc.id && <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                </div>
                <p className={`text-xs mt-1.5 leading-relaxed ${descStyle}`}>{sc.desc}</p>
              </div>

              <div className={`pt-3 text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1 ${badgeStyle}`}>
                <span>Load Profile</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
            </motion.button>
          )
        })}
      </div>

    </div>
  )
}
