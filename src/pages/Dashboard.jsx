import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import DigitalTwin from '../components/DigitalTwin'
import HealthCard from '../components/HealthCard'
import HealthScore from '../components/HealthScore'
import AIHealthReview from '../components/AIHealthReview'
import NearbyHospitals from '../components/NearbyHospitals'
import PreventiveRiskHub from '../components/PreventiveRiskHub'
import VoiceAnalysisView from '../components/VoiceAnalysisView'
import WoundTrackerView from '../components/WoundTrackerView'
import MedicineScannerView from '../components/MedicineScannerView'
import AIConsultationView from '../components/AIConsultationView'
import WearableSyncCard from '../components/WearableSyncCard'
import BiologicalAgeCard from '../components/BiologicalAgeCard'
import PitchDemoMode from '../components/PitchDemoMode'
import EmergencyDispatchModal from '../components/EmergencyDispatchModal'
import VitalsGraphView from '../components/VitalsGraphView'
import ClinicalPDFReportModal from '../components/ClinicalPDFReportModal'
import MedicationAdherenceWidget from '../components/MedicationAdherenceWidget'
import GuardianAlertModal from '../components/GuardianAlertModal'
import { getHealthProfile, clearHealthProfile } from '../utils/storage'
import { clearAdminSession } from '../utils/adminStorage'
import { calculateBMI, calculateHealthScore, generateInsights, generateRiskAnalysis } from '../utils/healthUtils'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import LanguageSelector from '../components/LanguageSelector'
import ThemeToggle from '../components/ThemeToggle'
import LiveECGHeaderTicker from '../components/LiveECGHeaderTicker'
import InsightsCarousel from '../components/InsightsCarousel'
import ClinicalInsightsOptimizationHub from '../components/ClinicalInsightsOptimizationHub'
import MobileHeader from '../components/mobile/MobileHeader'
import MobileNavigationFolder from '../components/mobile/MobileNavigationFolder'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RefreshCw, LogOut, Trash2, Activity, Mic, Camera, ShieldAlert, Sparkles,
  Home, CheckCircle2, Pill, ShieldCheck, User, UserCheck, Dna, HeartPulse,
  Lock, Shield, Edit3, Zap, FileText, Bell
} from 'lucide-react'

const defaultProfile = {
  personalInfo: { fullName: 'Alex Morgan', age: 32, gender: 'Male', height: '172', weight: '68', bloodGroup: 'O+', country: 'United States', state: 'California', city: 'San Francisco', location: 'San Francisco, California, United States' },
  lifestyle: { dailySteps: 8420, sleepDuration: 7.5, exerciseFreq: '3-4' },
  medicalHistory: { conditions: [], bloodGlucose: 98 },
  vitals: { heartRate: 76, systolic: 118, diastolic: 78, glucose: 98, spo2: 98, temperature: 36.7 }
}

export default function Dashboard() {
  const nav = useNavigate()
  const { t } = useLanguage()
  const { currentUser, healthProfile, lifestyleProfile, loading, signout } = useAuth()

  // Unified Mode Switcher: 'twin' | 'voice' | 'wound' | 'risk'
  const [activeMode, setActiveMode] = useState('twin')
  const [cloudSync, setCloudSync] = useState(true)
  const [aiAlerts, setAiAlerts] = useState(true)
  const [copiedId, setCopiedId] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncToast, setSyncToast] = useState(null)
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false)
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false)
  const [isGuardianModalOpen, setIsGuardianModalOpen] = useState(false)

  const handleSyncHealthData = () => {
    setSyncing(true)
    setSyncToast({ step: 1, message: '📡 Connecting to Wearables & Vital Sensors...' })

    setTimeout(() => {
      setSyncToast({ step: 2, message: '🧬 Recalibrating 3D Holographic Twin Physiology...' })
    }, 900)

    setTimeout(() => {
      setSyncing(false)
      setSyncToast({ step: 3, message: '✓ Health parameters successfully synchronized with Digital Twin!' })
    }, 1800)

    setTimeout(() => {
      setSyncToast(null)
    }, 4500)
  }

  const handleCopyTwinId = () => {
    const idToCopy = profile?.twinId || 'TWIN-88412-US'
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(idToCopy)
      } else {
        const input = document.createElement('input')
        input.value = idToCopy
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }
    } catch (err) {
      console.warn('Clipboard write fallback info:', err)
    }
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  // Initialize state synchronously so profile is NEVER null
  const [profile, setProfile] = useState(() => {
    const p = healthProfile || getHealthProfile() || defaultProfile
    const bmi = calculateBMI(p.personalInfo?.weight || 68, p.personalInfo?.height || 172)
    const scoreObj = calculateHealthScore(p)
    const insights = generateInsights(p)
    const risks = generateRiskAnalysis(p)
    return { ...p, bmi, healthScore: scoreObj?.score || 94, scoreBreakdown: scoreObj?.breakdown, insights, risks }
  })

  useEffect(() => {
    let p = healthProfile || getHealthProfile() || defaultProfile
    const merged = {
      ...p,
      personalInfo: { ...defaultProfile.personalInfo, ...(p.personalInfo || {}), fullName: p.personalInfo?.fullName || currentUser?.displayName || 'Alex Morgan' },
      lifestyle: lifestyleProfile || p.lifestyle || defaultProfile.lifestyle,
    }
    const bmi = calculateBMI(merged.personalInfo?.weight, merged.personalInfo?.height)
    const scoreObj = calculateHealthScore(merged)
    const insights = generateInsights(merged)
    const risks = generateRiskAnalysis(merged)
    setProfile({ ...merged, bmi, healthScore: scoreObj?.score || 94, scoreBreakdown: scoreObj?.breakdown, insights, risks })
  }, [healthProfile, lifestyleProfile, currentUser])

  const p = profile?.personalInfo || defaultProfile.personalInfo

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 w-full relative overflow-x-hidden font-sans">
      {/* Background Ambient Glow Spheres */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[160px] pointer-events-none z-0"></div>

      <Sidebar activeMode={activeMode} setActiveMode={setActiveMode} />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto relative z-10 space-y-4">
        {/* Live ECG Telemetry Waveform Header Ticker */}
        <LiveECGHeaderTicker
          heartRate={profile?.vitals?.heartRate || 78}
          systolic={profile?.vitals?.systolic || 118}
          diastolic={profile?.vitals?.diastolic || 78}
          spo2={profile?.vitals?.spo2 || 98}
        />

        {/* Mobile Header Drawer (< md screens) */}
        <MobileHeader
          onOpenPDFModal={() => setIsPDFModalOpen(true)}
          onOpenGuardianModal={() => setIsGuardianModalOpen(true)}
          onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          onSyncHealthData={handleSyncHealthData}
          syncing={syncing}
        />

        {/* Desktop Header (md+ screens) */}
        <header className="hidden md:flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-blue-950 text-xs font-black uppercase tracking-wider flex items-center gap-1 border border-sky-300 shadow-2xs">
                <Dna className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span className="text-blue-950 font-black">3D Digital Twin • {profile?.twinId || 'TWIN-88412-US'}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-950 text-xs font-black uppercase tracking-wider flex items-center gap-1 border border-teal-300 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-teal-950 font-black">256-Bit HIPAA Encrypted</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-2">
              <span>{t('goodMorning')}, {p.fullName}</span>
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            </h1>
            <div className="text-slate-700 text-xs sm:text-sm font-bold mt-0.5">{t('digitalTwinOverview')}</div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => nav('/')}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-900 font-black transition-colors text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              title="Return to Home Landing Page"
            >
              <Home className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-slate-900 font-black">Back to Home</span>
            </button>

            <LanguageSelector />
            <ThemeToggle />

            <button
              onClick={() => setIsPDFModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-950 font-black transition-colors text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              title="Download & Print Clinical PDF Telemetry Report"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-sky-950 font-black">Clinical PDF Report</span>
            </button>

            <button
              onClick={() => setIsGuardianModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-teal-300 bg-teal-50 hover:bg-teal-100 text-teal-950 font-black transition-colors text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              title="Configure Guardian SMS Alerts"
            >
              <Bell className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-teal-950 font-black">Guardian Alerts</span>
            </button>

            <button
              onClick={() => {
                clearAdminSession()
                nav('/admin')
              }}
              className="px-4 py-2.5 rounded-xl border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-black transition-colors text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              title="Switch to Admin User Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-indigo-950 font-black">Admin Portal</span>
            </button>

            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-950 font-black text-xs shadow-xs flex items-center gap-1.5 cursor-pointer animate-pulse"
              title="Trigger 911 Paramedic Tele-Dispatch Simulation"
            >
              <span className="text-rose-950 font-black">🚨 Emergency AI Tele-Dispatch</span>
            </button>

            <button
              onClick={handleSyncHealthData}
              disabled={syncing}
              className="px-4 py-2.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-950 font-black transition-colors text-xs flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${syncing ? 'animate-spin' : ''}`} />
              <span className="text-sky-950 font-black">{syncing ? 'Syncing...' : t('syncHealthData')}</span>
            </button>
            <button
              onClick={() => nav('/onboarding')}
              className="px-4 py-2.5 rounded-xl border border-blue-600 bg-blue-600 hover:bg-blue-500 text-white font-black transition-colors text-xs shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <span className="text-white font-black">{t('updateProfile')}</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Folder Dropdown (< md screens) */}
        <MobileNavigationFolder activeMode={activeMode} setActiveMode={setActiveMode} />

        {/* Clinical Digital Twin Simulation Suite Widget */}
        <div className="mb-6">
          <PitchDemoMode onScenarioSelect={(newProf, scenarioId) => {
            // 1. Immediately update dashboard health profile state
            setProfile(prev => ({
              ...prev,
              ...newProf,
              vitals: { ...(prev?.vitals || {}), ...(newProf?.vitals || {}) },
              personalInfo: { ...(prev?.personalInfo || {}), ...(newProf?.personalInfo || {}) }
            }))

            // 2. Auto-switch active mode and display toast notification
            let msg = '🏥 Clinical Profile Loaded!'
            if (scenarioId === 'cardiac') {
              setActiveMode('voice')
              msg = '🔴 Clinical Profile 1 Loaded: High-Risk Cardiac Ischemia Telemetry Active!'
            } else if (scenarioId === 'wound') {
              setActiveMode('wound')
              msg = '🟢 Clinical Profile 2 Loaded: Diabetic Wound Healing Trajectory Active!'
            } else if (scenarioId === 'drug') {
              setActiveMode('meds')
              msg = '🟣 Clinical Profile 3 Loaded: Anticoagulant Interaction Screen Active!'
            }

            setSyncToast({ step: 3, message: msg })
            setTimeout(() => setSyncToast(null), 3500)

            // 3. Smooth scroll down to workspace view so user sees loaded feature
            setTimeout(() => {
              const el = document.getElementById('workspace-view')
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }, 100)
          }} />
        </div>

        {/* Unified Studio Navigation Bar (1-Click Feature Switcher - Desktop md+ screens) */}
        <div id="workspace-view" className="hidden md:flex mb-8 p-2 bg-slate-900 rounded-2xl items-center gap-2 overflow-x-auto shadow-xl border-2 border-slate-800">
          <button
            onClick={() => setActiveMode('twin')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeMode === 'twin'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-300" />
            <span className="text-white font-black">3D Living Digital Twin</span>
          </button>

          <button
            onClick={() => setActiveMode('voice')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeMode === 'voice'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
            }`}
          >
            <Mic className="w-4 h-4 text-cyan-300" />
            <span className="text-white font-black">🎙️ 30s Voice Heart Risk Scan</span>
          </button>

          <button
            onClick={() => setActiveMode('wound')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeMode === 'wound'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-300" />
            <span className="text-white font-black">🩹 Wound Healing Tracker</span>
          </button>

          <button
            onClick={() => setActiveMode('risk')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeMode === 'risk'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/20 border border-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-300" />
            <span className="text-white font-black">🛡️ Preventive Risk Hub & PDF</span>
          </button>

          <button
            onClick={() => setActiveMode('meds')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeMode === 'meds'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 border border-purple-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
            }`}
          >
            <Pill className="w-4 h-4 text-purple-300" />
            <span className="text-white font-black">💊 AI Medicine Scanner</span>
          </button>

          <button
            onClick={() => setActiveMode('consult')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeMode === 'consult'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span className="text-white font-black">💬 Live AI Consultation Session</span>
          </button>
        </div>

        {/* Auto-Playing AI Telemetry Insights Carousel & Clinical Insights Optimization Hub */}
        <div className="mb-8 space-y-6">
          <InsightsCarousel />
          <ClinicalInsightsOptimizationHub
            onNavigateSimulation={() => nav('/simulation')}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          />
          {activeMode === 'twin' && (
            <>
              <WearableSyncCard />
              <BiologicalAgeCard profile={profile} />
            </>
          )}
        </div>

        {/* Dynamic Studio Workspace Views with AnimatePresence */}
        <AnimatePresence mode="wait">
          {activeMode === 'twin' && (
            <motion.section
              key="twin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-12 gap-8"
            >
              {/* Main 3D Digital Twin Avatar Column (Primary Column Styling) */}
              <div className="col-span-12 lg:col-span-7 p-6 rounded-3xl bg-white/95 border border-slate-200/90 border-t-4 border-t-cyan-500 shadow-xl shadow-cyan-500/5 backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="text-xs font-bold text-cyan-600 uppercase tracking-wider">3D Holographic Model</div>
                    <div className="text-xl font-extrabold text-slate-900">Living Digital Twin Avatar</div>
                  </div>
                  <HealthScore score={profile.healthScore || 94} />
                </div>

                <div className="flex items-center justify-center py-2">
                  <DigitalTwin healthScore={profile.healthScore || 94} />
                </div>

                {/* Real-Time Bio-Telemetry & Live ECG Waveform Container Box */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
                  {/* Container Box Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Real-Time Telemetry Hub</div>
                      <div className="text-base font-extrabold text-slate-900">Biometric Sensor Telemetry & Waveform</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Sensors Active</span>
                    </span>
                  </div>

                  {/* Animated Live ECG Cardiac Pulse Waveform Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-white space-y-3.5 relative overflow-hidden shadow-2xl border border-slate-800/90">
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold relative z-10">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Activity className="w-4 h-4 animate-pulse text-cyan-400" />
                        <span className="tracking-wide font-display">LIVE ECG CARDIAC WAVEFORM TELEMETRY</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 text-[11px] font-mono font-extrabold border border-emerald-500/40 flex items-center gap-1.5 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span>76 BPM • Sinus Rhythm</span>
                      </span>
                    </div>

                    {/* Animated Oscilloscope Grid & Dual AI Line Graph Canvas */}
                    <div className="h-28 w-full relative overflow-hidden bg-slate-950 rounded-xl border border-slate-800/90 shadow-inner flex flex-col justify-between p-2">
                      {/* Clinical Oscilloscope Grid Background */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:14px_14px] opacity-50"></div>

                      {/* On-Graph AI Legend Overlay */}
                      <div className="flex items-center justify-between text-[10px] font-extrabold relative z-20 px-1 pt-0.5">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-cyan-300">
                            <span className="w-2.5 h-0.5 bg-cyan-400 rounded-full inline-block"></span>
                            <span>ECG Waveform ({profile.vitals?.heartRate || 76} BPM)</span>
                          </span>
                          <span className="flex items-center gap-1 text-emerald-400">
                            <span className="w-2.5 h-0.5 bg-emerald-400 rounded-full inline-block border-t border-dashed border-emerald-300"></span>
                            <span>AI Longevity Score ({profile.healthScore || 94}/100)</span>
                          </span>
                        </div>
                        <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider">AI Signal Fidelity: 99.4%</span>
                      </div>

                      {/* High-Definition Dual SVG Line Graph */}
                      <div className="relative w-full h-16 z-10">
                        <svg className="w-full h-full" viewBox="0 0 600 60" preserveAspectRatio="none">
                          <defs>
                            {/* Cyan Area Gradient */}
                            <linearGradient id="areaCyan" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.35" />
                              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
                            </linearGradient>

                            {/* Emerald Area Gradient */}
                            <linearGradient id="areaEmerald" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Line 2 (Emerald AI Health Index Trend Line - Dashed Bezier Curve) */}
                          <path
                            d="M0,45 Q150,20 300,28 T600,18 L600,60 L0,60 Z"
                            fill="url(#areaEmerald)"
                          />
                          <path
                            d="M0,45 Q150,20 300,28 T600,18"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                            strokeDasharray="4 3"
                          />

                          {/* Line 1 (Cyan Cardiac Waveform - P-Q-R-S-T Pulse Line) */}
                          <path
                            d="M0,35 L60,35 L70,20 L80,50 L90,8 L100,55 L110,35 L210,35 L220,20 L230,50 L240,8 L250,55 L260,35 L360,35 L370,20 L380,50 L390,8 L400,55 L410,35 L510,35 L520,20 L530,50 L540,8 L550,55 L560,35 L600,35 L600,60 L0,60 Z"
                            fill="url(#areaCyan)"
                          />
                          <path
                            d="M0,35 L60,35 L70,20 L80,50 L90,8 L100,55 L110,35 L210,35 L220,20 L230,50 L240,8 L250,55 L260,35 L360,35 L370,20 L380,50 L390,8 L400,55 L410,35 L510,35 L520,20 L530,50 L540,8 L550,55 L560,35 L600,35"
                            fill="none"
                            stroke="#00f0ff"
                            strokeWidth="3"
                          />

                          {/* Glowing Animated Peak Nodes */}
                          <circle cx="90" cy="8" r="4" fill="#00f0ff" className="animate-ping" />
                          <circle cx="90" cy="8" r="3" fill="#ffffff" />

                          <circle cx="240" cy="8" r="4" fill="#00f0ff" className="animate-ping" />
                          <circle cx="240" cy="8" r="3" fill="#ffffff" />

                          <circle cx="390" cy="8" r="4" fill="#00f0ff" className="animate-ping" />
                          <circle cx="390" cy="8" r="3" fill="#ffffff" />

                          <circle cx="540" cy="8" r="4" fill="#00f0ff" className="animate-ping" />
                          <circle cx="540" cy="8" r="3" fill="#ffffff" />
                        </svg>
                      </div>

                      {/* Animated Live Scanning Line */}
                      <div className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-cyan-400/30 to-cyan-400/50 animate-pulse pointer-events-none z-20 right-1/3"></div>
                    </div>

                    {/* Related Live Cardiac Telemetry Metrics Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 relative z-10">
                      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 font-extrabold uppercase">PR Interval</div>
                        <div className="text-xs font-mono font-black text-cyan-300">142 ms <span className="text-[9px] text-emerald-400 font-sans font-bold">(Normal)</span></div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 font-extrabold uppercase">QRS Complex</div>
                        <div className="text-xs font-mono font-black text-cyan-300">86 ms <span className="text-[9px] text-emerald-400 font-sans font-bold">(Optimal)</span></div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 font-extrabold uppercase">QTc Interval</div>
                        <div className="text-xs font-mono font-black text-cyan-300">412 ms <span className="text-[9px] text-emerald-400 font-sans font-bold">(Stable)</span></div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 font-extrabold uppercase">ST-Segment</div>
                        <div className="text-xs font-mono font-black text-emerald-400">Isoelectric</div>
                      </div>
                    </div>
                  </div>

                  {/* Animated 6-Card Bio-Telemetry Grid Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <HealthCard title={t('heartRate')} value={`${profile.vitals?.heartRate || '76'} BPM`} status="🟢 Normal Baseline" />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <HealthCard title={t('bloodPressure')} value={`${profile.vitals?.systolic || '118'}/${profile.vitals?.diastolic || '78'}`} status="🟢 Stable Perfusion" />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <HealthCard title={t('bloodGlucose')} value={`${profile.vitals?.glucose || '98'} mg/dL`} status="🔵 Insulin Sensitive" />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <HealthCard title={t('spO2')} value={`${profile.vitals?.spo2 || '98'}%`} status="🟢 Excellent Saturation" />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <HealthCard title={t('sleepDuration')} value={`${profile.lifestyle?.sleepDuration || '7.5'}h`} status="🟣 Deep Recovery" />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <HealthCard title={t('activitySteps')} value={`${profile.lifestyle?.dailySteps || '8,420'} steps`} status="🟡 Active Movement" />
                    </motion.div>
                  </div>

                  {/* AI Organ Biomarker & Diagnostic Telemetry Bar */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="font-extrabold text-slate-900 flex items-center gap-1.5 font-display">
                        <Zap className="w-4 h-4 text-blue-600 animate-pulse" />
                        <span>AI Organ Physiology & Metabolic Biomarkers</span>
                      </div>
                      <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        ⚡ Real-Time Calibrated
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Neural Stress</div>
                        <div className="text-sm font-black text-slate-900 font-mono truncate">14% <span className="text-[10px] text-emerald-600 font-sans font-extrabold">(Optimal)</span></div>
                        <div className="text-[10px] text-slate-500 font-medium truncate">Cognitive Balance</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Vascular Velocity</div>
                        <div className="text-sm font-black text-slate-900 font-mono truncate">1.22 m/s</div>
                        <div className="text-[10px] text-teal-600 font-extrabold truncate">Healthy Arterial</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Pulmonary Index</div>
                        <div className="text-sm font-black text-slate-900 font-mono truncate">98% <span className="text-[10px] text-emerald-600 font-sans font-extrabold">(High)</span></div>
                        <div className="text-[10px] text-slate-500 font-medium truncate">Sub-Alveolar Exchange</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Metabolic Score</div>
                        <div className="text-sm font-black text-slate-900 font-mono truncate">89 / 100</div>
                        <div className="text-[10px] text-indigo-600 font-extrabold truncate">Glycemic Stability</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-xs">
                      <button
                        onClick={handleSyncHealthData}
                        disabled={syncing}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all disabled:opacity-60"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${syncing ? 'animate-spin' : ''}`} />
                        <span>{syncing ? 'Calibrating Sensor Diagnostics...' : '⚡ Run 30s Real-Time Sensor Diagnostics'}</span>
                      </button>

                      <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-teal-600" />
                        <span>🔒 Encrypted 256-Bit Local Stream</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Health Review & Risk Forecasting */}
              <aside className="col-span-12 lg:col-span-5 space-y-6">
                <MedicationAdherenceWidget />
                <VitalsGraphView />
                <AIHealthReview profile={profile} />
                <PreventiveRiskHub profile={profile} />
              </aside>
            </motion.section>
          )}

          {/* Dynamic View: 30s Voice Heart Risk Scan */}
          {activeMode === 'voice' && (
            <motion.section
              key="voice"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <VoiceAnalysisView />
            </motion.section>
          )}

          {/* Dynamic View: Wound Healing Tracker */}
          {activeMode === 'wound' && (
            <motion.section
              key="wound"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <WoundTrackerView />
            </motion.section>
          )}

          {/* Dynamic View: Preventive Risk Hub & Lab PDF */}
          {activeMode === 'risk' && (
            <motion.section
              key="risk"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <PreventiveRiskHub profile={profile} />
              <AIHealthReview profile={profile} />
            </motion.section>
          )}

          {/* Dynamic View: AI Camera Medicine & Prescription Scanner */}
          {activeMode === 'meds' && (
            <motion.section
              key="meds"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <MedicineScannerView />
            </motion.section>
          )}

          {/* Dynamic View: Live AI Clinical Consultation Session */}
          {activeMode === 'consult' && (
            <motion.section
              key="consult"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <AIConsultationView />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Nearby Emergency Hospitals & Account Management (Visible in Main Dashboard 'twin' Mode Only) */}
        {activeMode === 'twin' && (
          <section className="mt-8 grid grid-cols-12 gap-8 animate-in fade-in duration-200">
            <div className="col-span-12 lg:col-span-8">
              <NearbyHospitals location={profile?.personalInfo?.location} />
            </div>

            <div className="col-span-12 lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Account & Security Hub</h3>
                  <p className="text-[11px] text-slate-500">Digital Twin Patient Credentials & Privacy</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                  🔒 HIPAA Compliant
                </span>
              </div>

              {/* Profile Info Details Grid */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Patient Name:</span>
                  </span>
                  <span className="font-extrabold text-slate-900 font-display text-sm">{p.fullName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Dna className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Digital Twin ID:</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-cyan-700 text-xs">{profile?.twinId || 'TWIN-88412-US'}</span>
                    <button
                      type="button"
                      onClick={handleCopyTwinId}
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold cursor-pointer transition-all ${copiedId
                        ? 'bg-emerald-500 text-white shadow-sm scale-105'
                        : 'bg-cyan-100 hover:bg-cyan-200 text-cyan-800'
                        }`}
                      title="Copy Unique Digital Twin ID to Clipboard"
                    >
                      {copiedId ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Age & Gender:</span>
                  </span>
                  <span className="font-bold text-slate-800">{p.age} Yrs • {p.gender || 'Male'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                    <span>Blood Group:</span>
                  </span>
                  <span className="font-black text-rose-600 text-xs px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200">{p.bloodGroup || 'O+'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Data Encryption:</span>
                  </span>
                  <span className="font-bold text-emerald-600 text-[11px] flex items-center gap-1">
                    <span>256-Bit AES</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  </span>
                </div>
              </div>

              {/* Privacy & Cloud Settings Toggles */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">Security & Cloud Preferences</span>

                <div
                  onClick={() => setAiAlerts(!aiAlerts)}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                  title="Click to toggle AI Emergency Alerts"
                >
                  <span className="text-slate-700 font-semibold">Real-Time AI Emergency Alerts</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full transition-all ${aiAlerts ? 'text-emerald-800 bg-emerald-100 border border-emerald-200 shadow-sm' : 'text-slate-600 bg-slate-200 border border-slate-300'
                    }`}>
                    {aiAlerts ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>

                <div
                  onClick={() => setCloudSync(!cloudSync)}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                  title="Click to toggle Firebase Cloud Auto-Sync"
                >
                  <span className="text-slate-700 font-semibold">Cloud Auto-Sync (Firebase)</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full transition-all ${cloudSync ? 'text-cyan-800 bg-cyan-100 border border-cyan-200 shadow-sm' : 'text-slate-600 bg-slate-200 border border-slate-300'
                    }`}>
                    {cloudSync ? 'ACTIVE' : 'PAUSED'}
                  </span>
                </div>
              </div>

              {/* Account Action Buttons */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => nav('/onboarding')}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm text-center"
                >
                  ✏️ Edit Profile
                </button>

                <button
                  onClick={async () => { await signout(); nav('/login') }}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>

              <button
                onClick={() => { clearHealthProfile(); nav('/') }}
                className="w-full py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Profile Data</span>
              </button>
            </div>
          </section>
        )}

        {/* Floating Real-Time Health Data Sync Notification Toast */}
        <AnimatePresence>
          {syncToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-800 flex items-center gap-3 max-w-md"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                {syncing ? <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              </div>

              <div>
                <div className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider">Digital Twin Sync Status</div>
                <div className="text-xs font-extrabold text-white mt-0.5">{syncToast.message}</div>
              </div>
            </motion.div>
          )}
          {/* Emergency Tele-Dispatch Modal */}
          <EmergencyDispatchModal
            isOpen={isEmergencyModalOpen}
            onClose={() => setIsEmergencyModalOpen(false)}
            patientName={profile?.personalInfo?.fullName || 'Alex Morgan'}
            hr={profile?.vitals?.heartRate || 112}
          />
          {/* Clinical PDF Report Modal */}
          <ClinicalPDFReportModal
            isOpen={isPDFModalOpen}
            onClose={() => setIsPDFModalOpen(false)}
            profile={profile}
          />
          {/* Guardian Emergency Alert Modal */}
          <GuardianAlertModal
            isOpen={isGuardianModalOpen}
            onClose={() => setIsGuardianModalOpen(false)}
          />
        </AnimatePresence>
      </main>
    </div>
  )
}
