'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useAppDispatch, useAppSelector } from '@/hooks/useTypedRedux'
import { setActiveTaskFilter, setTheme } from '@/store/uiSlice'
import { useRouter } from 'next/navigation'
import IconStrip from './IconStrip'
import Sidebar   from './Sidebar'
import Header    from './Header'
import BoardView from '@/components/board/BoardView'
import { AddTaskModal, NewTemplateModal } from '@/components/board/AddTaskModal'

const Scene3D = dynamic(() => import('@/components/three/Scene3D'), { ssr: false })

export default function MainLayout() {
  const dispatch = useAppDispatch()
  const router   = useRouter()
  const theme    = useAppSelector(s => s.ui.theme)
  const { activeTaskFilter } = useAppSelector(s => s.ui)
  const tasks    = useAppSelector(s => s.tasks.tasks)
  const user     = useAppSelector(s => s.auth.user)
  const dark     = theme === 'dark'
  const outerBg  = dark ? '#0f111a' : '#f0f0f5'

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const counts = {
    todo:       tasks.filter(t => t.status === 'todo').length,
    inprogress: tasks.filter(t => t.status === 'inprogress').length,
    done:       tasks.filter(t => t.status === 'done').length,
  }


  const headerBg  = dark ? '#13152a' : '#ffffff'
  const textH     = dark ? '#ffffff' : '#111827'
  const textM     = dark ? '#9ca3af' : '#6b7280'
  const divider   = dark ? 'rgba(255,255,255,0.07)' : '#ebebf0'
  const drawerBg  = dark ? '#13152a' : '#ffffff'

  return (
    <>

      <div
        className="hidden md:grid h-screen w-screen overflow-hidden font-exo"
        style={{
          gridTemplateColumns: '48px 318px 1fr',
          gridTemplateRows:    '100dvh',
          backgroundColor:     outerBg,
          transition:          'background-color 0.2s ease',
        }}
      >
        <div className="h-full overflow-hidden"><IconStrip /></div>
        <div className="h-full overflow-hidden"><Sidebar /></div>

        <div className="relative h-full overflow-hidden flex flex-col"
          style={{ backgroundColor: outerBg, transition: 'background-color 0.2s ease' }}>
          <div className="absolute inset-0 z-0 pointer-events-none"
            style={{ opacity: dark ? 0.5 : 0.35 }} aria-hidden="true">
            <Scene3D />
          </div>
          <div className="relative z-10 flex flex-col h-full overflow-hidden">
            <Header />
            <main className="flex-1 min-h-0 overflow-hidden"><BoardView /></main>
          </div>
        </div>

        <AddTaskModal />
        <NewTemplateModal />
      </div>

     
      <div className="flex md:hidden flex-col h-screen w-screen overflow-hidden font-exo"
        style={{ backgroundColor: outerBg }}>

       
        <div className="flex-shrink-0 flex items-center justify-between px-4 h-14 z-20"
          style={{ backgroundColor: headerBg, borderBottom: `1px solid ${divider}` }}>

         
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl outline-none transition-all"
            style={{ backgroundColor: dark ? 'rgba(255,255,255,0.07)' : '#f3f4f6', color: textH }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#4f52cc' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white"
                strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
            <span className="font-black text-[15px]" style={{ color: textH }}>TaskFlow</span>
          </div>
          {user ? (
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-[12px]"
              style={{ backgroundColor: '#4f52cc' }}>
              {user.initials}
            </div>
          ) : <div className="w-8" />}
        </div>

        <div className="flex-1 min-h-0 overflow-hidden relative">
          <div className="absolute inset-0 z-0 pointer-events-none"
            style={{ opacity: dark ? 0.4 : 0.25 }} aria-hidden="true">
            <Scene3D />
          </div>
          <div className="relative z-10 h-full overflow-hidden">
            <BoardView mobile />
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center z-20"
          style={{ backgroundColor: headerBg, borderTop: `1px solid ${divider}`, paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {([
            { id: 'todo',       label: 'To do',    count: counts.todo,       emoji: '⭕' },
            { id: 'inprogress', label: 'In progress', count: counts.inprogress, emoji: '🔄' },
            { id: 'done',       label: 'Done',     count: counts.done,       emoji: '✅' },
          ] as const).map(tab => {
            const active = activeTaskFilter === tab.id || (activeTaskFilter === 'all' && tab.id === 'todo')
            return (
              <button
                key={tab.id}
                onClick={() => dispatch(setActiveTaskFilter(tab.id))}
                className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 outline-none transition-all"
                style={{ color: active ? '#6366f1' : textM }}
              >
                <span className="text-base leading-none">{tab.emoji}</span>
                <span className="text-[10px] font-semibold font-exo leading-none">{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className="text-[9px] font-bold font-exo px-1.5 rounded-full leading-[14px]"
                    style={{
                      backgroundColor: active ? 'rgba(99,102,241,0.15)' : (dark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'),
                      color: active ? '#6366f1' : textM,
                    }}
                  >
                    {tab.count}
                  </span>
                )}
                {active && (
                  <span className="absolute bottom-0 w-6 h-[2px] rounded-full bg-indigo-500 translate-y-0"/>
                )}
              </button>
            )
          })}
        </div>

      
        {sidebarOpen && (
          <>
  
            <div
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-[2px]"
              onClick={() => setSidebarOpen(false)}
            />
          
            <div
              className="fixed top-0 left-0 bottom-0 z-40 w-[300px] overflow-hidden animate-slide-up flex flex-col"
              style={{
                backgroundColor: drawerBg,
                boxShadow: '4px 0 32px rgba(0,0,0,0.25)',
               
                animation: 'slideInLeft 0.22s ease-out',
              }}
            >
            
              <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
                style={{ borderBottom: `1px solid ${divider}` }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#4f52cc' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white"
                      strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                      <polyline points="2 17 12 22 22 17"/>
                      <polyline points="2 12 12 17 22 12"/>
                    </svg>
                  </div>
                  <span className="font-black text-[15px]" style={{ color: textH }}>Menu</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl outline-none"
                  style={{ color: textM, backgroundColor: dark ? 'rgba(255,255,255,0.06)' : '#f3f4f6' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6"  y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

            
              <div className="flex-1 overflow-hidden">
                <Sidebar onNavigate={() => setSidebarOpen(false)} />
              </div>
            </div>
          </>
        )}

      
        <AddTaskModal />
        <NewTemplateModal />
      </div>

    
      <style jsx global>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0.6; }
          to   { transform: translateX(0);     opacity: 1;   }
        }
      `}</style>
    </>
  )
}