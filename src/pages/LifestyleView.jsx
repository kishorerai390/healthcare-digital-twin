import React, { useState } from 'react'

const lifestyleData = {
  sleep: {
    icon: '😴', title: 'Sleep', score: 82, status: 'Good',
    stats: [
      { label: 'Average Duration', value: '7.2 hrs' },
      { label: 'Deep Sleep', value: '1.8 hrs' },
      { label: 'REM Sleep', value: '2.1 hrs' },
      { label: 'Sleep Quality', value: '82/100' },
    ],
    tip: 'Try to maintain a consistent sleep schedule. Avoid screens 1 hour before bedtime.',
    weekData: [7.5, 6.8, 7.2, 8.0, 6.5, 7.8, 7.0],
    color: '#818cf8',
  },
  nutrition: {
    icon: '🥗', title: 'Nutrition', score: 68, status: 'Fair',
    stats: [
      { label: 'Calories Today', value: '1,850 kcal' },
      { label: 'Protein', value: '72g' },
      { label: 'Water Intake', value: '2.1 L' },
      { label: 'Fiber', value: '18g' },
    ],
    tip: 'Increase fiber intake to 25-30g/day. Add more leafy greens and whole grains.',
    weekData: [1900, 2100, 1750, 1850, 2200, 1600, 1950],
    color: '#34d399',
  },
  exercise: {
    icon: '🏃', title: 'Exercise', score: 75, status: 'Good',
    stats: [
      { label: 'Steps Today', value: '8,420' },
      { label: 'Active Minutes', value: '45 min' },
      { label: 'Calories Burned', value: '320 kcal' },
      { label: 'Weekly Goal', value: '75%' },
    ],
    tip: 'You\'re 1,580 steps away from your daily 10K goal. A 15-min evening walk would do it!',
    weekData: [6200, 9100, 7500, 8420, 5800, 10200, 7800],
    color: '#f97316',
  },
  stress: {
    icon: '🧠', title: 'Mental Health', score: 70, status: 'Moderate',
    stats: [
      { label: 'Stress Level', value: 'Moderate' },
      { label: 'Mindfulness', value: '10 min today' },
      { label: 'Mood Score', value: '7/10' },
      { label: 'Social Activity', value: 'Active' },
    ],
    tip: 'Consider adding 5 more minutes of meditation. Deep breathing exercises can reduce cortisol by 23%.',
    weekData: [6, 7, 5, 7, 8, 6, 7],
    color: '#a78bfa',
  },
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function LifestyleView() {
  const [activeCategory, setActiveCategory] = useState('sleep')
  const active = lifestyleData[activeCategory]

  // Overall wellness score
  const overallScore = Math.round(
    Object.values(lifestyleData).reduce((sum, d) => sum + d.score, 0) / Object.keys(lifestyleData).length
  )

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🌿</span> Lifestyle & Wellness
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Track your daily habits and get personalized AI recommendations</p>
          </div>
          <div className="glass rounded-2xl p-4 border border-white/5 text-center min-w-[120px]">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Overall Score</div>
            <div className="text-3xl font-black mt-1" style={{
              color: overallScore >= 80 ? '#34d399' : overallScore >= 60 ? '#fbbf24' : '#ef4444'
            }}>{overallScore}</div>
            <div className="text-[10px] text-slate-400">/ 100</div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {Object.entries(lifestyleData).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap border ${
                activeCategory === key
                  ? 'bg-white/10 text-white border-white/15 shadow-lg'
                  : 'bg-white/[0.02] text-slate-400 border-transparent hover:bg-white/5'
              }`}
              style={activeCategory === key ? { borderColor: `${data.color}40`, boxShadow: `0 4px 20px ${data.color}15` } : {}}
            >
              <span className="text-lg">{data.icon}</span>
              {data.title}
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{
                background: `${data.color}20`,
                color: data.color
              }}>{data.score}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Score Ring + Stats */}
          <div className="space-y-5">
            {/* Score Ring */}
            <div className="glass rounded-2xl p-6 border border-white/5 flex flex-col items-center">
              <div className="relative w-36 h-36 mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke={active.color} strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${(active.score / 100) * 327} 327`}
                    style={{ transition: 'stroke-dasharray 0.8s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">{active.score}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{active.status}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white">{active.icon} {active.title} Score</h3>
            </div>

            {/* Stats Grid */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Today's Stats</h4>
              <div className="space-y-3">
                {active.stats.map(stat => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{stat.label}</span>
                    <span className="text-sm font-bold text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Weekly Chart */}
          <div className="lg:col-span-2 space-y-5">
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Weekly Trend</h3>
              <div className="flex items-end gap-3 h-[200px] px-2">
                {active.weekData.map((val, i) => {
                  const max = Math.max(...active.weekData)
                  const heightPct = (val / max) * 100
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-300">{val}</span>
                      <div className="w-full rounded-t-lg transition-all duration-500 relative group" style={{
                        height: `${heightPct}%`,
                        background: `linear-gradient(to top, ${active.color}90, ${active.color}40)`,
                        minHeight: '8px'
                      }}>
                        <div className="absolute inset-0 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{
                          background: active.color,
                          boxShadow: `0 0 20px ${active.color}50`
                        }} />
                      </div>
                      <span className="text-[10px] font-medium text-slate-500">{days[i]}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* AI Tip */}
            <div className="glass rounded-2xl p-5 border border-white/5" style={{ borderColor: `${active.color}20` }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{
                  background: `${active.color}15`,
                  border: `1px solid ${active.color}30`
                }}>🤖</div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">AI Recommendation</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{active.tip}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'Log Meal', icon: '🍎', desc: 'Track calories & nutrients' },
                { label: 'Start Workout', icon: '💪', desc: 'Begin exercise session' },
                { label: 'Meditate', icon: '🧘', desc: '5-minute guided session' },
              ].map(action => (
                <button key={action.label} className="glass rounded-xl p-4 border border-white/5 text-left hover:bg-white/5 transition-all group">
                  <span className="text-2xl group-hover:scale-110 inline-block transition-transform">{action.icon}</span>
                  <div className="text-sm font-bold text-white mt-2">{action.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{action.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
