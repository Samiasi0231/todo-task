import { configureStore } from '@reduxjs/toolkit'
import uiReducer    from './uiSlice'
import tasksReducer from './tasksSlice'
import authReducer  from './authSlice'

export const store = configureStore({
  reducer: {
    ui:    uiReducer,
    tasks: tasksReducer,
    auth:  authReducer,
  },
})

export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch