'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { loadTodos, saveTodos, generateId } from '@/lib/storage'
import type { Todo } from '@/types/todo'

const TODOS_KEY = ['todos']

export function useTodos() {
  return useQuery({
    queryKey: TODOS_KEY,
    queryFn: loadTodos,
    staleTime: Infinity,
  })
}

export function useAddTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { title: string; dueDate: string | null }) => {
      const todos = loadTodos()
      const newTodo: Todo = {
        id: generateId(),
        title: data.title,
        completed: false,
        dueDate: data.dueDate,
        createdAt: new Date().toISOString(),
      }
      const updated = [...todos, newTodo]
      saveTodos(updated)
      return Promise.resolve(newTodo)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY })
    },
  })
}

export function useToggleTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      const todos = loadTodos()
      const updated = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
      saveTodos(updated)
      return Promise.resolve(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY })
    },
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { id: string; title: string; dueDate: string | null }) => {
      const todos = loadTodos()
      const updated = todos.map((todo) =>
        todo.id === data.id
          ? { ...todo, title: data.title, dueDate: data.dueDate }
          : todo
      )
      saveTodos(updated)
      return Promise.resolve(data.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY })
    },
  })
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      const todos = loadTodos()
      const updated = todos.filter((todo) => todo.id !== id)
      saveTodos(updated)
      return Promise.resolve(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY })
    },
  })
}
