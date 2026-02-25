'use client'

import { useState } from 'react'

const NAV_ITEMS = [
  {
    id: 'grid', label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    id: 'user', label: 'Profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    id: 'calendar', label: 'Calendar',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    id: 'file', label: 'Documents',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'layers', label: 'Projects',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
  },
  {
    id: 'book', label: 'Notes',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    id: 'activity', label: 'Analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
]

export default function IconStrip() {
  const [active, setActive] = useState('grid')

  return (
    <div
      className="flex flex-col items-center w-full h-full py-4 flex-shrink-0"
      style={{ backgroundColor: '#13152a' }}
    >
      
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center mb-6 flex-shrink-0"
        style={{ color: '#FFFFFF' }}>
         <svg width="14" height="4" viewBox="0 0 14 4" fill="currentColor">
              <circle cx="1.5" cy="2" r="1.5"/>
              <circle cx="7"   cy="2" r="1.5"/>
              <circle cx="12.5" cy="2" r="1.5"/>
            </svg>
      </div>

     
      <nav className="flex flex-col items-center gap-1 flex-1 w-full px-1.5">
        {NAV_ITEMS.map(({ id, label, icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              title={label}
              onClick={() => setActive(id)}
              className="w-full h-9 rounded-xl flex items-center justify-center transition-all duration-150 outline-none"
              style={{
                color:           isActive ? '#ffffff'                    : '#4a4e6a',
                backgroundColor: isActive ? 'rgba(255,255,255,0.10)'    : 'transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.color           = '#9ca3af'
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.color           = '#4a4e6a'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {icon}
            </button>
          )
        })}
      </nav>

    
      <button
        title="Sign out"
        className="w-9 h-9 rounded-xl flex items-center justify-center outline-none flex-shrink-0 transition-all duration-150"
        style={{ color: '#4a4e6a' }}
        onMouseEnter={e => {
          e.currentTarget.style.color           = '#9ca3af'
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color           = '#4a4e6a'
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </div>
  )
}