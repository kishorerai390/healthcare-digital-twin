import React, { useState } from 'react'
import { Activity, ShieldCheck, Heart, Brain, Wind, Droplet, Sparkles, X, ChevronRight, Cpu, CheckCircle2 } from 'lucide-react'

const ORGANS = [
  {
    id: 'brain',
    name: 'Brain & Central Nervous System',
    img: '/assets/organs/brain.png',
    pos: { top: '20%', left: '50%' },
    status: 'NORMAL (Focus 96%)',
    condition: 'Normal Neurological & Synaptic State',
    score: 96,
    normalRange: 'Alpha Wave 8–12 Hz • Neural Sync > 95% • Stress < 25%',
    metrics: [
      { label: 'Cognitive Stress', value: 'Low (18%)', normal: '< 25%' },
      { label: 'Neural Connectivity', value: '98% Sync', normal: '95–100%' },
      { label: 'REM Sleep Recovery', value: '7.5 Hours', normal: '7.0–9.0 hrs' }
    ],
    desc: 'Cortical alpha rhythm, neural synaptic transmission, and autonomic nerve regulation are operating within 100% healthy, normal physiological limits with zero detected anomalies.'
  },
  {
    id: 'heart',
    name: 'Heart & Cardiovascular System',
    img: '/assets/organs/heart.png',
    pos: { top: '38%', left: '44%' },
    status: 'NORMAL (Sinus Rhythm 92%)',
    condition: 'Normal Cardiac Perfusion & Pericardial Function',
    score: 92,
    normalRange: 'Heart Rate 60–100 BPM • BP < 120/80 mmHg • Ejection > 55%',
    metrics: [
      { label: 'Resting Heart Rate', value: '78 BPM', normal: '60–100 BPM' },
      { label: 'Blood Pressure', value: '118/78 mmHg', normal: '< 120/80 mmHg' },
      { label: 'Cardiac Output', value: '5.2 L/min', normal: '4.0–8.0 L/min' }
    ],
    desc: 'Normal sinus rhythm with optimal myocardial contraction. Coronary arterial perfusion and blood pressure remain strictly within standard healthy baseline limits.'
  },
  {
    id: 'lungs',
    name: 'Lungs & Pulmonary System',
    img: '/assets/organs/lungs.png',
    pos: { top: '38%', left: '58%' },
    status: 'NORMAL (SpO2 98%)',
    condition: 'Normal Pulmonary Gas Exchange & Airway Perfusion',
    score: 95,
    normalRange: 'SpO2 95–100% • Resp Rate 12–20 bpm • Clear Vesicular Sounds',
    metrics: [
      { label: 'Blood Oxygen (SpO2)', value: '98%', normal: '95–100%' },
      { label: 'Respiratory Rate', value: '16 bpm', normal: '12–20 bpm' },
      { label: 'Pulmonary Airflow', value: 'Clear / Optimal', normal: 'Unobstructed' }
    ],
    desc: 'Alveolar oxygen diffusion and chest expansion are in 100% normal condition. Pulmonary airways show zero inflammation, fluid retention, or breathing obstruction.'
  },
  {
    id: 'metabolism',
    name: 'Metabolism & Digestive System',
    img: '/assets/organs/metabolism.png',
    pos: { top: '56%', left: '50%' },
    status: 'NORMAL (Glycemic Index 89%)',
    condition: 'Normal Hepatic & Metabolic Homeostasis',
    score: 89,
    normalRange: 'Fasting Glucose 70–99 mg/dL • ALT 7–56 U/L • Balanced BMR',
    metrics: [
      { label: 'Fasting Glucose', value: '98 mg/dL', normal: '70–99 mg/dL' },
      { label: 'Est. Daily BMR', value: '1,620 kcal', normal: '1,500–2,000 kcal' },
      { label: 'Lipid Balance', value: 'Normal Profile', normal: '< 200 mg/dL' }
    ],
    desc: 'Hepatic enzyme levels, gastrointestinal absorption, and insulin sensitivity operate in a completely normal, balanced metabolic state.'
  }
]

export default function DigitalTwin({ compact = false, healthScore = 94, riskAssessment = 'Optimal' }) {
  const [selectedOrgan, setSelectedOrgan] = useState(null)

  return (
    <div className="w-full max-w-md p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-cyan-500/20 relative overflow-hidden backdrop-blur-xl group transition-all select-none">
      
      {/* Top Header Badge */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">3D HOLOGRAM AVATAR</div>
          <div className="text-xl font-extrabold text-white">Living Digital Twin</div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold border border-emerald-500/30 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Active Model
        </span>
      </div>

      {/* Hologram Image Container */}
      <div className={`relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 ${compact ? 'h-56' : 'h-72'} group-hover:shadow-lg transition flex items-center justify-center`}>
        <img
          src="/assets/medical_twin_hologram.png"
          alt="3D Hologram Digital Twin Avatar"
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
        />

        {/* 3D Scanning Laser Line Animation */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse top-1/2 pointer-events-none shadow-[0_0_15px_#22d3ee]" />

        {/* Floating Organ Badges for Interactive Modal */}
        {ORGANS.map((organ) => {
          const isSelected = selectedOrgan?.id === organ.id
          return (
            <div
              key={organ.id}
              style={{ top: organ.pos.top, left: organ.pos.left }}
              onClick={() => setSelectedOrgan(organ)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/organ z-20"
              title={`Click to inspect normal condition of ${organ.name}`}
            >
              <div
                className={`relative rounded-full p-1 bg-slate-900/80 backdrop-blur-md border transition-all duration-300 transform group-hover/organ:scale-125 ${
                  isSelected
                    ? 'border-cyan-400 scale-125 shadow-[0_0_20px_rgba(34,211,238,0.9)] ring-2 ring-cyan-400/50'
                    : 'border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(34,211,238,0.6)]'
                }`}
              >
                <img
                  src={organ.img}
                  alt={organ.name}
                  className="w-7 h-7 object-contain rounded-full"
                />
                <span className="absolute -inset-1 rounded-full border border-emerald-400/50 animate-ping pointer-events-none opacity-75"></span>
              </div>
            </div>
          )
        })}

        {/* Bottom Image Overlay Bar */}
        <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800 flex items-center justify-between text-xs z-10">
          <span className="text-white font-bold flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Organ Telemetry Active</span>
          </span>
          <span className="text-white font-mono font-extrabold">98.4% Accuracy</span>
        </div>
      </div>

      {/* Bottom Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 pt-4 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
          <div className="text-white font-semibold">Organ Health Score</div>
          <div className="text-2xl font-extrabold text-white mt-0.5">{healthScore} / 100</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
          <div className="text-white font-semibold">Risk Assessment</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">{riskAssessment}</div>
        </div>
      </div>

      {/* Interactive Modal Popup Window for Organ Normal Condition */}
      {selectedOrgan && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setSelectedOrgan(null)}
        >
          <div
            className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl max-w-md w-full p-5 text-white space-y-3.5 relative max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-950 to-cyan-950 border border-cyan-500/30 flex items-center justify-center p-1.5 shadow-lg flex-shrink-0">
                  <img src={selectedOrgan.img} alt="" className="w-8 h-8 object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>NORMAL CONDITION</span>
                    </span>
                  </div>
                  <h3 className="font-extrabold text-white text-base leading-tight mt-1 truncate">{selectedOrgan.name}</h3>
                  <p className="text-[11px] text-cyan-400 font-semibold truncate">{selectedOrgan.condition}</p>
                </div>
              </div>

              {/* Top Right Close Button */}
              <button
                onClick={() => setSelectedOrgan(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-white border border-slate-700 hover:border-rose-500/50 transition-colors shadow-md flex-shrink-0 cursor-pointer"
                title="Close Modal"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Score & Normal Range Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-200">Physiological Score</span>
                <span className="text-emerald-400 font-black">{selectedOrgan.score} / 100 (100% Normal)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full"
                  style={{ width: `${selectedOrgan.score}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono pt-0.5 leading-tight">
                <span className="text-cyan-400 font-bold">Baseline Range:</span> {selectedOrgan.normalRange}
              </div>
            </div>

            {/* Real-time Metrics & Normal Reference Table */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">Vitals vs Healthy Baseline</span>
                <span className="text-[10px] text-emerald-400 font-bold">✓ Parameters Normal</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {selectedOrgan.metrics.map((m, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-0.5">
                    <div className="text-slate-400 text-[10px] truncate">{m.label}</div>
                    <div className="font-extrabold text-white text-xs truncate">{m.value}</div>
                    <div className="text-[9px] text-emerald-400 font-bold flex items-center gap-1 pt-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">Ref: {m.normal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Normal Clinical Diagnosis Summary */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-white space-y-1">
              <div className="font-extrabold text-emerald-400 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Normal Assessment:</span>
              </div>
              <p className="leading-relaxed text-slate-200 text-[11px]">{selectedOrgan.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

