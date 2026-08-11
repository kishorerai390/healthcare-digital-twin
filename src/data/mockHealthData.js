const mockData = {
  patient: {
    id: 'demo-001',
    name: 'Alex Morgan',
    age: 36,
    gender: 'Female'
  },
  metrics: {
    heartRate: 78,
    bp: '120/80',
    glucose: 102,
    spo2: 98,
    sleep: '7h 24m',
    activity: 8420,
    bmi: 23.4
  },
  risks: [
    { title: 'Type 2 Diabetes Risk', prob: 18, status: 'Low', factors: ['Family history','Sleep irregularity','Diet pattern']},
    { title: 'Cardiovascular Risk', prob: 12, status: 'Low', factors: ['Age','Blood pressure']},
    { title: 'Hypertension Risk', prob: 24, status: 'Moderate', factors: ['BMI','Salt intake']},
    { title: 'Sleep Disorder Risk', prob: 31, status: 'Moderate', factors: ['Sleep duration','Stress level']}
  ],
  reports: [
    { id: 'r1', title: 'Complete Blood Count', date: '2026-08-01' },
    { id: 'r2', title: 'Lipid Profile', date: '2026-07-15' }
  ],
  onboardingDefaults: {
    age: '36',
    gender: 'Female',
    height: '170',
    weight: '67',
    bloodGroup: 'O+',
    conditions: 'None',
    activityLevel: 'Moderate',
    exerciseFreq: '3x / wk',
    diet: 'Balanced',
    sleepDuration: '7',
    sleepQuality: 'Good',
    heartRate: '78',
    bp: '120/80',
    glucose: '102'
  }
}

export default mockData
