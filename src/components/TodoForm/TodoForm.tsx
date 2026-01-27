'use client'

import { useState, useCallback, type FormEvent } from 'react'
import { useAddTodo } from '@/hooks/useTodos'
import styles from './TodoForm.module.scss'

export function TodoForm() {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const addTodo = useAddTodo()

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const trimmedTitle = title.trim()
      if (!trimmedTitle) return

      addTodo.mutate({
        title: trimmedTitle,
        dueDate: dueDate || null,
      })
      setTitle('')
      setDueDate('')
    },
    [title, dueDate, addTodo]
  )

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="todo-title" className={styles.label}>
            Task title
          </label>
          <input
            id="todo-title"
            type="text"
            className={styles.input}
            placeholder="What needs to be done…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="todo-due-date" className={styles.label}>
            Due date
          </label>
          <input
            id="todo-due-date"
            type="date"
            className={styles.dateInput}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
      <button
        type="submit"
        className={styles.button}
        disabled={addTodo.isPending || !title.trim()}
      >
        {addTodo.isPending ? 'Adding…' : 'Add Todo'}
      </button>
    </form>
  )
}
