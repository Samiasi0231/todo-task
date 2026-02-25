'use client'

import { useState, useEffect } from 'react'
import { useRouter }           from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/useTypedRedux'
import { loginAction, clearAuthError }    from '@/store/authSlice'

export default function LoginPage() {
  const dispatch  = useAppDispatch()
  const router    = useRouter()
  const { isLoggedIn, error: authError } = useAppSelector(s => s.auth)

  const [form, setForm]         = useState({ name: '', password: '' })
  const [errors, setErrors]     = useState<Record<string, string>>({})
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  
  useEffect(() => {
    if (isLoggedIn) router.replace('/dashboard')
  }, [isLoggedIn, router])

  const set = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => { const n = { ...p }; delete n[k]; return n })
    if (authError) dispatch(clearAuthError())
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim())  e.name     = 'Name is required'
    if (!form.password)     e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length) { setErrors(v); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    dispatch(loginAction({ name: form.name.trim(), password: form.password }))
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 font-exo"
      style={{ backgroundColor: '#0d0f1c' }}
    >
      {/* Ambient glow */}
      <div className="fixed top-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ backgroundColor: '#4f52cc' }}/>
      <div className="fixed bottom-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ backgroundColor: '#6366f1' }}/>

      <div className="w-full max-w-[380px] relative z-10">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#4f52cc', boxShadow: '0 4px 16px rgba(79,82,204,0.4)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white"
              strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>
          <span className="text-white font-black text-[20px] tracking-tight">Todo is here make it an habit</span>
        </div>
        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: '#13152a',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          }}
        >
          <div className="mb-6">
            <h2 className="text-white font-black text-[22px] mb-1">Welcome back</h2>
            <p className="text-[13px]" style={{ color: '#6b7280' }}>
              No account yet?{' '}
              <button
                onClick={() => router.push('/register')}
                className="font-semibold outline-none"
                style={{ color: '#6366f1' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6366f1')}
              >
                Create one
              </button>
            </p>
          </div>

        
          {authError && (
            <div className="mb-4 px-3 py-2.5 rounded-xl text-[12px] font-exo animate-fade-in"
              style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#f87171' }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

        
            <div>
              <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#9ca3af' }}>
                Full name
              </label>
              <input
                type="text" value={form.name} placeholder="Jane Smith"
                onChange={e => set('name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-[13px] font-exo text-white outline-none transition-all"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${errors.name ? '#ef4444' : 'rgba(255,255,255,0.08)'}`,
                }}
                onFocus={e => (e.target.style.borderColor = errors.name ? '#ef4444' : '#6366f1')}
                onBlur={e  => (e.target.style.borderColor = errors.name ? '#ef4444' : 'rgba(255,255,255,0.08)')}
              />
              {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#9ca3af' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={form.password} placeholder="Your password"
                  onChange={e => set('password', e.target.value)}
                  className="w-full px-4 py-3 pr-11 rounded-xl text-[13px] font-exo text-white outline-none transition-all"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: `1.5px solid ${errors.password ? '#ef4444' : 'rgba(255,255,255,0.08)'}`,
                  }}
                  onFocus={e => (e.target.style.borderColor = errors.password ? '#ef4444' : '#6366f1')}
                  onBlur={e  => (e.target.style.borderColor = errors.password ? '#ef4444' : 'rgba(255,255,255,0.08)')}
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 outline-none"
                  style={{ color: '#6b7280' }}>
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-400 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-[14px] text-white transition-all duration-150 active:scale-[0.98] outline-none mt-2"
              style={{
                backgroundColor: '#4f52cc',
                boxShadow: '0 4px 20px rgba(79,82,204,0.30)',
                opacity: loading ? 0.8 : 1,
                cursor: loading ? 'wait' : 'pointer',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#6366f1' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#4f52cc' }}
            >
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24"
                      fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Signing in…
                  </span>
                : 'Sign in'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}