'use client'

import { useState, useCallback, type FormEvent, type KeyboardEvent } from 'react'
import { useToggleTodo, useUpdateTodo, useDeleteTodo } from '@/hooks/useTodos'
import type { Todo } from '@/types/todo'
import styles from './TodoItem.module.scss'

interface TodoItemProps {
  todo: Todo
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? '')

  const toggleTodo = useToggleTodo()
  const updateTodo = useUpdateTodo()
  const deleteTodo = useDeleteTodo()

  const handleToggle = useCallback(() => {
    toggleTodo.mutate(todo.id)
  }, [toggleTodo, todo.id])

  const handleDelete = useCallback(() => {
    deleteTodo.mutate(todo.id)
  }, [deleteTodo, todo.id])

  const handleEdit = useCallback(() => {
    setEditTitle(todo.title)
    setEditDueDate(todo.dueDate ?? '')
    setIsEditing(true)
  }, [todo.title, todo.dueDate])

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditTitle(todo.title)
    setEditDueDate(todo.dueDate ?? '')
  }, [todo.title, todo.dueDate])

  const handleSave = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault()
      const trimmedTitle = editTitle.trim()
      if (!trimmedTitle) return

      updateTodo.mutate({
        id: todo.id,
        title: trimmedTitle,
        dueDate: editDueDate || null,
      })
      setIsEditing(false)
    },
    [editTitle, editDueDate, updateTodo, todo.id]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancelEdit()
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSave()
      }
    },
    [handleCancelEdit, handleSave]
  )

  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const isOverdue =
    todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date()

  if (isEditing) {
    return (
      <form className={styles.editForm} onSubmit={handleSave}>
        <input
          type="text"
          className={styles.editInput}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          aria-label="Edit todo title"
        />
        <input
          type="date"
          className={styles.editDateInput}
          value={editDueDate}
          onChange={(e) => setEditDueDate(e.target.value)}
          aria-label="Edit due date"
        />
        <div className={styles.editActions}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={!editTitle.trim()}
          >
            Save
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={todo.completed}
          onChange={handleToggle}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <span className={styles.checkmark} aria-hidden="true">
          {todo.completed ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
      </label>

      <div className={styles.content}>
        <span className={styles.title}>{todo.title}</span>
        {todo.dueDate ? (
          <span className={`${styles.dueDate} ${isOverdue ? styles.overdue : ''}`}>
            {formatDueDate(todo.dueDate)}
          </span>
        ) : null}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.editButton}
          onClick={handleEdit}
          aria-label={`Edit "${todo.title}"`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M11.333 2A1.886 1.886 0 0 1 14 4.667l-9 9-3.667 1 1-3.667 9-9Z"
              stroke="currentColor"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={handleDelete}
          aria-label={`Delete "${todo.title}"`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334Z"
              stroke="currentColor"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
