import React, { useState } from 'react'
import { MapPin, Phone, ExternalLink, ShieldAlert, Star, Navigation, Clock } from 'lucide-react'
import { getNearbyHospitals } from '../utils/hospitalUtils'

export default function NearbyHospitals({ location = 'San Francisco, California, United States' }){
  const parts = location ? location.split(',').map(s => s.trim()) : []
  const city = parts[0] || 'San Francisco'
  const state = parts[1] || 'California'
  const country = parts[2] || 'United States'

  const hospitals = getNearbyHospitals(city, state, country)
  const [callingHosp, setCallingHosp] = useState(null)

  const handleCall = (hosp) => {
    setCallingHosp(hosp.name)
    setTimeout(() => {
      alert(`Connecting call to ${hosp.name}\nPhone: ${hosp.phone}\nEmergency Line: ${hosp.emergencyCode}`)
      setCallingHosp(null)
    }, 400)
  }

  return (
    <div className="glass p-6 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <span>Nearby Emergency Hospitals</span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                24/7 Active
              </span>
            </h3>
            <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-600" />
              <span>Location: {city}, {state}, {country}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {hospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{hosp.name}</span>
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {hosp.rating}
                </span>
              </div>

              <div className="text-xs text-cyan-700 font-semibold flex items-center gap-2">
                <span>{hosp.specialty}</span>
                <span>•</span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-cyan-600" />
                  {hosp.distance}
                </span>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{hosp.address}</span>
              </div>

              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 pt-0.5">
                <Clock className="w-3 h-3 text-emerald-600" />
                <span>{hosp.status}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleCall(hosp)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{callingHosp === hosp.name ? 'Connecting...' : 'Call Hospital'}</span>
              </button>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(hosp.name + ' ' + hosp.address)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                title="Open in Google Maps"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Map</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
