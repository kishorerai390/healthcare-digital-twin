import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Cpu, Heart, Activity, ArrowRight, ShieldCheck, Sparkles, Zap, Brain, 
  Mic, Camera, FileText, CheckCircle2, Globe, Lock, Play, ChevronRight, Download 
} from 'lucide-react'
import DigitalTwin from '../components/DigitalTwin'
import demoData from '../data/mockHealthData'
import { clearHealthProfile, saveHealthProfile } from '../utils/storage'
import { clearAdminSession } from '../utils/adminStorage'
import LanguageSelector from '../components/LanguageSelector'
import ThemeToggle from '../components/ThemeToggle'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import MobileHeader from '../components/mobile/MobileHeader'
import MobileVitalsGrid from '../components/mobile/MobileVitalsGrid'

export default function Landing(){
  const nav = useNavigate()
  const { t } = useLanguage()
  const { currentUser, guestLogin, setHealthProfile } = useAuth()
  const [simYear, setSimYear] = useState(1) // 0, 1, 5, 10 years

  const handleCreateOwnTwin = () => {
    clearHealthProfile()
    setHealthProfile?.(null)
    nav('/onboarding')
  }

  const simScores = {
    0: { score: 87, text: 'Current Baseline Profile' },
    1: { score: 91, text: '+1 Year: Regular Exercise & Sleep Optimization (+4 pts)' },
    5: { score: 95, text: '+5 Years: Sustained Glycemic & BP Protocol (+8 pts)' },
    10: { score: 98, text: '+10 Years: Maximum Longevity & Cellular Preservation (+11 pts)' }
  }

  const handleAdminClick = () => {
    clearAdminSession()
    nav('/admin')
  }

  const handleExploreDemoDashboard = (targetPath = '/dashboard') => {
    if (!currentUser) {
      guestLogin()
    }
    const demoProfile = {
      twinId: 'TWIN-88412-US',
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      healthScore: 94,
      personalInfo: {
        fullName: 'Alex Morgan (AI Digital Twin)',
        age: 32,
        gender: 'Male',
        height: 172,
        weight: 68,
        bloodGroup: 'O+',
        country: 'United States',
        state: 'California',
        city: 'San Francisco',
        location: 'San Francisco, California, United States'
      },
      vitals: {
        heartRate: 76,
        systolic: 118,
        diastolic: 78,
        glucose: 98,
        spo2: 98,
        temperature: 36.7
      },
      lifestyle: {
        dailySteps: 8420,
        sleepDuration: 7.5,
        sleepQuality: 'Good Quality',
        exerciseFreq: '3-4 times/week',
        dietType: 'Balanced Mediterranean',
        smoking: 'No',
        alcohol: 'No'
      },
      medicalHistory: {
        conditions: ['None / Healthy Baseline'],
        bloodGlucose: 98
      },
      voiceScanResult: {
        cardiacRiskProb: 12,
        riskLevel: 'Low Risk',
        languageUsed: '🌐 Auto-Detect Any Language',
        vocalJitter: '0.38% (Optimal)',
        acousticShimmer: '1.2% (Normal)',
        fundamentalFreq: '142 Hz (Stable)',
        vocalStrainIndex: 'Minimal / Normal',
        oxygenationMarker: 'Optimal (98%)',
        verdict: 'No acoustic biomarkers of acute myocardial ischemia detected.',
        recommendation: 'Your voice acoustic features indicate healthy subglottic pressure and normal vocal fold perfusion.'
      },
      woundScanResult: {
        id: 'entry-demo',
        date: 'Today',
        day: 'Day 5',
        area: '2.4 cm²',
        areaReduction: '-42% Area Reduction',
        granulationPct: '88% Healthy Granulation',
        erythema: 'Minimal (Normal Margin)',
        infectionRisk: '1% — Optimal',
        tissueType: 'Epithelial Edge Bridging',
        verdict: 'Excellent wound closure velocity. Granulation tissue is healthy and uninfected.',
        recommendation: 'Maintain clean saline cleansing and protect from friction.'
      },
      medicineScanResult: {
        id: 'warfarin',
        name: 'Warfarin Sodium 5mg',
        brand: 'Coumadin',
        category: 'Anticoagulant (Blood Thinner)',
        dangerLevel: 'CRITICAL',
        whenToTake: {
          timeOfDay: 'Night / Bedtime',
          exactTime: '8:00 PM (Strict Schedule)',
          frequency: 'Once Daily (Strict 24h Spacing)'
        },
        verdict: 'High potency narrow-therapeutic index medication. Auto-synced with Digital Twin.'
      }
    }

    saveHealthProfile(demoProfile)
    setHealthProfile?.(demoProfile)
    const destination = typeof targetPath === 'string' && targetPath !== '/dashboard' ? targetPath : '/onboarding'
    nav(destination)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden relative font-sans">
      
      {/* Dynamic Animated Ambient Background Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px] animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] animate-pulse pointer-events-none delay-1000" />
      <div className="absolute bottom-20 left-10 w-[550px] h-[550px] bg-sky-400/15 rounded-full blur-[140px] animate-pulse pointer-events-none delay-2000" />

      {/* Cyber Grid Overlay Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      {/* Top Executive Competition & Hackathon Pitch Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white border-b border-cyan-500/30 px-4 py-2.5 shadow-xl relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2.5 font-extrabold text-cyan-300">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-[10px] font-black uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-spin-slow" />
              <span>Healthcare AI Innovation 2026</span>
            </span>
            <span className="hidden md:inline text-white font-bold">
              🎯 3D Digital Twin • 30s Acoustic Voice Diagnosis • Diabetic Wound AI • 5-Yr Preventive Longevity
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleExploreDemoDashboard('/voice-analysis')}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Mic className="w-3 h-3 text-cyan-400" />
              <span>🎙️ 30s Voice AI</span>
            </button>

            <button
              onClick={() => handleExploreDemoDashboard('/wound-tracker')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3 text-emerald-400" />
              <span>👁️ Wound Vision</span>
            </button>

            <button
              onClick={handleAdminClick}
              className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              <span>🔒 Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Folder Navigation Header (< md screens) */}
      <MobileHeader onCreateTwin={handleCreateOwnTwin} onExploreDemo={handleExploreDemoDashboard} />

      {/* Top Floating Glass Navigation Header (Desktop md+ screens) */}
      <header className="hidden md:flex px-6 sm:px-10 py-4 items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => nav('/')}>
          <div className="relative">
            <img src="/assets/logo.png" alt="MedTwin AI Logo" className="w-10 h-10 object-contain rounded-xl border border-blue-600/30 bg-blue-50 p-1 shadow-sm" />
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 absolute -top-0.5 -right-0.5 animate-ping pointer-events-none" />
          </div>
          <div>
            <div className="text-slate-900 font-black tracking-tight text-lg leading-none flex items-center gap-1.5">
              <span>MedTwin AI</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-mono border border-blue-200">STUDIO</span>
            </div>
            <div className="text-[11px] text-slate-500 font-bold mt-0.5">Healthcare Digital Twin & Longevity Engine</div>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <LanguageSelector />
          <ThemeToggle />

          {/* Admin User Switch Button */}
          <button
            onClick={handleAdminClick}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            title="Switch to Admin Portal"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Admin Portal</span>
          </button>

          <button
            onClick={() => nav('/login')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 transition-all cursor-pointer"
          >
            {t('signIn')}
          </button>

          <button
            onClick={handleCreateOwnTwin}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105 border border-blue-500"
          >
            <span>Create Own MyTwin</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </nav>
      </header>

      {/* Main Container */}
      <main className="flex-1 px-4 sm:px-10 py-8 sm:py-12 max-w-7xl mx-auto w-full space-y-12 sm:space-y-20 relative z-10">
        
        {/* Hero Section (2 Columns) */}
        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Bio-Telemetry Controls */}
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-12 lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold shadow-xs">
              <Sparkles className="w-4 h-4 text-teal-600 animate-spin duration-3000" />
              <span>{t('heroTag')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-slate-900">
              {t('heroTitle')}<br />
              <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
                {t('heroTitleSub')}
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-lg leading-relaxed max-w-xl font-medium">
              {t('heroDesc')}
            </p>

            {/* Live Real-Time Biometric Ticker Card (Mobile 2x2 Grid / Desktop 1-Row) */}
            <MobileVitalsGrid vitals={demoData.vitals} />

            {/* Hero Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={handleCreateOwnTwin}
                className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 border border-blue-500 flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-200 animate-pulse" />
                <span>Create My Own Digital Twin</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={handleExploreDemoDashboard}
                className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm border border-slate-300 shadow-sm flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-teal-600 text-teal-600" />
                <span>Explore Studio Dashboard</span>
              </button>
            </div>

            {/* Security Badges */}
            <div className="pt-4 flex items-center gap-6 text-xs font-semibold text-slate-500 border-t border-slate-200 max-w-xl">
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>256-Bit HIPAA Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-teal-600" />
                <span>Multilingual AI Engine</span>
              </div>
            </div>
          </motion.section>

          {/* Right Column: 3D Hologram Avatar Card */}
          <motion.aside
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-12 lg:col-span-5 flex items-center justify-center"
          >
            <DigitalTwin />
          </motion.aside>
        </div>

        {/* Interactive Future Longevity Projection Simulator Widget */}
        <section className="p-8 rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-extrabold mb-2 border border-teal-200">
                <Brain className="w-3.5 h-3.5 text-teal-600" />
                <span>Interactive AI Longevity Simulator</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{t('simTitle')}</h2>
              <p className="text-slate-500 text-xs mt-0.5">{t('simDesc')}</p>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500 font-bold uppercase">{t('simScoreLabel')}</div>
              <div className="text-4xl font-extrabold text-teal-600 font-mono mt-0.5">
                {simScores[simYear].score} / 100
              </div>
            </div>
          </div>

          {/* Time Slider */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span className={simYear === 0 ? 'text-teal-600 font-extrabold' : ''}>{t('nowBaseline')}</span>
              <span className={simYear === 1 ? 'text-teal-600 font-extrabold' : ''}>{t('yr1')}</span>
              <span className={simYear === 5 ? 'text-teal-600 font-extrabold' : ''}>{t('yr5')}</span>
              <span className={simYear === 10 ? 'text-teal-600 font-extrabold' : ''}>{t('yr10')}</span>
            </div>

            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={simYear}
              onChange={(e) => {
                const val = Number(e.target.value)
                if (val <= 0.5) setSimYear(0)
                else if (val <= 3) setSimYear(1)
                else if (val <= 7) setSimYear(5)
                else setSimYear(10)
              }}
              className="w-full accent-teal-600 cursor-pointer h-2.5 bg-slate-100 rounded-lg border border-slate-200"
            />
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 text-xs font-bold text-teal-900 flex items-center gap-2 relative z-10">
            <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>AI Projection Model: {simScores[simYear].text}</span>
          </div>
        </section>

        {/* 4 Core Pillars Motive Showcase Card Grid */}
        <section className="space-y-8 pt-4">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 text-xs font-black uppercase tracking-wider">
              Core Motive & Product Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Transforming Healthcare via 3D Digital Twin Intelligence
            </h2>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Combining non-invasive biometric telemetry, 30-second acoustic vocal diagnostics, computer vision wound tracking, and 5-year preventive risk forecasting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              onClick={() => handleExploreDemoDashboard('/digital-twin')}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-3 hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">3D Holographic Living Twin</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Real-time 3D organ telemetry avatar mapping cardiac sinus rhythm, respiratory gas exchange, and neural alpha sync.
              </p>
            </div>

            <div 
              onClick={() => handleExploreDemoDashboard('/voice-analysis')}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-3 hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">30s Voice Heart AI</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Analyzes subglottic vocal fold micro-tremors and acoustic jitter to detect early coronary ischemia in 30 seconds.
              </p>
            </div>

            <div 
              onClick={() => handleExploreDemoDashboard('/wound-tracker')}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-3 hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Diabetic Wound Vision</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Computer vision segmentation calculating granulation tissue %, wound surface area, and infection risk escalation.
              </p>
            </div>

            <div 
              onClick={() => handleExploreDemoDashboard('/risk-analysis')}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-3 hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">5-Year Preventive Risk</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Predictive ML forecasting cardiovascular risk, biological organ age vs chronological age, and longevity protocols.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Columns Section */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold">
              <Zap className="w-3.5 h-3.5" />
              <span>Multi-Modal Telemetry Columns</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('featureTitle')}</h2>
            <p className="text-slate-600 text-xs sm:text-sm">{t('featureDesc')}</p>
          </div>

          {/* 4 Feature Column Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature Column 1: 30s Voice Heart Scan */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xl space-y-4 flex flex-col justify-between group hover:border-blue-500/40 transition-all backdrop-blur-md"
            >
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-44 bg-slate-100">
                  <img
                    src="/assets/voice_cardiac_scan.png"
                    alt="30s Acoustic Voice Cardiac Scanner"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-blue-700 text-[10px] font-extrabold border border-blue-200 flex items-center gap-1 shadow-sm">
                    <Mic className="w-3 h-3 text-blue-600" />
                    <span>Acoustic Frequency Engine</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                  {t('voiceRiskScan')}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Record a 30-second acoustic voice sample in any language to measure vocal fold micro-tremors, subglottic pressure, and cardiac rhythm anomalies.
                </p>
              </div>

              <button
                onClick={() => handleExploreDemoDashboard('/voice-analysis')}
                className="pt-2 text-xs font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer group-hover:translate-x-1 transition-transform"
              >
                <span>{t('vocalTag')} →</span>
              </button>
            </motion.div>

            {/* Feature Column 2: Computer Vision Wound Tracker */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xl space-y-4 flex flex-col justify-between group hover:border-teal-500/40 transition-all backdrop-blur-md"
            >
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-44 bg-slate-100">
                  <img
                    src="/assets/wound_computer_vision.png"
                    alt="Computer Vision Wound Tissue Scanner"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-teal-700 text-[10px] font-extrabold border border-teal-200 flex items-center gap-1 shadow-sm">
                    <Camera className="w-3 h-3 text-teal-600" />
                    <span>Computer Vision Segmentation</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-teal-600 transition-colors">
                  {t('woundTracker')}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Upload daily photos of surgical incisions or wounds for computer vision tissue surface measurement and granulation risk analysis.
                </p>
              </div>

              <button
                onClick={() => handleExploreDemoDashboard('/wound-tracker')}
                className="pt-2 text-xs font-extrabold text-teal-600 hover:text-teal-800 flex items-center gap-1 cursor-pointer group-hover:translate-x-1 transition-transform"
              >
                <span>{t('woundTag')} →</span>
              </button>
            </motion.div>

            {/* Feature Column 3: Live AI Doctor Consultation Session */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xl space-y-4 flex flex-col justify-between group hover:border-indigo-500/40 transition-all backdrop-blur-md"
            >
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-44 bg-slate-100">
                  <img
                    src="/assets/ai_doctor_consult.png"
                    alt="Live AI Doctor Telemetry Consultation"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-indigo-700 text-[10px] font-extrabold border border-indigo-200 flex items-center gap-1 shadow-sm">
                    <Cpu className="w-3 h-3 text-indigo-600 animate-pulse" />
                    <span>Live AI Speech & Auto-Correct</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                  💬 Live AI Doctor Consultation
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Have a live voice/text consultation with AI Specialist Doctors. Includes speech synthesis readout and real-time medical auto-correction.
                </p>
              </div>

              <button
                onClick={() => handleExploreDemoDashboard('/consultation')}
                className="pt-2 text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer group-hover:translate-x-1 transition-transform"
              >
                <span>Start AI Consultation →</span>
              </button>
            </motion.div>

            {/* Feature Column 4: Preventive Risk & PDF Orders */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xl space-y-4 flex flex-col justify-between group hover:border-amber-500/40 transition-all backdrop-blur-md"
            >
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-44 bg-slate-100">
                  <img
                    src="/assets/preventive_risk_pdf.png"
                    alt="5-Year Predictive Intelligence & Clinical PDF Report"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-amber-800 text-[10px] font-extrabold border border-amber-200 flex items-center gap-1 shadow-sm">
                    <FileText className="w-3 h-3 text-amber-600" />
                    <span>5-Year Predictive Intelligence</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">
                  🛡️ Preventive Risk Hub & PDF
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  5-year multi-organ disease probability forecasting and 1-click clinical lab requisition PDF form generation for your physician.
                </p>
              </div>

              <button
                onClick={() => handleExploreDemoDashboard('/risk-analysis')}
                className="pt-2 text-xs font-extrabold text-amber-600 hover:text-amber-800 flex items-center gap-1 cursor-pointer group-hover:translate-x-1 transition-transform"
              >
                <span>Downloadable PDF Requisitions →</span>
              </button>
            </motion.div>

          </div>
        </section>

        {/* 3-Step Simple Workflow */}
        <section className="py-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-extrabold">
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              <span>3-Step Simple Workflow</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How Your Digital Twin Works</h2>
            <p className="text-slate-600 text-xs sm:text-sm">From vital onboarding to multi-year predictive health modeling in under 3 minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl border border-slate-200 bg-white hover:border-blue-500/50 transition-all space-y-4 shadow-xl group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-300/40 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">Input Bio-Telemetry</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Complete a simple 5-step guided wizard covering your vitals, lifestyle habits, medical history, and optional lab reports.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Takes ~2 minutes</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl border border-slate-200 bg-white hover:border-teal-500/50 transition-all space-y-4 shadow-xl group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg shadow-teal-500/20 border border-teal-300/40 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-teal-600 transition-colors">AI Organ Physiology Model</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Our neural engines compute real-time organ health scores, subglottic voice frequency harmonics, and wound tissue healing rates.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-teal-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Real-Time Recalibration</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl border border-slate-200 bg-white hover:border-blue-500/50 transition-all space-y-4 shadow-xl group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-300/40 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">Proceed In Your Wish</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Experience your personalized Digital Twin or explore the live Studio Dashboard features.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Full Privacy Control</span>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Security & HIPAA Compliance Banner */}
        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-50/90 via-teal-50/40 to-slate-50 border border-blue-200/80 text-slate-900 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-xl">
          {/* Ambient Glow Orb */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-blue-200/80 pb-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold">
                <Lock className="w-3.5 h-3.5 text-teal-700" />
                <span>Enterprise Security & Compliance</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Bank-Grade Encryption & HIPAA Compliance</h2>
              <p className="text-slate-600 text-xs max-w-xl font-medium">
                Your medical data is encrypted locally using 256-bit AES algorithms and synchronized via isolated vault storage.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-3 rounded-2xl bg-white border border-blue-200 text-center shadow-xs">
                <div className="text-xl font-extrabold text-blue-600 font-mono">256-Bit</div>
                <div className="text-[10px] text-slate-500 font-semibold">AES Data Vault</div>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white border border-teal-200 text-center shadow-xs">
                <div className="text-xl font-extrabold text-teal-600 font-mono">HIPAA</div>
                <div className="text-[10px] text-slate-500 font-semibold">Compliant Privacy</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs relative z-10">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/90 border border-slate-200 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Zero Third-Party Sharing</span>
                <span className="text-slate-500 text-[11px]">Your raw biometric records never leave your twin profile</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/90 border border-slate-200 shadow-sm">
              <Cpu className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">On-Device Processing</span>
                <span className="text-slate-500 text-[11px]">Real-time vocal and computer vision analysis</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/90 border border-slate-200 shadow-sm">
              <Download className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Full Data Portability</span>
                <span className="text-slate-500 text-[11px]">Download your complete health twin PDF anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Next-Gen Interactive Bio-Telemetry Command Hub Banner */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-50/90 via-sky-50/50 to-teal-50/60 text-slate-900 border border-blue-200/80 shadow-2xl space-y-8 relative overflow-hidden backdrop-blur-xl">
          {/* Animated Background Mesh & Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />

          {/* Header Info */}
          <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-extrabold shadow-xs">
              <Zap className="w-4 h-4 text-teal-600 animate-bounce" />
              <span>Next-Gen Personal Bio-Telemetry & Longevity Command</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight font-display">
              Empower Your Longevity with{' '}
              <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
                Real-Time AI Precision
              </span>
            </h2>

            <p className="text-slate-600 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto font-medium">
              Join thousands modeling their 3D organ physiology, acoustic voice cardiac biomarkers, and automated preventive health trajectories.
            </p>
          </div>

          {/* 4 Feature Telemetry Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200 flex items-center gap-3 backdrop-blur-md shadow-xs">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                <Mic className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Voice Scan</div>
                <div className="text-xs font-black text-slate-900 truncate">30s Heart Risk</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200 flex items-center gap-3 backdrop-blur-md shadow-xs">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
                <Camera className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Wound AI</div>
                <div className="text-xs font-black text-slate-900 truncate">Vision Healing</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200 flex items-center gap-3 backdrop-blur-md shadow-xs">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Risk Engine</div>
                <div className="text-xs font-black text-slate-900 truncate">Clinical PDF Form</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200 flex items-center gap-3 backdrop-blur-md shadow-xs">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                <Brain className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Digital Twin</div>
                <div className="text-xs font-black text-slate-900 truncate">3D Hologram</div>
              </div>
            </div>
          </div>

          {/* Action Button Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative z-10">
            <button
              onClick={handleCreateOwnTwin}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-xl shadow-blue-600/30 border border-blue-500 flex items-center justify-center gap-2 hover:scale-105 transition-all cursor-pointer text-xs sm:text-sm"
            >
              <Sparkles className="w-4 h-4 text-sky-200 animate-pulse" />
              <span>Launch My Living Digital Twin</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <button
              onClick={() => handleExploreDemoDashboard('/voice-analysis')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold border border-slate-300 flex items-center justify-center gap-2 hover:scale-105 transition-all cursor-pointer text-xs sm:text-sm shadow-sm"
            >
              <Mic className="w-4 h-4 text-blue-600" />
              <span>Try 30s Voice Heart Scan</span>
            </button>
          </div>

          {/* Security & Privacy Badges Footer */}
          <div className="pt-4 border-t border-blue-200/80 flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold text-slate-500 relative z-10">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit HIPAA Encrypted Vault</span>
            </div>
            <div className="flex items-center gap-1.5 text-teal-600">
              <Globe className="w-3.5 h-3.5" />
              <span>Auto-Detect Any Language</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero 3rd-Party Data Sharing</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© 2026 MedTwin AI Digital Twin Studio. All rights reserved.</div>
          <div className="flex items-center gap-5 font-semibold">
            <span className="cursor-pointer hover:text-slate-900 transition" onClick={handleAdminClick}>Admin Portal</span>
            <span className="cursor-pointer hover:text-slate-900 transition" onClick={() => nav('/login')}>{t('signIn')}</span>
            <span className="cursor-pointer hover:text-slate-900 transition" onClick={handleExploreDemoDashboard}>Studio Dashboard</span>
          </div>
        </footer>

      </main>
    </div>
  )
}
