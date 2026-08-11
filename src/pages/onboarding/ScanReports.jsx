import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import OnboardingStepper from '../../components/OnboardingStepper'
import AITelemetryCard from '../../components/AITelemetryCard'
import { getHealthProfile, saveHealthProfile } from '../../utils/storage'
import { useAuth } from '../../context/AuthContext'
import { Upload, FileText, CheckCircle2, ShieldCheck, ArrowRight, X, Sparkles, AlertCircle, FileCheck, Check } from 'lucide-react'

export default function ScanReports(){
  const nav = useNavigate()
  const { currentUser, loading: authLoading } = useAuth()

  const existing = getHealthProfile() || {}
  const scanData = existing.scanReports || {}

  useEffect(() => {
    // Guard check: Re-fetch fresh profile from storage
    const currentProfile = getHealthProfile() || {}
    const vt = currentProfile.vitals || {}
    if (!authLoading && (!vt.heartRate || !vt.systolic)) {
      nav('/onboarding/vitals')
    }
  }, [authLoading])

  const [hasReportsOption, setHasReportsOption] = useState(scanData.hasReports !== undefined ? scanData.hasReports : null) // true, false, or null
  const [uploadedFiles, setUploadedFiles] = useState(scanData.files || [])
  const [saving, setSaving] = useState(false)

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length) {
      setHasReportsOption(true)
      const newFiles = files.map(file => ({
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type.includes('pdf') ? 'PDF Document' : 'Scan Image',
        uploadDate: new Date().toLocaleDateString()
      }))
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }

  const handleComplete = (e) => {
    e.preventDefault()
    setSaving(true)

    const updatedProfile = {
      ...existing,
      scanReports: {
        hasReports: hasReportsOption === true,
        files: hasReportsOption === true ? uploadedFiles : [],
        completedAt: new Date().toISOString()
      }
    }

    saveHealthProfile(updatedProfile)

    // Redirect to Dashboard immediately
    setTimeout(() => {
      setSaving(false)
      nav('/dashboard')
    }, 400)
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 text-slate-100 font-sans relative overflow-x-hidden flex items-center justify-center">
      {/* Background Ambient Glow Spheres */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <div className="w-full max-w-3xl bg-white/95 border border-slate-200/80 p-6 sm:p-10 rounded-3xl shadow-2xl space-y-6 backdrop-blur-xl text-slate-900 relative z-10">
        
        {/* Top Stepper Header */}
        <OnboardingStepper currentStep={5} />

        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Do you have existing Scan Reports?</h2>
          <p className="text-slate-500 text-sm mt-1">
            Upload your existing blood tests, MRI scans, ECGs, or X-Rays to enhance your Digital Twin accuracy, or choose "None".
          </p>
        </div>

        <form onSubmit={handleComplete} className="space-y-6">
          
          {/* Main Selection Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Option 1: Upload Reports */}
            <div
              onClick={() => setHasReportsOption(true)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-2 relative ${
                hasReportsOption === true
                  ? 'border-cyan-500 bg-cyan-50/40 shadow-md ring-2 ring-cyan-400/20'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                {hasReportsOption === true && (
                  <span className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                )}
              </div>
              <div className="font-bold text-slate-900 text-base">Yes, Upload Scan Reports</div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Add blood work, MRI, CT scan, ECG, or lab reports to train your Digital Twin.
              </p>
            </div>

            {/* Option 2: None / Skip */}
            <div
              onClick={() => {
                setHasReportsOption(false)
                setUploadedFiles([])
              }}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-2 relative ${
                hasReportsOption === false
                  ? 'border-slate-900 bg-slate-100 shadow-md'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                  <X className="w-5 h-5" />
                </div>
                {hasReportsOption === false && (
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                )}
              </div>
              <div className="font-bold text-slate-900 text-base">None / Skip for Now</div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Choose this if you don't have any scan reports available right now. You can upload them anytime later.
              </p>
            </div>
          </div>

          {/* Upload Dropzone Box (If Yes Selected) */}
          {hasReportsOption === true && (
            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4 animate-in fade-in duration-200 shadow-sm">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Upload Files (Blood Tests, MRI, X-Ray, Prescriptions)
              </label>

              <div className="border-2 border-dashed border-slate-300 hover:border-cyan-500 rounded-2xl p-6 text-center transition-all bg-slate-50/60 flex flex-col items-center justify-center cursor-pointer">
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">Click to upload files</span>
                  <span className="text-xs text-slate-400 mt-1">Supports PDF, PNG, JPG files up to 25MB</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Uploaded File List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700">Uploaded Documents ({uploadedFiles.length}):</span>
                  <div className="space-y-2">
                    {uploadedFiles.map(file => (
                      <div key={file.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <FileCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-slate-900">{file.name}</div>
                            <div className="text-slate-400 text-[11px]">{file.type} • {file.size}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="text-slate-400 hover:text-rose-600 font-bold p-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Diagnostic Calibration & Hologram Sync Analysis Card */}
          <div className="mt-6 mb-6">
            <AITelemetryCard
              title="AI Diagnostic Calibration & Holographic Twin Sync"
              promptText="Select your Scan Reports option above to enable 3D Digital Twin Diagnostic Accuracy Calibration."
              isComplete={hasReportsOption !== null}
              statusLevel={hasReportsOption ? 'Enhanced Multi-Organ Sync' : 'Standard Physiological Model'}
              statusColor={hasReportsOption ? 'emerald' : 'cyan'}
              metrics={[
                { label: 'Diagnostic Coverage', value: hasReportsOption ? `${uploadedFiles.length} Report Files` : 'Baseline Parameters' },
                { label: 'Twin Model Accuracy', value: hasReportsOption ? '98.8% Precision' : '98.4% Precision' },
                { label: 'Organ Telemetry', value: 'Active Holographic Engine' }
              ]}
              insight={
                hasReportsOption !== null
                  ? hasReportsOption
                    ? `Diagnostic scans uploaded successfully (${uploadedFiles.length} files). 3D Digital Twin organ parameters are calibrated to exact clinical imaging telemetry.`
                    : 'Baseline physiological model initialized. 3D Digital Twin uses age, lifestyle, and vital baselines for predictive AI simulation.'
                  : ''
              }
            />
          </div>

          {/* Form Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => nav('/onboarding/vitals')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
            >
              ← Back
            </button>

            <button
              type="submit"
              disabled={saving || hasReportsOption === null}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-600/30 border border-blue-500 transition-all flex items-center gap-2 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
                  <span>Saving Digital Twin Profile...</span>
                </>
              ) : (
                <>
                  <span>Complete Onboarding & Launch Digital Twin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
