import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHealthProfile, updateHealthProfile } from '../utils/storage'
import { calculateBMI, bmiCategory, analyzeBMIAI } from '../utils/healthUtils'
import { COUNTRIES_DATA } from '../utils/hospitalUtils'
import Toast from '../components/Toast'
import OnboardingStepper from '../components/OnboardingStepper'
import AITelemetryCard from '../components/AITelemetryCard'
import { useAuth } from '../context/AuthContext'
import { saveHealthProfile as saveHealthProfileToFirestore } from '../services/firebase/database'
import { Home, Bot, Sparkles, MapPin, User, Calendar, Users, Briefcase, Ruler, Scale, Heart, ArrowRight, Lock, CheckCircle2 } from 'lucide-react'

export default function Onboarding(){
  const nav = useNavigate()
  // load existing personal info if present
  const existing = getHealthProfile() || {}
  const existingPersonal = existing.personalInfo || {}

  const [personal, setPersonal] = useState({
    fullName: existingPersonal.fullName || '',
    age: existingPersonal.age || '',
    gender: existingPersonal.gender || '',
    occupation: existingPersonal.occupation || '',
    height: existingPersonal.height || '',
    weight: existingPersonal.weight || '',
    bloodGroup: existingPersonal.bloodGroup || '',
    country: existingPersonal.country || '',
    state: existingPersonal.state || '',
    city: existingPersonal.city || '',
    location: existingPersonal.location || ''
  })

  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [customCityInput, setCustomCityInput] = useState(false)
  const [customOccupationInput, setCustomOccupationInput] = useState(false)

  const { currentUser, healthProfile, loading: authLoading, setHealthProfile } = useAuth()

  const bmi = useMemo(()=> calculateBMI(personal.weight, personal.height), [personal.weight, personal.height])
  const bmiCat = useMemo(()=> bmi ? bmiCategory(bmi) : 'Unknown', [bmi])

  // Check if all required details columns are completely filled
  const isFormComplete = useMemo(() => {
    const fn = personal.fullName && personal.fullName.toString().trim()
    const age = Number(personal.age)
    const gender = personal.gender
    const height = Number(personal.height)
    const weight = Number(personal.weight)
    const bg = personal.bloodGroup && personal.bloodGroup.toString().trim()
    const loc = personal.location && personal.location.toString().trim()
    if(!fn || !gender || !bg || !loc) return false
    if(isNaN(age) || age < 1 || age > 120) return false
    if(isNaN(height) || height < 50 || height > 250) return false
    if(isNaN(weight) || weight < 20 || weight > 300) return false
    return true
  }, [personal])

  // Bulletproof Location Resolution
  const currentCountry = useMemo(() => {
    return COUNTRIES_DATA[personal.country] ? personal.country : 'India'
  }, [personal.country])

  const stateOptions = useMemo(() => {
    return COUNTRIES_DATA[currentCountry]?.states || ['Tamil Nadu']
  }, [currentCountry])

  const currentState = useMemo(() => {
    return stateOptions.includes(personal.state) ? personal.state : stateOptions[0]
  }, [stateOptions, personal.state])

  const cityOptions = useMemo(() => {
    return COUNTRIES_DATA[currentCountry]?.cities[currentState] || ['Chennai']
  }, [currentCountry, currentState])

  const currentCity = useMemo(() => {
    return cityOptions.includes(personal.city) ? personal.city : cityOptions[0]
  }, [cityOptions, personal.city])

  useEffect(()=>{
    // ensure fields persist across refresh by reloading from storage
    const p = getHealthProfile()
    if(p && p.personalInfo){
      setPersonal(prev => ({...prev, ...p.personalInfo}))
    }
  }, [])

  const validate = ()=>{
    const e = {}
    if(!personal.fullName || !personal.fullName.trim()) e.fullName = 'Full Name is required*'
    const age = Number(personal.age)
    if(!personal.age || isNaN(age)) e.age = 'Age is required*'
    else if(age < 1 || age > 120) e.age = 'Age must be between 1 and 120.'

    if(!personal.gender) e.gender = 'Gender is required*'

    const height = Number(personal.height)
    if(!personal.height || isNaN(height)) e.height = 'Height is required*'
    else if(height < 50 || height > 250) e.height = 'Height must be between 50 and 250 cm.'

    const weight = Number(personal.weight)
    if(!personal.weight || isNaN(weight)) e.weight = 'Weight is required*'
    else if(weight < 20 || weight > 300) e.weight = 'Weight must be between 20 and 300 kg.'

    if(!personal.bloodGroup) e.bloodGroup = 'Blood Group is required*'
    if(!personal.location || !personal.location.trim()) e.location = 'Location is required*'

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

    const personalInfo = {
      fullName: personal.fullName.trim(),
      age: Number(personal.age),
      gender: personal.gender,
      occupation: personal.occupation.trim(),
      height: Number(personal.height),
      weight: Number(personal.weight),
      bloodGroup: personal.bloodGroup,
      location: personal.location.trim(),
      bmi: bmi,
      bmiCategory: bmiCat
    }

    // Save locally instantly so navigation is lightning fast
    setHealthProfile(prev => ({ ...(prev || {}), personalInfo }))
    updateHealthProfile(prev => ({ ...prev, personalInfo }))

    // Background cloud sync
    if(currentUser && !currentUser.isGuest){
      saveHealthProfileToFirestore(currentUser.uid, { personalInfo }).catch(fsErr => {
        console.warn('Background Firestore profile sync info:', fsErr)
      })
    }

    setToast('Personal information saved successfully ✓')
    setTimeout(()=>{
      setToast(null)
      nav('/onboarding/lifestyle')
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
        <OnboardingStepper currentStep={1} />

        <div className="space-y-3 border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-extrabold mb-1">
            <Lock className="w-3 h-3 text-teal-600" />
            <span>🔒 256-Bit HIPAA Encrypted & Local Vault Secured</span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Step 1: Patient Personal Information</span>
            <Lock className="w-5 h-5 text-teal-600" />
          </h2>
          <p className="text-slate-500 text-xs font-medium">Provide your personal demographics to calibrate your AI 3D Living Digital Twin baseline.</p>

          {/* Dynamic Lock Status Banner */}
          {!isFormComplete ? (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-amber-600 animate-pulse flex-shrink-0" />
                <span>🔒 <strong>Patient Profile Locked:</strong> Please fill in all required patient detail columns marked with (*) below to unlock your Studio Dashboard.</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-200/80 text-amber-950 text-[10px] font-mono font-extrabold uppercase border border-amber-300 flex-shrink-0">
                🔒 Locked
              </span>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>🔓 <strong>Patient Profile Unlocked:</strong> All required detail columns are filled! You can now proceed to launch your Digital Twin.</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-200/80 text-emerald-950 text-[10px] font-mono font-extrabold uppercase border border-emerald-300 flex-shrink-0">
                🔓 Unlocked
              </span>
            </div>
          )}

          {saveError && <div className="mt-2 text-rose-600 text-xs font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">{saveError}</div>}
        </div>

        {/* Box Layout Grid for Input Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Box 1: Full Name */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-600" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              value={personal.fullName}
              onChange={e=>setPersonal({...personal, fullName: e.target.value})}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-inner"
            />
            {errors.fullName && <div className="text-xs text-rose-600 font-bold">{errors.fullName}</div>}
          </div>

          {/* Box 2: Age */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span>Age (Years) *</span>
            </label>
            <input
              type="number"
              value={personal.age}
              onChange={e=>setPersonal({...personal, age: e.target.value})}
              placeholder="e.g. 32"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-inner"
            />
            {errors.age && <div className="text-xs text-rose-600 font-bold">{errors.age}</div>}
          </div>

          {/* Box 3: Gender */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-600" />
              <span>Gender *</span>
            </label>
            <select
              value={personal.gender}
              onChange={e=>setPersonal({...personal, gender: e.target.value})}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            {errors.gender && <div className="text-xs text-rose-600 font-bold">{errors.gender}</div>}
          </div>

          {/* Box 4: Occupation */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-600" />
                <span>Occupation</span>
              </label>
              <button
                type="button"
                onClick={() => setCustomOccupationInput(!customOccupationInput)}
                className="text-[10px] font-bold text-cyan-600 hover:underline cursor-pointer"
              >
                {customOccupationInput ? 'Select choices' : '+ Custom input'}
              </button>
            </div>

            {customOccupationInput ? (
              <input
                type="text"
                autoComplete="off"
                value={personal.occupation}
                onChange={e => setPersonal({ ...personal, occupation: e.target.value })}
                placeholder="e.g. Research Scholar, Pilot, Chef..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-inner"
              />
            ) : (
              <select
                autoComplete="off"
                value={personal.occupation}
                onChange={e => {
                  if (e.target.value === 'CUSTOM_OTHER') {
                    setCustomOccupationInput(true)
                    setPersonal({ ...personal, occupation: '' })
                  } else {
                    setPersonal({ ...personal, occupation: e.target.value })
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="" className="bg-white text-slate-900 font-bold">Select Occupation...</option>
                <option value="College / University Student" className="bg-white text-slate-900 font-bold">🎓 College / University Student</option>
                <option value="School Student" className="bg-white text-slate-900 font-bold">🎒 School Student</option>
                <option value="Software / Tech Professional" className="bg-white text-slate-900 font-bold">💻 Software / Tech Professional</option>
                <option value="Medical & Healthcare Professional" className="bg-white text-slate-900 font-bold">🩺 Medical & Healthcare Professional</option>
                <option value="Corporate / Business Executive" className="bg-white text-slate-900 font-bold">💼 Corporate / Business Executive</option>
                <option value="Engineer & Technical Professional" className="bg-white text-slate-900 font-bold">🛠️ Engineer & Technical Professional</option>
                <option value="Teacher / Educator / Academic" className="bg-white text-slate-900 font-bold">👨‍🏫 Teacher / Educator / Academic</option>
                <option value="Design, Media & Creative" className="bg-white text-slate-900 font-bold">🎨 Design, Media & Creative</option>
                <option value="Entrepreneur / Self-Employed" className="bg-white text-slate-900 font-bold">🚀 Entrepreneur / Self-Employed</option>
                <option value="Sports & Fitness Professional" className="bg-white text-slate-900 font-bold">🏋️ Sports & Fitness Professional</option>
                <option value="Homemaker" className="bg-white text-slate-900 font-bold">🏠 Homemaker</option>
                <option value="Retired" className="bg-white text-slate-900 font-bold">🌴 Retired</option>
                <option value="CUSTOM_OTHER" className="bg-white text-cyan-600 font-bold">✏️ + Custom / Other...</option>
              </select>
            )}
          </div>

          {/* Box 5: Height */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Ruler className="w-4 h-4 text-cyan-600" />
              <span>Height (cm) *</span>
            </label>
            <input
              type="number"
              value={personal.height}
              onChange={e=>setPersonal({...personal, height: e.target.value})}
              placeholder="e.g. 172"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-inner"
            />
            {errors.height && <div className="text-xs text-rose-600 font-bold">{errors.height}</div>}
          </div>

          {/* Box 6: Weight */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-600" />
              <span>Weight (kg) *</span>
            </label>
            <input
              type="number"
              value={personal.weight}
              onChange={e=>setPersonal({...personal, weight: e.target.value})}
              placeholder="e.g. 68"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-inner"
            />
            {errors.weight && <div className="text-xs text-rose-600 font-bold">{errors.weight}</div>}
          </div>

          {/* Box 7: Blood Group Box Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2 col-span-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Blood Group *</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setPersonal({ ...personal, bloodGroup: bg })}
                  className={`py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                    personal.bloodGroup === bg
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-105'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
            {errors.bloodGroup && <div className="text-xs text-rose-600 font-bold">{errors.bloodGroup}</div>}
          </div>

          {/* Box 8: Location Box Card (Country, State & District / City) */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 col-span-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-600" />
              <span>Location (Country, State & District / City) *</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Country</label>
                <select
                  autoComplete="off"
                  value={currentCountry}
                  onChange={e => {
                    const c = e.target.value
                    const firstState = COUNTRIES_DATA[c]?.states[0] || ''
                    const firstCity = COUNTRIES_DATA[c]?.cities[firstState]?.[0] || ''
                    setPersonal(prev => ({
                      ...prev,
                      country: c,
                      state: firstState,
                      city: firstCity,
                      location: `${firstCity}, ${firstState}, ${c}`
                    }))
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 mt-1 cursor-pointer"
                >
                  {Object.keys(COUNTRIES_DATA).map(c => (
                    <option key={c} value={c} className="bg-white text-slate-900 font-bold">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">State / Region</label>
                <select
                  autoComplete="off"
                  value={currentState}
                  onChange={e => {
                    const s = e.target.value
                    const firstCity = COUNTRIES_DATA[currentCountry]?.cities[s]?.[0] || ''
                    setPersonal(prev => ({
                      ...prev,
                      state: s,
                      city: firstCity,
                      location: `${firstCity}, ${s}, ${currentCountry}`
                    }))
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 mt-1 cursor-pointer"
                >
                  {stateOptions.map(s => (
                    <option key={s} value={s} className="bg-white text-slate-900 font-bold">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">District / City</label>
                  <button
                    type="button"
                    onClick={() => setCustomCityInput(!customCityInput)}
                    className="text-[10px] font-bold text-cyan-600 hover:underline cursor-pointer"
                  >
                    {customCityInput ? 'Select list' : '+ Custom district'}
                  </button>
                </div>

                {customCityInput ? (
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Enter district or city..."
                    value={personal.city}
                    onChange={e => {
                      const c = e.target.value
                      setPersonal(prev => ({
                        ...prev,
                        city: c,
                        location: `${c}, ${currentState}, ${currentCountry}`
                      }))
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 mt-1"
                  />
                ) : (
                  <select
                    autoComplete="off"
                    value={currentCity}
                    onChange={e => {
                      const c = e.target.value
                      setPersonal(prev => ({
                        ...prev,
                        city: c,
                        location: `${c}, ${currentState}, ${currentCountry}`
                      }))
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 mt-1 cursor-pointer"
                  >
                    {cityOptions.map(c => (
                      <option key={c} value={c} className="bg-white text-slate-900 font-bold">{c}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Body Composition & Metabolic Analysis Card */}
        {(() => {
          const aiAnalysis = analyzeBMIAI(personal.height, personal.weight, personal.age, personal.gender)
          const isComplete = Boolean(personal.height && personal.weight && personal.age && personal.gender && personal.fullName)
          return (
            <AITelemetryCard
              title="AI Body Composition & BMR Analysis"
              promptText="Enter your full name, age, height, and weight above to enable real-time AI Body Mass & Metabolic analysis."
              isComplete={isComplete}
              statusLevel={aiAnalysis?.riskLevel || 'Optimal Baseline'}
              statusColor={aiAnalysis?.color || 'emerald'}
              metrics={[
                { label: 'BMI Score', value: aiAnalysis ? `${aiAnalysis.bmi} kg/m² (${aiAnalysis.category})` : '—' },
                { label: 'Ideal Weight Range', value: aiAnalysis?.idealWeightRange || '—' },
                { label: 'Est. Basal Metabolism', value: aiAnalysis?.bmr || '—' }
              ]}
              insight={aiAnalysis?.insight}
            />
          )
        })()}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            {isFormComplete ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>🔓 All Required Patient Detail Columns Filled & Unlocked</span>
              </span>
            ) : (
              <span className="text-amber-700 flex items-center gap-1">
                <Lock className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>🔒 Fill all required detail columns (*) to unlock navigation</span>
              </span>
            )}
          </div>

          <button
            onClick={handleContinue}
            disabled={saving || !isFormComplete}
            className={`px-7 py-3 rounded-xl font-extrabold text-xs shadow-md transition flex items-center gap-2 cursor-pointer ${
              isFormComplete
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 border border-blue-500'
                : 'bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed opacity-75'
            }`}
          >
            {saving ? (
              <span>Saving Profile...</span>
            ) : isFormComplete ? (
              <>
                <span>Continue to Lifestyle & Habits</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>🔒 Fill Detail Columns to Unlock</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
