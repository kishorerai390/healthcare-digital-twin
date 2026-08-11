import React from 'react'

export default function HealthScore({score=87}){
  const stroke = 36
  const radius = 40
  const circumference = 2*Math.PI*radius
  const offset = circumference - (score/100)*circumference
  return (
    <div className="flex items-center gap-4">
      <svg width="100" height="100">
        <g transform="translate(50,50)">
          <circle r={radius} stroke="#0b1220" strokeWidth={stroke} fill="none" />
          <circle r={radius} stroke="#06b6d4" strokeWidth={stroke} strokeLinecap="round" fill="none"
            strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={offset} transform="rotate(-90)" />
          <text x="0" y="6" textAnchor="middle" className="text-white font-semibold" style={{fontSize: '14px', fill: 'white'}}>{score}</text>
        </g>
      </svg>
      <div>
        <div className="text-sm text-slate-400">Digital Twin Health Score</div>
        <div className="font-semibold">{score} / 100</div>
      </div>
    </div>
  )
}
