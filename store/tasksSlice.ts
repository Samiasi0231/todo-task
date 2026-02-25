import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Task, TaskStatus } from '@/types'
import { INITIAL_TASKS } from '@/lib/initialData'

interface TasksState {
  tasks:         Task[]
  draggedTaskId: string | null
}

const initialState: TasksState = {
  tasks:         INITIAL_TASKS,
  draggedTaskId: null,
}


const persist = (tasks: Task[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }
}

const uid = () => `t${Date.now()}_${Math.random().toString(36).slice(2, 7)}`


const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
   
    hydrateTasks(state) {
      if (typeof window === 'undefined') return
      try {
        const raw = localStorage.getItem('tasks')
        if (raw) state.tasks = JSON.parse(raw)
      } catch { /* ignore parse errors */ }
    },

   
    addTask(state, action: PayloadAction<Omit<Task, 'id' | 'createdAt'>>) {
      const task: Task = {
        ...action.payload,
        id:        uid(),
        createdAt: new Date().toISOString(),
      }
      state.tasks.push(task)
      persist(state.tasks)
    },

    
    updateTask(state, action: PayloadAction<{ id: string; updates: Partial<Omit<Task, 'id' | 'createdAt'>> }>) {
      const { id, updates } = action.payload
      const idx = state.tasks.findIndex(t => t.id === id)
      if (idx !== -1) {
        state.tasks[idx] = { ...state.tasks[idx], ...updates }
        persist(state.tasks)
      }
    },

  
    moveTask(state, action: PayloadAction<{ id: string; status: TaskStatus }>) {
      const { id, status } = action.payload
      const task = state.tasks.find(t => t.id === id)
      if (task) {
        task.status = status
        
        if (status === 'done') task.progress = task.maxProgress
        persist(state.tasks)
      }
    },

   
    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter(t => t.id !== action.payload)
      persist(state.tasks)
    },

   
    setDraggedTask(state, action: PayloadAction<string | null>) {
      state.draggedTaskId = action.payload
    },
  },
})

export const {
  hydrateTasks,
  addTask,
  updateTask,
  moveTask,
  deleteTask,
  setDraggedTask,
} = tasksSlice.actions

export default tasksSlice.reducer