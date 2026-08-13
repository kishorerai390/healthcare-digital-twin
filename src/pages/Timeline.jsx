import React, { useState } from 'react'

const timelineEvents = [
  {
    date: '2024-12-20',
    time: '10:30 AM',
    type: 'vitals',
    icon: '❤️',
    title: 'Vitals Check',
    desc: 'Heart rate: 72 bpm, BP: 120/80 mmHg, SpO2: 98%. All normal.',
    color: '#059669',
  },
  {
    date: '2024-12-18',
    time: '2:00 PM',
    type: 'appointment',
    icon: '👨‍⚕️',
    title: 'Doctor Consultation',
    desc: 'Routine checkup with Dr. Priya Sharma. Prescribed Vitamin D supplements. Follow-up in 3 months.',
    color: '#0284c7',
  },
  {
    date: '2024-12-15',
    time: '9:00 AM',
    type: 'report',
    icon: '📋',
    title: 'CBC Blood Test Results',
    desc: 'Complete Blood Count within normal range. Hemoglobin: 14.2 g/dL, WBC: 7,500/μL.',
    color: '#7c3aed',
  },
  {
    date: '2024-12-10',
    time: '8:15 PM',
    type: 'alert',
    icon: '⚠️',
    title: 'Heart Rate Alert',
    desc: 'Heart rate spiked to 115 bpm during rest. Possible cause: caffeine intake. Resolved after 20 min.',
    color: '#ea580c',
  },
  {
    date: '2024-12-05',
    time: '11:00 AM',
    type: 'medication',
    icon: '💊',
    title: 'Medication Started',
    desc: 'Started Vitamin D3 60K IU — once weekly for 8 weeks. Prescribed by Dr. Priya Sharma.',
    color: '#db2777',
  },
  {
    date: '2024-11-28',
    time: '3:45 PM',
    type: 'milestone',
    icon: '🏆',
    title: 'Health Milestone',
    desc: 'Achieved 30-day streak of 10,000+ daily steps! Overall fitness score improved by 12%.',
    color: '#d97706',
  },
  {
    date: '2024-11-20',
    time: '10:00 AM',
    type: 'report',
    icon: '🖼️',
    title: 'Chest X-Ray',
    desc: 'Normal findings. Clear lung fields, no cardiomegaly, normal mediastinum.',
    color: '#7c3aed',
  },
  {
    date: '2024-11-15',
    time: '7:30 AM',
    type: 'wearable',
    icon: '⌚',
    title: 'Wearable Connected',
    desc: 'Apple Watch Series 9 paired successfully. Now syncing heart rate, SpO2, and sleep data.',
    color: '#475569',
  },
  {
    date: '2024-11-01',
    time: '9:00 AM',
    type: 'onboarding',
    icon: '🎉',
    title: 'MedTwin Profile Created',
    desc: 'Digital twin health profile initialized. Medical history, vitals, and lifestyle data onboarded.',
    color: '#0284c7',
  },
]

const filterTypes = [
  { id: 'all', label: 'All', icon: '📊' },
  { id: 'vitals', label: 'Vitals', icon: '❤️' },
  { id: 'appointment', label: 'Appointments', icon: '👨‍⚕️' },
  { id: 'report', label: 'Reports', icon: '📋' },
  { id: 'alert', label: 'Alerts', icon: '⚠️' },
  { id: 'medication', label: 'Medications', icon: '💊' },
  { id: 'milestone', label: 'Milestones', icon: '🏆' },
]

export default function Timeline() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? timelineEvents : timelineEvents.filter(e => e.type === filter)

  // Group by date
  const grouped = filtered.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = []
    acc[event.date].push(event)
    return acc
  }, {})

  return (
    <div className="min-h-screen p-6 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <span className="text-3xl">📅</span> Health Timeline
          </h1>
          <p className="text-slate-600 mt-1 text-sm font-semibold">A chronological view of your health journey, events, and milestones</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {filterTypes.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer border ${
                filter === f.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{f.icon}</span> {f.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[22px] top-0 bottom-0 w-1 bg-slate-300" />

          {Object.entries(grouped).map(([date, events]) => (
            <div key={date} className="mb-8">
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-4 ml-1">
                <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-white z-10 shrink-0 shadow-xs" />
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {/* Events */}
              <div className="space-y-3 ml-[44px]">
                {events.map((event, idx) => (
                  <div
                    key={idx}
                    className="bg-white/95 rounded-2xl p-4 border border-slate-200 shadow-md hover:shadow-lg transition-all duration-200 group"
                    style={{ borderLeftColor: event.color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-xs" style={{
                        background: '#f1f5f9',
                        border: `1px solid ${event.color}40`
                      }}>
                        {event.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-extrabold text-slate-900">{event.title}</h4>
                          <span className="text-[11px] text-slate-600 font-extrabold">{event.time}</span>
                        </div>
                        <p className="text-xs text-slate-700 font-bold leading-relaxed mt-1">{event.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 ml-12">
              <div className="text-3xl mb-2 opacity-40">🔍</div>
              <p className="text-slate-600 font-bold text-sm">No events found for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
