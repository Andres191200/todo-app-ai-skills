'use client'

import type { FilterStatus } from '@/types/todo'
import styles from './FilterTabs.module.scss'

interface FilterTabsProps {
  filter: FilterStatus
  onFilterChange: (filter: FilterStatus) => void
  counts: { all: number; active: number; completed: number }
}

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

export function FilterTabs({ filter, onFilterChange, counts }: FilterTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Filter todos">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          role="tab"
          aria-selected={filter === value}
          className={`${styles.tab} ${filter === value ? styles.active : ''}`}
          onClick={() => onFilterChange(value)}
          type="button"
        >
          {label}
          <span className={styles.count}>{counts[value]}</span>
        </button>
      ))}
    </div>
  )
}
