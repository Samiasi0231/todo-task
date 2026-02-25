'use client'

import { ASSIGNEES } from '@/lib/initialData'

interface Props { assigneeIds: string[]; max?: number; dark?: boolean }

export default function AvatarStack({ assigneeIds, max = 2, dark = false }: Props) {
  if (assigneeIds.length === 0) return null

  const visible  = assigneeIds.slice(0, max)
  const overflow = assigneeIds.length - visible.length
  const borderC  = dark ? '#1e2035' : '#ffffff'

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visible.map(id => {
          const a = ASSIGNEES.find(x => x.id === id)
          if (!a) return null
          return (
            <div key={id} title={a.name}
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold font-exo text-white shadow-sm text-[9px]"
              style={{ backgroundColor: a.color, borderColor: borderC }}>
              {a.initials[0]}
            </div>
          )
        })}
      </div>
      {overflow > 0 && (
        <span className="ml-1 text-[11px] font-semibold font-exo"
          style={{ color: dark ? '#6b7280' : '#9ca3af' }}>
          +{overflow}
        </span>
      )}
    </div>
  )
}