import React, { useState } from 'react'
import { downloadFHIRClinicalRecord } from '../utils/fhirExporter'
import { getHealthProfile } from '../utils/storage'

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

  const handleExportFHIR = () => {
    const profile = getHealthProfile()
    downloadFHIRClinicalRecord(profile)
  }

  return (
    <div className="min-h-screen p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <span className="text-3xl">📋</span> Medical Reports Analyzer
            </h1>
            <p className="text-slate-600 mt-1 text-sm font-semibold">Upload reports and get instant AI-powered analysis</p>
          </div>

          <button
            onClick={handleExportFHIR}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer border border-teal-500 self-start sm:self-auto"
          >
            <span>🧬 Export FHIR R4 JSON Record</span>
          </button>
        </div>

        {/* Upload Zone */}
        <div
          className={`bg-white/95 rounded-2xl p-8 border-2 border-dashed mb-6 text-center transition-all duration-300 cursor-pointer shadow-md ${
            dragActive
              ? 'border-cyan-500 bg-cyan-50'
              : 'border-slate-300 hover:border-cyan-500'
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
              <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
              <p className="text-cyan-700 font-extrabold text-sm">Analyzing report with AI...</p>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-3">📤</div>
              <p className="text-slate-900 font-extrabold text-base">Drag & drop your medical report here</p>
              <p className="text-slate-600 text-xs font-bold mt-1">Supports PDF, JPG, PNG • Max 25 MB</p>
              <button className="mt-4 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black shadow-md transition-all cursor-pointer">
                Browse Files
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 rounded-2xl p-4 border border-slate-200 shadow-md">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3 px-2">
                Your Reports ({reports.length})
              </h3>
              <div className="space-y-2">
                {reports.map(report => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer border ${
                      selectedReport?.id === report.id
                        ? 'bg-cyan-50 border-cyan-300 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{report.type === 'Imaging' ? '🖼️' : '📄'}</span>
                      <span className="text-xs font-extrabold text-slate-900 truncate flex-1">{report.name}</span>
                    </div>
                    <div className="flex items-center justify-between ml-7">
                      <span className="text-[10px] text-slate-500 font-bold">{report.date}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        report.risk === 'Low' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : report.risk === 'Medium' ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
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
              <div className="bg-white/95 rounded-2xl p-6 border border-slate-200 shadow-md">
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">{selectedReport.name}</h2>
                    <p className="text-xs text-slate-600 font-bold mt-0.5">{selectedReport.type} • Uploaded: {selectedReport.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                    selectedReport.risk === 'Low' ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : selectedReport.risk === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                  }`}>
                    {selectedReport.risk} Risk
                  </span>
                </div>

                {/* AI Summary */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">🤖</span>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">AI Analysis Summary</h4>
                  </div>
                  <p className="text-xs text-slate-800 font-bold leading-relaxed">{selectedReport.summary}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap">
                  <button className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-extrabold text-slate-800 transition-colors flex items-center gap-2 border border-slate-300 shadow-xs cursor-pointer">
                    📥 Download
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-extrabold text-slate-800 transition-colors flex items-center gap-2 border border-slate-300 shadow-xs cursor-pointer">
                    🔗 Share with Doctor
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-extrabold text-rose-700 transition-colors flex items-center gap-2 border border-rose-200 shadow-xs cursor-pointer">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/95 rounded-2xl p-12 border border-slate-200 text-center shadow-md">
                <div className="text-4xl mb-3 opacity-40">📋</div>
                <p className="text-slate-700 font-extrabold text-sm">Select a report from the list to view AI analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
