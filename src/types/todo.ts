export interface Todo {
  id: string
  title: string
  completed: boolean
  dueDate: string | null
  createdAt: string
}

export type FilterStatus = 'all' | 'active' | 'completed'
