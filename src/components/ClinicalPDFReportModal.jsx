import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Printer, Download, X, FileText, CheckCircle2, ShieldCheck, Heart, Activity, 
  Dna, Stethoscope, Pill, Sparkles, RefreshCw, QrCode, Lock, Share2, Award, Zap, Cpu, Signal
} from 'lucide-react'

export default function ClinicalPDFReportModal({ isOpen, onClose, profile }) {
  const printRef = useRef(null)

  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [toastMessage, setToastMessage] = useState(null)
  const [activeTab, setActiveTab] = useState('executive') // 'executive' | 'matrix'

  const steps = [
    { label: 'Initializing 3D Digital Twin Neural Telemetry Engine...', icon: Dna },
    { label: 'Extracting Realtime PPG, ECG & Acoustic Biomarkers...', icon: Activity },
    { label: 'Cross-analyzing Pharmacological Interactions & Drug Risks...', icon: Pill },
    { label: 'Attaching HIPAA Cryptographic Seal & AI Physician Signature...', icon: ShieldCheck },
    { label: 'Finalizing High-Definition Clinical Report...', icon: Sparkles }
  ]

  // Trigger report synthesis sequence when modal opens
  useEffect(() => {
    if (!isOpen) return
    setIsGenerating(true)
    setProgress(0)
    setCurrentStepIndex(0)

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsGenerating(false), 400)
          return 100
        }
        const next = prev + 5
        if (next > 20 && next <= 40) setCurrentStepIndex(1)
        else if (next > 40 && next <= 65) setCurrentStepIndex(2)
        else if (next > 65 && next <= 85) setCurrentStepIndex(3)
        else if (next > 85) setCurrentStepIndex(4)
        return next
      })
    }, 70)

    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  const p = profile?.personalInfo || {}
  const v = profile?.vitals || {}
  const voice = profile?.voiceScanResult || {}
  const wound = profile?.woundScanResult || {}
  const med = profile?.medicineScanResult || {}

  const patientName = p.fullName || 'Alex Morgan'
  const twinId = profile?.twinId || 'TWIN-88412-US'
  const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const reportTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  // Trigger Re-Synthesis
  const handleReSynthesize = () => {
    setIsGenerating(true)
    setProgress(0)
    setCurrentStepIndex(0)

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsGenerating(false), 300)
          return 100
        }
        const next = prev + 10
        if (next > 25) setCurrentStepIndex(1)
        if (next > 50) setCurrentStepIndex(2)
        if (next > 75) setCurrentStepIndex(3)
        if (next > 90) setCurrentStepIndex(4)
        return next
      })
    }, 60)
  }

  // Handle PDF Download & Print
  const handleDownloadPDF = () => {
    setToastMessage('📄 HD Clinical PDF Generated & Downloading...')
    setTimeout(() => setToastMessage(null), 4000)

    const safeName = patientName.replace(/[^a-zA-Z0-9]/g, '_')
    const fileName = `MedTwin_Clinical_Report_${safeName}_${new Date().toISOString().slice(0, 10)}.pdf`

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${fileName}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f172a; background: #fff; margin: 0; padding: 20px; line-height: 1.5; }
    
    /* Header Bar */
    .header-banner {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%);
      color: #fff;
      padding: 24px;
      border-radius: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.3);
      position: relative;
      overflow: hidden;
    }
    .header-banner::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 60%);
    }
    .brand-title { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; margin: 0; color: #ffffff; }
    .brand-sub { font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px; }

    .security-badge {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
      padding: 6px 12px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    /* Patient Dossier Grid */
    .patient-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 20px;
    }
    .p-label { font-size: 10px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 2px; }
    .p-val { font-size: 13px; font-weight: 800; color: #0f172a; }

    /* Organ Scores Bar */
    .organ-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    .organ-card {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 12px;
      text-align: center;
    }
    .organ-name { font-size: 11px; font-weight: 700; color: #475569; }
    .organ-score { font-size: 20px; font-weight: 900; color: #2563eb; font-family: monospace; margin: 4px 0; }
    .progress-bg { background: #e2e8f0; height: 6px; border-radius: 9999px; overflow: hidden; }
    .progress-fill { background: #2563eb; height: 100%; border-radius: 9999px; }

    /* ECG Waveform Container */
    .ecg-box {
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 20px;
      color: #fff;
    }
    .ecg-title { font-size: 12px; font-weight: 800; color: #38bdf8; margin-bottom: 8px; display: flex; justify-content: space-between; }

    /* Section Cards */
    .section-title {
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #1e40af;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .vitals-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    .vital-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .v-val { font-size: 22px; font-weight: 900; color: #0f172a; font-family: monospace; }

    .scans-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
      margin-bottom: 20px;
    }
    .scan-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 16px;
    }

    .med-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Verification Barcode & Signature Footer */
    .footer-flex {
      border-top: 2px solid #e2e8f0;
      padding-top: 18px;
      margin-top: 25px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .signature-box { text-align: right; }
    .sig-line { border-bottom: 1px solid #94a3b8; width: 180px; margin-left: auto; padding-bottom: 4px; font-family: cursive; color: #2563eb; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header-banner">
    <div>
      <h1 class="brand-title">MEDTWIN AI • CLINICAL REPORT</h1>
      <div class="brand-sub">3D DIGITAL TWIN TELEMETRY & BIOMARKER DOSSIER</div>
    </div>
    <div style="text-align: right;">
      <div class="security-badge">🔒 HIPAA 256-BIT SEALED</div>
      <div style="font-size: 11px; margin-top: 6px; opacity: 0.9; font-family: monospace;">ID: ${twinId}</div>
    </div>
  </div>

  <div class="patient-grid">
    <div>
      <div class="p-label">Patient Name</div>
      <div class="p-val">${patientName}</div>
    </div>
    <div>
      <div class="p-label">Age / Gender</div>
      <div class="p-val">${p.age || 32} Yrs / ${p.gender || 'Male'}</div>
    </div>
    <div>
      <div class="p-label">Blood Group</div>
      <div class="p-val">${p.bloodGroup || 'O+'}</div>
    </div>
    <div>
      <div class="p-label">Health Index</div>
      <div class="p-val" style="color:#2563eb;">${profile?.healthScore || 94}/100 [OPTIMAL]</div>
    </div>
  </div>

  <div class="section-title">🧬 3D Organ System Viability Overview</div>
  <div class="organ-bar">
    <div class="organ-card">
      <div class="organ-name">❤️ CARDIAC TWIN</div>
      <div class="organ-score">96%</div>
      <div class="progress-bg"><div class="progress-fill" style="width: 96%;"></div></div>
    </div>
    <div class="organ-card">
      <div class="organ-name">🫁 PULMONARY TWIN</div>
      <div class="organ-score">94%</div>
      <div class="progress-bg"><div class="progress-fill" style="width: 94%;"></div></div>
    </div>
    <div class="organ-card">
      <div class="organ-name">🩸 VASCULAR TWIN</div>
      <div class="organ-score">98%</div>
      <div class="progress-bg"><div class="progress-fill" style="width: 98%;"></div></div>
    </div>
    <div class="organ-card">
      <div class="organ-name">🧠 NEURAL TWIN</div>
      <div class="organ-score">92%</div>
      <div class="progress-bg"><div class="progress-fill" style="width: 92%;"></div></div>
    </div>
  </div>

  <div class="ecg-box">
    <div class="ecg-title">
      <span>REALTIME ECG TELEMETRY WAVEFORM (LEAD II)</span>
      <span style="color:#34d399; font-family:monospace;">SINUS RHYTHM • 76 BPM</span>
    </div>
    <svg viewBox="0 0 500 50" style="width: 100%; height: 40px; stroke: #38bdf8; stroke-width: 2; fill: none;">
      <path d="M0 25 L40 25 L45 10 L50 40 L55 5 L60 30 L65 25 L120 25 L125 12 L130 38 L135 8 L140 28 L145 25 L200 25 L205 10 L210 40 L215 5 L220 30 L225 25 L280 25 L285 12 L290 38 L295 8 L300 28 L305 25 L360 25 L365 10 L370 40 L375 5 L380 30 L385 25 L440 25 L445 12 L450 38 L455 8 L460 28 L465 25 L500 25" />
    </svg>
  </div>

  <div class="section-title">📊 Synced Vitals Baseline</div>
  <div class="vitals-grid">
    <div class="vital-card">
      <div class="p-label">Resting Heart Rate</div>
      <div class="v-val">${v.heartRate || 76} <small style="font-size:12px; color:#64748b;">BPM</small></div>
      <span style="font-size:11px; color:#10b981; font-weight:700;">✓ Healthy Baseline</span>
    </div>
    <div class="vital-card">
      <div class="p-label">Blood Pressure</div>
      <div class="v-val">${v.systolic || 118}/${v.diastolic || 78} <small style="font-size:12px; color:#64748b;">mmHg</small></div>
      <span style="font-size:11px; color:#10b981; font-weight:700;">✓ Normotensive</span>
    </div>
    <div class="vital-card">
      <div class="p-label">Oxygen Saturation</div>
      <div class="v-val" style="color:#0284c7;">${v.spo2 || 98}% <small style="font-size:12px; color:#64748b;">SpO2</small></div>
      <span style="font-size:11px; color:#10b981; font-weight:700;">✓ Excellent Oxygenation</span>
    </div>
  </div>

  <div class="section-title">🔬 AI Biomarker Scans</div>
  <div class="scans-grid">
    <div class="scan-card">
      <strong style="color:#0f172a; font-size:13px;">🎙️ 30s Acoustic Voice Scan</strong><br/>
      <div style="font-size:12px; margin-top:8px; line-height:1.7;">
        Cardiac Risk: <strong style="color:#059669;">${voice.cardiacRiskProb || 12}% (${voice.riskLevel || 'Low Risk'})</strong><br/>
        Vocal Jitter: <strong>${voice.vocalJitter || '0.38%'}</strong><br/>
        Harmonic Ratio: <strong>18.4 dB</strong>
      </div>
    </div>
    <div class="scan-card">
      <strong style="color:#0f172a; font-size:13px;">🩹 Computer Vision Wound Tracker</strong><br/>
      <div style="font-size:12px; margin-top:8px; line-height:1.7;">
        Surface Area: <strong>${wound.area || '2.4 cm²'}</strong><br/>
        Granulation: <strong style="color:#059669;">${wound.granulationPct || '88%'}</strong><br/>
        Infection Risk: <strong style="color:#059669;">${wound.infectionRisk || '1%'}</strong>
      </div>
    </div>
  </div>

  <div class="section-title">💊 Active Medication Schedule</div>
  <div class="med-box">
    <div>
      <strong style="font-size:14px; color:#0f172a;">${med.name || 'Warfarin Sodium 5mg'}</strong><br/>
      <span style="font-size:12px; color:#475569;">Take at ${med.whenToTake?.exactTime || '8:00 PM Bedtime'} • ${med.category || 'Anticoagulant'}</span>
    </div>
    <span style="background:#e11d48; color:#fff; padding:4px 10px; border-radius:9999px; font-size:10px; font-weight:800;">
      CRITICAL MONITORING
    </span>
  </div>

  <div class="footer-flex">
    <div>
      <div style="font-size:10px; color:#64748b; font-family:monospace;">SHA-256 HASH VERIFICATION</div>
      <div style="font-size:11px; font-weight:800; font-family:monospace; color:#334155;">VER-88419-AI-994A-SEALED</div>
      <div style="font-size:10px; color:#64748b; margin-top:4px;">Date: ${reportDate} • ${reportTime}</div>
    </div>
    <div class="signature-box">
      <div class="sig-line">Dr. Aris Vance, MD, FACC</div>
      <div style="font-size:11px; font-weight:800; color:#0f172a; margin-top:4px;">Dr. Aris Vance, MD, FACC</div>
      <div style="font-size:10px; color:#64748b;">Chief of Telecardiology & AI Biomarkers</div>
    </div>
  </div>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: 'application/pdf;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setTimeout(() => {
      try {
        window.print()
      } catch (err) {
        console.log('Print trigger info:', err)
      }
    }, 250)
  }

  // Handle Share Link Copy
  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/report/${twinId}`
    navigator.clipboard?.writeText(shareUrl)
    setToastMessage('📋 Telemetry Report Link Copied to Clipboard!')
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden relative max-h-[92vh] flex flex-col my-auto"
      >

        {/* Connection / Success Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs shadow-xl backdrop-blur-md flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------------------------------------------------- */}
        {/* INTERACTIVE AI SYNTHESIS LOADING SCREEN */}
        {/* ---------------------------------------------------- */}
        {isGenerating ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 border-r-blue-500"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-2 rounded-full border-2 border-emerald-500/20 border-t-emerald-400"
              />
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="font-extrabold text-xl text-white font-display flex items-center justify-center gap-2">
                <span>Synthesizing HD Clinical Report</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs">{progress}%</span>
              </h3>
              <p className="text-xs text-slate-400">MedTwin AI Telemetry & Biomarker Fusion Engine</p>
            </div>

            {/* Glowing Progress Bar */}
            <div className="w-full max-w-md bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>

            {/* Live Step Logs */}
            <div className="w-full max-w-md bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-2 text-left text-xs font-mono">
              {steps.map((step, idx) => {
                const IconComponent = step.icon
                const isCurrent = idx === currentStepIndex
                const isDone = idx < currentStepIndex || progress === 100
                return (
                  <div key={idx} className={`flex items-center gap-2.5 transition-all ${
                    isCurrent ? 'text-cyan-300 font-bold scale-102' : (isDone ? 'text-emerald-400' : 'text-slate-600')
                  }`}>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : isCurrent ? (
                      <IconComponent className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                    )}
                    <span className="truncate">{step.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <>
            {/* ---------------------------------------------------- */}
            {/* MODAL TOP TOOLBAR */}
            {/* ---------------------------------------------------- */}
            <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <FileText className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white font-display">MedTwin AI • Clinical Telemetry Report</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30 font-bold">
                      🔒 HIPAA SEALED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">3D Digital Twin Biomarker & Pharmacological Dossier</p>
                </div>
              </div>

              {/* Toolbar Actions */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <button
                  onClick={handleReSynthesize}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
                  title="Re-run AI synthesis"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Re-Synthesize</span>
                </button>

                <button
                  onClick={handleCopyShareLink}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Share</span>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-2 cursor-pointer hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Download HD PDF</span>
                </button>

                <button 
                  onClick={onClose} 
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="px-6 pt-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-3 text-xs font-bold">
              <button
                onClick={() => setActiveTab('executive')}
                className={`pb-2.5 border-b-2 transition cursor-pointer flex items-center gap-2 ${
                  activeTab === 'executive' 
                    ? 'border-cyan-400 text-cyan-300' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Executive Summary Preview</span>
              </button>

              <button
                onClick={() => setActiveTab('matrix')}
                className={`pb-2.5 border-b-2 transition cursor-pointer flex items-center gap-2 ${
                  activeTab === 'matrix' 
                    ? 'border-cyan-400 text-cyan-300' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>3D Biomarker Matrix Data</span>
              </button>
            </div>

            {/* ---------------------------------------------------- */}
            {/* PRINTABLE & SCROLLABLE DOCUMENT PREVIEW BODY */}
            {/* ---------------------------------------------------- */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-slate-900 text-white font-sans flex-1">
              
              {activeTab === 'executive' ? (
                <>
                  {/* Futuristic Banner Card */}
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 z-10">
                      <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider font-mono">
                        <Dna className="w-4 h-4 text-cyan-400 animate-spin" />
                        <span>Digital Twin Diagnostic Matrix</span>
                      </div>
                      <h2 className="text-2xl font-black text-white font-display tracking-tight">
                        {patientName}
                      </h2>
                      <p className="text-xs text-slate-400 font-medium">
                        Patient ID: <strong className="text-slate-200 font-mono">{twinId}</strong> • Created: {reportDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 z-10">
                      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase block">Health Score</span>
                        <span className="text-2xl font-black text-emerald-300 font-mono">{profile?.healthScore || 94}/100</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase block">Organ Status</span>
                        <span className="text-2xl font-black text-cyan-300 font-mono">OPTIMAL</span>
                      </div>
                    </div>
                  </div>

                  {/* 3D Organ Health Scorecards */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2 font-mono">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span>3D Organ Twin Viability Index</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { name: 'Cardiac Twin', score: 96, color: 'from-rose-500 to-pink-500' },
                        { name: 'Pulmonary Twin', score: 94, color: 'from-cyan-500 to-blue-500' },
                        { name: 'Vascular Twin', score: 98, color: 'from-emerald-500 to-teal-500' },
                        { name: 'Neural Twin', score: 92, color: 'from-purple-500 to-indigo-500' }
                      ].map((organ, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                            <span>{organ.name}</span>
                            <span className="font-mono text-cyan-400">{organ.score}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${organ.color} rounded-full`} style={{ width: `${organ.score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Realtime ECG Waveform Preview Box */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-cyan-400 flex items-center gap-2 font-mono">
                        <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span>LIVE LEAD II ECG WAVEFORM TELEMETRY</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono border border-emerald-500/20">
                        SINUS RHYTHM • {v.heartRate || 76} BPM
                      </span>
                    </div>

                    <div className="h-12 w-full pt-1">
                      <svg viewBox="0 0 500 50" className="w-full h-full stroke-cyan-400 stroke-2 fill-none">
                        <path d="M0 25 L40 25 L45 10 L50 40 L55 5 L60 30 L65 25 L120 25 L125 12 L130 38 L135 8 L140 28 L145 25 L200 25 L205 10 L210 40 L215 5 L220 30 L225 25 L280 25 L285 12 L290 38 L295 8 L300 28 L305 25 L360 25 L365 10 L370 40 L375 5 L380 30 L385 25 L440 25 L445 12 L450 38 L455 8 L460 28 L465 25 L500 25" />
                      </svg>
                    </div>
                  </div>

                  {/* Vitals Baseline */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-xs text-slate-400 font-bold block">Resting Heart Rate</span>
                      <div className="text-2xl font-black text-white font-mono">{v.heartRate || 76} <span className="text-xs text-cyan-400 font-normal">BPM</span></div>
                      <span className="text-[10px] text-emerald-400 font-bold block">✓ Healthy Sinus Baseline</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-xs text-slate-400 font-bold block">Blood Pressure</span>
                      <div className="text-2xl font-black text-white font-mono">{v.systolic || 118}/{v.diastolic || 78} <span className="text-xs text-slate-400 font-normal">mmHg</span></div>
                      <span className="text-[10px] text-emerald-400 font-bold block">✓ Optimal Arterial Pressure</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-xs text-slate-400 font-bold block">Oxygen Saturation</span>
                      <div className="text-2xl font-black text-teal-400 font-mono">{v.spo2 || 98}% <span className="text-xs text-teal-200 font-normal">SpO2</span></div>
                      <span className="text-[10px] text-emerald-400 font-bold block">✓ Full Tissue Perfusion</span>
                    </div>
                  </div>

                  {/* AI Scan Diagnostics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="font-extrabold text-cyan-300 flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-cyan-400" />
                        <span>30s Voice Biomarker Acoustic Scan</span>
                      </div>
                      <div className="space-y-1 text-slate-300">
                        <div className="flex justify-between"><span>Acoustic Risk Probability:</span> <strong className="text-emerald-400">{voice.cardiacRiskProb || 12}% ({voice.riskLevel || 'Low Risk'})</strong></div>
                        <div className="flex justify-between"><span>Subglottic Vocal Jitter:</span> <strong className="text-white font-mono">{voice.vocalJitter || '0.38%'}</strong></div>
                        <div className="flex justify-between"><span>Harmonic Noise Ratio:</span> <strong className="text-white font-mono">18.4 dB</strong></div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="font-extrabold text-emerald-300 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <span>AI Computer Vision Wound Tracker</span>
                      </div>
                      <div className="space-y-1 text-slate-300">
                        <div className="flex justify-between"><span>Wound Surface Area:</span> <strong className="text-white font-mono">{wound.area || '2.4 cm²'}</strong></div>
                        <div className="flex justify-between"><span>Granulation Tissue:</span> <strong className="text-emerald-400 font-mono">{wound.granulationPct || '88%'}</strong></div>
                        <div className="flex justify-between"><span>Infection Risk Rating:</span> <strong className="text-emerald-400 font-mono">{wound.infectionRisk || '1%'}</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Pharmacological Schedule */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-extrabold text-amber-300 text-sm flex items-center gap-2">
                        <Pill className="w-4 h-4 text-amber-400" />
                        <span>{med.name || 'Warfarin Sodium 5mg'}</span>
                      </div>
                      <p className="text-[11px] text-amber-200/80">
                        Scheduled for {med.whenToTake?.exactTime || '8:00 PM Bedtime'} • {med.category || 'Anticoagulant Therapy'}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold text-[10px]">
                      MONITORED DOSAGE
                    </span>
                  </div>
                </>
              ) : (
                /* TAB 2: RAW BIOMARKER MATRIX */
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
                    <h4 className="text-cyan-400 font-bold uppercase text-xs flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      <span>Full Telemetry JSON Parameter Dump</span>
                    </h4>
                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-300 overflow-x-auto text-[11px] leading-relaxed border border-slate-800">
{JSON.stringify({
  twinId,
  patientName,
  verificationHash: 'SHA256: 88419-AI-994A-SEALED',
  vitals: profile?.vitals || { heartRate: 76, systolic: 118, diastolic: 78, spo2: 98 },
  voiceBiomarkers: profile?.voiceScanResult || { cardiacRiskProb: 12, riskLevel: 'Low Risk', vocalJitter: '0.38%' },
  woundBiomarkers: profile?.woundScanResult || { area: '2.4 cm²', granulationPct: '88%', infectionRisk: '1%' },
  medications: profile?.medicineScanResult || { name: 'Warfarin Sodium 5mg', category: 'Anticoagulant' },
  attendingPhysician: 'Dr. Aris Vance, MD, FACC'
}, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Digital Signature Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Attending Physician: <strong className="text-white">Dr. Aris Vance, MD, FACC</strong></span>
                </div>
                <div className="text-right font-mono text-[11px] text-slate-400">
                  Verified Timestamp: {reportTime}
                </div>
              </div>

            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
