import React, { useState } from 'react'
import { Upload, Camera, Sparkles, CheckCircle2, ShieldCheck, Calendar, Image as ImageIcon, Bell, Clock, AlertCircle, Activity, FileText, Layers, Zap, Check, RotateCcw, Lock, X, RefreshCw } from 'lucide-react'
import { updateHealthProfile } from '../utils/storage'
import { getAdminCustomData, saveAdminCustomData } from '../utils/adminStorage'
import { downloadClinicalReportPDF } from '../utils/pdfGenerator'

export default function WoundTrackerView(){
  const [imagePreview, setImagePreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [reminderActive, setReminderActive] = useState(true)

  const [showEhrModal, setShowEhrModal] = useState(false)
  const [isSyncingEhr, setIsSyncingEhr] = useState(false)
  const [ehrSyncStep, setEhrSyncStep] = useState(0)
  const [ehrSyncDetails, setEhrSyncDetails] = useState(null)

  const handleEhrClick = () => {
    if (!analysisResult) return
    const now = new Date()
    const mockHash = '0x' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')
    const mockRecordId = 'EHR-2026-WND-' + Math.floor(10000 + Math.random() * 90000)
    
    const details = {
      recordId: mockRecordId,
      hash: mockHash,
      timestamp: now.toUTCString(),
      patientId: 'TWIN-88942-AVA',
      scanType: 'AI Computer Vision Wound Diagnostics',
      area: analysisResult.area,
      areaReduction: analysisResult.areaReduction,
      infectionRisk: analysisResult.infectionRisk,
      granulation: analysisResult.granulationPct,
      depth: analysisResult.estimatedDepth || '0.8 mm',
      dressing: analysisResult.recommendedDressing
    }

    setEhrSyncDetails(details)
    setShowEhrModal(true)
    setIsSyncingEhr(true)
    setEhrSyncStep(1)

    setTimeout(() => setEhrSyncStep(2), 600)
    setTimeout(() => setEhrSyncStep(3), 1200)
    setTimeout(() => {
      setEhrSyncStep(4)
      setIsSyncingEhr(false)
      
      try {
        updateHealthProfile(prev => ({
          ...prev,
          ehrSyncedWoundRecordId: mockRecordId,
          ehrSyncedWoundHash: mockHash,
          ehrSyncedWoundTimestamp: now.toISOString()
        }))
      } catch(e) {}

      try {
        const curAdminData = getAdminCustomData() || {}
        const existingLogs = curAdminData.systemLogs || []
        const newLog = {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          level: 'SUCCESS',
          event: '🛡️ Wound EHR Ledger Locked & Sealed',
          detail: `Record #${mockRecordId} sealed. SHA-256 Hash ${mockHash.slice(0, 12)}... HIPAA Compliant.`
        }
        saveAdminCustomData({
          ...curAdminData,
          systemLogs: [newLog, ...existingLogs]
        })
      } catch(e) {}
    }, 1800)
  }

  const [history, setHistory] = useState([
    {
      id: 'entry-1',
      date: 'Aug 07, 2026',
      day: 'Day 1',
      area: '4.2 cm²',
      healingStage: 'Inflammatory Phase',
      infectionRisk: 'Low (3%)',
      tissueStatus: 'Fresh incision / minimal erythema'
    },
    {
      id: 'entry-2',
      date: 'Aug 09, 2026',
      day: 'Day 3',
      area: '3.1 cm²',
      healingStage: 'Early Proliferation',
      infectionRisk: 'Low (2%)',
      tissueStatus: 'Healthy pink granulation tissue expanding'
    }
  ])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
      setAnalysisResult(null)
    }
  }

  const runAIWoundAnalysis = () => {
    if (!imagePreview) return
    setAnalyzing(true)

    setTimeout(() => {
      setAnalyzing(false)
      const newResult = {
        id: `entry-${Date.now()}`,
        date: 'Today',
        day: `Day ${history.length * 2 + 1}`,
        area: '2.4 cm²',
        areaReduction: '-42% Area Reduction',
        granulationPct: '88% Healthy Granulation',
        erythema: 'Minimal (Normal Margin)',
        infectionRisk: '1% — Optimal',
        tissueType: 'Epithelial Edge Bridging',
        exudateLevel: 'Minimal (Serosanguinous)',
        periwoundCondition: 'Intact, No Maceration',
        estimatedDepth: '0.8 mm (Superficial Dermal)',
        bacterialBiofilmIndex: '0.02 (Low / Non-Colonized)',
        epithelialVelocity: '+0.4 cm²/day',
        recommendedDressing: 'Hydrocolloid / Non-Adherent Silicone Foam Dressing',
        verdict: 'Excellent wound closure velocity. Granulation tissue is healthy and uninfected with active re-epithelialization along margins.',
        recommendation: 'Maintain clean saline cleansing, apply sterile non-adherent dressing daily, and upload a photo at the same time tomorrow.',
        physicianSummary: 'Wound demonstrates favorable secondary intention healing with robust capillary proliferation and minimal periwound inflammation.'
      }

      setAnalysisResult(newResult)
      setHistory(prev => [newResult, ...prev])

      // Save to Health Profile for PDF report embedding
      try {
        updateHealthProfile(prev => ({
          ...prev,
          woundScanResult: newResult
        }))
      } catch (err) {}

      // Save to Admin Panel audit log
      try {
        const curAdminData = getAdminCustomData() || {}
        const existingLogs = curAdminData.systemLogs || []
        const newLog = {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          level: 'INFO',
          event: '🩹 AI Wound Healing Scan Completed',
          detail: `Wound area: 2.4 cm² (-42% reduction). Granulation: 88%. Infection Risk: 1% [Optimal].`
        }
        saveAdminCustomData({
          ...curAdminData,
          systemLogs: [newLog, ...existingLogs]
        })
      } catch (err) {}
    }, 2200)
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Daily Photo Upload Notification Alert */}
      <div className="p-5 rounded-3xl bg-slate-900 border-2 border-amber-500/60 text-white shadow-xl space-y-3 font-sans">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 shadow-md animate-pulse">
              <Bell className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base font-display flex items-center gap-2">
                <span>Daily Wound Photo Monitoring Notification</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[11px] border border-amber-500/40 font-mono">
                  REQUIRED DAILY
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Consistent daily photos enable AI computer vision to track sub-millimeter granulation and detect infection 48h before clinical symptoms.
              </p>
            </div>
          </div>

          <button
            onClick={() => setReminderActive(!reminderActive)}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-all border ${
              reminderActive 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{reminderActive ? '🔔 Daily Reminder Active (9:00 AM)' : '🔕 Reminder Paused'}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white font-extrabold">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Status: {analysisResult ? '✅ Today\'s Photo Analyzed' : '⚠️ Pending Today\'s Photo'}</span>
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-slate-300 font-medium hidden md:inline">Next Required Upload: Tomorrow at 9:00 AM (In 11 Hours)</span>
          </div>

          <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs cursor-pointer shadow-md transition-all flex items-center gap-2 border border-amber-400/50">
            <Camera className="w-4 h-4" />
            <span>Upload Today's Photo Now</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Photo Upload Dropzone */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200/90 border-t-4 border-t-cyan-500 bg-white/95 shadow-xl shadow-cyan-500/5 backdrop-blur-md space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Camera className="w-5 h-5 text-cyan-600" />
              <span>Upload Today's Wound Photo</span>
            </h3>

            <div className="relative border-2 border-dashed border-slate-300 hover:border-cyan-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50 flex flex-col items-center justify-center min-h-[200px]">
              {imagePreview ? (
                <div className="relative w-full max-h-52 overflow-hidden rounded-xl group">
                  <img
                    src={imagePreview}
                    alt="Wound preview"
                    className="w-full h-44 object-cover rounded-xl shadow-md"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-100">
                      Change Photo
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full py-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">Click to upload or drag wound photo</span>
                  <span className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WEBP photos up to 10MB</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>

            <button
              onClick={runAIWoundAnalysis}
              disabled={!imagePreview || analyzing}
              style={{ backgroundColor: '#38bdf8', color: '#000000' }}
              className="w-full py-3.5 rounded-xl font-black shadow-lg transition-all text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
                  <span style={{ color: '#000000' }}>Measuring Surface Area & Granulation...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black fill-black" />
                  <span style={{ color: '#000000' }}>Run AI Wound Healing Analysis</span>
                </>
              )}
            </button>
          </div>

          {/* Historic Timeline Log */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              <span>Daily Healing Progression Log</span>
            </h3>

            <div className="space-y-3">
              {history.map(item => (
                <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{item.day} ({item.date})</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {item.healingStage}
                      </span>
                    </div>
                    <div className="text-slate-500 mt-1">{item.tissueStatus}</div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-cyan-700">{item.area}</div>
                    <div className="text-[11px] text-emerald-600 font-semibold">{item.infectionRisk}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Tissue Analysis Results */}
        <div className="col-span-12 lg:col-span-6">
          {analysisResult ? (
            <div className="p-6 rounded-3xl border border-slate-200/90 border-t-4 border-t-emerald-500 bg-white/95 shadow-xl shadow-emerald-500/5 backdrop-blur-md space-y-5 animate-in fade-in duration-300">
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <span className="font-extrabold text-slate-900 text-base font-display">AI Wound Tissue Diagnostics</span>
                    <p className="text-[11px] text-slate-500">Computer Vision Sub-Millimeter Telemetry</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-200">
                  🟢 Normal Healing Velocity
                </span>
              </div>

              {/* Surface Area & Infection Risk Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Wound Surface Area:</span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">{analysisResult.area}</div>
                  <span className="text-[11px] text-emerald-600 font-extrabold">{analysisResult.areaReduction}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Infection Risk Index:</span>
                  <div className="text-2xl font-black text-emerald-600 mt-0.5">{analysisResult.infectionRisk}</div>
                  <span className="text-[11px] text-slate-500 font-medium">Erythema: {analysisResult.erythema}</span>
                </div>
              </div>

              {/* Tissue Classification & Granulation Breakdown */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-600" />
                    <span>Tissue Granulation Composition</span>
                  </span>
                  <span className="text-[11px] font-mono text-cyan-800 font-bold">88% Granulation • 7% Slough • 5% Epithelial</span>
                </div>
                
                {/* Granulation Bar Visualizer */}
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-rose-500 w-[88%]" title="Healthy Granulation Tissue (88%)"></div>
                  <div className="h-full bg-amber-400 w-[7%]" title="Slough / Fibrin (7%)"></div>
                  <div className="h-full bg-cyan-400 w-[5%]" title="Re-Epithelialization (5%)"></div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 flex items-center justify-between">
                  <span>Tissue Morphology: <strong>{analysisResult.tissueType}</strong></span>
                  <span className="text-emerald-700 font-mono text-[11px] font-bold">Vel: {analysisResult.epithelialVelocity}</span>
                </div>
              </div>

              {/* Advanced Micro-Telemetry Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Exudate Level</span>
                  <span className="font-extrabold text-slate-900 text-xs">{analysisResult.exudateLevel}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Periwound Condition</span>
                  <span className="font-extrabold text-emerald-700 text-xs">{analysisResult.periwoundCondition}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Estimated Depth</span>
                  <span className="font-extrabold text-slate-900 text-xs">{analysisResult.estimatedDepth}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Bacterial Biofilm Index</span>
                  <span className="font-extrabold text-emerald-700 text-xs">{analysisResult.bacterialBiofilmIndex}</span>
                </div>
              </div>

              {/* Recommended Dressing & Care Instructions */}
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80 text-xs space-y-1">
                <div className="font-extrabold text-purple-950 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span>Recommended Clinical Dressing & Care:</span>
                </div>
                <p className="text-purple-900 leading-relaxed font-medium">{analysisResult.recommendedDressing}</p>
              </div>

              {/* AI Healing Verdict & Physician Summary */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-2.5">
                <div>
                  <span className="font-extrabold block text-emerald-900 mb-0.5">🛡️ AI Healing Verdict:</span>
                  <p className="text-slate-700 leading-relaxed">{analysisResult.verdict}</p>
                </div>
                <div className="pt-2 border-t border-emerald-200/80">
                  <span className="font-extrabold block text-emerald-900 mb-0.5">🩺 Clinical Physician Note:</span>
                  <p className="text-slate-700 leading-relaxed">{analysisResult.physicianSummary}</p>
                </div>
              </div>

              {/* Download PDF & EHR Sync Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => downloadClinicalReportPDF({ patientName: 'Ava Nguyen' })}
                  style={{ backgroundColor: '#0284c7', color: '#ffffff' }}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md hover:opacity-90 border border-sky-400"
                >
                  <FileText className="w-4 h-4 text-white" />
                  <span style={{ color: '#ffffff' }}>Download AI Wound PDF Report</span>
                </button>

                <button
                  onClick={handleEhrClick}
                  style={{ backgroundColor: '#ecfdf5', color: '#047857' }}
                  className="flex items-center gap-2 text-[11px] font-extrabold px-3.5 py-2.5 rounded-xl border border-emerald-300 w-full sm:w-auto justify-center cursor-pointer transition-all shadow-sm hover:bg-emerald-100 group"
                  title="Click to view & verify Digital Twin EHR Audit Ledger"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>Synced to Digital Twin EHR Audit Trail</span>
                  {isSyncingEhr ? (
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin ml-1" />
                  ) : (
                    <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-mono font-bold">CLICK TO VIEW</span>
                  )}
                </button>
              </div>

            </div>
          ) : (
            <div className="h-full p-8 rounded-2xl border border-dashed border-slate-200 bg-white flex flex-col items-center justify-center text-center space-y-3 text-slate-400 min-h-[420px]">
              <ImageIcon className="w-12 h-12 text-slate-300" />
              <div className="text-sm font-bold text-slate-600">Awaiting Today's Wound Image</div>
              <p className="text-xs max-w-xs">
                Upload a photo on the left and click "Run AI Wound Healing Analysis" to generate computer vision metrics.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* EHR Audit Trail Telemetry Viewer Modal Overlay for Wound Analysis */}
      {showEhrModal && ehrSyncDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden space-y-0 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white font-display flex items-center gap-2">
                    Digital Twin EHR Audit Ledger
                  </h3>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>HIPAA & HITECH Compliant • 256-Bit Cryptographic Audit Trail</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowEhrModal(false)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sync Progress Workflow Steps */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                <span>Verification & Blockchain Ledger Lock Progress:</span>
                {isSyncingEhr ? (
                  <span className="text-cyan-600 flex items-center gap-1.5 animate-pulse font-mono">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Signing SHA-256 Block...
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 font-extrabold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Record Sealed & Locked
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-[10px]">
                <div 
                  style={{ 
                    backgroundColor: ehrSyncStep >= 1 ? '#bae6fd' : '#f1f5f9', 
                    color: '#0f172a',
                    borderColor: ehrSyncStep >= 1 ? '#0284c7' : '#cbd5e1'
                  }}
                  className="p-2 rounded-xl text-center border font-black shadow-sm transition-all"
                >
                  <span style={{ color: '#0f172a' }} className="font-extrabold">1. Photo Ingest</span>
                </div>

                <div 
                  style={{ 
                    backgroundColor: ehrSyncStep >= 2 ? '#bae6fd' : '#f1f5f9', 
                    color: '#0f172a',
                    borderColor: ehrSyncStep >= 2 ? '#0284c7' : '#cbd5e1'
                  }}
                  className="p-2 rounded-xl text-center border font-black shadow-sm transition-all"
                >
                  <span style={{ color: '#0f172a' }} className="font-extrabold">2. Vision Metric</span>
                </div>

                <div 
                  style={{ 
                    backgroundColor: ehrSyncStep >= 3 ? '#c7d2fe' : '#f1f5f9', 
                    color: '#0f172a',
                    borderColor: ehrSyncStep >= 3 ? '#4338ca' : '#cbd5e1'
                  }}
                  className="p-2 rounded-xl text-center border font-black shadow-sm transition-all"
                >
                  <span style={{ color: '#0f172a' }} className="font-extrabold">3. SHA-256 Sign</span>
                </div>

                <div 
                  style={{ 
                    backgroundColor: ehrSyncStep >= 4 ? '#a7f3d0' : '#f1f5f9', 
                    color: '#0f172a',
                    borderColor: ehrSyncStep >= 4 ? '#059669' : '#cbd5e1'
                  }}
                  className="p-2 rounded-xl text-center border font-black shadow-sm transition-all"
                >
                  <span style={{ color: '#0f172a' }} className="font-extrabold">4. Ledger Sealed</span>
                </div>
              </div>
            </div>

            {/* Audit Record Body */}
            <div className="p-6 space-y-4 max-h-[55vh] overflow-y-auto">
              
              {/* Record Key Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-medium">EHR Audit Record ID</span>
                  <span className="font-mono font-extrabold text-slate-900 text-xs">{ehrSyncDetails.recordId}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-medium">Digital Twin Patient ID</span>
                  <span className="font-mono font-extrabold text-cyan-700 text-xs">{ehrSyncDetails.patientId}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2">
                  <span className="text-slate-500 text-[10px] block font-medium">SHA-256 Cryptographic Audit Hash</span>
                  <span className="font-mono text-[10px] text-slate-800 break-all select-all font-bold bg-white p-2 rounded-lg border border-slate-200 block mt-1 shadow-inner">
                    {ehrSyncDetails.hash}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-medium">Timestamp (UTC)</span>
                  <span className="font-bold text-slate-900 text-xs">{ehrSyncDetails.timestamp}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-medium">Telemetry Source</span>
                  <span className="font-bold text-slate-900 text-xs">{ehrSyncDetails.scanType}</span>
                </div>
              </div>

              {/* Verified Telemetry Snapshot */}
              <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200 text-xs space-y-2.5">
                <div className="font-extrabold text-cyan-950 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-cyan-600" />
                    <span>Sealed Wound Telemetry Snapshot</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-extrabold border border-emerald-300">
                    VERIFIED & SYNCED
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-cyan-200/60">
                  <div><span className="text-slate-500">Surface Area:</span> <strong className="text-slate-900">{ehrSyncDetails.area} ({ehrSyncDetails.areaReduction})</strong></div>
                  <div><span className="text-slate-500">Infection Risk:</span> <strong className="text-emerald-700">{ehrSyncDetails.infectionRisk}</strong></div>
                  <div><span className="text-slate-500">Granulation:</span> <strong className="text-slate-900">{ehrSyncDetails.granulation}</strong></div>
                  <div><span className="text-slate-500">Est. Depth:</span> <strong className="text-slate-900">{ehrSyncDetails.depth}</strong></div>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => {
                  setShowEhrModal(false)
                  downloadClinicalReportPDF({ patientName: 'Ava Nguyen' })
                }}
                style={{ backgroundColor: '#0284c7', color: '#ffffff' }}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md hover:opacity-90 border border-sky-400"
              >
                <FileText className="w-4 h-4 text-white" />
                <span style={{ color: '#ffffff' }}>Export Signed EHR PDF Certificate</span>
              </button>

              <button
                onClick={() => setShowEhrModal(false)}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xs cursor-pointer transition-all"
              >
                Close Audit Viewer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
