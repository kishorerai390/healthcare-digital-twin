import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PageWrapper from './components/PageWrapper'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Lifestyle from './pages/onboarding/Lifestyle'
import MedicalHistory from './pages/onboarding/MedicalHistory'
import Vitals from './pages/onboarding/Vitals'
import Dashboard from './pages/Dashboard'
import Predictions from './pages/Predictions'
import Simulation from './pages/Simulation'
import Timeline from './pages/Timeline'
import Recommendations from './pages/Recommendations'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import VoiceAnalysis from './pages/VoiceAnalysis'
import WoundTracker from './pages/WoundTracker'
import ConsultationPage from './pages/ConsultationPage'
import PreventiveRiskPage from './pages/PreventiveRiskPage'
import MedicineScannerPage from './pages/MedicineScannerPage'
import ScanReports from './pages/onboarding/ScanReports'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'
import JudgesHackathonDock from './components/JudgesHackathonDock'

export default function App(){
  const location = useLocation()

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path='/' element={<PageWrapper><Landing/></PageWrapper>} />
          <Route path='/login' element={<PageWrapper><Login/></PageWrapper>} />
          <Route path='/signup' element={<PageWrapper><Signup/></PageWrapper>} />
          <Route path='/admin' element={<PageWrapper><Admin/></PageWrapper>} />
          <Route path='/onboarding' element={<ProtectedRoute><PageWrapper><Onboarding/></PageWrapper></ProtectedRoute>} />
          <Route path='/onboarding/lifestyle' element={<ProtectedRoute><PageWrapper><Lifestyle/></PageWrapper></ProtectedRoute>} />
          <Route path='/onboarding/medical-history' element={<ProtectedRoute><PageWrapper><MedicalHistory/></PageWrapper></ProtectedRoute>} />
          <Route path='/onboarding/vitals' element={<ProtectedRoute><PageWrapper><Vitals/></PageWrapper></ProtectedRoute>} />
          <Route path='/onboarding/scan-reports' element={<ProtectedRoute><PageWrapper><ScanReports/></PageWrapper></ProtectedRoute>} />

          <Route path='/dashboard' element={<ProtectedRoute requireHealthProfile><PageWrapper><Dashboard/></PageWrapper></ProtectedRoute>} />
          <Route path='/voice-analysis' element={<ProtectedRoute requireHealthProfile><PageWrapper><VoiceAnalysis/></PageWrapper></ProtectedRoute>} />
          <Route path='/wound-tracker' element={<ProtectedRoute requireHealthProfile><PageWrapper><WoundTracker/></PageWrapper></ProtectedRoute>} />
          <Route path='/digital-twin' element={<ProtectedRoute requireHealthProfile><PageWrapper><Dashboard/></PageWrapper></ProtectedRoute>} />
          <Route path='/vitals' element={<ProtectedRoute requireHealthProfile><PageWrapper><Dashboard/></PageWrapper></ProtectedRoute>} />
          <Route path='/lifestyle' element={<ProtectedRoute requireHealthProfile><PageWrapper><Dashboard/></PageWrapper></ProtectedRoute>} />
          <Route path='/consultation' element={<ProtectedRoute requireHealthProfile><PageWrapper><ConsultationPage/></PageWrapper></ProtectedRoute>} />
          <Route path='/risk-analysis' element={<ProtectedRoute requireHealthProfile><PageWrapper><PreventiveRiskPage/></PageWrapper></ProtectedRoute>} />
          <Route path='/medicine-scanner' element={<ProtectedRoute requireHealthProfile><PageWrapper><MedicineScannerPage/></PageWrapper></ProtectedRoute>} />
          <Route path='/simulation' element={<ProtectedRoute requireHealthProfile><PageWrapper><Simulation/></PageWrapper></ProtectedRoute>} />
          <Route path='/trends' element={<ProtectedRoute requireHealthProfile><PageWrapper><Timeline/></PageWrapper></ProtectedRoute>} />
          <Route path='/reports' element={<ProtectedRoute requireHealthProfile><PageWrapper><Reports/></PageWrapper></ProtectedRoute>} />
          <Route path='/settings' element={<ProtectedRoute requireHealthProfile><PageWrapper><Settings/></PageWrapper></ProtectedRoute>} />
          <Route path='/predictions' element={<ProtectedRoute requireHealthProfile><PageWrapper><Predictions/></PageWrapper></ProtectedRoute>} />

          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </AnimatePresence>

      <JudgesHackathonDock />
    </>
  )
}
