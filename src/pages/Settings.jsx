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
    <div className="min-h-screen p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <span className="text-3xl">⚙️</span> Settings & Profile
            </h1>
            <p className="text-slate-600 mt-1 text-sm font-semibold">Manage your account, devices, and preferences</p>
          </div>
          <button
            onClick={handleSave}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md ${
              saved
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-cyan-600 hover:bg-cyan-700 text-white border border-cyan-500 hover:scale-105'
            }`}
          >
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Nav */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 rounded-2xl p-3 border border-slate-200 shadow-md space-y-1">
              {settingsSections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                    activeSection === s.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
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
            <div className="bg-white/95 rounded-2xl p-6 border border-slate-200 shadow-md">
              <h2 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span>{section.icon}</span> {section.title}
              </h2>

              {/* Form fields */}
              {section.fields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map(field => (
                    <div key={field.label}>
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">{field.label}</label>
                      {field.type === 'select' ? (
                        <select
                          defaultValue={field.value}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 font-mono"
                        >
                          {field.options.map(opt => (
                            <option key={opt} value={opt} className="bg-white text-slate-900">{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          defaultValue={field.value}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-cyan-500 font-mono"
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
                    <div key={device.name} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{device.icon}</span>
                        <div>
                          <div className="text-xs font-extrabold text-slate-900">{device.name}</div>
                          <div className="text-[10px] text-slate-500 font-bold">Last sync: {device.lastSync}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                          device.connected
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}>
                          {device.status}
                        </span>
                        <button className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shadow-xs">
                          {device.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="w-full p-3 rounded-xl border-2 border-dashed border-slate-300 text-xs text-slate-700 font-extrabold hover:border-cyan-500 hover:text-cyan-800 transition-colors cursor-pointer">
                    + Add New Device
                  </button>
                </div>
              )}

              {/* Toggles */}
              {section.toggles && (
                <div className="space-y-4">
                  {section.toggles.map(toggle => (
                    <div key={toggle.label} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">{toggle.label}</div>
                        <div className="text-[11px] text-slate-600 font-bold mt-0.5">{toggle.desc}</div>
                      </div>
                      <button
                        onClick={() => handleToggle(section.id, toggle.label)}
                        className={`w-12 h-7 rounded-full transition-all duration-300 relative cursor-pointer ${
                          isToggleOn(section.id, toggle.label, toggle.enabled) ? 'bg-cyan-600' : 'bg-slate-300'
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
