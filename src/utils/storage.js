// Simple localStorage-based health profile storage for prototype with Unique Twin ID Generator
const KEY = 'medtwin_health_profile_v1'

export function generateUniqueTwinId(country = 'United States') {
  const codeMap = {
    'United States': 'US',
    'India': 'IN',
    'United Kingdom': 'UK',
    'Canada': 'CA',
    'Australia': 'AU',
    'Singapore': 'SG',
    'United Arab Emirates': 'AE',
    'Germany': 'DE',
    'Japan': 'JP'
  }
  const cc = codeMap[country] || 'US'
  const random5 = Math.floor(10000 + Math.random() * 90000)
  return `TWIN-${random5}-${cc}`
}

export const DEFAULT_HEALTH_PROFILE = {
  twinId: 'TWIN-88412-US',
  createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  healthScore: 94,
  personalInfo: {
    fullName: 'Alex Morgan',
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
  }
}

export function saveHealthProfile(profile){
  if (!profile.twinId) {
    profile.twinId = generateUniqueTwinId(profile.personalInfo?.country)
  }
  localStorage.setItem(KEY, JSON.stringify(profile))
}

export function getHealthProfile(){
  const raw = localStorage.getItem(KEY)
  if(!raw) {
    return null
  }
  try{
    const profile = JSON.parse(raw)
    if (profile && !profile.twinId) {
      profile.twinId = generateUniqueTwinId(profile.personalInfo?.country)
      localStorage.setItem(KEY, JSON.stringify(profile))
    }
    return profile
  }catch(e){
    console.error('Failed to parse health profile', e)
    return null
  }
}

export function updateHealthProfile(updater){
  const cur = getHealthProfile() || {}
  const next = typeof updater === 'function' ? updater(cur) : {...cur, ...updater}
  if (!next.twinId) {
    next.twinId = generateUniqueTwinId(next.personalInfo?.country)
  }
  saveHealthProfile(next)
  return next
}

export function clearHealthProfile(){
  localStorage.removeItem(KEY)
}

export default { saveHealthProfile, getHealthProfile, updateHealthProfile, clearHealthProfile, generateUniqueTwinId }
