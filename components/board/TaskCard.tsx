'use client'

import { useRef, useState, useEffect } from 'react'
import { Task, TaskStatus } from '@/types'
import { useAppDispatch, useAppSelector } from '@/hooks/useTypedRedux'
import { moveTask, deleteTask, setDraggedTask } from '@/store/tasksSlice'
import { openEditTaskModal } from '@/store/uiSlice'
import ProgressBar from '@/components/ui/ProgressBar'
import AvatarStack from '@/components/ui/AvatarStack'

interface Props { task: Task; onDragStart: (id: string) => void }

const DATE_STYLE: Record<TaskStatus, { color: string; bg: string }> = {
  todo:       { color: '#f97316', bg: 'rgba(249,115,22,0.09)'  },
  inprogress: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)'   },
  done:       { color: '#22c55e', bg: 'rgba(34,197,94,0.09)'   },
}

const ALL_MOVES: { label: string; status: TaskStatus }[] = [
  { label: 'Move to To Do',       status: 'todo'       },
  { label: 'Move to In Progress', status: 'inprogress' },
  { label: 'Move to Done',        status: 'done'       },
]

export default function TaskCard({ task, onDragStart }: Props) {
  const dispatch  = useAppDispatch()
  const cardRef   = useRef<HTMLDivElement>(null)
  const menuRef   = useRef<HTMLDivElement>(null)
  const theme     = useAppSelector(s => s.ui.theme)
  const dark      = theme === 'dark'
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on outside click — mousedown fires BEFORE blur
  // so menu items still receive their click events correctly
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  // ── Drag ──────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id)
    e.dataTransfer.effectAllowed = 'move'
    dispatch(setDraggedTask(task.id))
    onDragStart(task.id)
    setTimeout(() => cardRef.current?.classList.add('opacity-40', 'scale-[0.97]'), 0)
  }
  const handleDragEnd = () => {
    dispatch(setDraggedTask(null))
    cardRef.current?.classList.remove('opacity-40', 'scale-[0.97]')
  }

  const moves = ALL_MOVES.filter(m => m.status !== task.status)

  // ── Tokens ────────────────────────────────────────────
  const cardBg     = dark ? '#1e2035' : '#ffffff'
  const dashColor  = dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'
  const dashHover  = dark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.18)'
  const titleC     = dark ? '#ffffff'  : '#111827'
  const subtitleC  = dark ? '#6b7280'  : '#9ca3af'
  const menuBg     = dark ? '#252840'  : '#ffffff'
  const menuBorder = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
  const menuTextC  = dark ? '#d1d5db'  : '#374151'
  const menuHBg    = dark ? 'rgba(255,255,255,0.05)' : '#f9fafb'
  const dc         = DATE_STYLE[task.status]

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="group relative rounded-[14px] p-4 cursor-grab active:cursor-grabbing transition-all duration-200"
      style={{
        backgroundColor: cardBg,
        border:    `1.5px dashed ${dashColor}`,
        boxShadow: dark ? '0 1px 4px rgba(0,0,0,0.20)' : '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = dashHover
        e.currentTarget.style.boxShadow   = dark ? '0 6px 20px rgba(0,0,0,0.30)' : '0 4px 16px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = dashColor
        e.currentTarget.style.boxShadow   = dark ? '0 1px 4px rgba(0,0,0,0.20)' : '0 1px 3px rgba(0,0,0,0.04)'
      }}
    >
      {/* Title + horizontal 3-dot */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="min-w-0 flex-1">
          <h3 className="text-[13px] font-semibold leading-snug font-exo line-clamp-2"
            style={{ color: titleC }}>
            {task.title}
          </h3>
          <p className="text-[11px] mt-[3px] font-exo" style={{ color: subtitleC }}>
            {task.subtitle}
          </p>
        </div>

      
        <div ref={menuRef} className="relative flex-shrink-0">
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(v => !v) }}
            className="w-6 h-6 flex items-center justify-center rounded-md transition-all opacity-0 group-hover:opacity-100 outline-none"
            style={{ color: dark ? '#6b7280' : '#9ca3af' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = dark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'
              e.currentTarget.style.color = dark ? '#ffffff' : '#374151'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = dark ? '#6b7280' : '#9ca3af'
            }}
          >
           
            <svg width="14" height="4" viewBox="0 0 14 4" fill="currentColor">
              <circle cx="1.5" cy="2" r="1.5"/>
              <circle cx="7"   cy="2" r="1.5"/>
              <circle cx="12.5" cy="2" r="1.5"/>
            </svg>
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-8 z-50 w-48 rounded-xl py-1.5 animate-fade-in"
              style={{
                backgroundColor: menuBg,
                boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
                border: `1px solid ${menuBorder}`,
              }}
            >
              {/* Edit */}
              <MItem
                label="✏️  Edit task"
                color={menuTextC} hBg={menuHBg}
                onClick={() => {
                  dispatch(openEditTaskModal(task.id))
                  setMenuOpen(false)
                }}
              />

              {/* Move to column */}
              {moves.map(m => (
                <MItem
                  key={m.status}
                  label={`→  ${m.label}`}
                  color={menuTextC} hBg={menuHBg}
                  onClick={() => {
                    dispatch(moveTask({ id: task.id, status: m.status }))
                    setMenuOpen(false)
                  }}
                />
              ))}

              <div className="my-1" style={{ borderTop: `1px solid ${menuBorder}` }} />

              {/* Delete */}
              <MItem
                label="🗑️  Delete task"
                color="#ef4444" hBg="rgba(239,68,68,0.07)"
                onClick={() => {
                  dispatch(deleteTask(task.id))
                  setMenuOpen(false)
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3 mb-3">
        <ProgressBar value={task.progress} max={task.maxProgress} status={task.status} dark={dark} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-semibold px-2.5 py-[5px] rounded-lg font-exo"
          style={{ color: dc.color, backgroundColor: dc.bg }}
        >
          {task.dueDate}
        </span>

        <div className="flex items-center gap-2">
          {task.assignees.length > 0 && (
            <AvatarStack assigneeIds={task.assignees} max={2} dark={dark} />
          )}
          {task.comments > 0 && (
            <Chip value={task.comments} dark={dark}
              icon={
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              }
            />
          )}
          {task.attachments > 0 && (
            <Chip value={task.attachments} dark={dark}
              icon={
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}

function MItem({ label, onClick, color, hBg }: {
  label: string; onClick: () => void; color: string; hBg: string
}) {
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onClick() }}
      className="w-full text-left px-3 py-[7px] text-[12px] font-exo transition-colors outline-none"
      style={{ color }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = hBg)}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {label}
    </button>
  )
}

function Chip({ value, icon, dark }: { value: number; icon: React.ReactNode; dark: boolean }) {
  return (
    <div className="flex items-center gap-[3px]" style={{ color: dark ? '#6b7280' : '#9ca3af' }}>
      {icon}
      <span className="text-[11px] font-medium font-exo">{value}</span>
    </div>
  )
}