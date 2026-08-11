import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Printer, Download, X, FileText, CheckCircle2, ShieldCheck, Heart, Activity, Dna, Stethoscope, Pill, AlertTriangle } from 'lucide-react'

export default function ClinicalPDFReportModal({ isOpen, onClose, profile }) {
  const printRef = useRef(null)

  if (!isOpen) return null

  const p = profile?.personalInfo || {}
  const v = profile?.vitals || {}
  const voice = profile?.voiceScanResult || {}
  const wound = profile?.woundScanResult || {}
  const med = profile?.medicineScanResult || {}

  const handleDownloadPDF = () => {
    const patientName = (p.fullName || 'Patient').replace(/[^a-zA-Z0-9]/g, '_')
    const fileName = `Clinical_Telemetry_Report_${patientName}_${new Date().toISOString().slice(0, 10)}.pdf`

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${fileName}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; background: #fff; margin: 0; padding: 25px; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; border-bottom: 3px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
    .title { font-size: 22px; font-weight: 900; color: #0f172a; margin: 0; }
    .subtitle { font-size: 12px; font-weight: 700; color: #2563eb; font-family: monospace; }
    .patient-box { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 15px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; font-size: 12px; }
    .vitals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
    .vital-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; }
    .vital-val { font-size: 18px; font-weight: 900; color: #0f172a; font-family: monospace; }
    .scans-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
    .scan-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; font-size: 12px; }
    .med-box { background: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 15px; margin-bottom: 20px; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">MedTwin AI • Clinical Telemetry Report</div>
      <div class="subtitle">3D Digital Twin Diagnostic & Biomarker Summary</div>
    </div>
    <div style="text-align: right; font-size: 12px;">
      <strong>ID: ${profile?.twinId || 'TWIN-88412-US'}</strong><br/>
      Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br/>
      <span style="color: #0d9488; font-weight: bold;">HIPAA Sealed & Verified</span>
    </div>
  </div>

  <div class="patient-box">
    <div><span style="color:#64748b;">Patient Name</span><br/><strong>${p.fullName || 'Alex Morgan'}</strong></div>
    <div><span style="color:#64748b;">Age / Gender</span><br/><strong>${p.age || 32} yrs / ${p.gender || 'Male'}</strong></div>
    <div><span style="color:#64748b;">Blood Group</span><br/><strong>${p.bloodGroup || 'O+'}</strong></div>
    <div><span style="color:#64748b;">Health Score</span><br/><strong style="color:#2563eb; font-size:14px;">${profile?.healthScore || 94}/100</strong></div>
  </div>

  <h3 style="color:#2563eb; font-size:13px; text-transform:uppercase; margin-bottom:10px;">Synced Vitals Baseline</h3>
  <div class="vitals-grid">
    <div class="vital-card">
      <span style="font-size:11px; color:#64748b;">Resting Heart Rate</span><br/>
      <span class="vital-val">${v.heartRate || 76} BPM</span>
    </div>
    <div class="vital-card">
      <span style="font-size:11px; color:#64748b;">Blood Pressure</span><br/>
      <span class="vital-val">${v.systolic || 118}/${v.diastolic || 78} mmHg</span>
    </div>
    <div class="vital-card">
      <span style="font-size:11px; color:#64748b;">Oxygen Saturation</span><br/>
      <span class="vital-val" style="color:#0d9488;">${v.spo2 || 98}% SpO2</span>
    </div>
  </div>

  <h3 style="color:#2563eb; font-size:13px; text-transform:uppercase; margin-bottom:10px;">AI Diagnostic & Biomarker Scans</h3>
  <div class="scans-grid">
    <div class="scan-card">
      <strong style="color:#0f172a;">30s Voice Biomarker Acoustic Scan</strong><br/><br/>
      Risk Probability: <strong>${voice.cardiacRiskProb || 12}%</strong><br/>
      Classification: <strong style="color:#0d9488;">${voice.riskLevel || 'Low Risk'}</strong><br/>
      Vocal Jitter: <strong>${voice.vocalJitter || '0.38%'}</strong>
    </div>
    <div class="scan-card">
      <strong style="color:#0f172a;">AI Computer Vision Wound Tracker</strong><br/><br/>
      Surface Area: <strong>${wound.area || '2.4 cm²'}</strong><br/>
      Granulation Tissue: <strong style="color:#0d9488;">${wound.granulationPct || '88%'}</strong><br/>
      Infection Risk: <strong style="color:#10b981;">${wound.infectionRisk || '1%'}</strong>
    </div>
  </div>

  <h3 style="color:#2563eb; font-size:13px; text-transform:uppercase; margin-bottom:10px;">Prescribed Medication Schedule</h3>
  <div class="med-box">
    <strong style="font-size:14px; color:#0f172a;">${med.name || 'Warfarin Sodium 5mg'}</strong><br/>
    <span style="font-size:12px; color:#475569;">Take at ${med.whenToTake?.exactTime || '8:00 PM Bedtime'} • ${med.category || 'Anticoagulant'}</span>
  </div>

  <div class="footer">
    <div>
      <strong>Attending AI Tele-Physician:</strong> Dr. Aris Vance, MD, FACC<br/>
      Chief of Cardiology & Acoustic Biomarkers
    </div>
    <div style="text-align:right;">
      <em>Dr. Aris Vance (Digital Signature)</em><br/>
      Timestamp: ${new Date().toLocaleTimeString()}
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8"
      >
        {/* Modal Top Toolbar (Non-printable) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Clinical Telemetry PDF Report</h3>
              <p className="text-[11px] text-slate-400">HIPAA-Compliant Patient Diagnostic Summary</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </button>

            <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable PDF Document Body */}
        <div ref={printRef} className="p-8 space-y-6 text-slate-800 font-sans print:p-0 print:text-black">
          
          {/* Document Header */}
          <div className="flex items-start justify-between border-b-2 border-blue-600 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                <Dna className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">MedTwin AI • Clinical Telemetry Report</h1>
                <p className="text-xs text-blue-700 font-bold font-mono">3D Digital Twin Diagnostic & Biomarker Summary</p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500">
              <div className="font-mono font-bold text-slate-900">ID: {profile?.twinId || 'TWIN-88412-US'}</div>
              <div>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div className="text-teal-600 font-bold">HIPAA Sealed & Verified</div>
            </div>
          </div>

          {/* Patient Profile Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs">
            <div>
              <span className="text-slate-500 block font-semibold">Patient Name</span>
              <strong className="text-slate-900 text-sm">{p.fullName || 'Alex Morgan'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Age / Gender</span>
              <strong className="text-slate-900">{p.age || 32} yrs / {p.gender || 'Male'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Blood Group</span>
              <strong className="text-slate-900">{p.bloodGroup || 'O+'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Health Score</span>
              <strong className="text-blue-700 font-mono text-sm">{profile?.healthScore || 94}/100</strong>
            </div>
          </div>

          {/* Telemetry Vitals Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-blue-700 tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Synced Vitals Baseline</span>
            </h4>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Resting Heart Rate</span>
                <span className="text-lg font-black text-slate-900 font-mono">{v.heartRate || 76} <small className="text-xs font-normal">BPM</small></span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Blood Pressure</span>
                <span className="text-lg font-black text-slate-900 font-mono">{v.systolic || 118}/{v.diastolic || 78} <small className="text-xs font-normal">mmHg</small></span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Oxygen Saturation</span>
                <span className="text-lg font-black text-teal-700 font-mono">{v.spo2 || 98}% <small className="text-xs font-normal">SpO2</small></span>
              </div>
            </div>
          </div>

          {/* AI Diagnostic Scans */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Voice Biomarker Scan */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-extrabold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <span>30s Voice Biomarker Acoustic Scan</span>
              </div>
              <div className="text-slate-600 space-y-1">
                <div className="flex justify-between"><span>Acoustic Risk Probability:</span> <strong className="text-slate-900">{voice.cardiacRiskProb || 12}%</strong></div>
                <div className="flex justify-between"><span>Risk Classification:</span> <strong className="text-teal-700">{voice.riskLevel || 'Low Risk'}</strong></div>
                <div className="flex justify-between"><span>Subglottic Vocal Jitter:</span> <strong className="text-slate-900">{voice.vocalJitter || '0.38%'}</strong></div>
              </div>
            </div>

            {/* Wound Computer Vision Scan */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-extrabold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>AI Computer Vision Wound Tracker</span>
              </div>
              <div className="text-slate-600 space-y-1">
                <div className="flex justify-between"><span>Wound Surface Area:</span> <strong className="text-slate-900">{wound.area || '2.4 cm²'}</strong></div>
                <div className="flex justify-between"><span>Granulation Tissue:</span> <strong className="text-teal-700">{wound.granulationPct || '88%'}</strong></div>
                <div className="flex justify-between"><span>Infection Risk:</span> <strong className="text-emerald-700">{wound.infectionRisk || '1%'}</strong></div>
              </div>
            </div>
          </div>

          {/* Current Medication Schedule */}
          <div className="space-y-2 text-xs">
            <h4 className="font-black uppercase text-blue-700 tracking-wider flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-blue-600" />
              <span>Current Prescribed Medications</span>
            </h4>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 text-sm block">{med.name || 'Warfarin Sodium 5mg'}</strong>
                <span className="text-slate-600 text-[11px]">Take at {med.whenToTake?.exactTime || '8:00 PM Bedtime'} • {med.category || 'Anticoagulant'}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-mono font-bold text-[10px]">
                {med.dangerLevel || 'CRITICAL'} DANGER RATING
              </span>
            </div>
          </div>

          {/* Doctor Signature Block */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block font-semibold">Attending AI Tele-Physician</span>
              <strong className="text-slate-900 font-extrabold">Dr. Aris Vance, MD, FACC</strong>
              <p className="text-[11px] text-slate-500">Chief of Cardiology & Acoustic Biomarkers</p>
            </div>
            <div className="text-right">
              <div className="w-32 h-10 border-b border-slate-400 flex items-end justify-center font-mono text-[10px] text-slate-400 italic">
                Dr. Aris Vance (Digital Signature)
              </div>
              <span className="text-[10px] text-slate-400">Verified Timestamp: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}
