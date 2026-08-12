import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getHealthProfile, saveHealthProfile, DEFAULT_HEALTH_PROFILE } from '../utils/storage'

export default function ProtectedRoute({ children, requireHealthProfile }){
  const { loading, currentUser, guestLogin } = useAuth()
  const profile = getHealthProfile()

  if(loading){
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-900 gap-3 font-sans">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-sm font-bold tracking-wide">Loading Digital Twin Studio...</div>
      </div>
    )
  }

  if(!currentUser){
    // If a health profile exists in local storage (e.g. preset loaded from Hackathon Dock), auto-authenticate guest user
    if(profile && Object.keys(profile).length > 0){
      guestLogin?.()
      return children
    }
    return <Navigate to="/login" replace />
  }

  // Auto-provision default health profile if not set yet so user never gets stuck
  if(requireHealthProfile){
    const hasPersonal = Boolean(profile?.personalInfo?.fullName)
    const hasVitals = Boolean(profile?.vitals?.heartRate)

    if(!hasPersonal || !hasVitals){
      saveHealthProfile(DEFAULT_HEALTH_PROFILE)
    }
  }

  return children
}
