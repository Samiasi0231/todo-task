'use client'

import { TaskStatus } from '@/types'

interface Props { value: number; max: number; status: TaskStatus; dark?: boolean }

function barColor(status: TaskStatus, pct: number): string {
  if (status === 'done') return '#22c55e'
  if (pct <= 30)         return '#ef4444'
  if (pct <= 65)         return '#f97316'
  return '#f59e0b'
}

export default function ProgressBar({ value, max, status, dark = false }: Props) {
  const pct     = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  const color   = barColor(status, pct)
  const trackBg = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'
  const labelC  = dark ? '#6b7280' : '#9ca3af'

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" style={{ color: labelC }}>
            <line x1="8" y1="6"  x2="21" y2="6"/>  <line x1="8"   y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/> <line x1="3"   y1="6"  x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/> <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          <span className="text-[11px] font-medium font-exo" style={{ color: labelC }}>Progress</span>
        </div>
        <span className="text-[11px] font-semibold font-exo" style={{ color }}>{value}/{max}</span>
      </div>
      <div className="w-full h-[5px] rounded-full overflow-hidden" style={{ backgroundColor: trackBg }}>
        <div className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}