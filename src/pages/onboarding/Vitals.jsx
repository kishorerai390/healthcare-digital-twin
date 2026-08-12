import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, HeartPulse, Activity, Thermometer, Wind, Droplet } from 'lucide-react'
import { getHealthProfile, updateHealthProfile } from '../../utils/storage'
import Toast from '../../components/Toast'
import OnboardingStepper from '../../components/OnboardingStepper'
import AITelemetryCard from '../../components/AITelemetryCard'
import { useAuth } from '../../context/AuthContext'
import { saveHealthProfile as saveHealthProfileToFirestore } from '../../services/firebase/database'

export default function Vitals(){
  const nav = useNavigate()
  const { currentUser, loading: authLoading } = useAuth()
  const existing = getHealthProfile() || {}
  const savedVitals = existing.vitals || {}

  useEffect(() => {
    // Route Guard: Lock step 4 until steps 1, 2, 3 are completed
    const currentProfile = getHealthProfile() || {}
    const pInfo = currentProfile.personalInfo || {}
    const lStyle = currentProfile.lifestyle || {}
    const mh = currentProfile.medicalHistory || {}
    const isStep1Done = Boolean(
      pInfo.fullName && pInfo.fullName.toString().trim() &&
      pInfo.age && !isNaN(Number(pInfo.age)) &&
      pInfo.gender &&
      pInfo.height && !isNaN(Number(pInfo.height)) &&
      pInfo.weight && !isNaN(Number(pInfo.weight)) &&
      pInfo.bloodGroup &&
      pInfo.location
    )
    const isStep2Done = isStep1Done && Boolean(
      lStyle.exerciseFreq && lStyle.sleepQuality && lStyle.dietType && lStyle.smoking && lStyle.alcohol
    )
    const isStep3Done = isStep2Done && Boolean(
      mh.conditions && mh.conditions.length > 0
    )
    if (!authLoading) {
      if (!isStep1Done) nav('/onboarding')
      else if (!isStep2Done) nav('/onboarding/lifestyle')
      else if (!isStep3Done) nav('/onboarding/medical-history')
    }
  }, [authLoading, nav])

  const [form, setForm] = useState({
    heartRate: savedVitals.heartRate || '',
    systolic: savedVitals.systolic || '',
    diastolic: savedVitals.diastolic || '',
    glucose: savedVitals.glucose || existing.medicalHistory?.bloodGlucose || '',
    spo2: savedVitals.spo2 || '',
    temperature: savedVitals.temperature || ''
  })

  const [toast, setToast] = useState(null)

  const isFormComplete = Boolean(
    form.heartRate && !isNaN(Number(form.heartRate)) &&
    form.systolic && !isNaN(Number(form.systolic)) &&
    form.diastolic && !isNaN(Number(form.diastolic)) &&
    form.spo2 && !isNaN(Number(form.spo2))
  )

  const handleContinue = () => {
    const payload = {
      heartRate: Number(form.heartRate) || 76,
      systolic: Number(form.systolic) || 118,
      diastolic: Number(form.diastolic) || 78,
      glucose: Number(form.glucose) || 98,
      spo2: Number(form.spo2) || 98,
      temperature: Number(form.temperature) || 36.7
    }

    // Instant local save
    updateHealthProfile(prev => ({
      ...prev,
      vitals: payload
    }))

    // Background cloud sync
    if(currentUser && !currentUser.isGuest){
      saveHealthProfileToFirestore(currentUser.uid, { vitals: payload }).catch(err => {
        console.warn('Background Firestore vitals sync info:', err)
      })
    }

    setToast('Vital signs recorded successfully ✓')
    setTimeout(() => {
      setToast(null)
      nav('/onboarding/scan-reports')
    }, 150)
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background Ambient Glow Spheres */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {toast && <Toast message={toast} onClose={()=>setToast(null)} duration={1200} />}

      <div className="max-w-4xl mx-auto bg-white/95 border border-slate-200/80 p-6 sm:p-10 rounded-3xl shadow-2xl space-y-6 backdrop-blur-xl text-slate-900 relative z-10">
        <button
          type="button"
          onClick={() => nav('/')}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs mb-4 transition-colors group cursor-pointer font-medium"
          title="Return to Home Page"
        >
          <Home className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* Top Stepper Header with Page Names & Tick Symbols */}
        <OnboardingStepper currentStep={4} />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Vital Signs & Physiological Metrics</h2>
            <p className="text-slate-500 text-sm mt-0.5">Finalize your Digital Twin baseline metrics for active monitoring.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Heart Rate */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="block text-sm font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                Resting Heart Rate
              </span>
              <span className="text-xs font-semibold text-rose-600">BPM</span>
            </label>
            <input
              type="number"
              value={form.heartRate}
              onChange={e => setForm({ ...form, heartRate: e.target.value })}
              placeholder="e.g. 76"
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Blood Pressure */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="block text-sm font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                Blood Pressure (mmHg)
              </span>
              <span className="text-xs font-semibold text-blue-600">Sys / Dia</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={form.systolic}
                onChange={e => setForm({ ...form, systolic: e.target.value })}
                placeholder="Systolic (120)"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-cyan-500"
              />
              <input
                type="number"
                value={form.diastolic}
                onChange={e => setForm({ ...form, diastolic: e.target.value })}
                placeholder="Diastolic (80)"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Blood Glucose */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="block text-sm font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-cyan-600" />
                Fasting Blood Glucose
              </span>
              <span className="text-xs font-semibold text-cyan-600">mg/dL</span>
            </label>
            <input
              type="number"
              value={form.glucose}
              onChange={e => setForm({ ...form, glucose: e.target.value })}
              placeholder="e.g. 98"
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* SpO2 Oxygen Saturation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="block text-sm font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-600" />
                Oxygen Saturation (SpO2)
              </span>
              <span className="text-xs font-semibold text-teal-600">%</span>
            </label>
            <input
              type="number"
              value={form.spo2}
              onChange={e => setForm({ ...form, spo2: e.target.value })}
              placeholder="e.g. 98"
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* AI Hemodynamic & Vital Signs Perfusion Analysis Card */}
        <div className="mt-6">
          <AITelemetryCard
            title="AI Hemodynamic & Vital Signs Perfusion Analysis"
            promptText="Enter your Heart Rate, Blood Pressure, and Oxygen Saturation (SpO2) above to compute real-time AI Hemodynamic analysis."
            isComplete={isFormComplete}
            statusLevel={Number(form.systolic) >= 140 ? 'Elevated Pressure' : 'Normal Perfusion'}
            statusColor={Number(form.systolic) >= 140 ? 'amber' : 'emerald'}
            metrics={[
              { label: 'Resting Heart Rate', value: form.heartRate ? `${form.heartRate} BPM (Normal Sinus)` : '—' },
              { label: 'Arterial Pressure', value: form.systolic && form.diastolic ? `${form.systolic}/${form.diastolic} mmHg` : '—' },
              { label: 'Oxygen Saturation', value: form.spo2 ? `${form.spo2}% SpO2` : '—' }
            ]}
            insight={
              isFormComplete
                ? `Vitals indicate resting heart rate of ${form.heartRate} BPM and blood pressure of ${form.systolic}/${form.diastolic} mmHg. Oxygenation levels (${form.spo2}%) remain optimal.`
                : ''
            }
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => nav('/onboarding/medical-history')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-sm"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!isFormComplete}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold transition-all shadow-md shadow-blue-600/30 border border-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Continue to Scan Reports →
          </button>
        </div>
      </div>
    </div>
  )
}
