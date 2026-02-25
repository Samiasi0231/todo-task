export type TaskStatus = 'todo' | 'inprogress' | 'done'

export interface Task {
  id:          string
  title:       string
  subtitle:    string
  status:      TaskStatus
  progress:    number
  maxProgress: number
  dueDate:     string
  assignees:   string[]
  comments:    number
  attachments: number
  createdAt:   string
}

export interface Assignee {
  id:       string
  name:     string
  initials: string
  color:    string
}