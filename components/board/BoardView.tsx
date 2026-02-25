'use client'

import { useMemo } from 'react'
import { useAppSelector } from '@/hooks/useTypedRedux'
import { TaskStatus } from '@/types'
import TaskColumn    from './TaskColumn'
import CalendarPanel from './CalendarPanel'

const ALL_COLS: { status: TaskStatus; label: string }[] = [
  { status: 'todo',       label: 'To do'       },
  { status: 'inprogress', label: 'In progress' },
  { status: 'done',       label: 'Done'        },
]

interface Props {
  mobile?: boolean  
}

export default function BoardView({ mobile = false }: Props) {
  const tasks         = useAppSelector(s => s.tasks.tasks)
  const draggedTaskId = useAppSelector(s => s.tasks.draggedTaskId)
  const { activeTaskFilter, isCalendarOpen, searchQuery } = useAppSelector(s => s.ui)

  
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return tasks
    const q = searchQuery.toLowerCase()
    return tasks.filter(t =>
      t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q)
    )
  }, [tasks, searchQuery])

  
  const visibleCols = useMemo(() => {
    if (mobile) {
     
      const status =
        activeTaskFilter === 'all' ? 'todo' :
        (activeTaskFilter as TaskStatus)
      return ALL_COLS.filter(c => c.status === status)
    }
    if (activeTaskFilter === 'all')        return ALL_COLS
    if (activeTaskFilter === 'todo')       return ALL_COLS.filter(c => c.status === 'todo')
    if (activeTaskFilter === 'inprogress') return ALL_COLS.filter(c => c.status === 'inprogress')
    if (activeTaskFilter === 'done')       return ALL_COLS.filter(c => c.status === 'done')
    return ALL_COLS
  }, [activeTaskFilter, mobile])

  const byStatus = (s: TaskStatus) => filtered.filter(t => t.status === s)

  return (
    <div className="h-full flex flex-col overflow-hidden">

    
      {isCalendarOpen && <CalendarPanel />}

      
      <div className="flex-1 overflow-x-auto overflow-y-hidden min-h-0">
        <div
          className="flex h-full gap-4 px-5 pt-4 pb-5"
          style={{
          
            minWidth: mobile ? undefined : '480px',
            width:    (mobile || visibleCols.length === 1) ? '100%' : undefined,
          }}
        >
          {visibleCols.map(col => (
            <TaskColumn
              key={col.status}
              status={col.status}
              label={col.label}
              tasks={byStatus(col.status)}
              draggedTaskId={draggedTaskId}
            />
          ))}

        
          {!mobile && visibleCols.length === 1 && <div className="flex-[2]" />}
          {!mobile && visibleCols.length === 2 && <div className="flex-1"   />}
        </div>
      </div>
    </div>
  )
}