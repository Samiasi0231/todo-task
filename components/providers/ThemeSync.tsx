// 'use client'

// import { useEffect } from 'react'
// import { useAppDispatch, useAppSelector } from '@/hooks/useTypedRedux'
// import { hydrateTheme } from '@/store/uiSlice'
// import { hydrateTasks } from '@/store/tasksSlice'

// export default function ThemeSync() {
//   const dispatch = useAppDispatch()
//   const theme    = useAppSelector(s => s.ui.theme)

//   // Hydrate both slices from localStorage once on mount
//   useEffect(() => {
//     dispatch(hydrateTheme())
//     dispatch(hydrateTasks())
//   }, [dispatch])

//   useEffect(() => {
//     const root = document.documentElement
//     if (theme === 'dark') root.classList.add('dark')
//     else root.classList.remove('dark')
//   }, [theme])

//   return null
// }

'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useTypedRedux'
import { hydrateTheme } from '@/store/uiSlice'
import { hydrateTasks } from '@/store/tasksSlice'
import { hydrateAuth }  from '@/store/authSlice'

export default function ThemeSync() {
  const dispatch = useAppDispatch()
  const theme    = useAppSelector(s => s.ui.theme)

  useEffect(() => {
    dispatch(hydrateAuth())
    dispatch(hydrateTheme())
    dispatch(hydrateTasks())
  }, [dispatch])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return null
}