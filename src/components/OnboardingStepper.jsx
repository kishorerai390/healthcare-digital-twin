import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, User, Activity, Stethoscope, HeartPulse, FileText, Pencil, Lock } from 'lucide-react'
import { getHealthProfile } from '../utils/storage'
import { useLanguage } from '../context/LanguageContext'

export default function OnboardingStepper({ currentStep = 1 }){
  const nav = useNavigate()
  const { t } = useLanguage()
  const profile = getHealthProfile() || {}

  const pInfo = profile.personalInfo || {}
  const lStyle = profile.lifestyle || {}
  const mHist = profile.medicalHistory || {}
  const vTals = profile.vitals || {}
  const sReports = profile.scanReports || {}

  // Step Completion Validation Rules
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
    lStyle.exerciseFreq &&
    lStyle.sleepQuality &&
    lStyle.dietType &&
    lStyle.smoking &&
    lStyle.alcohol
  )

  const isStep3Done = isStep2Done && Boolean(
    mHist.conditions && mHist.conditions.length > 0
  )

  const isStep4Done = isStep3Done && Boolean(
    vTals.heartRate && !isNaN(Number(vTals.heartRate)) &&
    vTals.systolic && !isNaN(Number(vTals.systolic)) &&
    vTals.diastolic && !isNaN(Number(vTals.diastolic)) &&
    vTals.spo2 && !isNaN(Number(vTals.spo2)) &&
    vTals.temperature && !isNaN(Number(vTals.temperature))
  )

  const isStep5Done = isStep4Done && Boolean(
    sReports.hasReports !== undefined && sReports.hasReports !== null
  )

  // Step Unlocked Rules
  const isStep1Unlocked = true
  const isStep2Unlocked = isStep1Done
  const isStep3Unlocked = isStep2Done
  const isStep4Unlocked = isStep3Done
  const isStep5Unlocked = isStep4Done

  const steps = [
    { num: 1, title: t('step1'), path: '/onboarding', icon: User, isDone: isStep1Done, isUnlocked: isStep1Unlocked },
    { num: 2, title: t('step2'), path: '/onboarding/lifestyle', icon: Activity, isDone: isStep2Done, isUnlocked: isStep2Unlocked },
    { num: 3, title: t('step3'), path: '/onboarding/medical-history', icon: Stethoscope, isDone: isStep3Done, isUnlocked: isStep3Unlocked },
    { num: 4, title: t('step4'), path: '/onboarding/vitals', icon: HeartPulse, isDone: isStep4Done, isUnlocked: isStep4Unlocked },
    { num: 5, title: t('step5'), path: '/onboarding/scan-reports', icon: FileText, isDone: isStep5Done, isUnlocked: isStep5Unlocked }
  ]

  return (
    <div className="w-full mb-8">
      {/* Step Indicator Header Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {steps.map((s) => {
          const isActive = currentStep === s.num
          const isDone = s.isDone && !isActive
          const isLocked = !s.isUnlocked && !isActive

          return (
            <div
              key={s.num}
              onClick={() => {
                if (!isLocked) nav(s.path)
              }}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 select-none ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10 ring-2 ring-slate-900/20'
                  : isDone
                  ? 'bg-emerald-50/90 text-emerald-950 border-emerald-200 hover:bg-emerald-100/80 cursor-pointer'
                  : isLocked
                  ? 'bg-slate-100/80 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                    isActive
                      ? 'bg-cyan-400 text-black font-extrabold'
                      : isDone
                      ? 'bg-emerald-500 text-white'
                      : isLocked
                      ? 'bg-slate-200 text-slate-400'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : isLocked ? <Lock className="w-3.5 h-3.5" /> : `0${s.num}`}
                </div>

                <div className="min-w-0">
                  <div className="text-[9px] uppercase font-bold tracking-wider opacity-70">
                    Step 0{s.num}
                  </div>
                  <div className="text-xs font-bold truncate flex items-center gap-1">
                    <span className="truncate">{s.title}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge / Edit Action */}
              {isLocked ? (
                <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-200/90 text-slate-600 flex items-center gap-1 border border-slate-300 shadow-2xs" title="Locked — Complete prior steps to unlock">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Locked</span>
                </span>
              ) : isDone ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nav(s.path)
                  }}
                  className="px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-all flex-shrink-0 cursor-pointer bg-emerald-200/80 text-emerald-900 hover:bg-emerald-300 shadow-sm"
                  title={`Step 0${s.num}: ${s.title}`}
                >
                  <Pencil className="w-2.5 h-2.5" />
                  <span>{t('edit')}</span>
                </button>
              ) : isActive ? (
                <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-cyan-400/20 text-cyan-300 flex items-center gap-1">
                  Active
                </span>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nav(s.path)
                  }}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Fill</span>
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

