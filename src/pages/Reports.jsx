import React, { useState } from 'react'

const mockReports = [
  { id: 1, name: 'CBC_Report_2024.pdf', date: '2024-12-15', type: 'Blood Test', status: 'Analyzed', risk: 'Low', summary: 'All parameters within normal limits. Hemoglobin: 14.2 g/dL, WBC: 7,500/μL.' },
  { id: 2, name: 'Chest_Xray.jpg', date: '2024-11-20', type: 'Imaging', status: 'Analyzed', risk: 'Low', summary: 'Clear lung fields. No cardiomegaly. Normal mediastinum.' },
  { id: 3, name: 'Lipid_Panel_Q3.pdf', date: '2024-09-10', type: 'Blood Test', status: 'Analyzed', risk: 'Medium', summary: 'Total Cholesterol: 215 mg/dL (borderline high). LDL: 138 mg/dL. HDL: 52 mg/dL.' },
]

export default function Reports() {
  const [reports, setReports] = useState(mockReports)
  const [selectedReport, setSelectedReport] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const files = e.dataTransfer?.files || e.target?.files
    if (files && files.length > 0) {
      handleUpload(files[0])
    }
  }

  const handleUpload = (file) => {
    setUploading(true)
    setTimeout(() => {
      const newReport = {
        id: Date.now(),
        name: file.name,
        date: new Date().toISOString().slice(0, 10),
        type: file.name.endsWith('.pdf') ? 'Document' : 'Imaging',
        status: 'Analyzed',
        risk: 'Low',
        summary: `AI analysis of ${file.name}: All parameters appear within normal range. Detailed breakdown available below.`,
      }
      setReports(prev => [newReport, ...prev])
      setSelectedReport(newReport)
      setUploading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">📋</span> Medical Reports Analyzer
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Upload reports and get instant AI-powered analysis</p>
        </div>

        {/* Upload Zone */}
        <div
          className={`glass rounded-2xl p-8 border-2 border-dashed mb-6 text-center transition-all duration-300 cursor-pointer ${
            dragActive
              ? 'border-cyan-400/60 bg-cyan-500/5'
              : 'border-white/10 hover:border-white/20'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('reportUpload').click()}
        >
          <input
            type="file"
            id="reportUpload"
            accept="application/pdf,image/*"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <p className="text-cyan-400 font-semibold text-sm">Analyzing report with AI...</p>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-3">📤</div>
              <p className="text-white font-semibold">Drag & drop your medical report here</p>
              <p className="text-slate-500 text-sm mt-1">Supports PDF, JPG, PNG • Max 25 MB</p>
              <button className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                Browse Files
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-4 border border-white/5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
                Your Reports ({reports.length})
              </h3>
              <div className="space-y-2">
                {reports.map(report => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedReport?.id === report.id
                        ? 'bg-white/10 border border-white/10'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{report.type === 'Imaging' ? '🖼️' : '📄'}</span>
                      <span className="text-sm font-semibold text-white truncate flex-1">{report.name}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-6">
                      <span className="text-[10px] text-slate-500">{report.date}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        report.risk === 'Low' ? 'bg-emerald-500/15 text-emerald-400'
                          : report.risk === 'Medium' ? 'bg-yellow-500/15 text-yellow-400'
                            : 'bg-red-500/15 text-red-400'
                      }`}>{report.risk} Risk</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="glass rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedReport.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedReport.type} • Uploaded: {selectedReport.date}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                    selectedReport.risk === 'Low' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : selectedReport.risk === 'Medium' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                  }`}>
                    {selectedReport.risk} Risk
                  </span>
                </div>

                {/* AI Summary */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">🤖</span>
                    <h4 className="text-sm font-bold text-white">AI Analysis Summary</h4>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{selectedReport.summary}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="px-4 py-2 rounded-xl bg-white/5 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors flex items-center gap-2">
                    📥 Download
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-white/5 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors flex items-center gap-2">
                    🔗 Share with Doctor
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-red-500/10 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-12 border border-white/5 text-center">
                <div className="text-4xl mb-3 opacity-30">📋</div>
                <p className="text-slate-500 font-medium">Select a report to view AI analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
