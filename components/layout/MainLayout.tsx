'use client'

import dynamic from 'next/dynamic'
import { useAppSelector } from '@/hooks/useTypedRedux'
import IconStrip from './IconStrip'
import Sidebar   from './Sidebar'
import Header    from './Header'
import BoardView from '@/components/board/BoardView'
import { AddTaskModal, NewTemplateModal } from '@/components/board/AddTaskModal'

const Scene3D = dynamic(() => import('@/components/three/Scene3D'), { ssr: false })

export default function MainLayout() {
  const theme = useAppSelector(s => s.ui.theme)
  const dark  = theme === 'dark'

  const outerBg = dark ? '#0f111a' : '#f0f0f5'

  return (
    <div
      className="h-screen w-screen overflow-hidden font-exo"
      style={{
        display:             'grid',
        gridTemplateColumns: '48px 318px 1fr',
        gridTemplateRows:    '100dvh',
        backgroundColor:     outerBg,
        transition:          'background-color 0.2s ease',
      }}
    >
      {/* ── Col 1: Icon strip — always dark, no border ── */}
      <div className="h-full overflow-hidden">
        <IconStrip />
      </div>

      {/* ── Col 2: Sidebar — bg handles separation, no extra border ── */}
      <div className="h-full overflow-hidden">
        <Sidebar />
      </div>

      {/* ── Col 3: Main content ── */}
      <div
        className="relative h-full overflow-hidden flex flex-col"
        style={{ backgroundColor: outerBg, transition: 'background-color 0.2s ease' }}
      >
        {/* Ambient 3D background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ opacity: dark ? 0.5 : 0.35 }}
          aria-hidden="true"
        >
          <Scene3D />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full overflow-hidden">
          <Header />
          <main className="flex-1 min-h-0 overflow-hidden">
            <BoardView />
          </main>
        </div>
      </div>

      {/* Global modals */}
      <AddTaskModal />
      <NewTemplateModal />
    </div>
  )
}