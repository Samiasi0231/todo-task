import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User { id: string; name: string; initials: string }

interface AuthState {
  user:       User | null
  isLoggedIn: boolean
  isHydrated: boolean
  error:      string | null
}

const initialState: AuthState = {
  user:       null,
  isLoggedIn: false,
  isHydrated: false,
  error:      null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    hydrateAuth(state) {
      if (typeof window === 'undefined') return
      try {
        const raw = localStorage.getItem('auth_user')
        if (raw) { state.user = JSON.parse(raw); state.isLoggedIn = true }
      } catch { /* ignore */ }
      state.isHydrated = true
    },

    registerAction(
      state,
      action: PayloadAction<{ name: string; password: string }>
    ) {
      if (typeof window === 'undefined') return
      state.error = null
      const { name, password } = action.payload
      // Check if username already taken
      const existing = localStorage.getItem('auth_user')
      if (existing) {
        const u = JSON.parse(existing)
        if (u.name.toLowerCase() === name.toLowerCase()) {
          state.error = 'Username already taken. Choose another.'
          return
        }
      }
      const initials = name
        .split(' ')
        .map((p: string) => p[0]?.toUpperCase() ?? '')
        .slice(0, 2)
        .join('')
      const user: User = { id: `u_${Date.now()}`, name, initials }
      localStorage.setItem('auth_user', JSON.stringify(user))
      localStorage.setItem('auth_pass', password)
      // registration done — caller redirects to /login
    },

    loginAction(
      state,
      action: PayloadAction<{ name: string; password: string }>
    ) {
      if (typeof window === 'undefined') return
      state.error = null
      try {
        const raw = localStorage.getItem('auth_user')
        if (!raw) {
          state.error = 'No account found. Please register first.'
          return
        }
        const user: User   = JSON.parse(raw)
        const stored       = localStorage.getItem('auth_pass')
        const nameMatch    = user.name.toLowerCase() === action.payload.name.toLowerCase()
        const passMatch    = stored === action.payload.password
        if (!nameMatch)    { state.error = 'Username not found.';  return }
        if (!passMatch)    { state.error = 'Incorrect password.';   return }
        state.user       = user
        state.isLoggedIn = true
      } catch {
        state.error = 'Login failed. Please try again.'
      }
    },

    logoutAction(state) {
      state.user       = null
      state.isLoggedIn = false
    },

    clearAuthError(state) {
      state.error = null
    },
  },
})

export const {
  hydrateAuth,
  registerAction,
  loginAction,
  logoutAction,
  clearAuthError,
} = authSlice.actions

export default authSlice.reducer