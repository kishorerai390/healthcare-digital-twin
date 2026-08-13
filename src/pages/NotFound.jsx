import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="text-center max-w-lg">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[140px] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 text-[140px] font-black text-cyan-400/5 leading-none blur-2xl select-none">
            404
          </div>
        </div>

        {/* Heartbeat flat-line */}
        <div className="flex justify-center mb-6">
          <svg width="200" height="40" viewBox="0 0 200 40" className="text-red-400">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0,20 40,20 50,20 55,5 60,35 65,10 70,30 75,20 80,20 200,20"
              className="animate-pulse"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-slate-400 mb-8 text-sm leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back to your health dashboard.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/10 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
