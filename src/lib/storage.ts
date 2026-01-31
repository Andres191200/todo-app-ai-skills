import type { Todo } from '@/types/todo'

const STORAGE_KEY = 'todos:v1'
const ACTIVITY_KEY = 'activity:v1'

export interface ActivityEvent {
  type: 'created'
  timestamp: string
}

export function loadTodos(): Todo[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {
    // Handles incognito mode, quota exceeded, or disabled storage
  }
}

export function loadActivity(): ActivityEvent[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(ACTIVITY_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveActivity(events: ActivityEvent[]): void {
  try {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(events))
  } catch {
    // Handles incognito mode, quota exceeded, or disabled storage
  }
}

export function logTodoCreated(): void {
  const events = loadActivity()
  events.push({
    type: 'created',
    timestamp: new Date().toISOString(),
  })
  saveActivity(events)
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
