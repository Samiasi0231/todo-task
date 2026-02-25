'use client'

import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useTypedRedux'
import { closeCalendar } from '@/store/uiSlice'

const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function CalendarPanel() {
  const dispatch = useAppDispatch()
  const tasks    = useAppSelector(s => s.tasks.tasks)
  const theme    = useAppSelector(s => s.ui.theme)
  const dark     = theme === 'dark'

  const [year,  setYear]  = useState(2022)
  const [month, setMonth] = useState(4) // May = 4

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay    = new Date(year, month, 1).getDay()
  const totalCells  = Math.ceil((firstDay + daysInMonth) / 7) * 7
  const cells       = Array.from({ length: totalCells }, (_, i) => {
    const d = i - firstDay + 1
    return d >= 1 && d <= daysInMonth ? d : null
  })

  // Map task due dates to day numbers for this month/year
  const taskDots: Record<number, string> = {}
  tasks.forEach(t => {
    const parts = t.dueDate.split(' ')
    if (parts.length === 3) {
      const m = MONTHS.indexOf(parts[1])
      const d = parseInt(parts[0])
      const y = parseInt(parts[2])
      if (m === month && y === year && d >= 1 && d <= daysInMonth) {
        taskDots[d] = t.status === 'done' ? '#22c55e' : t.status === 'inprogress' ? '#f97316' : '#6366f1'
      }
    }
  })

  // Tasks due this month for the right panel
  const monthTasks = tasks.filter(t => {
    const parts = t.dueDate.split(' ')
    if (parts.length !== 3) return false
    return MONTHS.indexOf(parts[1]) === month && parseInt(parts[2]) === year
  })

  const prev = () => month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1)
  const next = () => month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1)

  const bg     = dark ? '#1e2035' : '#ffffff'
  const border = dark ? 'rgba(255,255,255,0.06)' : '#f0f0f5'
  const textH  = dark ? '#ffffff' : '#111827'
  const textM  = dark ? '#9ca3af' : '#6b7280'
  const textD  = dark ? '#6b7280' : '#9ca3af'
  const hBg    = dark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'
  const todayBg   = '#6366f1'
  const todayText = '#ffffff'

  return (
    <div className="flex-shrink-0 animate-slide-up"
      style={{ backgroundColor: bg, borderBottom: `1px solid ${border}` }}>
      <div className="px-5 py-4 flex items-start gap-8">

        {/* ── Mini calendar ── */}
        <div className="flex-shrink-0 w-60">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={prev}
              className="w-6 h-6 flex items-center justify-center rounded-lg transition-all"
              style={{ color: textM }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = hBg; e.currentTarget.style.color = textH }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = textM }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <span className="text-[13px] font-semibold font-exo" style={{ color: textH }}>
              {MONTHS_FULL[month]} {year}
            </span>
            <button onClick={next}
              className="w-6 h-6 flex items-center justify-center rounded-lg transition-all"
              style={{ color: textM }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = hBg; e.currentTarget.style.color = textH }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = textM }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-semibold font-exo py-0.5"
                style={{ color: textD }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              if (!day) return <div key={`e${i}`} className="aspect-square" />
              const hasTask = !!taskDots[day]
              const dotColor = taskDots[day]
              const isToday = day === 19 && month === 4 && year === 2022
              return (
                <button key={day}
                  className="relative aspect-square flex items-center justify-center rounded-lg text-[11px] font-medium font-exo transition-all outline-none"
                  style={{
                    backgroundColor: isToday ? todayBg : 'transparent',
                    color:           isToday ? todayText : textH,
                    fontWeight:      isToday ? 700 : 400,
                  }}
                  onMouseEnter={e => { if (!isToday) e.currentTarget.style.backgroundColor = hBg }}
                  onMouseLeave={e => { if (!isToday) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  {day}
                  {hasTask && !isToday && (
                    <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: dotColor }}/>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Tasks for selected month ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold font-exo" style={{ color: textH }}>
              Tasks in {MONTHS_FULL[month]}
              <span className="ml-2 text-[11px] font-normal" style={{ color: textM }}>
                ({monthTasks.length})
              </span>
            </span>
            <button onClick={() => dispatch(closeCalendar())}
              className="flex items-center gap-1 text-[11px] font-exo transition-all px-2 py-1 rounded-lg"
              style={{ color: textM }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = hBg; e.currentTarget.style.color = textH }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = textM }}>
              Close ×
            </button>
          </div>

          {monthTasks.length === 0 ? (
            <p className="text-[12px] font-exo" style={{ color: textD }}>
              No tasks due in {MONTHS_FULL[month]} {year}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {monthTasks.map(t => (
                <div key={t.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-exo"
                  style={{
                    backgroundColor: dark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
                    border:          `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f0f0f5'}`,
                    color:           textH,
                  }}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: t.status === 'done' ? '#22c55e' : t.status === 'inprogress' ? '#f97316' : '#6366f1' }}/>
                  <span className="truncate max-w-[140px]">{t.title}</span>
                  <span className="text-[10px] flex-shrink-0" style={{ color: textD }}>{t.dueDate}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
