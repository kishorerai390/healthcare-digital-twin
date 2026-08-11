// Separate Storage Utility for Admin Data & Authentication
const ADMIN_SESSION_KEY = 'medtwin_admin_session'
const ADMIN_DATA_KEY = 'medtwin_admin_data'
const ADMIN_PATIENTS_KEY = 'medtwin_admin_patients_v1'

export function getAdminSession() {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (err) {
    console.warn('Failed to parse admin session:', err)
    return null
  }
}

export function saveAdminSession(adminUser) {
  try {
    const session = {
      ...adminUser,
      isAuthenticated: true,
      authenticatedAt: new Date().toISOString()
    }
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
    return session
  } catch (err) {
    console.warn('Failed to save admin session:', err)
    return null
  }
}

export function clearAdminSession() {
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY)
  } catch (err) {
    console.warn('Failed to clear admin session:', err)
  }
}

export function getAdminCustomData() {
  try {
    const raw = localStorage.getItem(ADMIN_DATA_KEY)
    if (!raw) return { adminNotes: '', systemAlerts: [] }
    return JSON.parse(raw)
  } catch (err) {
    return { adminNotes: '', systemAlerts: [] }
  }
}

export function saveAdminCustomData(data) {
  try {
    localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(data))
  } catch (err) {
    console.warn('Failed to save admin custom data:', err)
  }
}

export function getAdminPatients(initialPatients) {
  try {
    const raw = localStorage.getItem(ADMIN_PATIENTS_KEY)
    if (!raw) return initialPatients
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialPatients
  } catch (err) {
    return initialPatients
  }
}

export function saveAdminPatients(patients) {
  try {
    localStorage.setItem(ADMIN_PATIENTS_KEY, JSON.stringify(patients))
  } catch (err) {
    console.warn('Failed to save admin patients:', err)
  }
}

export default {
  getAdminSession, saveAdminSession, clearAdminSession,
  getAdminCustomData, saveAdminCustomData, getAdminPatients, saveAdminPatients
}
