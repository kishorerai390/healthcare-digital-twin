import React from 'react'
import mock from '../data/mockHealthData'

export default function Recommendations(){
  const recs = [
    {title:'Sleep', priority:'MEDIUM', text:'Maintain a consistent 7–8 hour sleep schedule.'},
    {title:'Exercise', priority:'HIGH', text:'Add 20–30 minutes of moderate activity 5 days per week.'},
    {title:'Diet', priority:'MEDIUM', text:'Reduce added sugar and increase fiber-rich foods.'},
  ]
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto glass p-6 rounded-xl">
        <h2 className="text-2xl font-semibold">Your AI Preventive Care Plan</h2>
        <div className="mt-4 grid gap-3">
          {recs.map(r=> (
            <div key={r.title} className="p-3 rounded bg-white/3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{r.title}</div>
                <div className="text-sm text-slate-300">{r.priority}</div>
              </div>
              <div className="text-slate-400 mt-2">{r.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
