import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, TrendingUp, TestTube, FileText, CheckCircle2, ChevronRight, AlertTriangle, Sparkles, Download, Printer, X, FileCheck } from 'lucide-react'
import { generate5YearRiskForecast, generateRecommendedLabTests } from '../utils/healthUtils'
import { downloadClinicalReportPDF } from '../utils/pdfGenerator'
import { downloadFHIRClinicalRecord } from '../utils/fhirExporter'

export default function PreventiveRiskHub({ profile }){
  const [activeTab, setActiveTab] = useState('mitigation')
  const [showLabModal, setShowLabModal] = useState(false)

  const forecast = generate5YearRiskForecast(profile)
  const labTests = generateRecommendedLabTests(profile)
  const risks = profile?.risks || []

  const patientName = profile?.personalInfo?.fullName || 'Alex Morgan'

  const downloadPDF = () => {
    downloadClinicalReportPDF(profile, `MedTwin_Clinical_Lab_Order_${patientName.replace(/\s+/g, '_')}.pdf`)
  }

  const downloadFHIR = () => {
    downloadFHIRClinicalRecord(profile, `MedTwin_FHIR_Clinical_Record_${patientName.replace(/\s+/g, '_')}.json`)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        duration: 0.3
      }
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 25 } }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass p-6 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4 relative overflow-hidden"
    >
      {/* Header & Animated Tab Switcher + 1-Click Export Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 4, duration: 1.2 }}
            >
              <ShieldAlert className="w-5 h-5 text-amber-500" />
            </motion.div>
            <span>Preventive AI Risk Hub & 5-Year Forecast</span>
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">Continuous multi-organ disease forecasting & clinical prevention strategies</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* 1-Click Clinical Exporters */}
          <div className="flex items-center gap-2">
            <button
              onClick={downloadPDF}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Download Official Clinical PDF Report"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>PDF Report</span>
            </button>

            <button
              onClick={downloadFHIR}
              className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Export Official HL7 FHIR R4 Standard JSON Format"
            >
              <FileText className="w-3.5 h-3.5 text-purple-200" />
              <span>FHIR JSON</span>
            </button>
          </div>

          {/* Animated Sliding Pill Tab Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl text-xs font-bold relative">
            {[
              { id: 'mitigation', label: 'Mitigation' },
              { id: 'forecast', label: '5-Yr Forecast' },
              { id: 'labs', label: 'Lab Tests' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-lg transition-colors z-10 ${
                  activeTab === tab.id ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeRiskTab"
                    className="absolute inset-0 bg-slate-900 rounded-lg z-[-1] shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Tab 1: Active Risk Mitigation */}
        {activeTab === 'mitigation' && (
          <motion.div
            key="mitigation"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-3"
          >
            {risks.map((r, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                whileHover={{ scale: 1.01, translateY: -2 }}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-slate-50 transition-all shadow-xs hover:shadow-md hover:border-slate-300"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs tracking-wide">{r.area}</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    r.status === 'Needs Attention'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200 shadow-rose-100 shadow-xs'
                      : r.status === 'Moderate'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {r.status === 'Needs Attention' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
                    )}
                    {r.status}
                  </span>
                </div>

                <div className="text-xs text-slate-700 mt-1 font-medium">{r.reason}</div>

                {r.action && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs text-cyan-950 font-semibold flex items-center gap-1.5 bg-gradient-to-r from-cyan-50/50 to-transparent p-1.5 rounded-lg">
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
                      transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                    </motion.div>
                    <span className="font-extrabold text-cyan-900">AI Preventative Action:</span>
                    <span className="text-slate-800">{r.action}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Tab 2: 5-Year Disease Risk Forecast */}
        {activeTab === 'forecast' && (
          <motion.div
            key="forecast"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-3.5"
          >
            {forecast.map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                whileHover={{ scale: 1.01, translateY: -2 }}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-all shadow-xs hover:shadow-md space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{item.disease}</span>
                    <span className="text-[10px] text-slate-400 font-medium bg-slate-200/60 px-2 py-0.5 rounded-md">({item.timeframe})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">{item.prob}% Risk</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'High' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                      item.status === 'Moderate' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Animated Risk Probability Bar */}
                <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.prob}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
                    className={`h-full rounded-full ${
                      item.status === 'High' ? 'bg-gradient-to-r from-rose-400 to-rose-600 shadow-sm shadow-rose-300' :
                      item.status === 'Moderate' ? 'bg-gradient-to-r from-amber-400 to-amber-600 shadow-sm shadow-amber-300' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                    }`}
                  />
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-0.5">
                  <span>Associated Diagnostic Panel:</span>
                  <span className="font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">{item.labTest}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Tab 3: Recommended Lab Tests */}
        {activeTab === 'labs' && (
          <motion.div
            key="labs"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Recommended Preventive Clinical Tests:</span>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowLabModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md shadow-slate-900/10 flex items-center gap-1.5 transition-colors"
              >
                <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Doctor Order Form</span>
              </motion.button>
            </div>

            {labTests.map((lab, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                whileHover={{ scale: 1.01, translateY: -2 }}
                className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-50 transition-all flex items-start justify-between gap-3 text-xs shadow-xs hover:shadow-md"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <TestTube className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                    <span>{lab.name}</span>
                  </div>
                  <div className="text-slate-500 leading-relaxed text-[11px] pl-5">{lab.reason}</div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${
                  lab.urgency === 'High Priority' ? 'bg-rose-100 text-rose-800 border border-rose-200 shadow-xs' : 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                }`}>
                  {lab.urgency}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Official Clinical Lab Requisition Modal */}
      <AnimatePresence>
        {showLabModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-slate-900 space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold shadow-inner">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Clinical Lab Order Requisition</h3>
                    <p className="text-xs text-slate-500">Official MedTwin AI Diagnostic Request</p>
                  </div>
                </div>
                <button onClick={() => setShowLabModal(false)} className="text-slate-400 hover:text-slate-700 p-1 transition-colors rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <div>
                    <span className="text-slate-400">Patient:</span>
                    <div className="font-bold text-slate-900">{patientName}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Location:</span>
                    <div className="font-bold text-slate-900">{profile?.personalInfo?.location || 'San Francisco, CA'}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">Ordered Test Panels:</span>
                  <ul className="space-y-1.5 text-slate-700">
                    {['1. HbA1c & Fasting Glucose Panel', '2. Lipid Panel (ApoB & LDL-C)', '3. High-Sensitivity CRP (hs-CRP)', '4. Renal & Electrolyte Filter Panel'].map((item, idx) => (
                      <motion.li 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                        className="flex items-center gap-2 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                  <span className="font-bold">Instructions: </span>
                  <span>Fasting required 8–10 hours prior to blood draw. Results auto-sync with MedTwin AI.</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowLabModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    downloadFHIR()
                    setShowLabModal(false)
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  title="Export Official HL7 FHIR Standard JSON Format"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export HL7 FHIR (.json)</span>
                </button>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    downloadPDF()
                    setShowLabModal(false)
                  }}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 fill-black" />
                  <span>Download Official Lab Order PDF (.pdf)</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
