import React, { useState } from 'react'

const timelineEvents = [
  {
    date: '2024-12-20',
    time: '10:30 AM',
    type: 'vitals',
    icon: '❤️',
    title: 'Vitals Check',
    desc: 'Heart rate: 72 bpm, BP: 120/80 mmHg, SpO2: 98%. All normal.',
    color: '#34d399',
  },
  {
    date: '2024-12-18',
    time: '2:00 PM',
    type: 'appointment',
    icon: '👨‍⚕️',
    title: 'Doctor Consultation',
    desc: 'Routine checkup with Dr. Priya Sharma. Prescribed Vitamin D supplements. Follow-up in 3 months.',
    color: '#22d3ee',
  },
  {
    date: '2024-12-15',
    time: '9:00 AM',
    type: 'report',
    icon: '📋',
    title: 'CBC Blood Test Results',
    desc: 'Complete Blood Count within normal range. Hemoglobin: 14.2 g/dL, WBC: 7,500/μL.',
    color: '#a78bfa',
  },
  {
    date: '2024-12-10',
    time: '8:15 PM',
    type: 'alert',
    icon: '⚠️',
    title: 'Heart Rate Alert',
    desc: 'Heart rate spiked to 115 bpm during rest. Possible cause: caffeine intake. Resolved after 20 min.',
    color: '#f97316',
  },
  {
    date: '2024-12-05',
    time: '11:00 AM',
    type: 'medication',
    icon: '💊',
    title: 'Medication Started',
    desc: 'Started Vitamin D3 60K IU — once weekly for 8 weeks. Prescribed by Dr. Priya Sharma.',
    color: '#ec4899',
  },
  {
    date: '2024-11-28',
    time: '3:45 PM',
    type: 'milestone',
    icon: '🏆',
    title: 'Health Milestone',
    desc: 'Achieved 30-day streak of 10,000+ daily steps! Overall fitness score improved by 12%.',
    color: '#fbbf24',
  },
  {
    date: '2024-11-20',
    time: '10:00 AM',
    type: 'report',
    icon: '🖼️',
    title: 'Chest X-Ray',
    desc: 'Normal findings. Clear lung fields, no cardiomegaly, normal mediastinum.',
    color: '#a78bfa',
  },
  {
    date: '2024-11-15',
    time: '7:30 AM',
    type: 'wearable',
    icon: '⌚',
    title: 'Wearable Connected',
    desc: 'Apple Watch Series 9 paired successfully. Now syncing heart rate, SpO2, and sleep data.',
    color: '#64748b',
  },
  {
    date: '2024-11-01',
    time: '9:00 AM',
    type: 'onboarding',
    icon: '🎉',
    title: 'MedTwin Profile Created',
    desc: 'Digital twin health profile initialized. Medical history, vitals, and lifestyle data onboarded.',
    color: '#22d3ee',
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
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">📅</span> Health Timeline
          </h1>
          <p className="text-slate-400 mt-1 text-sm">A chronological view of your health journey, events, and milestones</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {filterTypes.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'bg-white/10 text-white border border-white/15'
                  : 'bg-white/[0.02] text-slate-400 border border-transparent hover:bg-white/5'
              }`}
            >
              <span>{f.icon}</span> {f.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 via-white/10 to-transparent" />

          {Object.entries(grouped).map(([date, events]) => (
            <div key={date} className="mb-8">
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-4 ml-1">
                <div className="w-[14px] h-[14px] rounded-full bg-white/10 border-2 border-white/20 z-10 shrink-0" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {/* Events */}
              <div className="space-y-3 ml-[44px]">
                {events.map((event, idx) => (
                  <div
                    key={idx}
                    className="glass rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all duration-200 group"
                    style={{ borderLeftColor: `${event.color}40`, borderLeftWidth: '3px' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0" style={{
                        background: `${event.color}15`,
                        border: `1px solid ${event.color}30`
                      }}>
                        {event.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{event.title}</h4>
                          <span className="text-[10px] text-slate-500 font-medium">{event.time}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mt-1">{event.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 ml-12">
              <div className="text-3xl mb-2 opacity-30">🔍</div>
              <p className="text-slate-500 text-sm">No events found for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
