'use client'

import { useMemo } from 'react'
import { TodoItem } from '@/components/TodoItem/TodoItem'
import type { Todo, FilterStatus } from '@/types/todo'
import styles from './TodoList.module.scss'
import { useLanguage } from '../LanguageProvider'

interface TodoListProps {
  todos: Todo[]
  filter: FilterStatus
  searchQuery: string
}

export function TodoList({ todos, filter, searchQuery }: TodoListProps) {
const {t} = useLanguage();

  const filteredTodos = useMemo(() => {
    let result = todos

    if (filter === 'active') {
      result = result.filter((todo) => !todo.completed)
    } else if (filter === 'completed') {
      result = result.filter((todo) => todo.completed)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((todo) =>
        todo.title.toLowerCase().includes(query)
      )
    }

    return result.toSorted((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      if (a.dueDate) return -1
      if (b.dueDate) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [todos, filter, searchQuery])

  if (filteredTodos.length === 0) {
    return (
      <div className={styles.empty}>
        {searchQuery.trim() ? (
          <p>{t('noTodosMatch')}</p>
        ) : filter === 'active' ? (
          <p>{t('noActiveTodos')}</p>
        ) : filter === 'completed' ? (
          <p>{t('noCompletedTodos')}</p>
        ) : (
          <p>{t('noTodosYet')}</p>
        )}
      </div>
    )
  }

  return (
    <ul className={styles.list} aria-label="Todo list">
      {filteredTodos.map((todo) => (
        <li key={todo.id}>
          <TodoItem todo={todo} />
        </li>
      ))}
    </ul>
  )
}
