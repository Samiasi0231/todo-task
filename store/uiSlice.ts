import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TaskStatus } from '@/types'

type ViewMode = 'board' | 'list' | 'calendar' | 'timeline'
type Theme    = 'light' | 'dark'

interface UIState {
  theme:               Theme
  viewMode:            ViewMode
  activeProject:       string
  activeTaskFilter:    string
  searchQuery:         string
  isCalendarOpen:      boolean
  isAddTaskModalOpen:  boolean
  isNewTemplateOpen:   boolean
  addTaskTargetStatus: TaskStatus
  editingTaskId:       string | null
}

const initialState: UIState = {
  theme:               'light',
  viewMode:            'board',
  activeProject:       'all-projects',
  activeTaskFilter:    'all',
  searchQuery:         '',
  isCalendarOpen:      false,
  isAddTaskModalOpen:  false,
  isNewTemplateOpen:   false,
  addTaskTargetStatus: 'todo',
  editingTaskId:       null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // ── Theme ──────────────────────────────────────────────
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload)
      }
    },
    hydrateTheme(state) {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme') as Theme | null
        if (saved === 'light' || saved === 'dark') state.theme = saved
      }
    },

    // ── View mode ──────────────────────────────────────────
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload
    },

    // ── Sidebar filters ────────────────────────────────────
    setActiveProject(state, action: PayloadAction<string>) {
      state.activeProject = action.payload
    },
    setActiveTaskFilter(state, action: PayloadAction<string>) {
      state.activeTaskFilter = action.payload
    },

    // ── Search ─────────────────────────────────────────────
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },

    // ── Calendar ───────────────────────────────────────────
    toggleCalendar(state) {
      state.isCalendarOpen = !state.isCalendarOpen
    },
    closeCalendar(state) {
      state.isCalendarOpen = false
    },

    // ── Add / Edit task modal ──────────────────────────────
    openAddTaskModal(state, action: PayloadAction<TaskStatus>) {
      state.isAddTaskModalOpen  = true
      state.addTaskTargetStatus = action.payload
      state.editingTaskId       = null
    },
    openEditTaskModal(state, action: PayloadAction<string>) {
      state.isAddTaskModalOpen = true
      state.editingTaskId      = action.payload
    },
    closeTaskModal(state) {
      state.isAddTaskModalOpen = false
      state.editingTaskId      = null
    },

    // ── New template modal ─────────────────────────────────
    openNewTemplate(state) {
      state.isNewTemplateOpen = true
    },
    closeNewTemplate(state) {
      state.isNewTemplateOpen = false
    },
  },
})

export const {
  setTheme, hydrateTheme,
  setViewMode,
  setActiveProject, setActiveTaskFilter,
  setSearchQuery,
  toggleCalendar, closeCalendar,
  openAddTaskModal, openEditTaskModal, closeTaskModal,
  openNewTemplate, closeNewTemplate,
} = uiSlice.actions

export default uiSlice.reducer