import { Task, Assignee } from '@/types'

export const ASSIGNEES: Assignee[] = [
  { id: 'a1', name: 'Alice Martin', initials: 'AM', color: '#f97316' },
  { id: 'a2', name: 'Bob Chen',     initials: 'BC', color: '#6366f1' },
  { id: 'a3', name: 'Carol Smith',  initials: 'CS', color: '#22c55e' },
  { id: 'a4', name: 'Dave Kim',     initials: 'DK', color: '#ec4899' },
  { id: 'a5', name: 'Eve Johnson',  initials: 'EJ', color: '#14b8a6' },
]

export const INITIAL_TASKS: Task[] = [
  
  {
    id: 't1', title: 'Design new ui presentation', subtitle: 'Dribble marketing',
    status: 'todo', progress: 7, maxProgress: 10, dueDate: '24 Aug 2022',
    assignees: [], comments: 7, attachments: 2, createdAt: '2022-08-01T10:00:00Z',
  },
  {
    id: 't2', title: 'Add more ui/ux mockups', subtitle: 'Pinterest promotion',
    status: 'todo', progress: 4, maxProgress: 10, dueDate: '25 Aug 2022',
    assignees: ['a1', 'a2', 'a3'], comments: 0, attachments: 0, createdAt: '2022-08-02T10:00:00Z',
  },
  {
    id: 't3', title: 'Design few mobile screens', subtitle: 'Dropbox mobile app',
    status: 'todo', progress: 3, maxProgress: 10, dueDate: '26 Aug 2022',
    assignees: [], comments: 6, attachments: 4, createdAt: '2022-08-03T10:00:00Z',
  },
  {
    id: 't4', title: 'Create a tweet and promote', subtitle: 'Twitter marketing',
    status: 'todo', progress: 2, maxProgress: 14, dueDate: '27 Aug 2022',
    assignees: ['a1', 'a3'], comments: 0, attachments: 0, createdAt: '2022-08-04T10:00:00Z',
  },
  
  {
    id: 't5', title: 'Design system update', subtitle: 'Oreo website project',
    status: 'inprogress', progress: 3, maxProgress: 10, dueDate: '12 Nov 2022',
    assignees: ['a2', 'a4'], comments: 0, attachments: 0, createdAt: '2022-10-01T10:00:00Z',
  },
  {
    id: 't6', title: 'Create brand guideline', subtitle: 'Oreo branding project',
    status: 'inprogress', progress: 7, maxProgress: 10, dueDate: '13 Nov 2022',
    assignees: [], comments: 2, attachments: 13, createdAt: '2022-10-02T10:00:00Z',
  },
  {
    id: 't7', title: 'Create wireframe for ios app', subtitle: 'Oreo ios project',
    status: 'inprogress', progress: 4, maxProgress: 10, dueDate: '14 Nov 2022',
    assignees: ['a1', 'a3'], comments: 0, attachments: 0, createdAt: '2022-10-03T10:00:00Z',
  },
  {
    id: 't8', title: 'Create ui kit for layout', subtitle: 'Crypto mobile app',
    status: 'inprogress', progress: 3, maxProgress: 10, dueDate: '15 Nov 2022',
    assignees: [], comments: 23, attachments: 12, createdAt: '2022-10-04T10:00:00Z',
  },
 
  {
    id: 't9', title: 'Add product to the market', subtitle: 'UI8 marketplace',
    status: 'done', progress: 10, maxProgress: 10, dueDate: '6 Jan 2022',
    assignees: [], comments: 1, attachments: 5, createdAt: '2021-12-10T10:00:00Z',
  },
  {
    id: 't10', title: 'Launch product promotion', subtitle: 'Kickstarter campaign',
    status: 'done', progress: 10, maxProgress: 10, dueDate: '7 Jan 2022',
    assignees: [], comments: 17, attachments: 3, createdAt: '2021-12-11T10:00:00Z',
  },
  {
    id: 't11', title: 'Make twitter banner', subtitle: 'Twitter marketing',
    status: 'done', progress: 10, maxProgress: 10, dueDate: '8 Jan 2022',
    assignees: ['a2', 'a4'], comments: 0, attachments: 0, createdAt: '2021-12-12T10:00:00Z',
  },
]