import React, { useState } from 'react'

const settingsSections = [
  {
    id: 'personal',
    icon: '👤',
    title: 'Personal Information',
    fields: [
      { label: 'Full Name', value: 'Ava Nguyen', type: 'text' },
      { label: 'Email', value: 'ava.nguyen@email.com', type: 'email' },
      { label: 'Phone', value: '+91 98765 43210', type: 'tel' },
      { label: 'Date of Birth', value: '1995-03-15', type: 'date' },
      { label: 'Blood Group', value: 'O+', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
      { label: 'Gender', value: 'Female', type: 'select', options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] },
    ]
  },
  {
    id: 'emergency',
    icon: '🚨',
    title: 'Emergency Contact',
    fields: [
      { label: 'Contact Name', value: 'David Nguyen', type: 'text' },
      { label: 'Relationship', value: 'Father', type: 'text' },
      { label: 'Contact Phone', value: '+91 98765 12345', type: 'tel' },
    ]
  },
  {
    id: 'devices',
    icon: '⌚',
    title: 'Connected Devices',
    devices: [
      { name: 'Apple Watch Series 9', status: 'Connected', lastSync: '2 min ago', icon: '⌚', connected: true },
      { name: 'Fitbit Charge 6', status: 'Disconnected', lastSync: '3 days ago', icon: '📱', connected: false },
      { name: 'Withings BPM Core', status: 'Connected', lastSync: '1 hr ago', icon: '💓', connected: true },
    ]
  },
  {
    id: 'notifications',
    icon: '🔔',
    title: 'Notification Settings',
    toggles: [
      { label: 'Medication Reminders', desc: 'Get notified when it\'s time to take medication', enabled: true },
      { label: 'Vital Alerts', desc: 'Receive alerts when vitals are out of range', enabled: true },
      { label: 'Weekly Health Report', desc: 'Receive a summary every Sunday', enabled: true },
      { label: 'AI Insights', desc: 'Get personalized health tips from AI', enabled: false },
      { label: 'Appointment Reminders', desc: 'Remind 1 hour before appointments', enabled: true },
    ]
  },
  {
    id: 'privacy',
    icon: '🔒',
    title: 'Privacy & Data',
    toggles: [
      { label: 'Share Data with Doctor', desc: 'Allow your primary doctor to access your health data', enabled: true },
      { label: 'Anonymous Analytics', desc: 'Help improve MedTwin with anonymized usage data', enabled: false },
      { label: 'Two-Factor Authentication', desc: 'Add extra security to your account', enabled: true },
      { label: 'Biometric Login', desc: 'Use fingerprint or face to sign in', enabled: false },
    ]
  },
]

export default function Settings() {
  const [activeSection, setActiveSection] = useState('personal')
  const [toggleStates, setToggleStates] = useState({})
  const [saved, setSaved] = useState(false)

  const handleToggle = (sectionId, label) => {
    const key = `${sectionId}-${label}`
    setToggleStates(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isToggleOn = (sectionId, label, defaultVal) => {
    const key = `${sectionId}-${label}`
    return key in toggleStates ? toggleStates[key] : defaultVal
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const section = settingsSections.find(s => s.id === activeSection)

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">⚙️</span> Settings & Profile
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Manage your account, devices, and preferences</p>
          </div>
          <button
            onClick={handleSave}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              saved
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5'
            }`}
          >
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Nav */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-3 border border-white/5 space-y-1">
              {settingsSections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeSection === s.id
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <span className="text-lg">{s.icon}</span>
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>{section.icon}</span> {section.title}
              </h2>

              {/* Form fields */}
              {section.fields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map(field => (
                    <div key={field.label}>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">{field.label}</label>
                      {field.type === 'select' ? (
                        <select
                          defaultValue={field.value}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                        >
                          {field.options.map(opt => (
                            <option key={opt} value={opt} className="bg-slate-800">{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          defaultValue={field.value}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Devices */}
              {section.devices && (
                <div className="space-y-3">
                  {section.devices.map(device => (
                    <div key={device.name} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{device.icon}</span>
                        <div>
                          <div className="text-sm font-semibold text-white">{device.name}</div>
                          <div className="text-[10px] text-slate-500">Last sync: {device.lastSync}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          device.connected
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}>
                          {device.status}
                        </span>
                        <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10 transition-colors">
                          {device.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="w-full p-3 rounded-xl border-2 border-dashed border-white/10 text-sm text-slate-400 font-medium hover:border-cyan-500/30 hover:text-cyan-400 transition-colors">
                    + Add New Device
                  </button>
                </div>
              )}

              {/* Toggles */}
              {section.toggles && (
                <div className="space-y-4">
                  {section.toggles.map(toggle => (
                    <div key={toggle.label} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div>
                        <div className="text-sm font-semibold text-white">{toggle.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{toggle.desc}</div>
                      </div>
                      <button
                        onClick={() => handleToggle(section.id, toggle.label)}
                        className={`w-12 h-7 rounded-full transition-all duration-300 relative ${
                          isToggleOn(section.id, toggle.label, toggle.enabled) ? 'bg-cyan-500' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all duration-300 shadow-md ${
                          isToggleOn(section.id, toggle.label, toggle.enabled) ? 'left-6' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
