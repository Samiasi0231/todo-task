'use client'
import React from 'react'
import { TK } from './Tokens'

// ── TreeList ──────────────────────────────────────────────────────────────────
export function TreeList({ children, T }: { children: React.ReactNode; T: TK }) {
  return (
    <div className="relative ml-3 mt-0.5 mb-2">
      <span className="absolute left-0 top-1 bottom-1 w-px"
        style={{ backgroundColor: T.connectorLine }} />
      <ul className="space-y-px pl-3">
        {children}
      </ul>
    </div>
  )
}

// ── TreeItem ──────────────────────────────────────────────────────────────────
export function TreeItem({
  children, active, T, onClick,
}: {
  children: React.ReactNode; active: boolean; T: TK; onClick: () => void
}) {
  return (
    <li className="relative">
      <span className="absolute pointer-events-none"
        style={{
          left: '-12px', top: '50%', transform: 'translateY(-50%)',
          width: '10px', height: '1px', backgroundColor: T.connectorLine,
        }}
      />
      <button
        onClick={onClick}
        className="w-full flex items-center gap-2 text-left rounded-lg px-2 py-[7px] transition-all duration-150 outline-none relative"
        style={{
          backgroundColor: active ? T.activeBg  : 'transparent',
          color:           active ? T.activeText : T.rowText,
        }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.backgroundColor = T.rowHoverBg
            e.currentTarget.style.color           = T.rowHoverText
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color           = T.rowText
          }
        }}
      >
        {active && (
          <span className="absolute -left-3 top-1 bottom-1 w-[3px] rounded-r-full"
            style={{ backgroundColor: T.accentBar }} />
        )}
        {children}
      </button>
    </li>
  )
}

// ── SectionHead — optional badge for unread/urgent counts ────────────────────
export function SectionHead({ label, open, onToggle, T, badge, badgeColor }: {
  label: string; open: boolean; onToggle: () => void; T: TK
  badge?: number; badgeColor?: string
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-2 py-[9px] rounded-lg text-[13px] font-bold font-exo outline-none transition-all duration-150"
      style={{ color: T.sectionLabel }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = T.rowHoverBg)}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <span>{label}</span>
      <div className="flex items-center gap-1.5">
        {badge != null && badge > 0 && badgeColor && (
          <span
            className="text-[10px] font-bold font-exo px-1.5 py-[1px] rounded-full"
            style={{ backgroundColor: `${badgeColor}20`, color: badgeColor }}
          >
            {badge}
          </span>
        )}
        <svg
          width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke={T.chevron} strokeWidth="2.5" strokeLinecap="round"
          style={{
            transform:  open ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform .2s ease',
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </button>
  )
}

// ── PlainRow ──────────────────────────────────────────────────────────────────
export function PlainRow({ label, T }: { label: string; T: TK }) {
  return (
    <button
      className="w-full flex items-center justify-between px-2 py-[9px] rounded-lg text-[13px] font-medium font-exo outline-none transition-all duration-150"
      style={{ color: T.rowText }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = T.rowHoverBg
        e.currentTarget.style.color           = T.rowHoverText
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'transparent'
        e.currentTarget.style.color           = T.rowText
      }}
    >
      <span>{label}</span>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ opacity: 0.45 }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────
export function SunIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"    x2="12" y2="3"/>
      <line x1="12" y1="21"   x2="12" y2="23"/>
      <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1"  y1="12" x2="3"  y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
    </svg>
  )
}

export function MoonIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}