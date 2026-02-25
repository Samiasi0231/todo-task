'use client'

import { useState, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useTypedRedux'
import {
  setActiveProject, setActiveTaskFilter,
  setTheme, openAddTaskModal,
} from '@/store/uiSlice'
import { PROJECT_ITEMS } from '@/components/sidebar/SidebarItems'
import { TOKENS, TK } from '@/components/sidebar/Tokens'
import {
  TreeList, TreeItem, SectionHead, PlainRow,
  SunIcon, MoonIcon,
} from '@/components/sidebar/SidebarComponents'


const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function parseDue(dueDate: string): Date | null {
  const parts = dueDate.split(' ')
  if (parts.length !== 3) return null
  const d = parseInt(parts[0])
  const m = MONTHS_SHORT.indexOf(parts[1])
  const y = parseInt(parts[2])
  if (isNaN(d) || m === -1 || isNaN(y)) return null
  return new Date(y, m, d)
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

const MESSENGER_SECTIONS = [
  {
    id: 'msg-inbox', label: 'Inbox',
    items: [
      { id: 'mi1', from: 'Alice Martin',  text: 'Can you review the UI kit?',       time: '2m ago',    read: false },
      { id: 'mi2', from: 'Bob Chen',      text: 'Design system update is ready',    time: '14m ago',   read: false },
      { id: 'mi3', from: 'Carol Smith',   text: 'New wireframes attached',          time: '1h ago',    read: false },
      { id: 'mi4', from: 'Dave Kim',      text: 'Can we sync on the brand guide?',  time: '3h ago',    read: false },
      { id: 'mi5', from: 'Eve Johnson',   text: 'Prototype link shared',            time: 'Yesterday', read: true  },
    ],
  },
  {
    id: 'msg-sent', label: 'Sent',
    items: [
      { id: 'ms1', from: 'You → Alice',   text: 'Reviewed and approved!',           time: '1h ago',    read: true },
      { id: 'ms2', from: 'You → Bob',     text: 'LGTM, merging now',                time: 'Yesterday', read: true },
    ],
  },
  {
    id: 'msg-archived', label: 'Archived',
    items: [
      { id: 'ma1', from: 'Dave Kim',      text: 'Old campaign assets',              time: '3 days ago', read: true },
    ],
  },
]


interface SidebarProps { onNavigate?: () => void }
export default function Sidebar({ onNavigate }: SidebarProps = {}) {
  const dispatch = useAppDispatch()
  const { activeProject, activeTaskFilter, theme } = useAppSelector(s => s.ui)
  const tasks = useAppSelector(s => s.tasks.tasks)

  const [projectsOpen,   setProjectsOpen]   = useState(true)
  const [tasksOpen,      setTasksOpen]      = useState(true)
  const [remindersOpen,  setRemindersOpen]  = useState(false)
  const [messengersOpen, setMessengersOpen] = useState(false)

  const [activeReminder,  setActiveReminder]  = useState<string | null>(null)
  const [activeMessenger, setActiveMessenger] = useState<string | null>('msg-inbox')

  
  const [readIds, setReadIds] = useState<Set<string>>(new Set())

  const T    = theme === 'dark' ? TOKENS.dark : TOKENS.light
  const dark = theme === 'dark'

 
  const counts = useMemo(() => ({
    all:        tasks.length,
    todo:       tasks.filter(t => t.status === 'todo').length,
    inprogress: tasks.filter(t => t.status === 'inprogress').length,
    done:       tasks.filter(t => t.status === 'done').length,
  }), [tasks])

  const TASK_ITEMS = [
    { id: 'all',        label: 'All tasks',   count: counts.all        },
    { id: 'todo',       label: 'To do',       count: counts.todo       },
    { id: 'inprogress', label: 'In progress', count: counts.inprogress },
    { id: 'done',       label: 'Done',        count: counts.done       },
  ]


  const { reminderBuckets, reminderCounts } = useMemo(() => {
    const now     = startOfDay(new Date())
    const in7days = new Date(now); in7days.setDate(in7days.getDate() + 7)

    const buckets = {
      'reminder-today':    [] as typeof tasks,
      'reminder-upcoming': [] as typeof tasks,
      'reminder-overdue':  [] as typeof tasks,
    }

    tasks.forEach(t => {
      if (t.status === 'done') return
      const due = parseDue(t.dueDate)
      if (!due) return
      const d = startOfDay(due)
      if (d.getTime() === now.getTime())  buckets['reminder-today'].push(t)
      else if (d > now && d <= in7days)   buckets['reminder-upcoming'].push(t)
      else if (d < now)                   buckets['reminder-overdue'].push(t)
    })

    return {
      reminderBuckets: buckets,
      reminderCounts: {
        today:    buckets['reminder-today'].length,
        upcoming: buckets['reminder-upcoming'].length,
        overdue:  buckets['reminder-overdue'].length,
      },
    }
  }, [tasks])

  const REMINDER_ITEMS = [
    { id: 'reminder-today',    label: 'Today',    count: reminderCounts.today,    color: '#6366f1' },
    { id: 'reminder-upcoming', label: 'Upcoming', count: reminderCounts.upcoming, color: '#f97316' },
    { id: 'reminder-overdue',  label: 'Overdue',  count: reminderCounts.overdue,  color: '#ef4444' },
  ]

  const urgentCount = reminderCounts.today + reminderCounts.overdue

  
  const totalUnread = useMemo(() =>
    MESSENGER_SECTIONS[0].items.filter(m => !m.read && !readIds.has(m.id)).length
  , [readIds])

  const markRead = (id: string) =>
  setReadIds(prev => new Set([...Array.from(prev), id]));

  return (
    <aside
      className="w-full h-full flex flex-col select-none transition-colors duration-200"
      style={{ backgroundColor: T.aside, borderRight: T.borderRight }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4 flex-shrink-0">
        <h1 className="font-bold text-[18px] tracking-tight font-exo" style={{ color: T.title }}>
          Projects
        </h1>
        <button
          onClick={() => dispatch(openAddTaskModal('todo'))}
          title="Add task"
          className="w-[22px] h-[22px] rounded-md flex items-center justify-center transition-all duration-150"
          style={{ backgroundColor: T.plusBg }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
            strokeWidth="2.5" strokeLinecap="round" stroke={T.plusIcon}>
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5"  y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

     
      <nav className="flex-1 overflow-y-auto px-3 pb-4" style={{ scrollbarWidth: 'none' }}>

        <PlainRow label="Team" T={T} />

      
        <SectionHead label="Projects" open={projectsOpen}
          onToggle={() => setProjectsOpen(v => !v)} T={T} />
        {projectsOpen && (
          <TreeList T={T}>
            {PROJECT_ITEMS.map(item => {
              const active = activeProject === item.id
              return (
                <TreeItem key={item.id} active={active} T={T}
                  onClick={() => { dispatch(setActiveProject(item.id)); onNavigate?.() }}>
                  <span className="text-[13px] font-exo flex-1" style={{ fontWeight: active ? 600 : 400 }}>
                    {item.label}
                  </span>
                  {item.showCount && (
                    <span className="text-[11px] font-exo" style={{ color: T.countText }}>({counts.all})</span>
                  )}
                </TreeItem>
              )
            })}
          </TreeList>
        )}

      
        <SectionHead label="Tasks" open={tasksOpen}
          onToggle={() => setTasksOpen(v => !v)} T={T} />
        {tasksOpen && (
          <TreeList T={T}>
            {TASK_ITEMS.map(item => {
              const active = activeTaskFilter === item.id
              return (
                <TreeItem key={item.id} active={active} T={T}
                  onClick={() => { dispatch(setActiveTaskFilter(item.id)); onNavigate?.() }}>
                  <span className="text-[13px] font-exo flex-1" style={{ fontWeight: active ? 600 : 400 }}>
                    {item.label}
                  </span>
                  <span className="text-[11px] font-exo" style={{ color: T.countText }}>
                    ({item.count})
                  </span>
                </TreeItem>
              )
            })}
          </TreeList>
        )}

       
        <button
          onClick={() => setRemindersOpen(v => !v)}
          className="w-full flex items-center justify-between px-2 py-[9px] rounded-lg text-[13px] font-bold font-exo outline-none transition-all duration-150"
          style={{ color: T.sectionLabel }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = T.rowHoverBg)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span>Reminders</span>
          <div className="flex items-center gap-1.5">
            {urgentCount > 0 && (
              <span className="text-[10px] font-bold font-exo px-1.5 py-[1px] rounded-full"
                style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                {urgentCount}
              </span>
            )}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke={T.chevron} strokeWidth="2.5" strokeLinecap="round"
              style={{ transform: remindersOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform .2s ease' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </button>

        {remindersOpen && (
          <>
            <TreeList T={T}>
              {REMINDER_ITEMS.map(item => {
                const active = activeReminder === item.id
                return (
                  <TreeItem key={item.id} active={active} T={T}
                    onClick={() => setActiveReminder(active ? null : item.id)}>
                    <span className="text-[13px] font-exo flex-1" style={{ fontWeight: active ? 600 : 400 }}>
                      {item.label}
                    </span>
                    {item.count > 0 && (
                      <span className="text-[10px] font-bold font-exo px-1.5 py-[1px] rounded-full"
                        style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                        {item.count}
                      </span>
                    )}
                  </TreeItem>
                )
              })}
            </TreeList>

         
            {activeReminder && (() => {
              const bucket = reminderBuckets[activeReminder as keyof typeof reminderBuckets] ?? []
              if (bucket.length === 0) return (
                <p className="ml-6 mb-2 px-2 text-[11px] font-exo italic" style={{ color: T.countText }}>
                  No tasks
                </p>
              )
              return (
                <div className="ml-6 mb-2 space-y-1">
                  {bucket.map(task => (
                    <button key={task.id}
                      onClick={() => dispatch(setActiveTaskFilter(task.status))}
                      className="w-full text-left px-2.5 py-2 rounded-lg outline-none transition-all"
                      style={{ border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f0f0f5'}` }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = T.rowHoverBg)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <p className="text-[11px] font-semibold font-exo truncate" style={{ color: T.activeText }}>
                        {task.title}
                      </p>
                      <p className="text-[10px] font-exo mt-0.5" style={{ color: T.countText }}>
                        Due: {task.dueDate}
                      </p>
                    </button>
                  ))}
                </div>
              )
            })()}
          </>
        )}

    
        <button
          onClick={() => setMessengersOpen(v => !v)}
          className="w-full flex items-center justify-between px-2 py-[9px] rounded-lg text-[13px] font-bold font-exo outline-none transition-all duration-150"
          style={{ color: T.sectionLabel }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = T.rowHoverBg)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span>Messengers</span>
          <div className="flex items-center gap-1.5">
            {totalUnread > 0 && (
              <span className="text-[10px] font-bold font-exo px-1.5 py-[1px] rounded-full"
                style={{ backgroundColor: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
                {totalUnread}
              </span>
            )}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke={T.chevron} strokeWidth="2.5" strokeLinecap="round"
              style={{ transform: messengersOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform .2s ease' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </button>

        {messengersOpen && (
          <>
            <TreeList T={T}>
              {MESSENGER_SECTIONS.map(section => {
                const unread = section.items.filter(m => !m.read && !readIds.has(m.id)).length
                const active = activeMessenger === section.id
                return (
                  <TreeItem key={section.id} active={active} T={T}
                    onClick={() => setActiveMessenger(active ? null : section.id)}>
                    <span className="text-[13px] font-exo flex-1" style={{ fontWeight: active ? 600 : 400 }}>
                      {section.label}
                    </span>
                    {unread > 0 && (
                      <span className="text-[10px] font-bold font-exo px-1.5 py-[1px] rounded-full"
                        style={{ backgroundColor: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
                        {unread}
                      </span>
                    )}
                  </TreeItem>
                )
              })}
            </TreeList>

          
            {activeMessenger && (() => {
              const section = MESSENGER_SECTIONS.find(s => s.id === activeMessenger)
              if (!section) return null
              return (
                <div className="ml-3 mb-2 space-y-px">
                  {section.items.map(msg => {
                    const isRead = msg.read || readIds.has(msg.id)
                    return (
                      <button
                        key={msg.id}
                        onClick={() => markRead(msg.id)}
                        className="w-full text-left px-2.5 py-2 rounded-lg outline-none transition-all"
                        style={{
                          backgroundColor: !isRead
                            ? (dark ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.04)')
                            : 'transparent',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = T.rowHoverBg)}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = !isRead
                          ? (dark ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.04)')
                          : 'transparent'
                        )}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className="text-[11px] font-exo truncate"
                            style={{ color: isRead ? T.countText : T.activeText, fontWeight: isRead ? 400 : 600 }}
                          >
                            {msg.from}
                          </span>
                          <span className="text-[9px] font-exo flex-shrink-0" style={{ color: T.countText }}>
                            {msg.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {!isRead && (
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-indigo-500"/>
                          )}
                          <p className="text-[10px] font-exo truncate"
                            style={{ color: isRead ? T.countText : T.rowText }}>
                            {msg.text}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )
            })()}
          </>
        )}
      </nav>

   
      <div className="px-4 py-[14px] flex-shrink-0"
        style={{ borderTop: `1px solid ${T.divider}` }}>
        <div className="flex items-center rounded-xl p-[3px] gap-[3px]"
          style={{ backgroundColor: T.trackBg }}>
          <button
            onClick={() => dispatch(setTheme('light'))}
            className="flex-1 flex items-center justify-center gap-[5px] py-[7px] rounded-[10px] text-[12px] font-medium font-exo outline-none transition-all duration-200"
            style={!dark
              ? { backgroundColor: T.pillBg, color: T.pillText, boxShadow: T.pillShadow }
              : { color: T.inactiveText }
            }
          >
            <SunIcon color={!dark ? T.pillText : T.inactiveText} />
            <span>Light</span>
          </button>
          <button
            onClick={() => dispatch(setTheme('dark'))}
            className="flex-1 flex items-center justify-center gap-[5px] py-[7px] rounded-[10px] text-[12px] font-medium font-exo outline-none transition-all duration-200"
            style={dark
              ? { backgroundColor: 'rgba(255,255,255,0.12)', color: '#ffffff' }
              : { color: T.inactiveText }
            }
          >
            <MoonIcon color={dark ? '#ffffff' : T.inactiveText} />
            <span>Dark</span>
          </button>
        </div>
      </div>
    </aside>
  )
}