import React from 'react'

export default function Settings(){
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto glass p-6 rounded-xl">
        <h2 className="text-2xl font-semibold">Settings & Profile</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 rounded bg-white/3">Personal Information (prototype)</div>
          <div className="p-4 rounded bg-white/3">Connected Devices (prototype)</div>
          <div className="p-4 rounded bg-white/3">Notification Settings</div>
          <div className="p-4 rounded bg-white/3">Privacy & Data Sharing</div>
        </div>
      </div>
    </div>
  )
}
