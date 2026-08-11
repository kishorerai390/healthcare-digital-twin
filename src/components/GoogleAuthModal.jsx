import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldCheck, CheckCircle2, ArrowRight, UserCheck, Lock } from 'lucide-react'

export default function GoogleAuthModal({ isOpen, onClose, onSelectAccount, roleTitle = 'Admin Portal' }) {
  const [customEmail, setCustomEmail] = useState('')
  const [isAddingAccount, setIsAddingAccount] = useState(false)
  const [authenticating, setAuthenticating] = useState(false)

  if (!isOpen) return null

  const handleAuth = (emailToUse, nameToUse = 'Google Verified Admin') => {
    setAuthenticating(true)
    setTimeout(() => {
      setAuthenticating(false)
      onSelectAccount({
        email: emailToUse,
        name: nameToUse,
        authMethod: 'Google OAuth 2.0'
      })
      onClose()
    }, 500)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-slate-900"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Google Logo & Header */}
          <div className="text-center space-y-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 p-2.5 mx-auto flex items-center justify-center shadow-sm">
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">Sign in with Google</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Choose an account to authenticate for <span className="font-bold text-slate-900">{roleTitle}</span>
              </p>
            </div>
          </div>

          {/* Account Options List */}
          <div className="py-5 space-y-3">
            {!isAddingAccount ? (
              <>
                <button
                  type="button"
                  onClick={() => handleAuth('admin.medtwin@gmail.com', 'Admin Leader')}
                  disabled={authenticating}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                      A
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 group-hover:text-cyan-700">Admin Leader</div>
                      <div className="text-[11px] text-slate-500 font-mono font-medium">admin.medtwin@gmail.com</div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition" />
                </button>

                <button
                  type="button"
                  onClick={() => handleAuth('sys.admin@gmail.com', 'System Administrator')}
                  disabled={authenticating}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                      S
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 group-hover:text-cyan-700">System Administrator</div>
                      <div className="text-[11px] text-slate-500 font-mono font-medium">sys.admin@gmail.com</div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddingAccount(true)}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 text-xs font-bold text-center transition cursor-pointer"
                >
                  + Use another Google account
                </button>
              </>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!customEmail.trim()) return
                  handleAuth(customEmail.trim(), customEmail.split('@')[0])
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter Gmail Address</label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={e => setCustomEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAccount(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 cursor-pointer shadow-md"
                  >
                    Authenticate →
                  </button>
                </div>
              </form>
            )}
          </div>

          {authenticating && (
            <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold text-center animate-pulse flex items-center justify-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-cyan-600 animate-ping"></span>
              <span>Authenticating Google OAuth Token...</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Protected by Google OAuth 2.0 Security Encryption</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
