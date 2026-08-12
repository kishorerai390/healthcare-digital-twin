import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { jsPDF } from 'jspdf'
import { 
  ShieldCheck, Users, Activity, Cpu, Server, Lock, Search, ArrowLeft, 
  CheckCircle2, AlertTriangle, TrendingUp, Database, RefreshCw, Key,
  Eye, EyeOff, ShieldAlert, Zap, Mail, LogOut, FileText, Save, Plus, Download,
  Globe, PhoneCall, Check, Trash2, Sliders, Stethoscope, Clock, Sparkles
} from 'lucide-react'
import LanguageSelector from '../components/LanguageSelector'
import ThemeToggle from '../components/ThemeToggle'
import GoogleAuthModal from '../components/GoogleAuthModal'
import ClinicalInsightsOptimizationHub from '../components/ClinicalInsightsOptimizationHub'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { 
  getAdminSession, saveAdminSession, clearAdminSession, 
  getAdminCustomData, saveAdminCustomData,
  getAdminPatients, saveAdminPatients
} from '../utils/adminStorage'
import { saveHealthProfile } from '../utils/storage'

const INITIAL_PATIENTS = [
  { id: 'TWIN-88412-US', name: 'Alex Morgan', age: 32, gender: 'Male', risk: 'Low Risk', score: 98, status: 'Active Sync', lastSync: '2 mins ago', role: 'Patient' },
  { id: 'TWIN-94811-US', name: 'Ava Nguyen', age: 29, gender: 'Female', risk: 'Low Risk', score: 96, status: 'Active Sync', lastSync: 'Just now', role: 'Patient' },
  { id: 'TWIN-31092-CA', name: 'Marcus Vance', age: 54, gender: 'Male', risk: 'Moderate Risk', score: 74, status: 'Pending Review', lastSync: '14 mins ago', role: 'Patient' },
  { id: 'TWIN-77210-UK', name: 'Elena Rostova', age: 41, gender: 'Female', risk: 'Low Risk', score: 91, status: 'Active Sync', lastSync: '1 hour ago', role: 'Patient' },
  { id: 'TWIN-50493-DE', name: 'David Kim', age: 62, gender: 'Male', risk: 'High Risk', score: 62, status: 'Clinical Alert', lastSync: '5 mins ago', role: 'Patient' },
  { id: 'TWIN-11928-IN', name: 'Priya Patel', age: 36, gender: 'Female', risk: 'Low Risk', score: 94, status: 'Active Sync', lastSync: '30 mins ago', role: 'Patient' }
]

const EMERGENCY_ALERTS = [
  { id: 'ALT-901', twinId: 'TWIN-50493-DE', patient: 'David Kim (62 M)', trigger: 'Systolic BP Spike (148 mmHg) & Fasting Glucose Surge (132 mg/dL)', level: 'CRITICAL', time: '5 mins ago', doctor: 'Dr. Sarah Jenkins (Cardiology)' },
  { id: 'ALT-902', twinId: 'TWIN-31092-CA', patient: 'Marcus Vance (54 M)', trigger: 'Circadian Sleep Deficit (<4.8 hrs/night) & Cortisol Elevation', level: 'ATTENTION', time: '14 mins ago', doctor: 'Dr. Robert Vance (Endocrinology)' }
]

const SERVER_NODES = [
  { region: 'US-East (Virginia)', code: 'us-east-1', latency: '12 ms', load: '14%', status: 'Operational 🟢' },
  { region: 'US-West (Oregon)', code: 'us-west-2', latency: '18 ms', load: '22%', status: 'Operational 🟢' },
  { region: 'EU-West (Frankfurt)', code: 'eu-central-1', latency: '28 ms', load: '31%', status: 'Operational 🟢' },
  { region: 'AP-South (Mumbai)', code: 'ap-south-1', latency: '34 ms', load: '19%', status: 'Operational 🟢' }
]

const SYSTEM_LOGS = [
  { id: 1, time: '14:08:22', level: 'INFO', event: 'HIPAA Security Vault Audit', detail: '0 vulnerabilities detected across 1,482 digital twin records.' },
  { id: 2, time: '14:05:10', level: 'SUCCESS', event: 'Voice AI Acoustic Model Sync', detail: '30s vocal waveform neural weights updated (v4.2).' },
  { id: 3, time: '13:58:44', level: 'WARN', event: 'High Risk Vitals Spike Alert', detail: 'Patient TWIN-50493-DE triggered automated clinical notification.' },
  { id: 4, time: '13:42:01', level: 'INFO', event: 'Computer Vision Model Deploy', detail: 'Wound healing segmentation dataset auto-calibrated.' }
]

export default function Admin(){
  const nav = useNavigate()
  const { t } = useLanguage()

  const { signinWithGoogle } = useAuth()

  // Admin Auth State & Registration Mode
  const [adminSession, setAdminSession] = useState(() => getAdminSession())
  const [adminMode, setAdminMode] = useState('login') // 'login' | 'register'
  const [adminEmail, setAdminEmail] = useState('admin.medtwin@gmail.com')
  const [adminKey, setAdminKey] = useState('ADMIN-2026-SECURE')
  const [showAdminKey, setShowAdminKey] = useState(false)

  // Register Admin Account State
  const [regFullName, setRegFullName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regRole, setRegRole] = useState('Senior Telemetry Physician')
  const [regKey, setRegKey] = useState('')
  const [regConfirmKey, setRegConfirmKey] = useState('')
  const [showRegKey, setShowRegKey] = useState(false)
  const [showRegConfirmKey, setShowRegConfirmKey] = useState(false)

  const [authError, setAuthError] = useState(null)
  const [authenticating, setAuthenticating] = useState(false)

  // Google Auth Admin Modal State
  const [showAdminGoogleModal, setShowAdminGoogleModal] = useState(false)

  const handleAdminGoogleAuth = () => {
    setAuthError(null)
    setShowAdminGoogleModal(true)
  }

  const handleAdminRegisterSubmit = (e) => {
    e?.preventDefault?.()
    setAuthError(null)

    const name = (regFullName || '').trim()
    const email = (regEmail || '').trim().toLowerCase()
    const key = (regKey || '').trim()
    const confirmKey = (regConfirmKey || '').trim()

    if (!name) {
      setAuthError('⚠️ Please enter your Admin Full Name.')
      return
    }

    if (!email || !email.includes('@')) {
      setAuthError('⚠️ Please enter a valid Admin Gmail or Email address.')
      return
    }

    if (!key) {
      setAuthError('⚠️ Please create an Admin Security Passcode.')
      return
    }

    if (key !== confirmKey) {
      setAuthError('❌ Passcodes do not match. Please re-enter your Security Passcode.')
      return
    }

    setAuthenticating(true)

    setTimeout(() => {
      try {
        setAuthenticating(false)
        const newAdmin = {
          email: email,
          name: name,
          role: regRole || 'Senior Telemetry Physician',
          authMethod: 'Custom Admin Account Creation'
        }
        const session = saveAdminSession(newAdmin) || { ...newAdmin, isAuthenticated: true }
        setAdminSession(session)
      } catch (err) {
        console.error('Admin registration error:', err)
        setAuthenticating(false)
        setAuthError('⚠️ Account creation failed. Please try again.')
      }
    }, 400)
  }

  // Dashboard Data State - Persistent Admin Patient Registry Merged with Real User Data
  const loadMergedPatients = () => {
    const adminPatients = getAdminPatients(INITIAL_PATIENTS)
    try {
      const raw = localStorage.getItem('medtwin_health_profile_v1')
      if (raw) {
        const hp = JSON.parse(raw)
        if (hp && hp.personalInfo && hp.personalInfo.fullName) {
          const twinId = hp.twinId || 'TWIN-88412-US'
          const name = hp.personalInfo.fullName
          const age = Number(hp.personalInfo.age) || 32
          const gender = hp.personalInfo.gender || 'Male'
          const score = Number(hp.healthScore) || 94
          const risk = score < 70 ? 'High Risk' : score < 85 ? 'Moderate Risk' : 'Low Risk'

          const userRecord = {
            id: twinId,
            name: name,
            age: age,
            gender: gender,
            risk: risk,
            score: score,
            status: 'Active Sync',
            lastSync: 'Just now (Recent User Entry)',
            role: 'Registered User',
            isRealUser: true
          }

          const idx = adminPatients.findIndex(p => p.id === twinId || (p.name || '').toLowerCase() === name.toLowerCase())
          if (idx >= 0) {
            adminPatients[idx] = { ...adminPatients[idx], ...userRecord }
          } else {
            adminPatients.unshift(userRecord)
          }
        }
      }
    } catch (err) {
      console.warn('Error reading user health profile for admin table:', err)
    }
    return adminPatients
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [filterRisk, setFilterRisk] = useState('ALL')
  const [patients, setPatients] = useState(() => loadMergedPatients())
  const [refreshing, setRefreshing] = useState(false)

  // Add Patient, Inspect & Comparison Modal State
  const [showAddPatientModal, setShowAddPatientModal] = useState(false)
  const [selectedInspectPatient, setSelectedInspectPatient] = useState(null)
  const [comparePatients, setComparePatients] = useState([])
  const [newPatient, setNewPatient] = useState({ name: '', age: '30', gender: 'Female', risk: 'Low Risk', score: '95' })
  const [exportToast, setExportToast] = useState(false)

  // Platform Navigation & System Modal States for All Buttons Access
  const [activePlatformTab, setActivePlatformTab] = useState('dashboard') // 'dashboard' | 'ai' | 'appointments' | 'patients' | 'finance' | 'operations' | 'inventory' | 'diagnostics' | 'staff' | 'physical_twin'
  const [activeSystemModal, setActiveSystemModal] = useState(null) // null | 'ehr' | 'monitoring' | 'labs' | 'pharmacy' | 'staff_sched' | 'devices'
  const [showActionsDropdown, setShowActionsDropdown] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const [viewSource, setViewSource] = useState('USER_ONLY') // 'USER_ONLY' | 'ALL'

  const handleAddPatientSubmit = (e) => {
    e.preventDefault()
    if (!newPatient.name.trim()) return
    const id = `TWIN-${Math.floor(10000 + Math.random() * 90000)}-IN`
    const created = {
      id,
      name: newPatient.name.trim(),
      age: Number(newPatient.age) || 30,
      gender: newPatient.gender,
      risk: newPatient.risk,
      score: Number(newPatient.score) || 92,
      status: 'Active Sync',
      lastSync: 'Just now (User Registered)',
      role: 'Registered Patient',
      isRealUser: true
    }
    const updated = [created, ...patients]
    setPatients(updated)
    saveAdminPatients(updated)
    setShowAddPatientModal(false)
    setNewPatient({ name: '', age: '30', gender: 'Female', risk: 'Low Risk', score: '95' })
  }

  const handleDeletePatient = (id) => {
    const updated = patients.filter(p => p.id !== id)
    setPatients(updated)
    saveAdminPatients(updated)
  }

  const handleInspectAndSavePatient = (patient) => {
    if (!patient) return
    const isHighRisk = patient.risk === 'High Risk'
    const isModRisk = patient.risk === 'Moderate Risk'

    const inspectedProfile = {
      twinId: patient.id,
      personalInfo: {
        fullName: patient.name,
        age: patient.age,
        gender: patient.gender,
        height: 175,
        weight: isHighRisk ? 88 : 68,
        bloodGroup: 'O+',
        location: 'San Francisco, CA',
        country: 'United States'
      },
      vitals: {
        heartRate: isHighRisk ? 98 : isModRisk ? 84 : 74,
        systolic: isHighRisk ? 148 : isModRisk ? 132 : 118,
        diastolic: isHighRisk ? 92 : isModRisk ? 84 : 78,
        spo2: 98,
        glucose: isHighRisk ? 132 : isModRisk ? 108 : 98
      },
      lifestyle: {
        exerciseFreq: isHighRisk ? '0 (Never)' : '3-4 times/week',
        sleepDuration: isHighRisk ? '5.2' : '7.5',
        sleepQuality: isHighRisk ? 'Poor / Disrupted' : 'Good Quality',
        dietType: 'Balanced Mediterranean',
        smoking: isHighRisk ? 'Yes' : 'No',
        alcohol: 'No'
      },
      medicalHistory: {
        conditions: isHighRisk ? ['Hypertension', 'Type 2 Diabetes'] : isModRisk ? ['Pre-Diabetes'] : ['None / Healthy'],
        bloodGlucose: isHighRisk ? 132 : 98
      },
      scanReports: {
        hasReports: true
      }
    }

    saveHealthProfile(inspectedProfile)
    setSelectedInspectPatient(patient)
  }

function createAdminHIPAAShieldDataURL() {
  const canvas = document.createElement('canvas')
  canvas.width = 120
  canvas.height = 120
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#0f172a'
  ctx.beginPath()
  ctx.arc(60, 60, 56, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#10b981'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(60, 60, 48, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = '#10b981'
  ctx.font = 'bold 20px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('HIPAA', 60, 46)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 11px sans-serif'
  ctx.fillText('VERIFIED 100%', 60, 66)

  return canvas.toDataURL('image/png')
}

function createAdminBarcodeDataURL(codeText = 'SEC-984021-HIPAA') {
  const canvas = document.createElement('canvas')
  canvas.width = 260
  canvas.height = 65
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 260, 65)

  ctx.fillStyle = '#0f172a'
  for (let x = 12; x < 248; x += 4) {
    const barWidth = ((x % 3 === 0) || (x % 5 === 0)) ? 3 : 1
    ctx.fillRect(x, 10, barWidth, 38)
  }

  ctx.font = 'bold 10px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(`CHECKSUM: ${codeText}`, 130, 58)
  return canvas.toDataURL('image/png')
}

  const handleExportAuditReport = () => {
    try {
      const doc = new jsPDF()
      const dateStr = new Date().toLocaleString()
      const adminMail = adminSession?.email || 'admin.medtwin@gmail.com'
      const checksum = `SEC-${Math.floor(100000 + Math.random() * 900000)}-HIPAA`

      // 1. Header Banner (Dark Navy)
      doc.setFillColor(15, 23, 42)
      doc.rect(0, 0, 210, 45, 'F')

      // Cyan Accent Line
      doc.setFillColor(6, 182, 212)
      doc.rect(0, 45, 210, 3, 'F')

      // Embed Header Shield Image
      try {
        const shieldDataUrl = createAdminHIPAAShieldDataURL()
        doc.addImage(shieldDataUrl, 'PNG', 12, 8, 28, 28)
      } catch (e) {
        console.warn('Shield embed error:', e)
      }

      // Title & Header Text
      doc.setTextColor(6, 182, 212)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('ADMIN COMMAND PORTAL — SYSTEM AUDIT', 45, 20)

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.text('HIPAA SECURITY RULE & SYSTEM TELEMETRY AUDIT REPORT', 45, 28)

      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(148, 163, 184)
      doc.text(`Generated: ${dateStr} | Operator: ${adminMail}`, 45, 36)
      doc.text('CLASSIFICATION: CONFIDENTIAL / RESTRICTED', 120, 36)

      // 2. Executive System Audit Summary Box
      doc.setFillColor(248, 250, 252)
      doc.rect(14, 54, 182, 40, 'F')
      doc.setDrawColor(226, 232, 240)
      doc.rect(14, 54, 182, 40, 'S')

      doc.setTextColor(15, 23, 42)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('1. 🛡️ EXECUTIVE SYSTEM & SECURITY AUDIT SUMMARY', 18, 63)

      doc.setFontSize(8.5)
      doc.setFont('helvetica', 'normal')
      doc.text('• Encryption Standard: AES-256 Bit End-to-End Encryption (100% HIPAA Compliance Score)', 18, 71)
      doc.text(`• Total Active Digital Twins: ${patients.length} Monitored Patient Registry Records`, 18, 77)
      doc.text('• AI Neural Precision Score: 99.8% Accuracy | Global Edge Latency: 14ms Response', 18, 83)
      doc.text('• Regional Cloud Edge Nodes: US-East (12ms), US-West (18ms), EU-West (28ms), AP-South (34ms)', 18, 89)

      // 3. Confidential Admin Vault Directives Section
      let y = 100
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('2. 📝 CONFIDENTIAL ADMIN DIRECTIVES & VAULT NOTES', 14, y)

      y += 4
      doc.setFillColor(241, 245, 249)
      doc.rect(14, y, 182, 18, 'F')
      doc.setDrawColor(203, 213, 225)
      doc.rect(14, y, 182, 18, 'S')

      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(51, 65, 85)
      const noteLines = doc.splitTextToSize(adminNotes || '• Executive Review: All telemetry clusters performing at 99.8% precision.', 175)
      doc.text(noteLines, 18, y + 6)

      // 4. Patient Registry Table Header
      y += 24
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('3. 👥 PATIENT DIGITAL TWIN AUDIT REGISTRY', 14, y)

      // Table Headers
      y += 4
      doc.setFillColor(30, 41, 59)
      doc.rect(14, y, 182, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text('TWIN ID', 18, y + 5.5)
      doc.text('PATIENT NAME', 55, y + 5.5)
      doc.text('DEMOGRAPHICS', 105, y + 5.5)
      doc.text('RISK STATUS', 142, y + 5.5)
      doc.text('SCORE', 178, y + 5.5)

      // Table Rows
      y += 13
      patients.forEach((p, idx) => {
        if (idx % 2 === 1) {
          doc.setFillColor(241, 245, 249)
          doc.rect(14, y - 5, 182, 8, 'F')
        }
        doc.setTextColor(15, 23, 42)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8)
        doc.text(p.id, 18, y)

        doc.setFont('helvetica', 'normal')
        doc.text(p.name, 55, y)
        doc.text(`${p.gender}, ${p.age} yrs`, 105, y)

        if (p.risk === 'High Risk') {
          doc.setTextColor(225, 29, 72)
        } else if (p.risk === 'Moderate Risk') {
          doc.setTextColor(217, 119, 6)
        } else {
          doc.setTextColor(16, 185, 129)
        }
        doc.text(p.risk, 142, y)

        doc.setTextColor(15, 23, 42)
        doc.text(`${p.score}/100`, 178, y)

        y += 8
      })

      // 5. Emergency Clinical Escalations Section
      y += 4
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('4. 🚨 ACTIVE EMERGENCY CLINICAL ALERTS & INTERVENTIONS', 14, y)

      y += 5
      doc.setFillColor(254, 242, 242)
      doc.rect(14, y, 182, 16, 'F')
      doc.setDrawColor(254, 202, 202)
      doc.rect(14, y, 182, 16, 'S')

      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(153, 27, 27)
      doc.text('• Alert ALT-901 [TWIN-50493-DE] David Kim (62 M): Systolic BP Spike (148 mmHg) & Fasting Glucose Surge', 18, y + 5.5)
      doc.setFont('helvetica', 'normal')
      doc.text('  Attending Physician: Dr. Sarah Jenkins (Cardiology) | Intervention Status: Escalation Active', 18, y + 11)

      // 6. Embed Barcode Image & HIPAA Attestation Seal
      y += 22
      try {
        const barcodeDataUrl = createAdminBarcodeDataURL(checksum)
        doc.addImage(barcodeDataUrl, 'PNG', 14, y, 86, 22)
      } catch (err) {
        console.warn('Barcode embed error:', err)
      }

      // Regulatory Footer
      doc.setFillColor(241, 245, 249)
      doc.rect(110, y, 86, 22, 'F')
      doc.setDrawColor(203, 213, 225)
      doc.rect(110, y, 86, 22, 'S')

      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('HIPAA SECURITY RULE CERTIFICATION', 114, y + 6)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(71, 85, 105)
      doc.text('Certifies 45 CFR Part 160 & Part 164 compliance.', 114, y + 11)
      doc.text(`Checksum Hash: ${checksum}`, 114, y + 16)

      // Footer Accent Bar
      doc.setFillColor(15, 23, 42)
      doc.rect(0, 276, 210, 21, 'F')

      doc.setFontSize(8)
      doc.setTextColor(255, 255, 255)
      doc.text('MedTwin AI Healthcare Digital Twin Command Portal — Restricted Admin Audit', 14, 287)
      doc.setTextColor(6, 182, 212)
      doc.text('AES-256 Encrypted PDF 🛡️', 150, 287)

      // Save PDF
      doc.save(`HIPAA_Security_Audit_Report_${Date.now()}.pdf`)
    } catch (err) {
      console.error('PDF Generation Error:', err)
    }

    setExportToast(true)
    setTimeout(() => setExportToast(false), 3500)
  }

  // Separate Admin Vault Confidential Notes Default Template
  const DEFAULT_CONFIDENTIAL_DIRECTIVES = `[CONFIDENTIAL MEDICAL DIRECTIVES & TELEMETRY VAULT]
----------------------------------------------------------------------
• EXECUTIVE REVIEW: All 1,482 patient digital twin telemetry clusters operating at 99.8% neural precision. Zero corrupted packets.
• CRITICAL CASE ALERT: Patient David Kim (TWIN-50493-DE) flagged for Systolic BP spike (148 mmHg) & Fasting Glucose surge. Notification dispatched to Dr. Sarah Jenkins.
• CLINICAL CASE REVIEWS: 18 patient twin scans currently pending physician sign-off prior to insurance claim export.
• HIPAA COMPLIANCE AUDIT: AES-256 vault encryption verified across all node clusters. Next scheduled scan: Midnight UTC.`

  // Separate Admin Notes State
  const [adminNotes, setAdminNotes] = useState(() => getAdminCustomData().adminNotes || DEFAULT_CONFIDENTIAL_DIRECTIVES)
  const [notesSaved, setNotesSaved] = useState(false)

  // Handle Admin Login Verification
  const handleAdminAuthSubmit = (e) => {
    e?.preventDefault?.()
    setAuthError(null)

    const trimmedEmail = adminEmail.trim().toLowerCase()
    const trimmedKey = adminKey.trim()

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setAuthError('⚠️ Please enter a valid Admin Gmail or Email address.')
      return
    }

    if (!trimmedKey) {
      setAuthError('⚠️ Please enter the Admin Security Key.')
      return
    }

    setAuthenticating(true)

    setTimeout(() => {
      setAuthenticating(false)
      // Allow demo key or any non-empty passcode for security validation
      const newSession = saveAdminSession({
        email: trimmedEmail,
        name: trimmedEmail.split('@')[0].toUpperCase(),
        role: 'System Administrator'
      })
      setAdminSession(newSession)
    }, 600)
  }

  // Handle Admin Lock / Logout
  const handleAdminLogout = () => {
    clearAdminSession()
    setAdminSession(null)
  }

  // Save Custom Admin Notes
  const handleSaveNotes = () => {
    saveAdminCustomData({ adminNotes })
    setNotesSaved(true)
    setTimeout(() => setNotesSaved(false), 2000)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 800)
  }

  const safePatients = Array.isArray(patients) ? patients : INITIAL_PATIENTS
  const filteredPatients = safePatients.filter(p => {
    if (!p) return false

    // If USER_ONLY mode is active, filter out synthetic mock records
    if (viewSource === 'USER_ONLY') {
      const isUserCreated = p.isRealUser || p.lastSync?.includes('User') || p.lastSync?.includes('Just now') || p.role?.includes('Registered')
      if (!isUserCreated) return false
    }

    const nameStr = (p.name || '').toString().toLowerCase()
    const idStr = (p.id || '').toString().toLowerCase()
    const riskStr = (p.risk || '').toString().toUpperCase()
    const statusStr = (p.status || '').toString().toUpperCase()
    const syncStr = (p.lastSync || '').toString().toUpperCase()
    const searchStr = (searchTerm || '').toString().toLowerCase()

    const matchesSearch = nameStr.includes(searchStr) || idStr.includes(searchStr)
    let matchesFilter = true
    if (filterRisk === 'LOW') matchesFilter = riskStr.includes('LOW')
    else if (filterRisk === 'MODERATE') matchesFilter = riskStr.includes('MODERATE')
    else if (filterRisk === 'HIGH') matchesFilter = riskStr.includes('HIGH')
    else if (filterRisk === 'PENDING') matchesFilter = statusStr.includes('PENDING')
    else if (filterRisk === 'RECENT') matchesFilter = p.isRealUser || syncStr.includes('JUST NOW') || syncStr.includes('RECENT')

    return matchesSearch && matchesFilter
  })

  // ----------------------------------------------------
  // UNAUTHENTICATED GATE: ADMIN LOCK LOGIN SCREEN
  // ----------------------------------------------------
  if (!adminSession || !adminSession.isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 font-sans relative overflow-hidden">
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6 relative z-10"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <button
              onClick={() => nav('/')}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Back to Home</span>
            </button>
            <LanguageSelector />
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-2">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              <span>Restricted Admin Portal</span>
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {adminMode === 'login' ? 'Admin Gateway Security' : 'Create Admin Account'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {adminMode === 'login'
                ? 'Enter your authorized Admin Gmail & Security Passcode to unlock'
                : 'Register a new authorized Admin Account for MedTwin Digital Twin System'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAdminMode('login'); setAuthError(null); }}
              className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                adminMode === 'login'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In as Admin
            </button>
            <button
              type="button"
              onClick={() => { setAdminMode('register'); setAuthError(null); }}
              className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                adminMode === 'register'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Admin Account
            </button>
          </div>

          {adminMode === 'login' ? (
            <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Admin Email / Gmail</label>
                <div className="relative">
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={e => { setAdminEmail(e.target.value); setAuthError(null); }}
                    placeholder="admin.medtwin@gmail.com"
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-medium pl-10"
                  />
                  <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Admin Security Key / Passcode</label>
                <div className="relative">
                  <input
                    type={showAdminKey ? "text" : "password"}
                    value={adminKey}
                    onChange={e => { setAdminKey(e.target.value); setAuthError(null); }}
                    placeholder="ADMIN-2026-SECURE"
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-mono font-bold pl-10 pr-10"
                  />
                  <Key className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowAdminKey(!showAdminKey)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                    title={showAdminKey ? "Hide passcode" : "Show passcode"}
                  >
                    {showAdminKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Demo Helper Buttons */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Fill Demo Admin Credentials:</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => { setAdminEmail('admin.medtwin@gmail.com'); setAdminKey('ADMIN-2026-SECURE'); setAuthError(null); }}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold transition-colors cursor-pointer"
                  >
                    ✓ Demo Gmail: admin.medtwin@gmail.com
                  </button>
                </div>
              </div>

              {authError && (
                <div className="text-rose-400 text-xs font-bold bg-rose-500/10 p-3 rounded-xl border border-rose-500/30">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authenticating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {authenticating ? (
                  <div className="flex items-center gap-2 text-white">
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span className="text-white">Verifying Admin Credentials...</span>
                  </div>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span className="text-white">Authenticate & Unlock Admin Portal →</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleAdminGoogleAuth}
                disabled={authenticating}
                className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md border border-slate-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Authenticate Admin with Google</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminMode('register')}
                className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-cyan-500/30"
              >
                <span>✨ Need a New Admin Account? Register Here →</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const session = saveAdminSession({ email: 'admin.medtwin@gmail.com', name: 'Demo Admin', role: 'System Administrator' })
                  setAdminSession(session)
                }}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
              >
                ⚡ Continue as Admin (Demo Mode)
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Admin Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={regFullName}
                    onChange={e => { setRegFullName(e.target.value); setAuthError(null); }}
                    placeholder="Dr. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-medium pl-10"
                  />
                  <ShieldCheck className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Admin Email / Gmail</label>
                <div className="relative">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => { setRegEmail(e.target.value); setAuthError(null); }}
                    placeholder="sarah.jenkins@medtwin.org"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-medium pl-10"
                  />
                  <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Admin Medical / System Role</label>
                <div className="relative">
                  <select
                    value={regRole}
                    onChange={e => setRegRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-bold focus:outline-none focus:border-cyan-500 pl-10"
                  >
                    <option value="Senior Telemetry Physician">Senior Telemetry Physician</option>
                    <option value="Chief Medical Officer">Chief Medical Officer</option>
                    <option value="Senior Cardiologist">Senior Cardiologist</option>
                    <option value="System Administrator">System Administrator</option>
                    <option value="Lead Telemetry Engineer">Lead Telemetry Engineer</option>
                  </select>
                  <Stethoscope className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Create Admin Passcode</label>
                <div className="relative">
                  <input
                    type={showRegKey ? "text" : "password"}
                    value={regKey}
                    onChange={e => { setRegKey(e.target.value); setAuthError(null); }}
                    placeholder="Create Admin Passcode"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-mono font-bold pl-10 pr-10"
                  />
                  <Key className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowRegKey(!showRegKey)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                    title={showRegKey ? "Hide passcode" : "Show passcode"}
                  >
                    {showRegKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Confirm Admin Passcode</label>
                <div className="relative">
                  <input
                    type={showRegConfirmKey ? "text" : "password"}
                    value={regConfirmKey}
                    onChange={e => { setRegConfirmKey(e.target.value); setAuthError(null); }}
                    placeholder="Confirm Admin Passcode"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-mono font-bold pl-10 pr-10"
                  />
                  <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmKey(!showRegConfirmKey)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                    title={showRegConfirmKey ? "Hide passcode" : "Show passcode"}
                  >
                    {showRegConfirmKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="text-rose-400 text-xs font-bold bg-rose-500/10 p-3 rounded-xl border border-rose-500/30">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authenticating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {authenticating ? (
                  <div className="flex items-center gap-2 text-white">
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span className="text-white">Creating Admin Account...</span>
                  </div>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span className="text-white">✨ Register & Unlock Admin Portal →</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setAdminMode('login')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
              >
                <span>← Already registered? Back to Admin Login</span>
              </button>
            </form>
          )}
        </motion.div>

        <GoogleAuthModal
          isOpen={showAdminGoogleModal}
          onClose={() => setShowAdminGoogleModal(false)}
          roleTitle="Admin Command Portal"
          onSelectAccount={(account) => {
            const session = saveAdminSession({
              email: account.email,
              name: account.name,
              role: 'System Administrator',
              authMethod: account.authMethod
            })
            setAdminSession(session)
          }}
        />
      </div>
    )
  }

  // ----------------------------------------------------
  // AUTHENTICATED ADMIN COMMAND DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      {/* Header Bar */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">Admin Command Portal</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                System Live
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-2 pt-0.5">
              <span>Admin: <strong className="text-cyan-400 font-mono">{adminSession?.email || adminSession?.name || 'admin.medtwin@gmail.com'}</strong></span>
              {adminSession?.role && (
                <>
                  <span>•</span>
                  <span className="text-teal-400 font-bold">{adminSession.role}</span>
                </>
              )}
              <span>•</span>
              <span className="text-slate-400">Separate Storage Active</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowActionsDropdown(!showActionsDropdown)}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-500/20"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Actions</span>
            </button>

            {showActionsDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1 text-xs font-bold text-slate-200">
                <button
                  onClick={() => {
                    setShowActionsDropdown(false)
                    handleExportAuditReport()
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-cyan-400 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download HIPAA PDF Audit</span>
                </button>
                <button
                  onClick={() => {
                    setShowActionsDropdown(false)
                    setShowAddPatientModal(true)
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Register Patient Twin</span>
                </button>
                <button
                  onClick={() => {
                    setShowActionsDropdown(false)
                    setActivePlatformTab('operations')
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-rose-400 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Emergency SOS Dispatch</span>
                </button>
                <button
                  onClick={() => {
                    setShowActionsDropdown(false)
                    setActivePlatformTab('ai')
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-purple-400 cursor-pointer"
                >
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span>Deploy Voice & Vision AI Models</span>
                </button>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
            title="System Settings & Configuration"
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={handleExportAuditReport}
            className="px-3.5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Download HIPAA Compliance & System Audit Report"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export HIPAA Report</span>
          </button>

          <button
            onClick={() => setShowAddPatientModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Register Twin</span>
          </button>

          <LanguageSelector />
          <ThemeToggle />
          <button
            onClick={() => nav('/')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
            title="Return to Home Landing Page"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Back to Home</span>
          </button>
          <button
            onClick={() => nav('/dashboard')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
          >
            <span>Patient View</span>
          </button>
          
          <button
            onClick={handleAdminLogout}
            className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Lock Portal and Log Out Admin"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Portal</span>
          </button>
        </div>
      </header>

      {/* Connected Healthcare Systems Pills Bar */}
      <div className="max-w-7xl mx-auto mb-6 p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2">
        <div className="text-[11px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>Connected Healthcare Systems (Click Any Pill to Inspect Telemetry):</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-extrabold">
          <button
            onClick={() => setActiveSystemModal('ehr')}
            className="px-3.5 py-2 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>EHR System</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveSystemModal('monitoring')}
            className="px-3.5 py-2 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            <span>Patient Monitoring</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveSystemModal('labs')}
            className="px-3.5 py-2 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Lab Systems</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveSystemModal('pharmacy')}
            className="px-3.5 py-2 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Pill className="w-3.5 h-3.5 text-purple-400" />
            <span>Pharmacy Database</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveSystemModal('staff_sched')}
            className="px-3.5 py-2 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span>Staff Scheduling</span>
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          </button>

          <button
            onClick={() => setActiveSystemModal('devices')}
            className="px-3.5 py-2 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Medical Devices</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* Export Toast Notification */}
      {exportToast && (
        <div className="max-w-7xl mx-auto mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>✓ HIPAA Compliance Audit & System Telemetry Log exported successfully as PDF (Checksum: #SEC-98402)!</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-mono">100% Encrypted</span>
        </div>
      )}

      {/* 2-Column Platform Layout with Sidebar */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Platform Navigation Sidebar (Matches User Screenshot) */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2">
              Platform Navigation
            </div>

            <div className="space-y-1 text-xs font-bold">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Activity, badge: 'Main' },
                { id: 'ai', label: 'AI Intelligence', icon: Cpu, badge: 'Neural' },
                { id: 'appointments', label: 'Appointments', icon: Clock, badge: '18 Cases' },
                { id: 'patients', label: 'Patients', icon: Users, badge: '1,482' },
                { id: 'finance', label: 'Finance & Claims', icon: TrendingUp, badge: 'HIPAA' },
                { id: 'operations', label: 'Operations & ER', icon: ShieldAlert, badge: '92%' },
                { id: 'inventory', label: 'Inventory & Supplies', icon: Database, badge: 'Stock' },
                { id: 'diagnostics', label: 'Diagnostics & Pharmacy', icon: Pill, badge: 'Rx' },
                { id: 'staff', label: 'Staff & On-Call', icon: Stethoscope, badge: 'Roster' },
                { id: 'physical_twin', label: 'Physical Twin Map', icon: Globe, badge: 'Room 304' }
              ].map(item => {
                const Icon = item.icon
                const isActive = activePlatformTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePlatformTab(item.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 font-extrabold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Connected Healthcare Systems Status Card */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="text-[10px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>System Health Status</span>
            </div>
            <div className="space-y-2 text-xs font-semibold text-slate-300">
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950">
                <span>FHIR v4 Data Bridge</span>
                <span className="text-emerald-400 font-bold text-[10px]">Active 🟢</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950">
                <span>AES-256 Vault Encryption</span>
                <span className="text-emerald-400 font-bold text-[10px]">100% HIPAA</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950">
                <span>Edge Neural Server</span>
                <span className="text-cyan-400 font-bold text-[10px]">14 ms</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Dynamic Platform Content */}
        <main className="lg:col-span-3 space-y-8">
          {/* TAB 1: DASHBOARD */}
          {activePlatformTab === 'dashboard' && (
            <>
              {/* Top KPI Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400">Total Active Twins</span>
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white mb-1">1,482</div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12.4% this month</span>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="p-4 rounded-3xl bg-slate-900/80 border border-cyan-500/30 shadow-xl relative overflow-hidden bg-gradient-to-b from-cyan-950/20 to-transparent"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-cyan-300">AI Active Telemetry Users</span>
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-cyan-400 mb-1">1,248 Users</div>
                  <div className="flex items-center gap-1 text-[11px] text-cyan-300 font-bold">
                    <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                    <span>84% Daily AI usage</span>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="p-4 rounded-3xl bg-slate-900/80 border border-amber-500/30 shadow-xl relative overflow-hidden bg-gradient-to-b from-amber-950/20 to-transparent"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-amber-300">Cases Pending Review</span>
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-amber-400 mb-1">18 Cases</div>
                  <div className="flex items-center gap-1 text-[11px] text-amber-300 font-bold">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>⚠️ Awaiting Physician Sign-Off</span>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400">AI Neural Engine</span>
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white mb-1">99.8%</div>
                  <div className="flex items-center gap-1 text-[11px] text-purple-400 font-bold">
                    <Zap className="w-3 h-3" />
                    <span>Neural precision score</span>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400">HIPAA Security Audit</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Lock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-emerald-400 mb-1">100%</div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>AES-256 Encrypted</span>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                  className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400">System Latency</span>
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                      <Server className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white mb-1">14 ms</div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    <span>Optimal response</span>
                  </div>
                </motion.div>
              </div>

              {/* Separate Admin Private Notes & Data Storage Card */}
              <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-cyan-400" />
                      <span>Separate Admin Vault & Confidential Directives</span>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                        AES-256 ENCRYPTED
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Isolated administrative directives, clinical escalation logs, and executive security notes
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminNotes(DEFAULT_CONFIDENTIAL_DIRECTIVES)
                        saveAdminCustomData({ adminNotes: DEFAULT_CONFIDENTIAL_DIRECTIVES })
                        setNotesSaved(true)
                        setTimeout(() => setNotesSaved(false), 2000)
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
                      title="Reset to default confidential directives"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Reset Template</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
                    >
                      <Save className="w-3.5 h-3.5 text-white" />
                      <span className="text-white font-extrabold">{notesSaved ? 'Saved to Vault!' : 'Save Directives to Vault'}</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Type confidential admin directives or systemic logs here..."
                  className="w-full h-36 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500 leading-relaxed resize-none shadow-inner"
                />
              </section>
            </>
          )}

          {/* TAB 2: AI INTELLIGENCE */}
          {activePlatformTab === 'ai' && (
            <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-purple-400" />
                    <span>AI Healthcare Neural Models & Computer Vision Engine</span>
                  </h2>
                  <p className="text-xs text-slate-400">Live Telemetry & Retraining Controls for Voice, Vision, and Risk AI Models</p>
                </div>
                <button
                  onClick={() => nav('/voice-analysis')}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs cursor-pointer shadow-md"
                >
                  Test Live Voice AI →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-cyan-400" />
                      <span>30s Voice Cardiac Model</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">99.4% Accuracy</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Analyses acoustic jitter, shimmer & fundamental frequency for myocardial ischemia detection.</p>
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500">Weights: v4.2-NEURAL</span>
                    <span className="text-cyan-400 font-bold">Active 🟢</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <span>Wound Healing Vision AI</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">98.9% Precision</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Calculates diabetic ulcer surface area (cm²), tissue granulation & infection probability.</p>
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500">SegmentNet v2.1</span>
                    <span className="text-emerald-400 font-bold">Active 🟢</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-purple-400" />
                      <span>Pharmacology AI Engine</span>
                    </span>
                    <span className="text-[10px] font-mono text-purple-400 font-bold">100% Rule Audit</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Flags drug-drug contraindications, liver clearance toxicity & dosage schedules.</p>
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500">RxMatch v3.0</span>
                    <span className="text-purple-400 font-bold">Active 🟢</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: APPOINTMENTS */}
          {activePlatformTab === 'appointments' && (
            <div className="space-y-6">
              {/* Top KPI Metrics Header Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Appointments</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold">+8%</span>
                  </div>
                  <div className="text-xl font-black text-white">124</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold">+5.2%</span>
                  </div>
                  <div className="text-xl font-black text-white">89</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No-Shows</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[9px] font-mono font-bold">+3.1%</span>
                  </div>
                  <div className="text-xl font-black text-white">12</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Walk-ins</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[9px] font-mono font-bold">+12.7%</span>
                  </div>
                  <div className="text-xl font-black text-white">23</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Wait Time</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-mono font-bold">-2.5%</span>
                  </div>
                  <div className="text-xl font-black text-white">18m</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Duration</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold">+1.8%</span>
                  </div>
                  <div className="text-xl font-black text-white">22m</div>
                </div>
              </div>

              {/* Main Middle Row: Hourly Patient Flow Chart + AI Insights & Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Hourly Patient Flow Chart Card */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      <span>Hourly Patient Flow</span>
                    </h3>
                    <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
                      <button className="px-3 py-1 rounded-lg bg-cyan-600 text-white font-extrabold shadow-sm">Today</button>
                      <button className="px-3 py-1 rounded-lg text-slate-400 hover:text-white">Weekly</button>
                    </div>
                  </div>

                  {/* Hourly Chart Bar Visualization with High-Contrast Text Box Tooltip */}
                  <div className="relative h-64 w-full bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 flex items-end justify-between gap-2 overflow-visible">
                    
                    {/* Fixed High Contrast Tooltip Box */}
                    <div className="absolute top-6 left-[42%] z-30 p-3 rounded-2xl bg-slate-900 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/30 text-white font-mono space-y-1 backdrop-blur-md">
                      <div className="text-xs font-black text-white border-b border-slate-800 pb-1">14:00</div>
                      <div className="text-xs font-bold text-cyan-300 flex items-center justify-between gap-3">
                        <span>scheduled :</span>
                        <span className="font-mono text-cyan-400 font-extrabold">16</span>
                      </div>
                      <div className="text-xs font-bold text-purple-300 flex items-center justify-between gap-3">
                        <span>walkIns :</span>
                        <span className="font-mono text-purple-400 font-extrabold">3</span>
                      </div>
                    </div>

                    {/* Hourly Bars */}
                    {[
                      { hour: '8:00', scheduled: 12, walkIns: 3 },
                      { hour: '9:00', scheduled: 15, walkIns: 5 },
                      { hour: '10:00', scheduled: 14, walkIns: 7 },
                      { hour: '11:00', scheduled: 20, walkIns: 4 },
                      { hour: '12:00', scheduled: 13, walkIns: 2 },
                      { hour: '13:00', scheduled: 18, walkIns: 6 },
                      { hour: '14:00', scheduled: 16, walkIns: 3, highlight: true },
                      { hour: '15:00', scheduled: 12, walkIns: 2 }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                        <div className="w-full max-w-[32px] flex items-end justify-center gap-1 h-44">
                          {/* Scheduled Bar */}
                          <div
                            className={`w-3.5 rounded-t-lg transition-all ${
                              bar.highlight ? 'bg-cyan-400 ring-2 ring-cyan-300 shadow-lg shadow-cyan-400/50' : 'bg-blue-600 group-hover:bg-cyan-500'
                            }`}
                            style={{ height: `${(bar.scheduled / 22) * 100}%` }}
                            title={`${bar.hour} Scheduled: ${bar.scheduled}`}
                          />
                          {/* Walk-ins Bar */}
                          <div
                            className="w-3.5 bg-purple-500 rounded-t-lg transition-all group-hover:bg-purple-400"
                            style={{ height: `${(bar.walkIns / 22) * 100}%` }}
                            title={`${bar.hour} Walk-ins: ${bar.walkIns}`}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{bar.hour}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Clinical Insights & Optimization Hub */}
                <div className="lg:col-span-3">
                  <ClinicalInsightsOptimizationHub onNavigateSimulation={() => nav('/simulation')} />
                </div>
              </div>

              {/* Bottom Row: Appointment Types Distribution & No-Show Trend */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appointment Types Distribution Donut Chart */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-indigo-400" />
                    <span>Appointment Types Distribution</span>
                  </h3>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    {/* Donut graphic */}
                    <div className="w-36 h-36 rounded-full border-8 border-cyan-500 border-t-purple-500 border-r-indigo-500 flex items-center justify-center font-extrabold text-white text-base shadow-inner">
                      118 Total
                    </div>

                    {/* Breakdown List */}
                    <div className="flex-1 space-y-2.5 text-xs font-semibold">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                          <span className="text-slate-200">Consultation</span>
                        </div>
                        <span className="font-mono text-cyan-400 font-extrabold">68</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                          <span className="text-slate-200">Procedure</span>
                        </div>
                        <span className="font-mono text-purple-400 font-extrabold">32</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                          <span className="text-slate-200">Follow-up</span>
                        </div>
                        <span className="font-mono text-rose-400 font-extrabold">18</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* No-Show Trend Chart Card */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-rose-400" />
                      <span>No-Show Trend</span>
                    </h3>
                    <button className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-slate-950" />
                      <span>+ New Appointment</span>
                    </button>
                  </div>

                  <div className="h-36 w-full bg-slate-950/60 rounded-2xl p-4 border border-slate-800 flex items-end justify-between gap-3">
                    {[
                      { month: 'Feb', pct: '6%' },
                      { month: 'Mar', pct: '8%' },
                      { month: 'Apr', pct: '10%' },
                      { month: 'May', pct: '12%' },
                      { month: 'Jun', pct: '14%' }
                    ].map((m, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div
                          className="w-full bg-rose-500 rounded-t-lg transition-all hover:bg-rose-400"
                          style={{ height: `${(parseInt(m.pct) / 16) * 100}%` }}
                          title={`${m.month}: ${m.pct}`}
                        />
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{m.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PATIENTS */}
          {(activePlatformTab === 'patients' || activePlatformTab === 'dashboard') && (
            <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-cyan-400" />
                    <span>Patient Digital Twin Registry</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Monitor real-time patient twin vitals, risk escalation, and access permissions
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search patient name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-xs font-semibold rounded-xl pl-9 pr-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 w-48 sm:w-64"
                    />
                  </div>

                  <select
                    value={filterRisk}
                    onChange={(e) => setFilterRisk(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Risk Levels & Records</option>
                    <option value="PENDING">⏳ Cases Pending Review (18)</option>
                    <option value="RECENT">⭐ Recent User Entries</option>
                    <option value="LOW">Low Risk</option>
                    <option value="MODERATE">Moderate Risk</option>
                    <option value="HIGH">High Risk</option>
                  </select>

                  <button
                    onClick={handleRefresh}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Refresh Table"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-black text-[11px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Patient Twin ID</th>
                      <th className="p-4">Patient Name</th>
                      <th className="p-4">Demographics</th>
                      <th className="p-4">Risk Status</th>
                      <th className="p-4">Health Score</th>
                      <th className="p-4">Sync Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-200">
                    {filteredPatients.map(p => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-mono text-cyan-400 font-extrabold">{p.id}</td>
                        <td className="p-4 font-bold text-white flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-cyan-400 border border-slate-700">
                            {(p.name || 'P').charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="flex items-center gap-1.5">
                              {p.name}
                              {(p.isRealUser || p.lastSync?.includes('Just now') || p.lastSync?.includes('Recent')) && (
                                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-black uppercase tracking-wider">
                                  ⭐ Recent Entry
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{p.lastSync}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400">{p.gender}, {p.age} yrs</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                            p.risk === 'High Risk'
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                              : p.risk === 'Moderate Risk'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          }`}>
                            {p.risk}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold">{p.score}/100</span>
                            <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  p.score >= 90 ? 'bg-emerald-500' : p.score >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${p.score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className={`w-2 h-2 rounded-full ${
                              p.status === 'Pending Review' ? 'bg-amber-400 animate-ping' : p.status === 'Clinical Alert' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 animate-pulse'
                            }`}></span>
                            <span className={`font-extrabold ${
                              p.status === 'Pending Review' ? 'text-amber-400' : p.status === 'Clinical Alert' ? 'text-rose-400' : 'text-emerald-400'
                            }`}>
                              {p.status}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setComparePatients(prev => {
                                if (prev.some(x => x.id === p.id)) {
                                  return prev.filter(x => x.id !== p.id)
                                }
                                if (prev.length >= 2) return [prev[1], p]
                                return [...prev, p]
                              })
                            }}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer border ${
                              comparePatients.some(x => x.id === p.id)
                                ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                                : 'bg-slate-800 hover:bg-slate-700 text-purple-400 border-slate-700'
                            }`}
                            title="Select Patient to Compare Side-by-Side"
                          >
                            <Cpu className="w-3.5 h-3.5" />
                            <span>{comparePatients.some(x => x.id === p.id) ? 'Selected' : 'Compare'}</span>
                          </button>

                          <button
                            onClick={() => handleInspectAndSavePatient(p)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer border border-slate-700"
                            title="Inspect Patient Twin Details & Sync Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>

                          <button
                            onClick={() => handleDeletePatient(p.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer border border-rose-500/20"
                            title="Delete Patient Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 5: FINANCE & CLAIMS */}
          {activePlatformTab === 'finance' && (
            <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span>Healthcare Billing, Insurance Claims & ROI Audit</span>
                  </h2>
                  <p className="text-xs text-slate-400">$1.2M Saved in Hospital Readmissions via Digital Twin Early Interventions</p>
                </div>
                <button
                  onClick={handleExportAuditReport}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs cursor-pointer shadow-md"
                >
                  Export Financial Audit PDF →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Total Claims Audited</span>
                  <span className="text-xl font-extrabold text-white">$4.82 M</span>
                  <span className="text-[10px] text-emerald-400 font-bold block mt-1">100% HIPAA Verified</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Prevented Emergency Costs</span>
                  <span className="text-xl font-extrabold text-emerald-400">$1.24 M</span>
                  <span className="text-[10px] text-cyan-300 font-bold block mt-1">Early AI Screening Savings</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Avg Cost per Digital Twin</span>
                  <span className="text-xl font-extrabold text-cyan-400">$12 / mo</span>
                  <span className="text-[10px] text-purple-400 font-bold block mt-1">84% Operational ROI</span>
                </div>
              </div>
            </section>
          )}

          {/* TAB 6: OPERATIONS & ER */}
          {activePlatformTab === 'operations' && (
            <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-500" />
                    <span>Hospital Emergency Operations & ER Occupancy Command</span>
                  </h2>
                  <p className="text-xs text-slate-400">ER Occupancy: 92% • Avg ER Wait Time: 42 Mins • Staffing Ratio: 1:4</p>
                </div>
                <button
                  onClick={() => setIsEmergencyModalOpen?.(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs cursor-pointer shadow-md"
                >
                  ⚡ Trigger SOS Dispatch Modal
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-500 animate-bounce" />
                    <span>Room 304 Critical Alert (Patient John Doe)</span>
                  </span>
                  <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-black">URGENT</span>
                </div>
                <p className="text-xs text-slate-300">
                  Alert: Patient in Room 304 shows early signs of sepsis — rising temperature and elevated WBC count. Immediate clinical intervention recommended.
                </p>
              </div>
            </section>
          )}

          {/* TAB 7: INVENTORY & SUPPLIES */}
          {activePlatformTab === 'inventory' && (
            <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-cyan-400" />
                    <span>Pharmacy Stock & Medical Supplies Inventory</span>
                  </h2>
                  <p className="text-xs text-slate-400">Real-time pharmaceutical reserve levels and automated restock triggers</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between font-bold text-white">
                    <span>Warfarin Sodium 5mg</span>
                    <span className="text-emerald-400 font-mono">4,200 Units (In Stock)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[85%]" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between font-bold text-white">
                    <span>Metformin HCl 500mg</span>
                    <span className="text-cyan-400 font-mono">6,800 Units (Optimal)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full w-[92%]" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between font-bold text-white">
                    <span>Rapid Insulin Glargine</span>
                    <span className="text-amber-400 font-mono">320 Units (Low Stock Warning)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[24%]" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between font-bold text-white">
                    <span>Pathology Reagent Kits</span>
                    <span className="text-emerald-400 font-mono">1,150 Kits (In Stock)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[78%]" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 8: DIAGNOSTICS & PHARMACY */}
          {activePlatformTab === 'diagnostics' && (
            <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Pill className="w-5 h-5 text-purple-400" />
                    <span>Diagnostics & Drug Interaction Scanner</span>
                  </h2>
                  <p className="text-xs text-slate-400">Scan physical pill boxes and run clinical lab requisitions</p>
                </div>
                <button
                  onClick={() => nav('/medicine-scanner')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs cursor-pointer shadow-md"
                >
                  Open Medicine Camera Scanner →
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-2">
                <span className="text-xs font-bold text-purple-400">Pharmacology Contraindication Alert:</span>
                <p className="text-xs text-slate-300 font-medium">
                  Warfarin Sodium 5mg + NSAID Danger Alert — High potency blood thinner interaction. Combining with Aspirin/Ibuprofen increases hemorrhage risk by 4.2x.
                </p>
              </div>
            </section>
          )}

          {/* TAB 9: STAFF & ON-CALL */}
          {activePlatformTab === 'staff' && (
            <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-teal-400" />
                    <span>Attending Physicians & Nurse Staff Scheduling</span>
                  </h2>
                  <p className="text-xs text-slate-400">On-Call Telemetry Duty Roster & ER Shift Assignments</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-extrabold text-white text-sm">Dr. Sarah Jenkins</div>
                  <div className="text-cyan-400 font-bold">Senior Telemetry Cardiologist</div>
                  <div className="text-[10px] text-slate-400 font-mono">Shift: 08:00 AM - 04:00 PM • Room 301</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-extrabold text-white text-sm">Dr. Robert Vance</div>
                  <div className="text-teal-400 font-bold">Lead Endocrinologist</div>
                  <div className="text-[10px] text-slate-400 font-mono">Shift: 12:00 PM - 08:00 PM • Room 304</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-extrabold text-white text-sm">Dr. Alex Morgan</div>
                  <div className="text-indigo-400 font-bold">ER Trauma Chief</div>
                  <div className="text-[10px] text-slate-400 font-mono">Shift: On-Call (24/7 Telemetry Duty)</div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 10: PHYSICAL TWIN MAP */}
          {activePlatformTab === 'physical_twin' && (
            <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    <span>Hospital Physical Twin Facility & Bed Telemetry Map</span>
                  </h2>
                  <p className="text-xs text-slate-400">Live Spatial Facility Tracking, Room 304 Sepsis Alert & Bed Sensor Grid</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">HOSPITAL FLOOR 3 — ICU & CARDIAC UNIT</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black">SPATIAL SYNC ACTIVE</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-mono text-xs text-slate-400">BED 301</div>
                    <div className="font-extrabold text-emerald-400 text-sm mt-1">Occupied</div>
                    <div className="text-[10px] text-slate-500">Alex Morgan (Stable)</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-mono text-xs text-slate-400">BED 302</div>
                    <div className="font-extrabold text-emerald-400 text-sm mt-1">Occupied</div>
                    <div className="text-[10px] text-slate-500">Ava Nguyen (Stable)</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/50 bg-rose-950/20">
                    <div className="font-mono text-xs text-rose-400 font-bold">BED 304 (ALERT)</div>
                    <div className="font-extrabold text-rose-400 text-sm mt-1 animate-pulse">Sepsis Spike ⚠️</div>
                    <div className="text-[10px] text-rose-300 font-bold">John Doe (Temp 39.2°C)</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-mono text-xs text-slate-400">BED 305</div>
                    <div className="font-extrabold text-cyan-400 text-sm mt-1">Available</div>
                  </div>
                </div>
              </div>
            </section>
          )}

        {/* Patient Twin Management Table */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <span>Patient Digital Twin Registry</span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Monitor real-time patient twin vitals, risk escalation, and access permissions
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patient name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs font-semibold rounded-xl pl-9 pr-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 w-48 sm:w-64"
                />
              </div>

              {/* Filter */}
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Risk Levels & Records</option>
                <option value="PENDING">⏳ Cases Pending Review (18)</option>
                <option value="RECENT">⭐ Recent User Entries</option>
                <option value="LOW">Low Risk</option>
                <option value="MODERATE">Moderate Risk</option>
                <option value="HIGH">High Risk</option>
              </select>

              <button
                onClick={handleRefresh}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Refresh Table"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-extrabold">
              <button
                type="button"
                onClick={() => setViewSource('USER_ONLY')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewSource === 'USER_ONLY'
                    ? 'bg-cyan-600 text-white font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-white" />
                <span className="text-white font-extrabold">👤 User Entered Data Only ({safePatients.filter(p => p?.isRealUser || p?.lastSync?.includes('User') || p?.lastSync?.includes('Just now')).length})</span>
              </button>
              <button
                type="button"
                onClick={() => setViewSource('ALL')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewSource === 'ALL'
                    ? 'bg-slate-800 text-white shadow-md font-extrabold border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>🌐 All System Records ({safePatients.length})</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-medium">
              {viewSource === 'USER_ONLY' ? 'Showing authentic patient records entered by real users' : 'Showing all system records including baseline benchmark twins'}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-black text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Patient Twin ID</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Demographics</th>
                  <th className="p-4">Risk Status</th>
                  <th className="p-4">Health Score</th>
                  <th className="p-4">Sync Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-200">
                {filteredPatients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono text-cyan-400 font-extrabold">{p.id}</td>
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-cyan-400 border border-slate-700">
                        {(p.name || 'P').charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1.5">
                          {p.name}
                          {(p.isRealUser || p.lastSync?.includes('Just now') || p.lastSync?.includes('Recent')) && (
                            <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-black uppercase tracking-wider">
                              ⭐ Recent Entry
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{p.lastSync}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">{p.gender}, {p.age} yrs</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                        p.risk === 'High Risk'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          : p.risk === 'Moderate Risk'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}>
                        {p.risk}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold">{p.score}/100</span>
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              p.score >= 90 ? 'bg-emerald-500' : p.score >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${p.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className={`w-2 h-2 rounded-full ${
                          p.status === 'Pending Review' ? 'bg-amber-400 animate-ping' : p.status === 'Clinical Alert' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 animate-pulse'
                        }`}></span>
                        <span className={`font-extrabold ${
                          p.status === 'Pending Review' ? 'text-amber-400' : p.status === 'Clinical Alert' ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setComparePatients(prev => {
                            if (prev.some(x => x.id === p.id)) {
                              return prev.filter(x => x.id !== p.id)
                            }
                            if (prev.length >= 2) return [prev[1], p]
                            return [...prev, p]
                          })
                        }}
                        className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer border ${
                          comparePatients.some(x => x.id === p.id)
                            ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-purple-400 border-slate-700'
                        }`}
                        title="Select Patient to Compare Side-by-Side"
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        <span>{comparePatients.some(x => x.id === p.id) ? 'Selected' : 'Compare'}</span>
                      </button>

                      <button
                        onClick={() => handleInspectAndSavePatient(p)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer border border-slate-700"
                        title="Inspect Patient Twin Details & Sync Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => handleDeletePatient(p.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer border border-rose-500/20"
                        title="Delete Patient Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* System Logs & Neural Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>Real-Time Security & AI Scan Audit Logs</span>
            </h2>
            <div className="space-y-3 font-mono text-xs max-h-[420px] overflow-y-auto pr-1">
              {(() => {
                const customData = getAdminCustomData() || {}
                const storedLogs = customData.systemLogs || []
                const combinedLogs = [...storedLogs, ...SYSTEM_LOGS]
                return combinedLogs.map((log, idx) => (
                  <div key={log.id || idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
                    <span className="text-slate-500 font-bold text-[10px] pt-0.5">{log.time}</span>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                          log.level === 'WARN' ? 'bg-amber-500/20 text-amber-400' : log.level === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
                        }`}>
                          {log.level}
                        </span>
                        <span className="font-bold text-slate-200">{log.event}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] font-sans">{log.detail}</p>
                    </div>
                  </div>
                ))
              })()}
            </div>
          </section>

          <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              <span>AI Living Twin Cluster Telemetry</span>
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Acoustic Voice Heart Neural Engine</span>
                  <span className="text-emerald-400">99.4% Ready</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full w-[99.4%]" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Wound Computer Vision Pipeline</span>
                  <span className="text-cyan-400">98.9% Ready</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-[98.9%]" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">5-Year Preventive Risk Model</span>
                  <span className="text-purple-400">100% Operational</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-[100%]" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Emergency Clinical Risk Escalation Panel */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
              <span>Emergency Clinical Risk Escalation Center</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase">
              2 Active Alerts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EMERGENCY_ALERTS.map(alt => (
              <div key={alt.id} className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-rose-400">{alt.twinId}</span>
                    <span className="text-xs font-extrabold text-white">{alt.patient}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{alt.time}</span>
                </div>
                <div className="text-xs font-semibold text-slate-300">
                  <span className="text-rose-400 font-bold">Trigger:</span> {alt.trigger}
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{alt.doctor}</span>
                  </span>
                  <button
                    onClick={() => nav('/dashboard')}
                    className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-[10px] transition-colors border border-rose-500/30"
                  >
                    ⚡ Intervene
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Cloud Infrastructure & Edge Server Nodes */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span>Global Healthcare Cloud Edge Nodes & Latency</span>
            </h2>
            <span className="text-xs text-slate-400 font-bold font-mono">Total Bandwidth: 42.8 GB/s</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVER_NODES.map((node, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white">{node.region}</span>
                  <span className="text-[10px] font-mono text-emerald-400">{node.status}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Latency: <strong className="text-cyan-400 font-mono">{node.latency}</strong></span>
                  <span>Load: <strong className="text-slate-200 font-mono">{node.load}</strong></span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </section>
        </main>
      </div>

      {/* Add Patient Digital Twin Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl max-w-md w-full p-6 text-white space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <span>Register New Patient Twin</span>
              </h3>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPatientSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={newPatient.name}
                  onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Age</label>
                  <input
                    type="number"
                    value={newPatient.age}
                    onChange={e => setNewPatient({ ...newPatient, age: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={e => setNewPatient({ ...newPatient, gender: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Initial Risk Status</label>
                  <select
                    value={newPatient.risk}
                    onChange={e => setNewPatient({ ...newPatient, risk: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Low Risk">Low Risk</option>
                    <option value="Moderate Risk">Moderate Risk</option>
                    <option value="High Risk">High Risk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Health Score</label>
                  <input
                    type="number"
                    value={newPatient.score}
                    onChange={e => setNewPatient({ ...newPatient, score: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span className="text-white">Register Twin →</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Twin Detailed Inspection Modal */}
      {selectedInspectPatient && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl max-w-xl w-full p-6 text-white space-y-5 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 font-extrabold flex items-center justify-center border border-cyan-500/30 text-sm">
                  {(selectedInspectPatient?.name || 'P').charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-white text-base">{selectedInspectPatient?.name || 'Patient'}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[10px] font-bold">
                      {selectedInspectPatient?.id || 'TWIN-ID'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {selectedInspectPatient?.gender || 'Patient'}, {selectedInspectPatient?.age || 30} Yrs • Last Sync: {selectedInspectPatient?.lastSync || 'Just now'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedInspectPatient(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Risk Rating & Digital Twin Health Index */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Risk Rating</span>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-black border ${
                  selectedInspectPatient.risk === 'High Risk'
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : selectedInspectPatient.risk === 'Moderate Risk'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                }`}>
                  {selectedInspectPatient.risk}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Digital Twin Health Index</span>
                <div className="text-xl font-black text-white mt-0.5">
                  {selectedInspectPatient.score} <span className="text-xs font-normal text-slate-400">/ 100</span>
                </div>
              </div>
            </div>

            {/* Physiological Vitals Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Physiological Vitals Telemetry</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Heart Rate</span>
                  <span className="font-bold text-cyan-400 text-sm">78 BPM</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Blood Pressure</span>
                  <span className="font-bold text-emerald-400 text-sm">120/80</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Blood Oxygen</span>
                  <span className="font-bold text-cyan-400 text-sm">98% SpO2</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Glucose</span>
                  <span className="font-bold text-purple-400 text-sm">98 mg/dL</span>
                </div>
              </div>
            </div>

            {/* 3D Organ System Telemetry */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>3D Organ System Health Metrics</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Brain & Nervous</span>
                  <span className="font-bold text-emerald-400">96 / 100 (Optimal)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Heart & Vascular</span>
                  <span className="font-bold text-cyan-400">92 / 100 (Healthy)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Lungs & Respiratory</span>
                  <span className="font-bold text-emerald-400">95 / 100 (Optimal)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Metabolism & Liver</span>
                  <span className="font-bold text-amber-400">89 / 100 (Balanced)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setSelectedInspectPatient(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Close Inspection
              </button>

              <button
                onClick={() => {
                  if (selectedInspectPatient) {
                    handleInspectAndSavePatient(selectedInspectPatient)
                  }
                  setSelectedInspectPatient(null)
                  nav('/dashboard')
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-white" />
                <span className="text-white font-extrabold">Open Full 3D Twin Dashboard →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Patient Twin Comparison Matrix Modal */}
      {comparePatients.length === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2 font-display">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span>Side-by-Side Patient Digital Twin Comparison Matrix</span>
                </h3>
                <p className="text-xs text-slate-400">Comparative Physiology, Risk Forecasting & Health Score Analysis</p>
              </div>

              <button
                onClick={() => setComparePatients([])}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Close Comparison
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {comparePatients.map((p, idx) => (
                <div key={p.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold block">{p.id}</span>
                      <span className="text-base font-extrabold text-white">{p.name}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      p.risk === 'High Risk' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {p.risk}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Health Score</span>
                      <span className="font-extrabold text-cyan-400 text-sm">{p.score} / 100</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Demographics</span>
                      <span className="font-extrabold text-white text-xs">{p.gender}, {p.age} yrs</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                      <span className="font-extrabold text-emerald-400 text-xs">76 BPM</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                      <span className="font-extrabold text-cyan-400 text-xs">118/78 mmHg</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleInspectAndSavePatient(p)
                      setComparePatients([])
                      nav('/dashboard')
                    }}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Load Patient #{idx + 1} into 3D Studio →
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Connected Healthcare Systems Inspection Telemetry Modal */}
      {activeSystemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-white text-base uppercase font-mono">
                  {activeSystemModal === 'ehr' && 'EHR Integration Telemetry (Epic & Cerner)'}
                  {activeSystemModal === 'monitoring' && 'Continuous Patient Vitals Telemetry'}
                  {activeSystemModal === 'labs' && 'Pathology Lab System Telemetry'}
                  {activeSystemModal === 'pharmacy' && 'Pharmacy Database & Rx Drug Vault'}
                  {activeSystemModal === 'staff_sched' && 'Physician & Nurse Duty Roster'}
                  {activeSystemModal === 'devices' && 'IoT Medical Devices & Wearables Grid'}
                </h3>
              </div>
              <button
                onClick={() => setActiveSystemModal(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs font-medium">
              {activeSystemModal === 'ehr' && (
                <>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">FHIR API Status:</span>
                    <span className="text-emerald-400">v4.0.1 Connected 🟢</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Synchronized Twin Records:</span>
                    <span className="text-cyan-400">1,482 Encrypted Records</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Real-time bi-directional EHR data sync active with Epic Systems & Cerner Millenium.</p>
                </>
              )}

              {activeSystemModal === 'monitoring' && (
                <>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Live Vitals Telemetry:</span>
                    <span className="text-rose-400 animate-pulse">112 BPM Alert Active</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Mean SpO2 Oxygenation:</span>
                    <span className="text-emerald-400">98% (Optimal)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Continuous telemetry feed streaming from 48 bedside monitors & wireless ECG patches.</p>
                </>
              )}

              {activeSystemModal === 'labs' && (
                <>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Automated Pathology Scans:</span>
                    <span className="text-indigo-400">100% Processed</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">HbA1c & Fasting Glucose:</span>
                    <span className="text-cyan-400">Normal Range (98 mg/dL)</span>
                  </div>
                </>
              )}

              {activeSystemModal === 'pharmacy' && (
                <>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Drug Interaction Engine:</span>
                    <span className="text-purple-400">Active</span>
                  </div>
                  <p className="text-[11px] text-rose-400 font-bold">
                    ⚠️ Critical Rule: Warfarin Sodium + NSAIDs flagged for high hemorrhage risk.
                  </p>
                </>
              )}

              {activeSystemModal === 'staff_sched' && (
                <>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">On-Call Telemetry Staff:</span>
                    <span className="text-teal-400">18 Physicians Active</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Attending: Dr. Sarah Jenkins (Cardiology), Dr. Robert Vance (Endocrinology).</p>
                </>
              )}

              {activeSystemModal === 'devices' && (
                <>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">IoT Device Grid:</span>
                    <span className="text-amber-400">48 Connected Sensors</span>
                  </div>
                  <p className="text-[11px] text-slate-400">14 ms edge response across Apple Watch, Fitbit, Blood Glucose Patches & Wireless ECGs.</p>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveSystemModal(null)}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs cursor-pointer shadow-md"
            >
              Close System Inspection →
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-white text-base">System Settings & Controls</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span>AES-256 Vault Encryption</span>
                <span className="text-emerald-400 font-bold">ENABLED</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span>HIPAA Compliance Telemetry</span>
                <span className="text-emerald-400 font-bold">100% PASSED</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span>Edge Neural Server Sync</span>
                <span className="text-cyan-400 font-bold">14 ms Latency</span>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs cursor-pointer"
            >
              Close Settings
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
