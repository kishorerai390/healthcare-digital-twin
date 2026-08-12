import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, Mic, MicOff, PhoneOff, Sparkles, ShieldCheck, Activity, Volume2, Maximize2 } from 'lucide-react'

export default function AIVideoConsultModal({ doctor, isOpen, onClose }) {
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [activeSpeech, setActiveSpeech] = useState('Initializing 256-bit encrypted HD video link with Digital Twin AI engine...')

  useEffect(() => {
    if (!isOpen) return
    setCallDuration(0)

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)

    const speechTimers = [
      setTimeout(() => setActiveSpeech(`Hello! I am ${doctor.name}. I am inspecting your live telemetry and 3D organ scores in real-time.`), 2000),
      setTimeout(() => setActiveSpeech(`Your Heart Rate is 76 BPM with healthy sinus rhythm. Your 30s voice scan indicates 12% acoustic risk [Low Risk].`), 8000),
      setTimeout(() => setActiveSpeech(`Your Warfarin Sodium 5mg prescription is scheduled for 8:00 PM tonight. Do you have any questions?`), 15000)
    ]

    return () => {
      clearInterval(timer)
      speechTimers.forEach(t => clearTimeout(t))
    }
  }, [isOpen, doctor])

  if (!isOpen) return null

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300 font-sans overflow-y-auto">
      
      <div className="w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-y-auto flex flex-col h-[550px] max-h-[90vh] relative">
        
        {/* Top Floating Video Controls Bar */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
            <div>
              <div className="font-extrabold text-white text-xs flex items-center gap-2">
                <span>HD VIDEO TELE-TRIAGE CONSULTATION</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                  LIVE ENCRYPTED
                </span>
              </div>
              <div className="text-[11px] text-slate-400">{doctor.name} • {doctor.title}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-cyan-400 font-bold">
            <span className="bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
              ⏱️ {formatTime(callDuration)}
            </span>
          </div>
        </div>

        {/* Video Screen Container */}
        <div className="flex-1 bg-slate-950 relative flex items-center justify-center overflow-hidden">
          
          {/* Doctor Simulated Live Stream Video Graphic */}
          <div className="absolute inset-0 z-0">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-full h-full object-cover filter brightness-90 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          </div>

          {/* AI Speech Subtitle Overlay */}
          <div className="absolute bottom-20 left-6 right-6 z-10 p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 text-white backdrop-blur-md shadow-2xl space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{doctor.name} (AI Speech Engine)</span>
              </span>
              <span className="text-emerald-400">Real-Time Telemetry Sync</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-100 italic leading-relaxed">
              "{activeSpeech}"
            </p>
          </div>

          {/* User Self Camera Thumbnail (Bottom Right Corner) */}
          <div className="absolute top-6 right-6 w-36 h-28 rounded-2xl bg-slate-900 border-2 border-cyan-500/60 shadow-2xl overflow-hidden z-10 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-bold text-xs mb-1">
              YOU
            </div>
            <span className="text-[10px] text-slate-300 font-bold">Patient Cam</span>
            <span className="text-[9px] text-emerald-400 font-mono">720p HD</span>
          </div>

        </div>

        {/* Bottom Floating Control Panel */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-6 z-20">
          <button
            onClick={() => setIsMuted(prev => !prev)}
            className={`p-4 rounded-full transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-xl shadow-rose-600/40 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          >
            <PhoneOff className="w-4 h-4 fill-white" />
            <span>End Tele-Triage Call</span>
          </button>
        </div>

      </div>

    </div>
  )
}
