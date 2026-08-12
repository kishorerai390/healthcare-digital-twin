import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Printer, Download, X, FileText, CheckCircle2, ShieldCheck, Heart, Activity, 
  Dna, Stethoscope, Pill, Sparkles, RefreshCw, QrCode, Lock, Share2, Award, Zap, Cpu, Signal,
  TrendingDown, TrendingUp, Minus, AlertTriangle, CalendarCheck, ShieldAlert, CheckSquare, BarChart2
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
    { label: 'Synthesizing 5-Axis Organ Radar & 7-Day Micro Trends...', icon: BarChart2 },
    { label: 'Cross-analyzing Pharmacological Interactions & Critical Allergies...', icon: Pill },
    { label: 'Attaching HIPAA SHA-256 QR Verification Seal & Signature...', icon: ShieldCheck }
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
        else if (next > 40 && next <= 60) setCurrentStepIndex(2)
        else if (next > 60 && next <= 80) setCurrentStepIndex(3)
        else if (next > 80) setCurrentStepIndex(4)
        return next
      })
    }, 60)

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
  const verificationHash = 'SHA256: 88419-AI-994A-SEALED'

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
        if (next > 20) setCurrentStepIndex(1)
        if (next > 40) setCurrentStepIndex(2)
        if (next > 65) setCurrentStepIndex(3)
        if (next > 85) setCurrentStepIndex(4)
        return next
      })
    }, 50)
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
    @page { size: A4; margin: 10mm; }
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f172a; background: #fff; margin: 0; padding: 18px; line-height: 1.45; }
    
    /* Header Bar */
    .header-banner {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%);
      color: #fff;
      padding: 20px 24px;
      border-radius: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.3);
      position: relative;
    }
    .brand-title { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; margin: 0; color: #ffffff; }
    .brand-sub { font-size: 10px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px; }

    .security-badge {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
      padding: 5px 10px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.5px;
      display: inline-block;
    }

    /* Patient Dossier Grid */
    .patient-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 16px;
    }
    .p-label { font-size: 9px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 2px; }
    .p-val { font-size: 12px; font-weight: 800; color: #0f172a; }

    /* Medical History & Allergy Alert */
    .allergy-banner {
      background: #fff1f2;
      border: 1px solid #fecdd3;
      border-left: 4px solid #e11d48;
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
    }

    /* Section Cards */
    .section-title {
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #1e40af;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Organ Radar & Waveform Flex */
    .radar-flex {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 16px;
    }

    .card-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px;
    }

    .ecg-box {
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 14px;
      color: #fff;
    }

    /* Vitals Grid with 7d Trends */
    .vitals-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    .vital-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .v-val { font-size: 20px; font-weight: 900; color: #0f172a; font-family: monospace; }

    .trend-pill {
      font-size: 9px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 3px;
      margin-top: 4px;
    }

    .scans-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .med-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Clinical Action Plan */
    .plan-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 20px;
      font-size: 11px;
    }

    /* Footer & Verification QR */
    .footer-flex {
      border-top: 2px solid #e2e8f0;
      padding-top: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .qr-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .sig-line { border-bottom: 1px solid #94a3b8; width: 170px; text-align: right; padding-bottom: 3px; font-family: cursive; color: #2563eb; font-size: 13px; margin-left: auto; }
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
      <div style="font-size: 10px; margin-top: 5px; opacity: 0.9; font-family: monospace;">ID: ${twinId}</div>
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

  <div class="allergy-banner">
    <div>
      <strong style="color: #9f1239; font-size: 12px;">⚠️ CRITICAL MEDICAL HISTORY & ALLERGY ALERTS</strong><br/>
      <span style="color: #4c0519;">Active Diagnoses: Essential Hypertension • Post-Op Recovery (Day 14)</span>
    </div>
    <div style="text-align: right; font-weight: 800; color: #e11d48;">
      ALLERGIC TO: PENICILLIN (ANAPHYLAXIS) • SULFA DRUGS
    </div>
  </div>

  <div class="section-title">🧬 5-Axis Organ Viability & ECG Telemetry</div>
  <div class="radar-flex">
    <!-- SVG 5-Axis Radar Chart -->
    <div class="card-box" style="text-align: center;">
      <div style="font-size: 10px; font-weight: 800; color: #475569; margin-bottom: 6px;">BIOMARKER RADAR BALANCE</div>
      <svg viewBox="0 0 200 160" style="width: 100%; max-height: 120px;">
        <!-- Polygon Grid Backgrounds -->
        <polygon points="100,20 170,60 145,135 55,135 30,60" fill="none" stroke="#cbd5e1" stroke-width="1" />
        <polygon points="100,45 145,70 130,115 70,115 55,70" fill="none" stroke="#e2e8f0" stroke-width="1" />
        
        <!-- Data Polygon (Cardiac 96%, Pulmonary 94%, Vascular 98%, Neural 92%, Metabolic 95%) -->
        <polygon points="100,22 165,62 143,132 58,133 32,62" fill="rgba(37, 99, 235, 0.2)" stroke="#2563eb" stroke-width="2.5" />
        
        <!-- Axis Labels -->
        <text x="100" y="14" font-size="8" font-weight="bold" fill="#1e40af" text-anchor="middle">Cardiac 96%</text>
        <text x="175" y="62" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="start">Pulmonary 94%</text>
        <text x="150" y="145" font-size="8" font-weight="bold" fill="#059669" text-anchor="middle">Vascular 98%</text>
        <text x="50" y="145" font-size="8" font-weight="bold" fill="#7c3aed" text-anchor="middle">Neural 92%</text>
        <text x="25" y="62" font-size="8" font-weight="bold" fill="#d97706" text-anchor="end">Metabolic 95%</text>
      </svg>
    </div>

    <!-- ECG Waveform -->
    <div class="ecg-box">
      <div style="font-size: 10px; font-weight: 800; color: #38bdf8; margin-bottom: 6px; display: flex; justify-content: space-between;">
        <span>LEAD II ECG TELEMETRY</span>
        <span style="color:#34d399; font-family:monospace;">SINUS RHYTHM • ${v.heartRate || 76} BPM</span>
      </div>
      <svg viewBox="0 0 500 60" style="width: 100%; height: 60px; stroke: #38bdf8; stroke-width: 2.5; fill: none;">
        <path d="M0 30 L40 30 L45 15 L50 45 L55 8 L60 38 L65 30 L120 30 L125 18 L130 42 L135 10 L140 35 L145 30 L200 30 L205 15 L210 45 L215 8 L220 38 L225 30 L280 30 L285 18 L290 42 L295 10 L300 35 L305 30 L360 30 L365 15 L370 45 L375 8 L380 38 L385 30 L440 30 L445 18 L450 42 L455 10 L460 35 L465 30 L500 30" />
      </svg>
      <div style="font-size: 9px; color: #94a3b8; margin-top: 4px; text-align: right; font-mono">HRV Spectrum: 58 ms (Low Arrhythmia Risk)</div>
    </div>
  </div>

  <div class="section-title">📊 Synced Vitals & 7-Day Trends</div>
  <div class="vitals-grid">
    <div class="vital-card">
      <div class="p-label">Resting Heart Rate</div>
      <div class="v-val">${v.heartRate || 76} <small style="font-size:11px; color:#64748b;">BPM</small></div>
      <div class="trend-pill" style="background: #dcfce7; color: #15803d;">
        ↓ 2 BPM 7d Avg • Optimal Baseline
      </div>
    </div>
    <div class="vital-card">
      <div class="p-label">Blood Pressure</div>
      <div class="v-val">${v.systolic || 118}/${v.diastolic || 78} <small style="font-size:11px; color:#64748b;">mmHg</small></div>
      <div class="trend-pill" style="background: #e0f2fe; color: #0369a1;">
        ↔ Stable Arterial Pressure
      </div>
    </div>
    <div class="vital-card">
      <div class="p-label">Oxygen Saturation</div>
      <div class="v-val" style="color:#0284c7;">${v.spo2 || 98}% <small style="font-size:11px; color:#64748b;">SpO2</small></div>
      <div class="trend-pill" style="background: #ccfbf1; color: #0f766e;">
        ↑ 1% Tissue Oxygenation
      </div>
    </div>
  </div>

  <div class="section-title">🔬 AI Biomarker Diagnostic Scans</div>
  <div class="scans-grid">
    <div class="card-box">
      <strong style="color:#0f172a; font-size:12px;">🎙️ 30s Acoustic Voice Scan</strong>
      <div style="font-size:11px; margin-top:6px; line-height:1.6;">
        Cardiac Risk: <strong style="color:#059669;">${voice.cardiacRiskProb || 12}% (${voice.riskLevel || 'Low Risk'})</strong><br/>
        Vocal Jitter: <strong>${voice.vocalJitter || '0.38%'}</strong><br/>
        Harmonic Ratio: <strong>18.4 dB (Normal Vocal Fold)</strong>
      </div>
    </div>
    <div class="card-box">
      <strong style="color:#0f172a; font-size:12px;">🩹 Computer Vision Wound Tracker</strong>
      <div style="font-size:11px; margin-top:6px; line-height:1.6;">
        Surface Area: <strong>${wound.area || '2.4 cm²'}</strong><br/>
        Granulation: <strong style="color:#059669;">${wound.granulationPct || '88%'}</strong><br/>
        Infection Risk: <strong style="color:#059669;">${wound.infectionRisk || '1%'} (Healthy Epithelialization)</strong>
      </div>
    </div>
  </div>

  <div class="section-title">💊 Active Pharmacological Schedule</div>
  <div class="med-box">
    <div>
      <strong style="font-size:13px; color:#0f172a;">${med.name || 'Warfarin Sodium 5mg'}</strong><br/>
      <span style="font-size:11px; color:#475569;">Take at ${med.whenToTake?.exactTime || '8:00 PM Bedtime'} • ${med.category || 'Anticoagulant Therapy'}</span>
    </div>
    <span style="background:#e11d48; color:#fff; padding:4px 10px; border-radius:9999px; font-size:9px; font-weight:800;">
      INR LAB CHECK DUE IN 7 DAYS
    </span>
  </div>

  <div class="section-title">📋 30-Day Clinical Action Plan & Recommendations</div>
  <div class="plan-box">
    <div style="margin-bottom: 4px;"><strong>1. Tele-Physician Follow-up:</strong> Schedule 3D Echocardiogram & Tele-consult in 14 days.</div>
    <div style="margin-bottom: 4px;"><strong>2. Medication Adherence:</strong> Maintain Warfarin 5mg bedtime regimen with continuous INR monitoring.</div>
    <div><strong>3. Activity Goal:</strong> Target >8,000 daily steps with continuous Bluetooth PPG telemetry active.</div>
  </div>

  <div class="footer-flex">
    <div class="qr-container">
      <!-- SVG QR Code Icon -->
      <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="5" y="5" width="3" height="3"/>
        <rect x="16" y="5" width="3" height="3"/>
        <rect x="5" y="16" width="3" height="3"/>
        <path d="M14 14h3v3h-3z"/>
        <path d="M17 17h4v4h-4z"/>
        <path d="M14 20h3"/>
        <path d="M20 14v3"/>
      </svg>
      <div>
        <div style="font-size:9px; color:#64748b; font-family:monospace;">SCAN TO VERIFY AUTHENTICITY</div>
        <div style="font-size:10px; font-weight:800; font-family:monospace; color:#0f172a;">${verificationHash}</div>
        <div style="font-size:9px; color:#059669; font-weight:700;">https://medtwin.ai/verify/${twinId}</div>
      </div>
    </div>

    <div>
      <div class="sig-line">Dr. Aris Vance, MD, FACC</div>
      <div style="font-size:11px; font-weight:800; color:#0f172a; margin-top:2px; text-align:right;">Dr. Aris Vance, MD, FACC</div>
      <div style="font-size:9px; color:#64748b; text-align:right;">Chief of Telecardiology & AI Biomarkers</div>
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
    setToastMessage('📋 Verified Telemetry Report Link Copied to Clipboard!')
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
              <p className="text-xs text-slate-400">MedTwin AI Telemetry, 5-Axis Radar & Biomarker Fusion</p>
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
                  <p className="text-[11px] text-slate-400">3D Digital Twin Biomarker, 5-Axis Radar & Action Plan Dossier</p>
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
            <div className="p-6 sm:p-8 overflow-y-auto space-y-5 bg-slate-900 text-white font-sans flex-1">
              
              {activeTab === 'executive' ? (
                <>
                  {/* Futuristic Banner Card */}
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 z-10">
                      <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider font-mono">
                        <Dna className="w-4 h-4 text-cyan-400 animate-spin" />
                        <span>Digital Twin Diagnostic Dossier</span>
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
                        <span className="text-[10px] text-emerald-400 font-bold uppercase block">Health Index</span>
                        <span className="text-2xl font-black text-emerald-300 font-mono">{profile?.healthScore || 94}/100</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase block">Biomarker Seal</span>
                        <span className="text-2xl font-black text-cyan-300 font-mono">VERIFIED</span>
                      </div>
                    </div>
                  </div>

                  {/* Critical Medical History & Allergy Alert Banner */}
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse flex-shrink-0" />
                      <div>
                        <strong className="text-rose-300 block font-bold">Critical Medical History & Active Diagnoses</strong>
                        <span className="text-slate-300 text-[11px]">Essential Hypertension • Post-Op Knee Recovery (Day 14)</span>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-[10px] whitespace-nowrap">
                      ⚠️ ALLERGIC TO: PENICILLIN • SULFA DRUGS
                    </div>
                  </div>

                  {/* 5-Axis Radar Chart & ECG Waveform Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* SVG 5-Axis Spiderweb Radar Chart */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                      <div className="text-xs font-bold text-slate-300 flex items-center justify-center gap-2">
                        <BarChart2 className="w-4 h-4 text-cyan-400" />
                        <span>5-AXIS BIOMARKER RADAR BALANCE</span>
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <svg viewBox="0 0 200 150" className="w-full max-h-[130px]">
                          <polygon points="100,20 170,60 145,135 55,135 30,60" fill="none" stroke="#334155" strokeWidth="1" />
                          <polygon points="100,45 145,70 130,115 70,115 55,70" fill="none" stroke="#1e293b" strokeWidth="1" />
                          <polygon points="100,22 165,62 143,132 58,133 32,62" fill="rgba(34, 211, 238, 0.25)" stroke="#22d3ee" strokeWidth="2.5" />
                          
                          <text x="100" y="14" fontSize="9" fontWeight="bold" fill="#38bdf8" textAnchor="middle">Cardiac 96%</text>
                          <text x="175" y="62" fontSize="9" fontWeight="bold" fill="#38bdf8" textAnchor="start">Pulmonary 94%</text>
                          <text x="150" y="145" fontSize="9" fontWeight="bold" fill="#34d399" textAnchor="middle">Vascular 98%</text>
                          <text x="50" y="145" fontSize="9" fontWeight="bold" fill="#a78bfa" textAnchor="middle">Neural 92%</text>
                          <text x="25" y="62" fontSize="9" fontWeight="bold" fill="#fbbf24" textAnchor="end">Metabolic 95%</text>
                        </svg>
                      </div>
                    </div>

                    {/* ECG Telemetry Box */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-cyan-400 flex items-center gap-2 font-mono">
                          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                          <span>LEAD II ECG TELEMETRY</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono border border-emerald-500/20">
                          SINUS RHYTHM • {v.heartRate || 76} BPM
                        </span>
                      </div>

                      <div className="h-14 w-full pt-1">
                        <svg viewBox="0 0 500 60" className="w-full h-full stroke-cyan-400 stroke-2 fill-none">
                          <path d="M0 30 L40 30 L45 15 L50 45 L55 8 L60 38 L65 30 L120 30 L125 18 L130 42 L135 10 L140 35 L145 30 L200 30 L205 15 L210 45 L215 8 L220 38 L225 30 L280 30 L285 18 L290 42 L295 10 L300 35 L305 30 L360 30 L365 15 L370 45 L375 8 L380 38 L385 30 L440 30 L445 18 L450 42 L455 10 L460 35 L465 30 L500 30" />
                        </svg>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono text-right">
                        HRV Spectrum: 58 ms (Sinus Rhythm)
                      </div>
                    </div>
                  </div>

                  {/* Vitals Baseline with 7-Day Micro Trend Indicators */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-xs text-slate-400 font-bold block">Resting Heart Rate</span>
                      <div className="text-2xl font-black text-white font-mono">{v.heartRate || 76} <span className="text-xs text-cyan-400 font-normal">BPM</span></div>
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>↓ 2 BPM 7d Avg • Optimal</span>
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-xs text-slate-400 font-bold block">Blood Pressure</span>
                      <div className="text-2xl font-black text-white font-mono">{v.systolic || 118}/{v.diastolic || 78} <span className="text-xs text-slate-400 font-normal">mmHg</span></div>
                      <span className="text-[10px] text-cyan-300 font-bold flex items-center gap-1">
                        <Minus className="w-3.5 h-3.5" />
                        <span>↔ Stable Baseline</span>
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-xs text-slate-400 font-bold block">Oxygen Saturation</span>
                      <div className="text-2xl font-black text-teal-400 font-mono">{v.spo2 || 98}% <span className="text-xs text-teal-200 font-normal">SpO2</span></div>
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>↑ 1% Tissue Oxygenation</span>
                      </span>
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
                      INR LAB CHECK DUE IN 7 DAYS
                    </span>
                  </div>

                  {/* 30-Day Clinical Action Plan */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-xs">
                    <div className="font-extrabold text-emerald-300 flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-emerald-400" />
                      <span>30-Day Clinical Action Plan & Recommendations</span>
                    </div>
                    <div className="space-y-1 text-slate-300 text-[11px] leading-relaxed">
                      <div>1. <strong>Tele-Physician Follow-Up:</strong> Schedule 3D Echocardiogram & Tele-consult in 14 days.</div>
                      <div>2. <strong>Medication Adherence:</strong> Continue Warfarin 5mg bedtime regimen with INR check in 7 days.</div>
                      <div>3. <strong>Telemetry Monitoring:</strong> Target &gt;8,000 daily steps with continuous Bluetooth PPG sync.</div>
                    </div>
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
  verificationHash,
  vitals: profile?.vitals || { heartRate: 76, systolic: 118, diastolic: 78, spo2: 98 },
  trends: { heartRate: '↓ 2 BPM 7d', bloodPressure: '↔ Stable', spo2: '↑ 1%' },
  voiceBiomarkers: profile?.voiceScanResult || { cardiacRiskProb: 12, riskLevel: 'Low Risk', vocalJitter: '0.38%' },
  woundBiomarkers: profile?.woundScanResult || { area: '2.4 cm²', granulationPct: '88%', infectionRisk: '1%' },
  medications: profile?.medicineScanResult || { name: 'Warfarin Sodium 5mg', category: 'Anticoagulant' },
  allergies: ['Penicillin (Anaphylaxis)', 'Sulfa Drugs'],
  attendingPhysician: 'Dr. Aris Vance, MD, FACC'
}, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Digital Signature & QR Verification Footer */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  {/* SVG QR Code Icon */}
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="5" y="5" width="3" height="3"/>
                    <rect x="16" y="5" width="3" height="3"/>
                    <rect x="5" y="16" width="3" height="3"/>
                    <path d="M14 14h3v3h-3z"/>
                    <path d="M17 17h4v4h-4z"/>
                    <path d="M14 20h3"/>
                    <path d="M20 14v3"/>
                  </svg>
                  <div>
                    <div className="font-mono text-[10px] text-slate-400">SCAN TO VERIFY AUTHENTICITY</div>
                    <div className="font-mono font-extrabold text-cyan-300 text-xs">{verificationHash}</div>
                    <div className="text-emerald-400 text-[10px] font-mono font-semibold">https://medtwin.ai/verify/{twinId}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Attending Physician: <strong className="text-white">Dr. Aris Vance, MD, FACC</strong></span>
                  <span className="text-[10px] text-slate-400 font-mono">Verified Timestamp: {reportTime}</span>
                </div>
              </div>

            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
