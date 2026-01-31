'use client'

import { useState, useMemo, useCallback } from 'react'
import { useTodos } from '@/hooks/useTodos'
import { TodoForm } from '@/components/TodoForm/TodoForm'
import { SearchBar } from '@/components/SearchBar/SearchBar'
import { FilterTabs } from '@/components/FilterTabs/FilterTabs'
import { TodoList } from '@/components/TodoList/TodoList'
import { TimelineChart } from '@/components/TimelineChart/TimelineChart'
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle'
import type { FilterStatus } from '@/types/todo'
import styles from './page.module.scss'

export default function Home() {
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: todos = [], isLoading } = useTodos()

  const handleFilterChange = useCallback((newFilter: FilterStatus) => {
    setFilter(newFilter)
  }, [])

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const counts = useMemo(() => {
    const active = todos.filter((t) => !t.completed).length
    const completed = todos.filter((t) => t.completed).length
    return {
      all: todos.length,
      active,
      completed,
    }
  }, [todos])

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Todos</h1>
            <p className={styles.subtitle}>Stay organized, one task at a time</p>
          </div>
          <ThemeToggle />
        </header>

        <TodoForm />

        <div className={styles.controls}>
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
          <FilterTabs
            filter={filter}
            onFilterChange={handleFilterChange}
            counts={counts}
          />
        </div>

        <div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
          {isLoading ? 'Loading todos…' : `${counts.all} todos total`}
        </div>

        {isLoading ? (
          <div className={styles.loading}>Loading…</div>
        ) : (
          <>
            <TodoList todos={todos} filter={filter} searchQuery={searchQuery} />
            <TimelineChart todos={todos} />
          </>
        )}
      </div>
    </main>
  )
}
