import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HeartPulse, Activity, Zap, TrendingUp, Sparkles, CheckCircle2, 
  Bed, Calendar, Cpu, X, FileText, MessageSquare, AlertCircle, ArrowRight, ShieldCheck
} from 'lucide-react'

export default function ClinicalInsightsOptimizationHub({ onNavigateSimulation, onOpenEmergencyModal }) {
  // Modal states for action buttons
  const [activeActionModal, setActiveActionModal] = useState(null) 
  // 'admission_surge' | 'resource_allocation' | 'bed_simulation' | 'staff_schedule' | 'equipment_plan' | null

  const [activeTab, setActiveTab] = useState('reports') // 'reports' | 'ask_ai'
  const [toastMessage, setToastMessage] = useState(null)
  const [simulationPercentage, setSimulationPercentage] = useState(22)
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiChatHistory, setAiChatHistory] = useState([
    { sender: 'ai', text: 'Hello! I am your Clinical Optimization Assistant. How can I assist with hospital throughput or bed allocations today?' }
  ])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleSendAiMessage = (e) => {
    e?.preventDefault()
    if (!aiPrompt.trim()) return
    const userMsg = aiPrompt.trim()
    setAiChatHistory(prev => [...prev, { sender: 'user', text: userMsg }])
    setAiPrompt('')
    setTimeout(() => {
      setAiChatHistory(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: `Analysis complete: Based on current telemetry data for "${userMsg}", recommended action is to maintain 15% surge reserve and optimize bed discharge velocity.` 
        }
      ])
    }, 800)
  }

  return (
    <div className="w-full space-y-6 font-sans">

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900/90 text-emerald-100 border border-emerald-500/50 shadow-2xl flex items-center gap-3 font-semibold text-xs max-w-md"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ========================================================= */}
        {/* CARD 1: CLINICAL INSIGHTS                                */}
        {/* ========================================================= */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 text-white relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-extrabold flex items-center gap-2 text-white">
              <HeartPulse className="w-5 h-5 text-cyan-400" />
              <span>Clinical Insights</span>
            </h3>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-extrabold border border-cyan-500/20">
              Live AI Telemetry
            </span>
          </div>

          <div className="space-y-4">
            {/* Item 1: Admission Surge Alert */}
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-3 hover:border-rose-500/60 transition-all">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-400" />
                <h4 className="text-xs font-extrabold text-white">Admission Surge Alert</h4>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Expecting 30% more admissions this evening based on ER trends
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-extrabold border border-rose-500/30">
                  Impact: high
                </span>
                <button
                  onClick={() => setActiveActionModal('admission_surge')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-extrabold text-xs border border-slate-700 transition-all cursor-pointer shadow-md hover:border-cyan-500"
                >
                  Take Action
                </button>
              </div>
            </div>

            {/* Item 2: Resource Allocation */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-extrabold text-white">Resource Allocation</h4>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Cardiology department has 15% underutilized capacity
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-extrabold border border-cyan-500/30">
                  Impact: medium
                </span>
                <button
                  onClick={() => setActiveActionModal('resource_allocation')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-extrabold text-xs border border-slate-700 transition-all cursor-pointer shadow-md hover:border-cyan-500"
                >
                  Take Action
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* ========================================================= */}
        {/* CARD 2: OPTIMIZATION SUGGESTIONS                         */}
        {/* ========================================================= */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 text-white relative overflow-hidden flex flex-col justify-between">
          
          <div className="space-y-4">
            {/* Header with Live Monitoring & Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-extrabold border border-indigo-500/30 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Live Monitoring Mode
              </span>

              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeTab === 'reports' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Reports</span>
                </button>
                <button
                  onClick={() => setActiveTab('ask_ai')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeTab === 'ask_ai' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: REPORTS */}
            {activeTab === 'reports' ? (
              <div className="space-y-4">
                <h3 className="text-base font-extrabold flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Optimization Suggestions</span>
                </h3>

                {/* Card 1: Bed Management */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-all">
                  <h4 className="text-xs font-extrabold text-white">Bed Management</h4>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Predictive discharge modeling could improve bed turnover by 22%.
                  </p>
                  <button
                    onClick={() => setActiveActionModal('bed_simulation')}
                    className="px-4 py-2 rounded-xl bg-black hover:bg-slate-900 active:scale-95 text-white font-mono font-bold text-xs border border-slate-800 transition-all cursor-pointer shadow-md hover:border-indigo-500"
                  >
                    Run Simulation
                  </button>
                </div>

                {/* Card 2: Staff Scheduling */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-all">
                  <h4 className="text-xs font-extrabold text-white">Staff Scheduling</h4>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    AI recommends shift adjustments to better align with patient influx patterns.
                  </p>
                  <button
                    onClick={() => setActiveActionModal('staff_schedule')}
                    className="px-4 py-2 rounded-xl bg-black hover:bg-slate-900 active:scale-95 text-white font-mono font-bold text-xs border border-slate-800 transition-all cursor-pointer shadow-md hover:border-indigo-500"
                  >
                    View Schedule
                  </button>
                </div>

                {/* Card 3: Equipment Sharing */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-all">
                  <h4 className="text-xs font-extrabold text-white">Equipment Sharing</h4>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Cross-department equipment sharing could reduce idle time by 35%.
                  </p>
                  <button
                    onClick={() => setActiveActionModal('equipment_plan')}
                    className="px-4 py-2 rounded-xl bg-black hover:bg-slate-900 active:scale-95 text-white font-mono font-bold text-xs border border-slate-800 transition-all cursor-pointer shadow-md hover:border-indigo-500"
                  >
                    See Plan
                  </button>
                </div>
              </div>
            ) : (
              /* TAB CONTENT: ASK AI */
              <div className="space-y-3">
                <h3 className="text-base font-extrabold flex items-center gap-2 text-white">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  <span>Ask Clinical AI Assistant</span>
                </h3>
                <div className="h-56 bg-slate-950 p-3 rounded-2xl border border-slate-800 overflow-y-auto space-y-2.5">
                  {aiChatHistory.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl text-xs max-w-[85%] font-medium leading-relaxed ${
                        m.sender === 'user'
                          ? 'ml-auto bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                      }`}
                    >
                      {m.text}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendAiMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ask AI about bed turnover, staffing, or ER surge..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold cursor-pointer transition-all"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>

      </div>


      {/* ========================================================= */}
      {/* INTERACTIVE MODALS FOR ALL BUTTONS                        */}
      {/* ========================================================= */}
      <AnimatePresence>
        {activeActionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl space-y-5 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveActionModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* MODAL 1: ADMISSION SURGE ALERT */}
              {activeActionModal === 'admission_surge' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">ER Admission Surge Action Plan</h3>
                      <p className="text-xs text-slate-400">30% projected influx starting this evening</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400 font-bold">Surge Beds Requested:</span>
                      <span className="text-rose-400 font-mono font-extrabold">10 Beds</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400 font-bold">Triage Staffing Escalation:</span>
                      <span className="text-emerald-400 font-mono font-extrabold">4 On-Call Nurses</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold">Fast-Track Discharge Protocol:</span>
                      <span className="text-cyan-400 font-mono font-extrabold">Enabled</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setActiveActionModal(null)
                        showToast('✅ ER Surge Action Dispatched: 10 Beds reserved & On-call staff notified!')
                      }}
                      className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer text-center"
                    >
                      Confirm & Dispatch Plan
                    </button>
                    <button
                      onClick={() => setActiveActionModal(null)}
                      className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* MODAL 2: RESOURCE ALLOCATION */}
              {activeActionModal === 'resource_allocation' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">Cardiology Capacity Re-balancing</h3>
                      <p className="text-xs text-slate-400">15% underutilized telemetry units detected</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400 font-bold">Available Cardiology Telemetry Units:</span>
                      <span className="text-cyan-400 font-mono font-extrabold">6 Beds</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold">Target Destination:</span>
                      <span className="text-emerald-400 font-mono font-extrabold">ER Overflow Support</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setActiveActionModal(null)
                        showToast('✅ Resource Re-balanced: 15% Cardiology capacity assigned to ER overflow!')
                      }}
                      className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer text-center"
                    >
                      Execute Capacity Re-balance
                    </button>
                    <button
                      onClick={() => setActiveActionModal(null)}
                      className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* MODAL 3: BED MANAGEMENT SIMULATION */}
              {activeActionModal === 'bed_simulation' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      <Bed className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">Predictive Discharge Simulation</h3>
                      <p className="text-xs text-slate-400">Simulate 22% improvement in bed turnover</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400">Target Turnover Boost:</span>
                      <span className="text-indigo-400 font-mono">+{simulationPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="40"
                      value={simulationPercentage}
                      onChange={(e) => setSimulationPercentage(Number(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-400 font-medium">
                      Estimated Discharge Acceleration: <span className="text-white font-bold">1.4 hours saved per bed</span>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSimulationRunning(true)
                        setTimeout(() => {
                          setSimulationRunning(false)
                          setActiveActionModal(null)
                          if (onNavigateSimulation) onNavigateSimulation()
                          showToast(`✅ Bed Simulation Complete: +${simulationPercentage}% turnover velocity verified!`)
                        }, 1200)
                      }}
                      className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                    >
                      {simulationRunning ? (
                        <>
                          <Activity className="w-4 h-4 animate-spin" />
                          <span>Simulating...</span>
                        </>
                      ) : (
                        <span>Run Full Simulation →</span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveActionModal(null)}
                      className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* MODAL 4: STAFF SCHEDULING */}
              {activeActionModal === 'staff_schedule' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">AI Shift Adjustment Roster</h3>
                      <p className="text-xs text-slate-400">Optimizing shift overlap for evening influx</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <div>
                        <div className="font-extrabold text-white">Dr. Sarah Jenkins (Cardiology)</div>
                        <div className="text-[10px] text-slate-400">Shift extension: +2 Hours</div>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold">Approved</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-extrabold text-white">Triage Team B (4 Staff)</div>
                        <div className="text-[10px] text-slate-400">Evening Influx Rotation</div>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold">Assigned</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setActiveActionModal(null)
                        showToast('✅ Staff Schedule Applied: Evening shifts re-aligned to influx!')
                      }}
                      className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer text-center"
                    >
                      Apply Shift Adjustments
                    </button>
                    <button
                      onClick={() => setActiveActionModal(null)}
                      className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* MODAL 5: EQUIPMENT SHARING PLAN */}
              {activeActionModal === 'equipment_plan' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">Cross-Department Equipment Plan</h3>
                      <p className="text-xs text-slate-400">Reduce device idle time by 35%</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400 font-bold">Portable Infusion Pumps:</span>
                      <span className="text-purple-300 font-mono font-bold">8 Reallocated to ER</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold">Mobile Ventilators:</span>
                      <span className="text-purple-300 font-mono font-bold">3 Reallocated to ICU</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setActiveActionModal(null)
                        showToast('✅ Equipment Plan Deployed: Device idle time reduced by 35%!')
                      }}
                      className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer text-center"
                    >
                      Deploy Equipment Route
                    </button>
                    <button
                      onClick={() => setActiveActionModal(null)}
                      className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
