import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertOctagon, PhoneCall, ShieldAlert, Activity, Navigation, Radio, CheckCircle2, X, FileText } from 'lucide-react'
import { getHealthProfile } from '../utils/storage'

export default function EmergencyDispatchModal({ isOpen, onClose, patientName, hr = 112, hospitalName }) {
  const [eta, setEta] = useState(342) // seconds (05:42)

  const profile = getHealthProfile() || {}
  const rawName = patientName || profile?.personalInfo?.fullName || 'Ava Nguyen'
  const cleanPatientName = rawName.split('(')[0].trim()
  const city = profile?.personalInfo?.city || profile?.personalInfo?.location || ''

  // Resolve Hospital based on city/location
  let targetHospital = hospitalName
  if (!targetHospital) {
    if (city.toLowerCase().includes('chennai') || city.toLowerCase().includes('tamil')) {
      targetHospital = 'Apollo Heart & Vascular Emergency, Greams Road'
    } else if (city.toLowerCase().includes('mumbai')) {
      targetHospital = 'Asian Heart Institute Emergency ER, Mumbai'
    } else if (city.toLowerCase().includes('bangalore') || city.toLowerCase().includes('bengaluru')) {
      targetHospital = 'Fortis Heart & Cardiac Emergency, Bengaluru'
    } else if (city.toLowerCase().includes('delhi')) {
      targetHospital = 'AIIMS Cardiac Emergency Center, New Delhi'
    } else {
      targetHospital = 'Metropolitan Heart & Vascular Emergency Center'
    }
  }

  // Realistic attending cardiologist (never same as patient name)
  const attendingCardiologist = cleanPatientName.includes('Rajesh') 
    ? 'Dr. Aris Vance, MD, FACC' 
    : 'Dr. Rajesh K. Sharma, MD, FACC (Chief Interventional Cardiologist)'

  const hrValue = Number(hr) || 112
  const hrDiagnosis = hrValue >= 100 
    ? `${hrValue} BPM (Sinus Tachycardia - High Risk)` 
    : `${hrValue} BPM (Normal Sinus Rhythm)`

  useEffect(() => {
    if (!isOpen) return
    setEta(342)

    const timer = setInterval(() => {
      setEta(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  if (!isOpen) return null

  const formatEta = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-300 font-sans overflow-y-auto">
      
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border-2 border-rose-500/80 shadow-2xl overflow-y-auto max-h-[90vh] text-white p-6 space-y-6 relative">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/30 animate-pulse">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2 font-display">
                <span>AUTOMATED ER TELE-DISPATCH SYSTEM</span>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              </h3>
              <p className="text-xs text-rose-400 font-medium">911 Paramedic Unit & Cardiology Pre-Arrival Link</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ETA & Ambulance Dispatch Card */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-extrabold">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Navigation className="w-4 h-4 animate-spin" />
              <span>AMBULANCE SQUAD #402 IN TRANSIT</span>
            </span>
            <span className="text-rose-400 font-mono">DISTANCE: 1.2 MILES</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Estimated Arrival (ETA)</div>
              <div className="text-4xl font-black text-white font-mono mt-0.5">{formatEta(eta)}</div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Destination Hospital</div>
              <div className="text-xs font-extrabold text-cyan-400 font-display mt-0.5 max-w-[240px] leading-tight">
                {targetHospital}
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div className="w-[65%] bg-gradient-to-r from-rose-500 to-cyan-400 h-full rounded-full animate-pulse" />
          </div>
        </div>

        {/* Pre-Arrival Digital Twin Telemetry Transmission Status */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="text-xs font-extrabold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>LIVE TELEMETRY STREAM TO PARAMEDIC DASHBOARD</span>
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">
              256-BIT ENCRYPTED
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Patient Identity:</span>
              <span className="font-bold text-white text-xs">{cleanPatientName}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Telemetry HR Spike:</span>
              <span className={`font-bold text-xs ${hrValue >= 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {hrDiagnosis}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Attending Cardiologist:</span>
              <span className="font-bold text-cyan-400 text-xs">{attendingCardiologist}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-extrabold text-xs cursor-pointer shadow-lg transition-all"
          >
            Dismiss Emergency Alert
          </button>
          
          <button
            onClick={onClose}
            className="py-3.5 px-4 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Synced to EHR Audit Trail</span>
          </button>
        </div>

      </div>

    </div>
  )
}
