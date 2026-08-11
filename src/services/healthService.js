// Health data service (prototype)
// Provides mock data and simple helpers for the demo
import mock from '../data/mockHealthData'

export function getPatient(){
  // In a real app, fetch from Firestore: users/{uid}
  return mock.patient
}

export function getLatestMetrics(){
  return mock.metrics
}

export function getRisks(){
  return mock.risks
}

export default { getPatient, getLatestMetrics, getRisks }
