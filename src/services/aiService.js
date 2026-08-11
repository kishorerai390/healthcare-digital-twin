// Mock AI prediction service
// Structure is modular so a real AI model (TensorFlow / Python / LLM) can be integrated later.

const mockPredict = (patientData)=>{
  // Use simple heuristics to produce realistic-looking prototype predictions
  const risks = [
    { title: 'Type 2 Diabetes Risk', prob: 18, status: 'Low', factors: ['Family history','Sleep irregularity','Diet pattern']},
    { title: 'Cardiovascular Risk', prob: 12, status: 'Low', factors: ['Age','Blood pressure']},
    { title: 'Hypertension Risk', prob: 24, status: 'Moderate', factors: ['BMI','Salt intake']},
    { title: 'Sleep Disorder Risk', prob: 31, status: 'Moderate', factors: ['Sleep duration','Stress level']}
  ]
  return { risks, summary: 'Prototype AI prediction — not a medical diagnosis.' }
}

export default {
  predict: mockPredict,
}

/*
  Integration notes:
  - Replace mockPredict with a fetch to a deployed model endpoint, or
  - Implement a TF.js model here that accepts normalized metrics and returns probabilities.
  - Keep the same function signature (patientData) so UI code won't change.
*/
