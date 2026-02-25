'use client'

import { useState, useCallback } from 'react'
import { Task, TaskStatus } from '@/types'
import { useAppDispatch, useAppSelector } from '@/hooks/useTypedRedux'
import { moveTask } from '@/store/tasksSlice'
import { openAddTaskModal } from '@/store/uiSlice'
import TaskCard from './TaskCard'

interface Props {
  status:        TaskStatus
  label:         string
  tasks:         Task[]
  draggedTaskId: string | null
}

export default function TaskColumn({ status, label, tasks, draggedTaskId }: Props) {
  const dispatch = useAppDispatch()
  const theme    = useAppSelector(s => s.ui.theme)
  const dark     = theme === 'dark'
  const [over, setOver] = useState(false)

  const onDragOver  = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setOver(true)
  }
  const onDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false)
  }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setOver(false)
    const id = e.dataTransfer.getData('taskId')
    if (id) dispatch(moveTask({ id, status }))
  }
  const onCardDragStart = useCallback((_id: string) => {}, [])

  // ── Tokens ───────────────────────────────────────────
  const labelC        = dark ? '#e5e7eb'                  : '#374151'
  const countC        = dark ? '#6b7280'                  : '#9ca3af'
  const addBtnC       = dark ? '#6b7280'                  : '#9ca3af'
  const addBtnHC      = dark ? '#e5e7eb'                  : '#374151'
  const emptyC        = dark ? '#4b5563'                  : '#c7c8d0'
  const colBorder     = dark ? 'rgba(255,255,255,0.10)'   : 'rgba(0,0,0,0.10)'
  const colBorderOver = dark ? 'rgba(99,102,241,0.45)'    : 'rgba(99,102,241,0.35)'
  const colBgOver     = dark ? 'rgba(99,102,241,0.05)'    : 'rgba(99,102,241,0.03)'

  return (
    <div className="flex flex-col flex-1 min-w-[200px]">

      {/* Column header */}
      <div className="flex items-center justify-between mb-2 px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold font-exo" style={{ color: labelC }}>
            {label}
          </span>
          <span className="text-[12px] font-exo" style={{ color: countC }}>
            ({tasks.length})
          </span>
        </div>
        <button
          onClick={() => dispatch(openAddTaskModal(status))}
          className="flex items-center gap-1 text-[12px] font-exo transition-colors outline-none"
          style={{ color: addBtnC }}
          onMouseEnter={e => (e.currentTarget.style.color = addBtnHC)}
          onMouseLeave={e => (e.currentTarget.style.color = addBtnC)}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5"  x2="12" y2="19"/>
            <line x1="5"  y1="12" x2="19" y2="12"/>
          </svg>
          Add new task
        </button>
      </div>

      {/*
        Drop zone — single dashed border wraps ALL cards as one visual unit,
        matching the design reference. Border shifts to indigo on drag-over.
      */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className="flex-1 rounded-2xl p-3 overflow-y-auto overflow-x-hidden min-h-[120px] transition-all duration-150"
        style={{
          border:          `1.5px dashed ${over ? colBorderOver : colBorder}`,
          backgroundColor: over ? colBgOver : 'transparent',
          scrollbarWidth:  'thin',
        }}
      >
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onDragStart={onCardDragStart} />
          ))}
        </div>

        {/* Empty state */}
        {tasks.length === 0 && !over && (
          <div className="flex flex-col items-center justify-center min-h-[120px] gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" style={{ color: emptyC }}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <p className="text-[11px] font-exo" style={{ color: emptyC }}>Drop tasks here…</p>
          </div>
        )}

        {/* Drag-over indicator */}
        {over && (
          <div
            className="flex items-center justify-center py-5 mt-2 rounded-xl border-2 border-dashed text-[12px] font-exo"
            style={{
              borderColor: dark ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.3)',
              color:       dark ? 'rgba(99,102,241,0.7)' : 'rgba(99,102,241,0.6)',
            }}
          >
            Drop here
          </div>
        )}
      </div>
    </div>
  )
}