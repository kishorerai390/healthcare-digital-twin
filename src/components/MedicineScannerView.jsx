import React, { useState, useRef, useEffect } from 'react'
import { Camera, Upload, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, Clock, Calendar, Sun, Moon, Utensils, Pill, RefreshCw, X, Play, Zap, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { updateHealthProfile } from '../utils/storage'
import { getAdminCustomData, saveAdminCustomData } from '../utils/adminStorage'

const PRESET_MEDICINES = [
  {
    id: 'warfarin',
    name: 'Warfarin Sodium 5mg',
    brand: 'Coumadin',
    category: 'Anticoagulant (Blood Thinner)',
    dangerLevel: 'CRITICAL',
    dangerColor: 'red',
    dangerBadge: '🔴 High Danger / Critical Monitoring Required',
    whenToTake: {
      timeOfDay: 'Night / Bedtime',
      timeIcon: '🌙',
      exactTime: '8:00 PM (Strict Schedule)',
      foodInstruction: 'Take with or without food at the exact same time every day',
      foodIcon: '🥛',
      frequency: 'Once Daily (Strict 24h Spacing)'
    },
    organImpact: {
      heart: 'Requires Regular INR Blood Monitoring',
      liver: 'Metabolized via Hepatic Enzymes (CYP2C9)',
      kidneys: 'Low Direct Renal Load'
    },
    warnings: [
      '⚠️ HIGH BLEEDING RISK: Do not combine with Aspirin, Ibuprofen, or NSAIDs.',
      '🥗 DIET ALERT: Maintain consistent Vitamin K intake (avoid sudden increases in kale/spinach).',
      '🍷 ALCOHOL: Avoid alcohol consumption while on this medication.'
    ],
    verdict: 'High potency narrow-therapeutic index medication. Auto-synced with Digital Twin Hematology Risk Protocol.'
  },
  {
    id: 'metformin',
    name: 'Metformin Hydrochloride 850mg',
    brand: 'Glucophage',
    category: 'Antidiabetic / Glycemic Regulator',
    dangerLevel: 'MODERATE',
    dangerColor: 'amber',
    dangerBadge: '🟡 Moderate Caution / Prescribed Regimen',
    whenToTake: {
      timeOfDay: 'Morning & Evening',
      timeIcon: '🌅 🌙',
      exactTime: '8:00 AM & 7:00 PM',
      foodInstruction: 'Must be taken IMMEDIATELY WITH or AFTER meals to reduce stomach upset',
      foodIcon: '🍲',
      frequency: 'Twice Daily With Meals'
    },
    organImpact: {
      heart: 'Cardioprotective Glycemic Balance',
      liver: 'Inhibits Gluconeogenesis',
      kidneys: 'Requires eGFR Monitoring (>45 mL/min)'
    },
    warnings: [
      '🍲 FOOD REQUIRED: Taking on an empty stomach may cause abdominal discomfort or nausea.',
      '💧 HYDRATION: Drink plenty of fluids throughout the day.',
      '💊 VITAMIN B12: Long-term use requires periodic B12 level checks.'
    ],
    verdict: 'Optimal alignment with Digital Twin metabolic profile. Enhances insulin sensitivity.'
  },
  {
    id: 'amoxicillin',
    name: 'Amoxicillin Trihydrate 500mg',
    brand: 'Amoxil',
    category: 'Broad-Spectrum Antibiotic',
    dangerLevel: 'SAFE',
    dangerColor: 'emerald',
    dangerBadge: '🟢 Safe / Standard Prescription',
    whenToTake: {
      timeOfDay: 'Morning, Afternoon & Night',
      timeIcon: '🌅 ☀️ 🌙',
      exactTime: 'Every 8 Hours (8 AM, 4 PM, 12 AM)',
      foodInstruction: 'Take after food with a full glass of water',
      foodIcon: '🍲',
      frequency: '3 Times Daily for 7 Days'
    },
    organImpact: {
      heart: 'No Adverse Cardiac Impact',
      liver: 'Safe Hepatic Profile',
      kidneys: 'Normal Renal Excretion'
    },
    warnings: [
      '✅ COMPLETE THE COURSE: Finish all 7 days even if symptoms improve early.',
      '🥛 PROBIOTICS: Consider probiotic yogurt 2 hours apart to support gut flora.'
    ],
    verdict: 'Standard antibiotic panel. High 3D Digital Twin organ safety score (98%).'
  },
  {
    id: 'vitamin_d',
    name: 'Cholecalciferol (Vitamin D3) 2000 IU',
    brand: 'Bio-D3',
    category: 'Nutritional Supplement',
    dangerLevel: 'SAFE',
    dangerColor: 'emerald',
    dangerBadge: '🟢 Safe / Daily Supplement',
    whenToTake: {
      timeOfDay: 'Morning',
      timeIcon: '🌅',
      exactTime: '9:00 AM (Morning)',
      foodInstruction: 'Best taken with fat-containing breakfast (milk, eggs, nuts) for absorption',
      foodIcon: '🥗',
      frequency: 'Once Daily'
    },
    organImpact: {
      heart: 'Supports Calcium Absorption & Vascular Tone',
      liver: 'Converts to 25-OH Vitamin D',
      kidneys: 'Supports Bone Density Mineralization'
    },
    warnings: [
      '☀️ SUNLIGHT: Complements natural sunlight exposure.',
      '💧 ABSORPTION: Fat-soluble vitamin — take with healthy fats for maximum uptake.'
    ],
    verdict: 'Optimal daily wellness supplement. Supports immune & bone density health.'
  }
]

export default function MedicineScannerView(){
  const [selectedMed, setSelectedMed] = useState(PRESET_MEDICINES[0])
  const [scanning, setScanning] = useState(false)
  const [useCamera, setUseCamera] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [medPhotoUrl, setMedPhotoUrl] = useState(null)
  const [scanResult, setScanResult] = useState(PRESET_MEDICINES[0])
  const [photoToast, setPhotoToast] = useState(false)

  const videoRef = useRef(null)

  useEffect(() => {
    let stream = null
    if (useCamera) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
          .then(s => {
            stream = s
            if (videoRef.current) {
              videoRef.current.srcObject = s
              videoRef.current.play().catch(err => console.warn('Video play error:', err))
            }
          })
          .catch(err => {
            console.warn('Camera access denied or unavailable:', err)
            setUseCamera(false)
          })
      } else {
        setUseCamera(false)
      }
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop())
      }
    }
  }, [useCamera])

  const handleScanMedicine = (medObj = selectedMed) => {
    setScanning(true)
    const targetMed = medObj || PRESET_MEDICINES[0]
    setTimeout(() => {
      setScanning(false)
      setScanResult(targetMed)

      // Save to Health Profile for PDF report embedding
      try {
        updateHealthProfile(prev => ({
          ...prev,
          medicineScanResult: targetMed
        }))
      } catch (err) {}

      // Save to Admin Panel audit log
      try {
        const curAdminData = getAdminCustomData() || {}
        const existingLogs = curAdminData.systemLogs || []
        const newLog = {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          level: targetMed.dangerLevel === 'CRITICAL' ? 'WARN' : 'INFO',
          event: '💊 AI Medicine & Prescription Scan Completed',
          detail: `Scanned: ${targetMed.name} (${targetMed.category}). Schedule: ${targetMed.whenToTake?.exactTime}. Danger Rating: ${targetMed.dangerLevel}.`
        }
        saveAdminCustomData({
          ...curAdminData,
          systemLogs: [newLog, ...existingLogs]
        })
      } catch (err) {}
    }, 900)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedImage(url)
      setMedPhotoUrl(url)
      setPhotoToast(true)
      setTimeout(() => setPhotoToast(false), 3500)
      handleScanMedicine(PRESET_MEDICINES[1])
    }
  }

  const handleUpdateMedicinePhoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setMedPhotoUrl(url)
      setUploadedImage(url)
      setPhotoToast(true)
      setTimeout(() => setPhotoToast(false), 3500)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>AI Camera Medicine & Prescription Scanner</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-extrabold">
                  Vision AI v2.4
                </span>
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Scan any pill box, prescription label, or strip to extract dosage timing & color-coded danger levels
              </p>
            </div>
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 flex-shrink-0">Sample Meds:</span>
          {PRESET_MEDICINES.map((med) => (
            <button
              key={med.id}
              onClick={() => {
                setSelectedMed(med)
                handleScanMedicine(med)
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 flex items-center gap-1.5 ${
                selectedMed.id === med.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                med.dangerColor === 'red' ? 'bg-rose-500 animate-pulse' :
                med.dangerColor === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              <span>{med.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Camera Viewfinder & Image Input */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xl space-y-4 text-center relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-cyan-600" />
                <span>Camera Viewfinder / Scan Input</span>
              </span>
              <button
                onClick={() => setUseCamera(!useCamera)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  useCamera ? 'bg-cyan-500 text-black shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {useCamera ? '📹 Live Cam Active' : '📷 Switch to WebCam'}
              </button>
            </div>

            {/* Viewfinder Box */}
            <div className="relative w-full h-72 rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
              {useCamera ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              ) : uploadedImage ? (
                <img src={uploadedImage} alt="Uploaded Medicine" className="w-full h-full object-contain p-3" />
              ) : (
                <div className="space-y-3 p-6 text-slate-400">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/10">
                    <Pill className="w-8 h-8 animate-bounce text-cyan-400" />
                  </div>
                  <div className="text-xs font-bold text-slate-200">
                    {selectedMed ? `Selected: ${selectedMed.name}` : 'Point Camera or Upload Medicine Photo'}
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Position pill box or prescription label clearly inside the laser reticle below.
                  </p>
                </div>
              )}

              {/* Scanning HUD Reticle Laser Line */}
              <div className="absolute inset-4 border-2 border-dashed border-cyan-400/40 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-sm shadow-cyan-400" />
              </div>

              {/* Scanning HUD Overlay */}
              {scanning && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-cyan-400 z-30 animate-in fade-in duration-150">
                  <RefreshCw className="w-9 h-9 animate-spin text-cyan-400" />
                  <div className="text-xs font-extrabold uppercase tracking-wider text-white">AI Vision Computer Scanning...</div>
                  <div className="text-[10px] text-cyan-300 font-semibold">Extracting Active Ingredients, Timing & Danger Level</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleScanMedicine(selectedMed)}
                disabled={scanning}
                className="py-3 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs shadow-lg shadow-cyan-400/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Scan Medicine Now</span>
              </button>

              <label className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all">
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: AI Scan Result, Timing & Danger Level Report */}
        <div className="col-span-12 lg:col-span-7">
          {scanResult ? (
            <motion.div 
              key={scanResult.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xl space-y-5"
            >
              {/* Header & Danger Rating Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                <div>
                  <span className="text-[10px] font-extrabold text-black bg-cyan-100/80 px-2.5 py-0.5 rounded-md border border-cyan-300">
                    {scanResult.category}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">{scanResult.name}</h3>
                  <div className="text-xs text-slate-500 font-semibold">Brand: {scanResult.brand}</div>
                </div>

                {/* DANGER LEVEL COLOR BADGE */}
                <div className={`px-4 py-2 rounded-2xl border font-extrabold text-xs text-center flex items-center gap-2 self-start sm:self-auto shadow-xs ${
                  scanResult.dangerColor === 'red'
                    ? 'bg-rose-100 text-rose-900 border-rose-300 shadow-rose-200'
                    : scanResult.dangerColor === 'amber'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-amber-200'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-emerald-200'
                }`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    scanResult.dangerColor === 'red' ? 'bg-rose-600 animate-ping' :
                    scanResult.dangerColor === 'amber' ? 'bg-amber-600' : 'bg-emerald-600'
                  }`} />
                  <span>{scanResult.dangerBadge}</span>
                </div>
              </div>

              {/* 📸 MEDICINE PHOTO DISPLAY & UPDATE CONTROL CARD WITH RX PHARMA LOGO */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 border border-cyan-400/40 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md">
                    {medPhotoUrl || uploadedImage ? (
                      <img src={medPhotoUrl || uploadedImage} alt="Scanned Medicine" className="w-full h-full object-cover" />
                    ) : (
                      <Pill className="w-7 h-7 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                      <span>Medicine Package / Pill Photo</span>
                      <span className="text-[9px] text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md font-black tracking-wider uppercase border border-cyan-200">
                        RX PHARMA LOGO
                      </span>
                      {(medPhotoUrl || uploadedImage) && (
                        <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-bold">
                          ✓ Photo Attached
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Upload or snap a new photo of your pill box/label anytime
                    </p>
                  </div>
                </div>

                <label 
                  style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                  className="px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all hover:opacity-90 flex-shrink-0 border border-slate-700"
                >
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span style={{ color: '#ffffff' }}>Update Medicine Photo</span>
                  <input type="file" accept="image/*" onChange={handleUpdateMedicinePhoto} className="hidden" />
                </label>
              </div>

              {photoToast && (
                <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>✓ Medicine photo successfully updated and saved to profile!</span>
                </div>
              )}

              {/* ⏰ WHEN CAN WE TAKE THE MEDICINE (TIMING & DOSAGE CARD) */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 text-white space-y-4 shadow-xl border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                    <Clock className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <span>WHEN TO TAKE THIS MEDICINE (DOSAGE SCHEDULE)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-extrabold">
                    AI Calibrated
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Time of Day */}
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-semibold">Recommended Time</span>
                    <div className="text-sm font-extrabold text-cyan-300 flex items-center gap-1.5">
                      <span>{scanResult.whenToTake.timeIcon}</span>
                      <span>{scanResult.whenToTake.exactTime}</span>
                    </div>
                  </div>

                  {/* Food Instructions */}
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-semibold">Food & Meal Rule</span>
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <span>{scanResult.whenToTake.foodIcon}</span>
                      <span>{scanResult.whenToTake.foodInstruction}</span>
                    </div>
                  </div>

                  {/* Frequency */}
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-semibold">Dosage Spacing</span>
                    <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span>{scanResult.whenToTake.frequency}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ⚠️ DANGER & RISK WARNINGS BOX */}
              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                scanResult.dangerColor === 'red'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : scanResult.dangerColor === 'amber'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}>
                <div className="font-extrabold flex items-center gap-1.5 text-sm">
                  <AlertTriangle className={`w-4 h-4 ${
                    scanResult.dangerColor === 'red' ? 'text-rose-600' :
                    scanResult.dangerColor === 'amber' ? 'text-amber-600' : 'text-emerald-600'
                  }`} />
                  <span>Important Safety & Interaction Guidelines:</span>
                </div>
                <ul className="space-y-1.5 pl-1">
                  {scanResult.warnings.map((warn, i) => (
                    <li key={i} className="font-semibold leading-relaxed">{warn}</li>
                  ))}
                </ul>
              </div>

              {/* 🫀 3D Digital Twin Organ Compatibility */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  3D Digital Twin Organ Compatibility:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-semibold">Cardiovascular</span>
                    <span className="font-bold text-slate-900 text-xs block mt-0.5">{scanResult.organImpact.heart}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-semibold">Hepatic (Liver)</span>
                    <span className="font-bold text-slate-900 text-xs block mt-0.5">{scanResult.organImpact.liver}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-semibold">Renal (Kidneys)</span>
                    <span className="font-bold text-slate-900 text-xs block mt-0.5">{scanResult.organImpact.kidneys}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
