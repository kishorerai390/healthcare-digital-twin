import React from 'react'

export default function HealthCard({ title, value, status }) {
  return (
    <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-1.5 min-w-0 overflow-hidden text-slate-900">
      <div className="text-[10px] sm:text-[11px] font-extrabold text-slate-500 uppercase tracking-wider truncate">
        {title}
      </div>
      <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight truncate">
        {value}
      </div>
      {status && (
        <div className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 pt-0.5 truncate">
          <span className="truncate">{status}</span>
        </div>
      )}
    </div>
  )
}
