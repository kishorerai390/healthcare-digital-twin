// Health-related utility functions for prototype

export function calculateBMI(weightKg, heightCm){
  const h = Number(heightCm) / 100
  const w = Number(weightKg)
  if(!h || !w || isNaN(h) || isNaN(w)) return null
  const bmi = w / (h*h)
  return Number(bmi.toFixed(1))
}

export function bmiCategory(bmi){
  if(bmi == null) return 'Unknown'
  if(bmi < 18.5) return 'Underweight'
  if(bmi < 25) return 'Normal'
  if(bmi < 30) return 'Overweight'
  return 'Obese'
}

export function analyzeBMIAI(heightCm, weightKg, age = 30, gender = 'Male'){
  const bmi = calculateBMI(weightKg, heightCm)
  if(!bmi) return null

  const cat = bmiCategory(bmi)
  const hM = Number(heightCm) / 100
  const minIdealW = (18.5 * hM * hM).toFixed(1)
  const maxIdealW = (24.9 * hM * hM).toFixed(1)

  const w = Number(weightKg)
  const h = Number(heightCm)
  const a = Number(age) || 30
  let bmr = (10 * w) + (6.25 * h) - (5 * a) + (gender === 'Female' ? -161 : 5)
  bmr = Math.round(bmr)

  let riskLevel = 'Optimal'
  let color = 'emerald'
  let insight = `Your BMI of ${bmi} kg/m² falls in the optimal healthy weight range. Estimated Basal Metabolic Rate (BMR) is ${bmr} kcal/day.`

  if(bmi < 18.5){
    riskLevel = 'Underweight Attention'
    color = 'amber'
    insight = `BMI indicates underweight status (${bmi} kg/m²). AI recommends nutrient-dense caloric intake and resistance training.`
  } else if(bmi >= 25 && bmi < 30){
    riskLevel = 'Mild Overweight Risk'
    color = 'amber'
    insight = `BMI is slightly elevated (${bmi} kg/m²). AI recommends 150 mins/week moderate exercise and balanced diet.`
  } else if(bmi >= 30){
    riskLevel = 'Elevated Risk'
    color = 'rose'
    insight = `BMI indicates obesity range (${bmi} kg/m²). AI recommends structured cardio and medical consultation.`
  }

  return {
    bmi,
    category: cat,
    idealWeightRange: `${minIdealW} kg – ${maxIdealW} kg`,
    bmr: `${bmr} kcal/day`,
    riskLevel,
    color,
    insight
  }
}

export function calculateHealthScore(profile){
  let lifestyle = 80
  let vitals = 80
  let history = 100
  let habits = 90

  const { personalInfo = {}, lifestyle: ls = {}, medicalHistory = {}, vitals: v = {} } = profile || {}

  const bmi = calculateBMI(personalInfo.weight, personalInfo.height)
  if(bmi){
    if(bmi < 18.5 || bmi >= 30) lifestyle -= 10
    if(bmi >= 25 && bmi < 30) lifestyle -= 5
  }

  const sleep = Number(ls.sleepDuration) || 7
  if(sleep < 6) lifestyle -= 12
  else if(sleep < 7) lifestyle -= 6

  const exFreq = ls.exerciseFreq || ls.exercise || '3-4'
  if(exFreq === 'Never' || exFreq === '0') lifestyle -= 18
  else if(exFreq.includes('1')) lifestyle -= 8

  const steps = Number(ls.dailySteps) || 0
  if(steps < 3000) lifestyle -= 10
  else if(steps < 7000) lifestyle -= 4

  const stress = Number(ls.stressLevel) || 3
  lifestyle -= Math.max(0, (stress - 2) * 3)

  const hr = Number(v.heartRate)
  if(hr){ if(hr < 55 || hr > 100) vitals -= 12 }
  const sys = Number(v.systolic)
  const dia = Number(v.diastolic)
  if(sys){ if(sys >= 140 || dia >= 90) vitals -= 12 }
  const glucose = Number(v.glucose)
  if(glucose){ if(glucose >= 126) vitals -= 14 }
  const spo2 = Number(v.spo2)
  if(spo2 && spo2 < 94) vitals -= 12

  if(ls.smoking && ls.smoking !== 'No') habits -= 30
  if(ls.alcohol && (ls.alcohol === 'Frequently')) habits -= 12

  const conditions = medicalHistory.conditions || []
  if(conditions.length) history -= Math.min(60, conditions.length * 12)

  const score = Math.max(12, Math.round(
    0.30 * Math.max(0, lifestyle) +
    0.40 * Math.max(0, vitals) +
    0.20 * Math.max(0, history) +
    0.10 * Math.max(0, habits)
  ))

  return {
    score,
    breakdown: {
      lifestyle: Math.max(0, Math.round(lifestyle)),
      vitals: Math.max(0, Math.round(vitals)),
      history: Math.max(0, Math.round(history)),
      habits: Math.max(0, Math.round(habits))
    }
  }
}

export function generateInsights(profile){
  const insights = []
  const { lifestyle = {}, vitals = {}, medicalHistory = {} } = profile || {}
  const sleep = Number(lifestyle.sleepDuration)
  if(sleep && sleep < 7){
    insights.push({priority:'Medium', title:'Sleep below recommended', text:`Your average sleep (${sleep}h) is below the 7–8h target.`})
  }
  if(lifestyle.dailySteps && Number(lifestyle.dailySteps) > 8000){
    insights.push({priority:'Low', title:'Activity level strong', text:'Your daily steps are high — good job keeping active.'})
  }
  if(vitals.systolic && Number(vitals.systolic) >= 140){
    insights.push({priority:'High', title:'Elevated blood pressure', text:'Your entered blood pressure is in an elevated range. Persistent elevation may warrant medical follow-up.'})
  }
  if(lifestyle.stressLevel && Number(lifestyle.stressLevel) >= 4){
    insights.push({priority:'Medium', title:'Stress level elevated', text:'Your reported stress level may benefit from stress-reduction activities.'})
  }
  if(medicalHistory.conditions && medicalHistory.conditions.includes('Diabetes')){
    insights.push({priority:'High', title:'Diabetes history', text:'Existing diabetes is noted — monitor blood glucose as recommended.'})
  }
  return insights
}

export function generateRecommendations(profile){
  const recs = []
  const { lifestyle = {}, vitals = {} } = profile || {}
  if((!lifestyle.dailySteps || Number(lifestyle.dailySteps) < 5000)){
    recs.push({priority:'High', title:'Increase daily steps', reason:'Gradually increase walking to reach 7,000–10,000 steps/day.'})
  }
  const sleep = Number(lifestyle.sleepDuration)
  if(!sleep || sleep < 7){
    recs.push({priority:'Medium', title:'Improve sleep consistency', reason:'Aim for a regular 7–8 hour sleep schedule.'})
  }
  if(vitals.systolic && Number(vitals.systolic) >= 140){
    recs.push({priority:'High', title:'Monitor blood pressure', reason:'Consider regular BP checks and consult a professional if values remain high.'})
  }
  return recs
}

export function generateRiskAnalysis(profile){
  const risks = []
  const { lifestyle={}, vitals={}, medicalHistory = {} } = profile || {}
  
  const sleep = Number(lifestyle.sleepDuration) || 7
  if(sleep < 6) risks.push({area:'Sleep & Circadian Rhythm', status:'Needs Attention', reason:'Low sleep duration (<6h/night)', action: 'Establish regular bedtime routine'})
  
  const steps = Number(lifestyle.dailySteps) || 0
  if(steps < 3000) risks.push({area:'Physical Activity', status:'Moderate', reason:'Sedentary step count (<3,000 steps/day)', action: 'Aim for 30-min daily walks'})
  
  if(lifestyle.smoking && lifestyle.smoking !== 'No') risks.push({area:'Lifestyle Habits', status:'Needs Attention', reason:'Tobacco / Smoking reported', action: 'Consider cessation support plan'})
  
  if(vitals.systolic && Number(vitals.systolic) >= 140) risks.push({area:'Cardiovascular System', status:'Needs Attention', reason:`Elevated BP (${vitals.systolic}/${vitals.diastolic || 80} mmHg)`, action: 'Monitor BP 2x daily & reduce sodium'})
  
  const glucose = Number(vitals.glucose) || Number(medicalHistory.bloodGlucose)
  if(glucose && glucose >= 126) risks.push({area:'Metabolic & Endocrine', status:'Needs Attention', reason:`Fasting Glucose High (${glucose} mg/dL)`, action: 'Schedule HbA1c panel & consult endocrinologist'})
  else if(glucose && glucose >= 100) risks.push({area:'Metabolic System', status:'Moderate', reason:`Prediabetes Range (${glucose} mg/dL)`, action: 'Reduce refined sugars & walk post-meals'})

  if(medicalHistory.conditions && medicalHistory.conditions.length){
    const valid = medicalHistory.conditions.filter(c => c !== 'None / Healthy')
    if(valid.length){
      risks.push({
        area:'Pre-existing Conditions',
        status:'Moderate',
        reason:`History noted: ${valid.join(', ')}`,
        action: 'Maintain active medication schedule & annual checkups'
      })
    }
  }

  if(risks.length === 0){
    risks.push({area:'Overall Baseline', status:'Optimal', reason:'No elevated risk factors detected', action: 'Maintain healthy lifestyle'})
  }

  return risks
}

export function generate5YearRiskForecast(profile){
  const { vitals = {}, medicalHistory = {}, lifestyle = {} } = profile || {}
  const glucose = Number(vitals.glucose) || Number(medicalHistory.bloodGlucose) || 98
  const sys = Number(vitals.systolic) || 120
  const sleep = Number(lifestyle.sleepDuration) || 7.5

  let diabetesProb = glucose >= 126 ? 68 : glucose >= 100 ? 28 : 12
  let cardioProb = sys >= 140 ? 42 : sys >= 130 ? 24 : 11
  let sleepDisorderProb = sleep < 6 ? 38 : 14

  return [
    { disease: 'Type 2 Diabetes Risk', prob: diabetesProb, status: diabetesProb > 30 ? 'High' : diabetesProb > 20 ? 'Moderate' : 'Low', timeframe: '5-Year AI Forecast', labTest: 'HbA1c & Fasting Insulin' },
    { disease: 'Cardiovascular Disease Risk', prob: cardioProb, status: cardioProb > 30 ? 'High' : cardioProb > 20 ? 'Moderate' : 'Low', timeframe: '5-Year AI Forecast', labTest: 'Lipid Panel & ApoB' },
    { disease: 'Hypertension & Arterial Stiffness', prob: sys >= 130 ? 32 : 14, status: sys >= 130 ? 'Moderate' : 'Low', timeframe: '5-Year AI Forecast', labTest: 'High-Sensitivity CRP (hs-CRP)' },
    { disease: 'Metabolic Sleep Disorder', prob: sleepDisorderProb, status: sleepDisorderProb > 25 ? 'Moderate' : 'Low', timeframe: '5-Year AI Forecast', labTest: 'Cortisol & Thyroid Panel' }
  ]
}

export function generateRecommendedLabTests(profile){
  const { vitals = {}, medicalHistory = {} } = profile || {}
  const glucose = Number(vitals.glucose) || Number(medicalHistory.bloodGlucose) || 98
  const sys = Number(vitals.systolic) || 120

  return [
    { name: 'HbA1c & Fasting Plasma Glucose', reason: 'Evaluates 90-day glycemic control and early insulin resistance.', urgency: glucose >= 100 ? 'High Priority' : 'Routine Annual' },
    { name: 'Comprehensive Lipid Panel (ApoB & LDL-C)', reason: 'Assesses atherogenic plaque risk and cardiovascular lipid ratios.', urgency: sys >= 130 ? 'Recommended' : 'Routine Annual' },
    { name: 'High-Sensitivity C-Reactive Protein (hs-CRP)', reason: 'Measures systemic vascular inflammation and arterial plaque risk.', urgency: 'Recommended' },
    { name: 'Renal & Electrolyte Panel (eGFR, Creatinine)', reason: 'Monitors kidney filtration efficacy and fluid-electrolyte balance.', urgency: 'Routine Annual' }
  ]
}

export function runHealthSimulation(profile, adjustments = {}){
  const baseScore = calculateHealthScore(profile).score
  const months = [0,1,6,12,60]
  const timeline = months.map(m=>{
    const deltaEx = (adjustments.exercisePercent || 0) * 0.05
    const deltaSl = (adjustments.sleepHours || 0) * 1.5
    const deltaW = Math.abs(adjustments.weightDeltaKg || 0) * 1.2
    const stepGain = (deltaEx + deltaSl + deltaW) * Math.min(1, m/12)
    const newScore = Math.min(99, Math.round(baseScore + stepGain))
    return { month: m, label: m === 0 ? 'Now' : m === 1 ? '1 mo' : m === 6 ? '6 mo' : m === 12 ? '1 yr' : '5 yr', score: newScore }
  })
  return timeline
}

export function getOnboardingCompletionStatus(profile = {}) {
  const pInfo = profile.personalInfo || {}
  const lStyle = profile.lifestyle || {}
  const mHist = profile.medicalHistory || {}
  const vTals = profile.vitals || {}
  const sReports = profile.scanReports || {}

  const isStep1Done = Boolean(
    pInfo.fullName && pInfo.fullName.toString().trim() &&
    pInfo.age && !isNaN(Number(pInfo.age)) && Number(pInfo.age) >= 1 && Number(pInfo.age) <= 120 &&
    pInfo.gender &&
    pInfo.height && !isNaN(Number(pInfo.height)) && Number(pInfo.height) >= 50 && Number(pInfo.height) <= 250 &&
    pInfo.weight && !isNaN(Number(pInfo.weight)) && Number(pInfo.weight) >= 20 && Number(pInfo.weight) <= 300 &&
    pInfo.bloodGroup &&
    pInfo.location
  )

  const isStep2Done = isStep1Done && Boolean(
    (lStyle.exerciseFreq || lStyle.exercise) &&
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
    vTals.spo2 && !isNaN(Number(vTals.spo2))
  )

  const isStep5Done = isStep4Done && Boolean(
    sReports.hasReports !== undefined && sReports.hasReports !== null
  )

  return { isStep1Done, isStep2Done, isStep3Done, isStep4Done, isStep5Done }
}

export default {
  calculateBMI, bmiCategory, calculateHealthScore, generateInsights, generateRecommendations, generateRiskAnalysis, runHealthSimulation, getOnboardingCompletionStatus
}
