import React, { Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PageWrapper from './components/PageWrapper'
import ProtectedRoute from './components/ProtectedRoute'
import JudgesHackathonDock from './components/JudgesHackathonDock'

// Lazy-loaded pages for code splitting
const Landing = React.lazy(() => import('./pages/Landing'))
const Login = React.lazy(() => import('./pages/Login'))
const Signup = React.lazy(() => import('./pages/Signup'))
const Onboarding = React.lazy(() => import('./pages/Onboarding'))
const Lifestyle = React.lazy(() => import('./pages/onboarding/Lifestyle'))
const MedicalHistory = React.lazy(() => import('./pages/onboarding/MedicalHistory'))
const Vitals = React.lazy(() => import('./pages/onboarding/Vitals'))
const ScanReports = React.lazy(() => import('./pages/onboarding/ScanReports'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Predictions = React.lazy(() => import('./pages/Predictions'))
const Simulation = React.lazy(() => import('./pages/Simulation'))
const Timeline = React.lazy(() => import('./pages/Timeline'))
const Recommendations = React.lazy(() => import('./pages/Recommendations'))
const Reports = React.lazy(() => import('./pages/Reports'))
const Settings = React.lazy(() => import('./pages/Settings'))
const VoiceAnalysis = React.lazy(() => import('./pages/VoiceAnalysis'))
const WoundTracker = React.lazy(() => import('./pages/WoundTracker'))
const ConsultationPage = React.lazy(() => import('./pages/ConsultationPage'))
const PreventiveRiskPage = React.lazy(() => import('./pages/PreventiveRiskPage'))
const MedicineScannerPage = React.lazy(() => import('./pages/MedicineScannerPage'))
const Admin = React.lazy(() => import('./pages/Admin'))
const NotFound = React.lazy(() => import('./pages/NotFound'))
const DigitalTwinView = React.lazy(() => import('./pages/DigitalTwinView'))
const VitalsView = React.lazy(() => import('./pages/VitalsView'))
const LifestyleView = React.lazy(() => import('./pages/LifestyleView'))

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-b-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <p className="text-slate-400 text-sm font-medium tracking-wide animate-pulse">Loading MedTwin...</p>
      </div>
    </div>
  )
}

export default function App(){
  const location = useLocation()

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path='/' element={<PageWrapper><Landing/></PageWrapper>} />
            <Route path='/login' element={<PageWrapper><Login/></PageWrapper>} />
            <Route path='/signup' element={<PageWrapper><Signup/></PageWrapper>} />

            {/* Admin — now protected */}
            <Route path='/admin' element={<ProtectedRoute><PageWrapper><Admin/></PageWrapper></ProtectedRoute>} />

            {/* Onboarding flow */}
            <Route path='/onboarding' element={<ProtectedRoute><PageWrapper><Onboarding/></PageWrapper></ProtectedRoute>} />
            <Route path='/onboarding/lifestyle' element={<ProtectedRoute><PageWrapper><Lifestyle/></PageWrapper></ProtectedRoute>} />
            <Route path='/onboarding/medical-history' element={<ProtectedRoute><PageWrapper><MedicalHistory/></PageWrapper></ProtectedRoute>} />
            <Route path='/onboarding/vitals' element={<ProtectedRoute><PageWrapper><Vitals/></PageWrapper></ProtectedRoute>} />
            <Route path='/onboarding/scan-reports' element={<ProtectedRoute><PageWrapper><ScanReports/></PageWrapper></ProtectedRoute>} />

            {/* Main app — protected with health profile */}
            <Route path='/dashboard' element={<ProtectedRoute requireHealthProfile><PageWrapper><Dashboard/></PageWrapper></ProtectedRoute>} />
            <Route path='/voice-analysis' element={<ProtectedRoute requireHealthProfile><PageWrapper><VoiceAnalysis/></PageWrapper></ProtectedRoute>} />
            <Route path='/wound-tracker' element={<ProtectedRoute requireHealthProfile><PageWrapper><WoundTracker/></PageWrapper></ProtectedRoute>} />
            <Route path='/consultation' element={<ProtectedRoute requireHealthProfile><PageWrapper><ConsultationPage/></PageWrapper></ProtectedRoute>} />
            <Route path='/risk-analysis' element={<ProtectedRoute requireHealthProfile><PageWrapper><PreventiveRiskPage/></PageWrapper></ProtectedRoute>} />
            <Route path='/medicine-scanner' element={<ProtectedRoute requireHealthProfile><PageWrapper><MedicineScannerPage/></PageWrapper></ProtectedRoute>} />
            <Route path='/simulation' element={<ProtectedRoute requireHealthProfile><PageWrapper><Simulation/></PageWrapper></ProtectedRoute>} />
            <Route path='/trends' element={<ProtectedRoute requireHealthProfile><PageWrapper><Timeline/></PageWrapper></ProtectedRoute>} />
            <Route path='/reports' element={<ProtectedRoute requireHealthProfile><PageWrapper><Reports/></PageWrapper></ProtectedRoute>} />
            <Route path='/settings' element={<ProtectedRoute requireHealthProfile><PageWrapper><Settings/></PageWrapper></ProtectedRoute>} />
            <Route path='/predictions' element={<ProtectedRoute requireHealthProfile><PageWrapper><Predictions/></PageWrapper></ProtectedRoute>} />

            {/* Dedicated views instead of Dashboard duplicates */}
            <Route path='/digital-twin' element={<ProtectedRoute requireHealthProfile><PageWrapper><DigitalTwinView/></PageWrapper></ProtectedRoute>} />
            <Route path='/vitals' element={<ProtectedRoute requireHealthProfile><PageWrapper><VitalsView/></PageWrapper></ProtectedRoute>} />
            <Route path='/lifestyle' element={<ProtectedRoute requireHealthProfile><PageWrapper><LifestyleView/></PageWrapper></ProtectedRoute>} />

            {/* 404 */}
            <Route path='*' element={<PageWrapper><NotFound/></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      <JudgesHackathonDock />
    </>
  )
}
