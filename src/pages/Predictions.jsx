import React from 'react'
import mock from '../data/mockHealthData'

export default function Predictions(){
  const risks = mock.risks
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto glass p-6 rounded-xl">
        <h2 className="text-2xl font-semibold">AI Risk Prediction</h2>
        <div className="text-slate-400 mt-2">Prototype AI predictions — not a medical diagnosis.</div>
        <div className="mt-4 space-y-3">
          {risks.map(r=> (
            <div key={r.title} className="p-3 rounded border border-white/6">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{r.title}</div>
                <div className="text-sm text-slate-400">{r.prob}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
