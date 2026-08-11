import React from 'react'

export default function Reports(){
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto glass p-6 rounded-xl">
        <h2 className="text-2xl font-semibold">Medical Reports Analyzer</h2>
        <p className="text-slate-400 mt-2">Upload PDF / JPG / PNG and view prototype AI summary.</p>
        <div className="mt-4">
          <input type="file" accept="application/pdf,image/*" className="text-sm" />
          <div className="mt-3 text-slate-400">Uploaded reports will show here (prototype).</div>
        </div>
      </div>
    </div>
  )
}
