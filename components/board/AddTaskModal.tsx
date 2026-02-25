'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useTypedRedux'
import { addTask, updateTask } from '@/store/tasksSlice'
import { closeTaskModal, closeNewTemplate } from '@/store/uiSlice'
import { TaskStatus } from '@/types'
import { ASSIGNEES } from '@/lib/initialData'

type Mode = 'task' | 'template'

// ✅ Explicitly typed so `value` is TaskStatus, not string
const STATUS_OPTS: { value: TaskStatus; label: string }[] = [
  { value: 'todo',       label: 'To Do'       },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'done',       label: 'Done'        },
]

const BLANK = {
  title:       '',
  subtitle:    '',
  status:      'todo' as TaskStatus,
  progress:    0,
  maxProgress: 10,
  dueDate:     '',
  assignees:   [] as string[],
  comments:    0,
  attachments: 0,
}

function ModalBody({ mode }: { mode: Mode }) {
  const dispatch = useAppDispatch()
  const {
    isAddTaskModalOpen, addTaskTargetStatus,
    editingTaskId, isNewTemplateOpen, theme,
  } = useAppSelector(s => s.ui)
  const tasks = useAppSelector(s => s.tasks.tasks)
  const dark  = theme === 'dark'

  const isOpen   = mode === 'task' ? isAddTaskModalOpen : isNewTemplateOpen
  const editTask = editingTaskId ? tasks.find(t => t.id === editingTaskId) : null
  const isEdit   = !!editTask

  const [form, setForm] = useState({ ...BLANK })
  const [errs, setErrs] = useState<Record<string, string>>({})

  // Populate form when modal opens — either edit data or fresh blank
  useEffect(() => {
    if (!isOpen) return
    if (isEdit && editTask) {
      setForm({
        title:       editTask.title,
        subtitle:    editTask.subtitle,
        status:      editTask.status,
        progress:    editTask.progress,
        maxProgress: editTask.maxProgress,
        dueDate:     editTask.dueDate,
        assignees:   [...editTask.assignees],
        comments:    editTask.comments,
        attachments: editTask.attachments,
      })
    } else {
      setForm({
        ...BLANK,
        status: mode === 'task' ? addTaskTargetStatus : 'todo',
      })
    }
    setErrs({})
  }, [isOpen, editingTaskId]) // eslint-disable-line react-hooks/exhaustive-deps

  const close = useCallback(() => {
    mode === 'task' ? dispatch(closeTaskModal()) : dispatch(closeNewTemplate())
  }, [dispatch, mode])

  if (!isOpen) return null

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.title.trim())   e.title   = 'Title is required'
    if (!form.dueDate.trim()) e.dueDate = 'Due date is required'
    if (form.maxProgress < 1) e.max     = 'Must be ≥ 1'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length) { setErrs(v); return }

    if (isEdit && editTask) {
      dispatch(updateTask({ id: editTask.id, updates: form }))
    } else {
      dispatch(addTask(form))
    }
    close()
  }

  const toggleAssignee = (id: string) =>
    setForm(p => ({
      ...p,
      assignees: p.assignees.includes(id)
        ? p.assignees.filter(a => a !== id)
        : [...p.assignees, id],
    }))

  // ── Design tokens ──────────────────────────────────────
  const bg       = dark ? '#1e2035' : '#ffffff'
  const border   = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
  const textH    = dark ? '#ffffff' : '#111827'
  const textM    = dark ? '#9ca3af' : '#6b7280'
  const divider  = dark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'
  const inputBg  = dark ? 'rgba(255,255,255,0.05)' : '#f9fafb'
  const inputBd  = dark ? 'rgba(255,255,255,0.10)' : '#e5e7eb'
  const inputC   = dark ? '#ffffff' : '#111827'
  const closeHBg = dark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[3px] animate-fade-in"
        onClick={close}
      />

      {/* Sheet */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-[440px] rounded-2xl pointer-events-auto animate-slide-up overflow-hidden"
          style={{
            backgroundColor: bg,
            boxShadow: '0 24px 72px rgba(0,0,0,0.22)',
            border: `1px solid ${border}`,
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4"
            style={{ borderBottom: `1px solid ${divider}` }}>
            <div>
              <h2 className="text-[15px] font-bold font-exo" style={{ color: textH }}>
                {mode === 'template' ? '📋  New Template' : isEdit ? '✏️  Edit Task' : '➕  New Task'}
              </h2>
              {mode === 'template' && (
                <p className="text-[11px] font-exo mt-0.5" style={{ color: textM }}>
                  Save as a reusable task template
                </p>
              )}
            </div>
            <button
              onClick={close}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all outline-none"
              style={{ color: textM }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = closeHBg }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">

            <FField label="Task title" error={errs.title} required textM={textM}>
              <input
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Design landing page"
                className="w-full px-3 py-2 text-[13px] font-exo rounded-lg outline-none transition-all"
                style={{
                  backgroundColor: inputBg,
                  border: `1px solid ${errs.title ? '#ef4444' : inputBd}`,
                  color: inputC,
                }}
                onFocus={e => (e.target.style.borderColor = errs.title ? '#ef4444' : '#6366f1')}
                onBlur={e  => (e.target.style.borderColor = errs.title ? '#ef4444' : inputBd)}
              />
            </FField>

            <FField label="Subtitle / project" textM={textM}>
              <input
                value={form.subtitle}
                onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))}
                placeholder="e.g. Dribble marketing"
                className="w-full px-3 py-2 text-[13px] font-exo rounded-lg outline-none transition-all"
                style={{ backgroundColor: inputBg, border: `1px solid ${inputBd}`, color: inputC }}
                onFocus={e => (e.target.style.borderColor = '#6366f1')}
                onBlur={e  => (e.target.style.borderColor = inputBd)}
              />
            </FField>

            <div className="grid grid-cols-2 gap-3">
              <FField label="Status" textM={textM}>
                <select
                  value={form.status}
                  onChange={e => setForm(p => ({ ...p, status: e.target.value as TaskStatus }))}
                  className="w-full px-3 py-2 text-[13px] font-exo rounded-lg outline-none transition-all"
                  style={{ backgroundColor: inputBg, border: `1px solid ${inputBd}`, color: inputC }}
                >
                  {STATUS_OPTS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </FField>

              <FField label="Due date" error={errs.dueDate} required textM={textM}>
                <input
                  value={form.dueDate}
                  onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                  placeholder="24 Aug 2022"
                  className="w-full px-3 py-2 text-[13px] font-exo rounded-lg outline-none transition-all"
                  style={{
                    backgroundColor: inputBg,
                    border: `1px solid ${errs.dueDate ? '#ef4444' : inputBd}`,
                    color: inputC,
                  }}
                  onFocus={e => (e.target.style.borderColor = errs.dueDate ? '#ef4444' : '#6366f1')}
                  onBlur={e  => (e.target.style.borderColor = errs.dueDate ? '#ef4444' : inputBd)}
                />
              </FField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FField label={`Progress — ${form.progress}/${form.maxProgress}`} textM={textM}>
                <input
                  type="range" min={0} max={form.maxProgress} value={form.progress}
                  onChange={e => setForm(p => ({ ...p, progress: +e.target.value }))}
                  className="w-full mt-2 accent-indigo-500"
                />
              </FField>

              <FField label="Total tasks" error={errs.max} required textM={textM}>
                <input
                  type="number" min={1} max={100} value={form.maxProgress}
                  onChange={e => setForm(p => ({ ...p, maxProgress: +e.target.value }))}
                  className="w-full px-3 py-2 text-[13px] font-exo rounded-lg outline-none transition-all"
                  style={{
                    backgroundColor: inputBg,
                    border: `1px solid ${errs.max ? '#ef4444' : inputBd}`,
                    color: inputC,
                  }}
                />
              </FField>
            </div>

            {/* Assignees */}
            <div>
              <p className="text-[12px] font-semibold mb-2 font-exo" style={{ color: textM }}>
                Assignees
              </p>
              <div className="flex flex-wrap gap-2">
                {ASSIGNEES.map(a => {
                  const sel = form.assignees.includes(a.id)
                  return (
                    <button
                      key={a.id} type="button"
                      onClick={() => toggleAssignee(a.id)}
                      className="flex items-center gap-1.5 px-2.5 py-[5px] rounded-lg text-[12px] font-medium font-exo transition-all outline-none"
                      style={sel
                        ? { backgroundColor: a.color, color: '#ffffff', boxShadow: `0 0 0 2px ${a.color}40` }
                        : { backgroundColor: dark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', color: textM }
                      }
                    >
                      <span
                        className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: a.color }}
                      >
                        {a.initials[0]}
                      </span>
                      {a.name.split(' ')[0]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2"
              style={{ borderTop: `1px solid ${divider}` }}>
              <button
                type="button" onClick={close}
                className="px-4 py-2 text-[13px] font-medium font-exo rounded-lg transition-all outline-none"
                style={{ color: textM }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = closeHBg)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-white text-[13px] font-semibold font-exo transition-all active:scale-95 outline-none"
                style={{ backgroundColor: '#1a1d2e' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#252840')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1a1d2e')}
              >
                {mode === 'template' ? 'Save template' : isEdit ? 'Save changes' : 'Create task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

// ── Exports ───────────────────────────────────────────────────────────────────
export function AddTaskModal()    { return <ModalBody mode="task"     /> }
export function NewTemplateModal() { return <ModalBody mode="template" /> }
export default AddTaskModal

// ── Field wrapper ─────────────────────────────────────────────────────────────
function FField({ label, children, error, required, textM }: {
  label: string; children: React.ReactNode
  error?: string; required?: boolean; textM: string
}) {
  return (
    <div>
      <label className="block text-[12px] font-semibold mb-1.5 font-exo" style={{ color: textM }}>
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-1 font-exo">{error}</p>}
    </div>
  )
}