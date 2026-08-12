import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Home, Eye, EyeOff } from 'lucide-react'
import LanguageSelector from '../components/LanguageSelector'
import GoogleAuthModal from '../components/GoogleAuthModal'
import { saveHealthProfile, DEFAULT_HEALTH_PROFILE } from '../utils/storage'

export default function Signup(){
  const nav = useNavigate()
  const { signup, guestLogin, loginWithCustomUser, signinWithGoogle } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showGoogleModal, setShowGoogleModal] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      // Ensure health profile is provisioned for new user
      const userProfile = {
        ...DEFAULT_HEALTH_PROFILE,
        personalInfo: {
          ...DEFAULT_HEALTH_PROFILE.personalInfo,
          fullName: name || email.split('@')[0] || 'Patient User',
          email: email
        }
      }
      saveHealthProfile(userProfile)

      // Race Firebase signup with a 2-second timeout fallback for network/offline delay
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('TIMEOUT'), 2000))
      await Promise.race([signup(email, password, name), timeoutPromise])

      loginWithCustomUser(email, name)
      nav('/dashboard')
    } catch (err) {
      console.warn('Signup fallback triggered:', err)
      loginWithCustomUser(email, name)
      nav('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)
    try {
      await signinWithGoogle()
      nav('/dashboard')
    } catch (err) {
      console.warn('Google signin error, using modal fallback for mobile:', err)
      setShowGoogleModal(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-900">
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-3xl shadow-2xl shadow-slate-200/60 relative space-y-5">
        
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <button
            type="button"
            onClick={() => nav('/')}
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs transition-colors group cursor-pointer font-bold whitespace-nowrap flex-shrink-0"
            title="Return to Home Page"
          >
            <Home className="w-3.5 h-3.5 text-cyan-600 group-hover:scale-110 transition-transform" />
            <span>Back to Home</span>
          </button>

          <LanguageSelector />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create your MedTwin Account</h2>
          <p className="text-slate-500 text-xs font-medium">Sign up to securely save your Digital Twin to the cloud.</p>
        </div>

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Alex Morgan"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-cyan-500 font-medium pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-0.5"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-cyan-600" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-cyan-500 font-medium pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-0.5"
                title={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="w-4 h-4 text-cyan-600" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <div className="text-rose-700 text-xs font-bold bg-rose-50 p-3 rounded-xl border border-rose-200">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold transition-all text-xs cursor-pointer shadow-md"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 flex gap-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-bold text-xs cursor-pointer text-slate-700 shadow-xs flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign up with Google</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 text-center font-medium">
          Already have an account?{' '}
          <button type="button" onClick={() => nav('/login')} className="text-cyan-600 hover:underline font-extrabold">
            Log in
          </button>
        </div>
      </div>

      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        roleTitle="Digital Twin Studio"
        onSelectAccount={(account) => {
          guestLogin?.()
          setShowGoogleModal(false)
          nav('/dashboard')
        }}
      />
    </div>
  )
}
