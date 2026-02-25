'use client'

import { useState, useRef, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useTypedRedux'
import { setViewMode, toggleCalendar, openNewTemplate, setSearchQuery } from '@/store/uiSlice'
import Image from "next/image";

type ViewMode = 'board' | 'list' | 'calendar' | 'timeline'
type SortOption = 'None' | 'Due date' | 'Priority' | 'Name' | 'Created'

const VIEW_OPTIONS: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
  {
    mode: 'list',
    label: 'List view',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    mode: 'calendar',
    label: 'Calendar view',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    mode: 'timeline',
    label: 'Timeline view',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <polyline points="8 8 3 12 8 16" />
        <polyline points="16 8 21 12 16 16" />
      </svg>
    ),
  },
]

const SORT_OPTIONS: SortOption[] = ['None', 'Due date', 'Priority', 'Name', 'Created']

const THREE_DOT_ACTIONS = [
  {
    label: 'Rename board',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    danger: false,
  },
  {
    label: 'Duplicate board',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    ),
    danger: false,
  },
  {
    label: 'Copy link',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    danger: false,
  },
  { divider: true, label: '', icon: null, danger: false },
  {
    label: 'Archive board',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
    danger: false,
  },
  {
    label: 'Delete board',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4h6v2" />
      </svg>
    ),
    danger: true,
  },
]

export default function Header() {
  const dispatch = useAppDispatch()
  const { theme, viewMode, searchQuery } = useAppSelector((s) => s.ui)
  const tasks = useAppSelector((s) => s.tasks.tasks)
  const dark = theme === 'dark'

  const [searchOpen,   setSearchOpen]   = useState(false)
  const [filterOpen,   setFilterOpen]   = useState(false)
  const [sortOpen,     setSortOpen]     = useState(false)
  const [addViewOpen,  setAddViewOpen]  = useState(false)
  const [threeDotOpen, setThreeDotOpen] = useState(false)
  const [activeSort,   setActiveSort]   = useState<SortOption>('None')
  const [activeViews,  setActiveViews]  = useState<ViewMode[]>([])
  // local mirror — avoids depending on store type for active tab highlight
  const [currentView,  setCurrentView]  = useState<ViewMode>('board')

  const threeDotRef = useRef<HTMLDivElement>(null)

  // close three-dot on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (threeDotRef.current && !threeDotRef.current.contains(e.target as Node))
        setThreeDotOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const closeAll = () => {
    setFilterOpen(false); setSortOpen(false); setAddViewOpen(false); setThreeDotOpen(false)
  }

  const switchView = (mode: ViewMode) => {
    setCurrentView(mode)
    dispatch(setViewMode(mode as any))
  }

  const handleAddView = (mode: ViewMode) => {
    if (!activeViews.includes(mode)) setActiveViews(prev => [...prev, mode])
    switchView(mode)
    setAddViewOpen(false)
  }

  const handleRemoveView = (mode: ViewMode, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveViews(prev => prev.filter(v => v !== mode))
    if (currentView === mode) switchView('board')
  }

  const handleSort = (opt: SortOption) => {
    setActiveSort(opt)
    setSortOpen(false)
    // dispatch(setSortBy(opt)) — wire up when store supports it
  }

  // ── Colours ──────────────────────────────────────────────
  const bg           = dark ? '#1e2035' : '#ffffff'
  const border       = dark ? 'rgba(255,255,255,0.06)' : '#f0f0f5'
  const titleC       = dark ? '#ffffff' : '#111827'
  const iconC        = dark ? '#9ca3af' : '#9ca3af'
  const iconHBg      = dark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'
  const iconHC       = dark ? '#ffffff' : '#374151'
  const tabAC        = dark ? '#ffffff' : '#111827'
  const tabIC        = dark ? '#6b7280' : '#9ca3af'
  const actionC      = dark ? '#9ca3af' : '#6b7280'
  const actionHBg    = dark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'
  const dropBg       = dark ? '#1e2035' : '#ffffff'
  const dropBorder   = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
  const dropItemC    = dark ? '#d1d5db' : '#374151'
  const dropHoverBg  = dark ? 'rgba(255,255,255,0.05)' : '#f9fafb'
  const dividerC     = dark ? 'rgba(255,255,255,0.06)' : '#f0f0f5'

  const dropdownStyle = {
    backgroundColor: dropBg,
    boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
    border: `1px solid ${dropBorder}`,
  }

  return (
    <header
      className="flex-shrink-0 transition-colors duration-200 px-6"
      style={{ backgroundColor: bg, borderBottom: `1px solid ${border}` }}
    >
      {/* ── Top row ── */}
      <div className="flex items-center justify-between h-[54px]">
        <h2 className="text-[16px] font-bold font-exo tracking-tight" style={{ color: titleC }}>
          Welcome back, Vincent <span>👋</span>
        </h2>

        <div className="flex items-center gap-1">
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={searchQuery}
                onChange={e => dispatch(setSearchQuery(e.target.value))}
                placeholder="Search tasks…"
                className="text-[12px] font-exo px-3 py-1.5 rounded-lg border outline-none w-44 transition-all"
                style={{
                  backgroundColor: dark ? 'rgba(255,255,255,0.06)' : '#f9fafb',
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : '#e5e7eb'}`,
                  color: dark ? '#ffffff' : '#111827',
                }}
              />
              <button onClick={() => { setSearchOpen(false); dispatch(setSearchQuery('')) }}
                className="text-[11px] font-exo transition-colors" style={{ color: actionC }}>✕</button>
            </div>
          ) : (
            <IBtn title="Search" dark={dark} iconC={iconC} iconHBg={iconHBg} iconHC={iconHC} onClick={() => setSearchOpen(true)}>
              <Image src="/icons/search-icon (1).svg" alt="Search" width={15} height={15} />
            </IBtn>
          )}

          <div className="relative">
            <IBtn title="Notifications" dark={dark} iconC={iconC} iconHBg={iconHBg} iconHC={iconHC}>
              <Image src="/icons/notification-icon.svg" alt="notifications" width={15} height={15} />
            </IBtn>
            <span className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full bg-red-500 border-[1.5px] pointer-events-none"
              style={{ borderColor: bg }} />
          </div>

          <button onClick={() => dispatch(toggleCalendar())}
            className="flex items-center gap-1.5 px-2.5 py-[7px] text-[11px] font-medium font-exo"
            style={{ color: actionC }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            19 May 2022
          </button>

          <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm flex-shrink-0">
            <Image src="/images/asi-pic.jpeg" alt="User Avatar" width={32} height={32} className="object-cover w-full" />
          </div>
        </div>
      </div>

      {/* ── Tabs + Actions row ── */}
      <div className="flex items-center justify-between">

        {/* Tabs */}
        <div className="flex items-center">

          {/* ① Board view — always visible, active state driven by currentView */}
          <TabBtn
            label="Board view"
            active={currentView === 'board'}
            activeC={tabAC}
            inactiveC={tabIC}
            onClick={() => { closeAll(); switchView('board') }}
            icon={
              <div className="w-3 h-3 relative">
      <Image
        src="/icons/broadView.svg" 
        alt="Board view"
        fill
        className="object-contain"
      />
    </div>
            }
          />

          {/* ② Dynamically added views — each has a hover-reveal ✕ */}
          {activeViews.map(mode => {
            const meta = VIEW_OPTIONS.find(v => v.mode === mode)!
            return (
              <div key={mode} className="relative flex items-center group">
                <button
                  onClick={() => { closeAll(); switchView(mode) }}
                  className="flex items-center gap-1.5 pl-3 pr-7 py-2.5 text-[12px] font-medium font-exo transition-all border-b-2 outline-none"
                  style={{
                    color: currentView === mode ? tabAC : tabIC,
                    borderColor: currentView === mode ? tabAC : 'transparent',
                  }}
                >
                  <span style={{ opacity: 0.7 }}>{meta.icon}</span>
                  {meta.label}
                </button>
                {/* ✕ remove — appears on hover */}
                <button
                  onClick={(e) => handleRemoveView(mode, e)}
                  title={`Remove ${meta.label}`}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] leading-none"
                  style={{ color: tabIC }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={e => (e.currentTarget.style.color = tabIC)}
                >✕</button>
              </div>
            )
          })}

          {/* ③ Add view */}
          <div className="relative">
            <TabBtn
              label="Add view"
              active={addViewOpen}
              activeC="#6366f1"
              inactiveC={tabIC}
              onClick={() => { setFilterOpen(false); setSortOpen(false); setThreeDotOpen(false); setAddViewOpen(v => !v) }}
              icon={
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              }
            />
            {addViewOpen && (
              <div className="absolute left-0 top-10 z-30 w-48 rounded-xl py-1.5" style={dropdownStyle}>
                <p className="px-3 pt-1 pb-2 text-[10px] font-semibold font-exo uppercase tracking-widest"
                  style={{ color: dark ? '#4b5563' : '#9ca3af' }}>Add a view</p>
                {VIEW_OPTIONS.filter(v => !activeViews.includes(v.mode)).length === 0 ? (
                  <p className="px-3 py-2 text-[12px] font-exo" style={{ color: dark ? '#6b7280' : '#9ca3af' }}>
                    All views added
                  </p>
                ) : (
                  VIEW_OPTIONS.filter(v => !activeViews.includes(v.mode)).map(v => (
                    <button key={v.mode} onClick={() => handleAddView(v.mode)}
                      className="w-full flex items-center gap-2.5 text-left px-3 py-2 text-[12px] font-exo transition-colors"
                      style={{ color: dropItemC }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = dropHoverBg)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      <span style={{ opacity: 0.6 }}>{v.icon}</span>{v.label}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 pb-0.5">

          {/* Filter */}
          <div className="relative">
            <ABtn label="Filter" active={filterOpen} actionC={actionC} actionHBg={actionHBg}
              onClick={() => { setSortOpen(false); setAddViewOpen(false); setThreeDotOpen(false); setFilterOpen(v => !v) }}
              icon={
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              }
            />
            {filterOpen && (
              <div className="absolute right-0 top-9 z-30 w-44 rounded-xl py-1.5" style={dropdownStyle}>
                {['All priorities', 'High', 'Medium', 'Low'].map(f => (
                  <button key={f} onClick={() => setFilterOpen(false)}
                    className="w-full text-left px-3 py-2 text-[12px] font-exo transition-colors"
                    style={{ color: dropItemC }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = dropHoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>{f}</button>
                ))}
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <ABtn
              label={activeSort !== 'None' ? `Sort: ${activeSort}` : 'Sort'}
              active={sortOpen || activeSort !== 'None'}
              actionC={actionC} actionHBg={actionHBg}
              onClick={() => { setFilterOpen(false); setAddViewOpen(false); setThreeDotOpen(false); setSortOpen(v => !v) }}
              icon={
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
                </svg>
              }
            />
            {sortOpen && (
              <div className="absolute right-0 top-9 z-30 w-44 rounded-xl py-1.5" style={dropdownStyle}>
                <p className="px-3 pt-1 pb-2 text-[10px] font-semibold font-exo uppercase tracking-widest"
                  style={{ color: dark ? '#4b5563' : '#9ca3af' }}>Sort by</p>
                {SORT_OPTIONS.map(opt => (
                  <button key={opt} onClick={() => handleSort(opt)}
                    className="w-full flex items-center justify-between text-left px-3 py-2 text-[12px] font-exo transition-colors"
                    style={{ color: dropItemC }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = dropHoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    {opt}
                    {activeSort === opt && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ④ Three dot — now has a real dropdown */}
          <div className="relative" ref={threeDotRef}>
            <button
              onClick={() => { setFilterOpen(false); setSortOpen(false); setAddViewOpen(false); setThreeDotOpen(v => !v) }}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
              style={{
                color: threeDotOpen ? iconHC : actionC,
                backgroundColor: threeDotOpen ? actionHBg : 'transparent',
              }}
              onMouseEnter={e => { if (!threeDotOpen) { e.currentTarget.style.backgroundColor = actionHBg; e.currentTarget.style.color = iconHC } }}
              onMouseLeave={e => { if (!threeDotOpen) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = actionC } }}
            >
              <img src="/icons/menu-dots.svg" alt="menu" className="w-[16px] h-[16px]" />
            </button>

            {threeDotOpen && (
              <div className="absolute right-0 top-9 z-30 w-48 rounded-xl py-1.5" style={dropdownStyle}>
                {THREE_DOT_ACTIONS.map((item, i) =>
                  item.divider ? (
                    <div key={`div-${i}`} className="my-1 mx-3" style={{ borderTop: `1px solid ${dividerC}` }} />
                  ) : (
                    <button key={item.label} onClick={() => setThreeDotOpen(false)}
                      className="w-full flex items-center gap-2.5 text-left px-3 py-2 text-[12px] font-exo transition-colors"
                      style={{ color: item.danger ? (dark ? '#f87171' : '#dc2626') : dropItemC }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = item.danger ? (dark ? 'rgba(239,68,68,0.08)' : 'rgba(220,38,38,0.06)') : dropHoverBg)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      <span style={{ opacity: item.danger ? 1 : 0.6 }}>{item.icon}</span>
                      {item.label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* New template CTA */}
          <button onClick={() => dispatch(openNewTemplate())}
            className="flex items-center gap-1.5 ml-1 px-3 md:px-[14px] py-1.5 md:py-[5px] rounded-xl text-[#FFFFFF] text-[11px] md:text-[14px] font-semibold font-exo  active:scale-95 whitespace-nowrap"
            style={{ backgroundColor: '#1a1d2e' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#252840')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1a1d2e')}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New template
          </button>
        </div>
      </div>
    </header>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function IBtn({ children, title, dark, iconC, iconHBg, iconHC, onClick }: {
  children: React.ReactNode; title?: string; dark: boolean
  iconC: string; iconHBg: string; iconHC: string; onClick?: () => void
}) {
  return (
    <button title={title} onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 outline-none"
      style={{ color: iconC }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = iconHBg; e.currentTarget.style.color = iconHC }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = iconC }}>
      {children}
    </button>
  )
}

function TabBtn({ label, active, activeC, inactiveC, onClick, icon }: {
  label: string; active: boolean; activeC: string; inactiveC: string
  onClick: () => void; icon: React.ReactNode
}) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-medium font-exo transition-all border-b-2 outline-none"
      style={{ color: active ? activeC : inactiveC, borderColor: active ? activeC : 'transparent' }}>
      <span style={{ opacity: 0.7 }}>{icon}</span>
      {label}
    </button>
  )
}

function ABtn({ label, icon, actionC, actionHBg, onClick, active }: {
  label: string; icon: React.ReactNode; actionC: string; actionHBg: string
  onClick: () => void; active?: boolean
}) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-[6px] rounded-lg text-[12px] font-medium font-exo transition-all duration-150 outline-none"
      style={{ color: active ? '#6366f1' : actionC, backgroundColor: active ? 'rgba(99,102,241,0.08)' : 'transparent' }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = actionHBg }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}>
      {icon}{label}
    </button>
  )
}