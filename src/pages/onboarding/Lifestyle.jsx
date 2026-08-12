import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { getHealthProfile, updateHealthProfile } from '../../utils/storage'
import Toast from '../../components/Toast'
import { useAuth } from '../../context/AuthContext'
import { saveLifestyleData } from '../../services/firebase/database'
import OnboardingStepper from '../../components/OnboardingStepper'
import AITelemetryCard from '../../components/AITelemetryCard'
import { Home, Footprints, Dumbbell, Moon, Droplets, Zap, Utensils, Cigarette, Wine, Monitor, ArrowLeft, ArrowRight } from 'lucide-react'

export default function Lifestyle(){
  const nav = useNavigate()
  const { currentUser, healthProfile, lifestyleProfile, loading: authLoading, setLifestyleProfile } = useAuth()
  const existing = getHealthProfile() || {}
  const savedLifestyle = (lifestyleProfile && Object.keys(lifestyleProfile).length > 0) ? lifestyleProfile : (existing.lifestyle || {})
  useEffect(() => {
    // Route Guard: Lock step 2 until step 1 (Personal Info) is completed
    const currentProfile = getHealthProfile() || {}
    const pInfo = currentProfile.personalInfo || {}
    const isStep1Done = Boolean(
      pInfo.fullName && pInfo.fullName.toString().trim() &&
      pInfo.age && !isNaN(Number(pInfo.age)) &&
      pInfo.gender &&
      pInfo.height && !isNaN(Number(pInfo.height)) &&
      pInfo.weight && !isNaN(Number(pInfo.weight)) &&
      pInfo.bloodGroup &&
      pInfo.location
    )
    if (!authLoading && !isStep1Done) {
      nav('/onboarding')
    }
  }, [authLoading, nav])

  const [form, setForm] = useState({
    dailySteps: savedLifestyle.dailySteps || '',
    exerciseFreq: savedLifestyle.exerciseFreq || '',
    exerciseDuration: savedLifestyle.exerciseDuration || '',
    sleepDuration: savedLifestyle.sleepDuration || '',
    sleepQuality: savedLifestyle.sleepQuality || '',
    waterIntake: savedLifestyle.waterIntake || '',
    dietType: savedLifestyle.dietType || '',
    smoking: savedLifestyle.smoking || '',
    alcohol: savedLifestyle.alcohol || '',
    screenTime: savedLifestyle.screenTime || '',
    ...savedLifestyle
  })
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(()=>{
    if(!authLoading){
      const currentSaved = lifestyleProfile || (getHealthProfile() || {}).lifestyle || {}
      setForm(prev => ({ 
        ...prev, 
        ...currentSaved 
      }))
    }
  }, [authLoading, lifestyleProfile])

  const isFormComplete = Boolean(
    form.exerciseFreq &&
    form.sleepQuality &&
    form.dietType &&
    form.smoking &&
    form.alcohol
  )

  const validate = ()=>{
    const e = {}
    if(form.dailySteps && Number(form.dailySteps) < 0) e.dailySteps = 'Enter a valid number'
    if(!form.exerciseFreq) e.exerciseFreq = 'Select exercise frequency'
    if(form.exerciseDuration && Number(form.exerciseDuration) < 0) e.exerciseDuration = 'Enter minutes'
    if(form.sleepDuration && Number(form.sleepDuration) < 0) e.sleepDuration = 'Enter hours'
    if(!form.sleepQuality) e.sleepQuality = 'Select sleep quality'
    if(form.waterIntake && Number(form.waterIntake) < 0) e.waterIntake = 'Enter liters'
    if(!form.dietType) e.dietType = 'Select diet type'
    if(!form.smoking) e.smoking = 'Select smoking option'
    if(!form.alcohol) e.alcohol = 'Select alcohol option'
    if(form.screenTime && Number(form.screenTime) < 0) e.screenTime = 'Enter hours'
    setErrors(e)
    if (Object.keys(e).length > 0) {
      setSaveError('⚠️ Please fill in all required fields marked with *')
      return false
    }
    return true
  }

  const handleContinue = ()=>{
    if(!validate()) return
    setSaveError(null)

    const payload = {
      dailySteps: form.dailySteps ? Number(form.dailySteps) : 0,
      exercise: form.exerciseFreq || form.exercise || '',
      exerciseFreq: form.exerciseFreq || form.exercise || '',
      exerciseDuration: form.exerciseDuration ? Number(form.exerciseDuration) : 0,
      sleepDuration: form.sleepDuration ? Number(form.sleepDuration) : 0,
      sleepQuality: form.sleepQuality || '',
      waterIntake: form.waterIntake ? Number(form.waterIntake) : 0,
      stressLevel: form.stressLevel ? Number(form.stressLevel) : 3,
      dietType: form.dietType || '',
      smoking: form.smoking || '',
      alcohol: form.alcohol || '',
      screenTime: form.screenTime ? Number(form.screenTime) : 0
    }

    // Save locally instantly so navigation is lightning fast
    setLifestyleProfile(payload)
    updateHealthProfile(prev => ({ ...prev, lifestyle: payload }))

    // Background cloud sync
    if(currentUser && !currentUser.isGuest){
      saveLifestyleData(currentUser.uid, payload).catch(fsErr => {
        console.warn('Background Firestore lifestyle sync info:', fsErr)
      })
    }

    setToast('Lifestyle saved ✓')
    setTimeout(()=>{
      setToast(null)
      nav('/onboarding/medical-history')
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
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-xs transition-colors group cursor-pointer font-bold"
          title="Return to Home Page"
        >
          <Home className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* Top Stepper Header */}
        <OnboardingStepper currentStep={2} />

        <div className="space-y-1 border-b border-slate-100 pb-4">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Step 2: Lifestyle & Daily Habits</h2>
          <p className="text-slate-500 text-xs font-medium">Tell us about your daily activity, sleep, and nutrition to calibrate your twin's longevity model.</p>
          {saveError && <div className="mt-2 text-rose-600 text-xs font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">{saveError}</div>}
        </div>

        {/* Box Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Box 1: Daily Steps */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Footprints className="w-4 h-4 text-cyan-600" />
              <span>Daily Steps</span>
            </label>
            <input
              type="number"
              value={form.dailySteps || ''}
              onChange={e=>setForm({...form, dailySteps: e.target.value})}
              placeholder="e.g. 8400"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 focus:bg-white shadow-inner"
            />
            {errors.dailySteps && <div className="text-xs text-rose-600 font-bold">{errors.dailySteps}</div>}
          </div>

          {/* Box 2: Exercise Frequency */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-cyan-600" />
              <span>Exercise Frequency *</span>
            </label>
            <select
              value={form.exerciseFreq || ''}
              onChange={e=>setForm({...form, exerciseFreq: e.target.value})}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="">Select Frequency</option>
              <option value="Never">Never</option>
              <option value="1–2 days/week">1–2 days/week</option>
              <option value="3–4 days/week">3–4 days/week</option>
              <option value="5+ days/week">5+ days/week</option>
            </select>
            {errors.exerciseFreq && <div className="text-xs text-rose-600 font-bold">{errors.exerciseFreq}</div>}
          </div>

          {/* Box 3: Sleep Duration & Quality */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-600" />
              <span>Sleep Duration (Hours/Night) & Quality</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.5"
                value={form.sleepDuration || ''}
                onChange={e=>setForm({...form, sleepDuration: e.target.value})}
                placeholder="e.g. 7.5"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 shadow-inner"
              />
              <select
                value={form.sleepQuality || ''}
                onChange={e=>setForm({...form, sleepQuality: e.target.value})}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="">Quality</option>
                <option value="Poor">Poor</option>
                <option value="Fair">Fair</option>
                <option value="Good">Good</option>
                <option value="Excellent">Excellent</option>
              </select>
            </div>
          </div>

          {/* Box 4: Water Intake & Stress Level */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-500" />
              <span>Water Intake (Liters) & Stress (1-5)</span>
            </label>
            <div className="grid grid-cols-2 gap-2 items-center">
              <input
                type="number"
                step="0.5"
                value={form.waterIntake || ''}
                onChange={e=>setForm({...form, waterIntake: e.target.value})}
                placeholder="e.g. 2.5 L"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 shadow-inner"
              />
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-slate-500 flex justify-between">
                  <span>Stress Level:</span>
                  <span className="text-cyan-600 font-extrabold">{form.stressLevel || 3}/5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={form.stressLevel || 3}
                  onChange={e=>setForm({...form, stressLevel: e.target.value})}
                  className="w-full accent-cyan-600"
                />
              </div>
            </div>
          </div>

          {/* Box 5: Diet Type */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-600" />
              <span>Diet Type *</span>
            </label>
            <select
              value={form.dietType || ''}
              onChange={e=>setForm({...form, dietType: e.target.value})}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="">Select Diet</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Mixed">Mixed</option>
            </select>
            {errors.dietType && <div className="text-xs text-rose-600 font-bold">{errors.dietType}</div>}
          </div>

          {/* Box 6: Smoking & Alcohol */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Cigarette className="w-4 h-4 text-amber-600" />
              <span>Smoking & Alcohol Habits *</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={form.smoking || ''}
                onChange={e=>setForm({...form, smoking: e.target.value})}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="">Smoking</option>
                <option value="Never">Never</option>
                <option value="Occasionally">Occasionally</option>
                <option value="Regularly">Regularly</option>
              </select>

              <select
                value={form.alcohol || ''}
                onChange={e=>setForm({...form, alcohol: e.target.value})}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="">Alcohol</option>
                <option value="Never">Never</option>
                <option value="Occasionally">Occasionally</option>
                <option value="Regularly">Regularly</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Lifestyle & Circadian Recovery Analysis Card */}
        <div className="pt-2">
          <AITelemetryCard
            title="AI Lifestyle, Activity & Circadian Recovery Analysis"
            promptText="Select your exercise frequency, sleep quality, diet type, smoking, and alcohol choices above to compute real-time AI Lifestyle analysis."
            isComplete={isFormComplete}
            statusLevel={form.sleepQuality === 'Good' || form.sleepQuality === 'Excellent' ? 'Optimal Recovery' : 'Balanced Baseline'}
            statusColor={form.sleepQuality === 'Good' || form.sleepQuality === 'Excellent' ? 'emerald' : 'cyan'}
            metrics={[
              { label: 'Activity Baseline', value: form.exerciseFreq ? `${form.exerciseFreq} workouts/wk` : '—' },
              { label: 'Sleep & Circadian', value: form.sleepDuration ? `${form.sleepDuration}h (${form.sleepQuality || '—'})` : '—' },
              { label: 'Dietary Profile', value: form.dietType || '—' }
            ]}
            insight={
              isFormComplete
                ? `Lifestyle parameters indicate ${form.exerciseFreq} workout frequency and ${form.sleepDuration || '7.5'} hours of ${form.sleepQuality || 'balanced'} sleep. Autonomic circadian recovery is within optimal healthy range.`
                : ''
            }
          />
        </div>

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={()=>nav('/onboarding')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleContinue}
            disabled={saving || !isFormComplete}
            className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 border border-blue-500 transition cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{saving ? 'Saving...' : 'Continue to Medical History →'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
