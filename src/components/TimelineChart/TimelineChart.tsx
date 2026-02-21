'use client'

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { useTheme } from '@/components/ThemeProvider'
import { useActivity } from '@/hooks/useTodos'
import styles from './TimelineChart.module.scss'
import { useLanguage } from '../LanguageProvider'

interface DayData {
  date: string
  label: string
  count: number
}

function getLast7Days(): Date[] {
  const days: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    days.push(date)
  }

  return days
}

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0]
}

function formatDayLabel(date: Date): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const diffDays = Math.round(
    (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'

  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

export function TimelineChart() {
  const {t} = useLanguage();
  const { theme, mounted } = useTheme()
  const { data: activity = [] } = useActivity()

  const chartData = useMemo(() => {
    const last7Days = getLast7Days()

    const countsByDate = new Map<string, number>()
    for (const day of last7Days) {
      countsByDate.set(formatDateKey(day), 0)
    }

    for (const event of activity) {
      const eventDate = new Date(event.timestamp)
      eventDate.setHours(0, 0, 0, 0)
      const dateKey = formatDateKey(eventDate)

      if (countsByDate.has(dateKey)) {
        countsByDate.set(dateKey, (countsByDate.get(dateKey) ?? 0) + 1)
      }
    }

    const data: DayData[] = last7Days.map((day) => ({
      date: formatDateKey(day),
      label: formatDayLabel(day),
      count: countsByDate.get(formatDateKey(day)) ?? 0,
    }))

    return data
  }, [activity])

  const totalThisWeek = useMemo(() => {
    return chartData.reduce((sum, day) => sum + day.count, 0)
  }, [chartData])

  const colors = useMemo(() => {
    const isDark = theme === 'dark'
    return {
      bar: isDark ? '#60a5fa' : '#3b82f6',
      barHover: isDark ? '#93c5fd' : '#2563eb',
      grid: isDark ? '#2e2e2e' : '#e5e7eb',
      text: isDark ? '#a1a1aa' : '#6b7280',
      tooltip: {
        bg: isDark ? '#1a1a1a' : '#ffffff',
        border: isDark ? '#2e2e2e' : '#e5e7eb',
        text: isDark ? '#f5f5f5' : '#111111',
      },
    }
  }, [theme])

  if (!mounted) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('activityThisWeek')}</h2>
        </div>
        <div className={styles.chartWrapper} style={{ height: 200 }} />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('activityThisWeek')}</h2>
        <span className={styles.total}>{totalThisWeek} {t('todosCreated')}</span>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={colors.grid}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: colors.text, fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: colors.text, fontSize: 12 }}
              allowDecimals={false}
              width={40}
            />
            <Tooltip
              cursor={{ fill: colors.grid, opacity: 0.3 }}
              contentStyle={{
                backgroundColor: colors.tooltip.bg,
                border: `1px solid ${colors.tooltip.border}`,
                borderRadius: '0.5rem',
                padding: '0.5rem 0.75rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{
                color: colors.tooltip.text,
                fontWeight: 500,
                marginBottom: '0.25rem',
              }}
              itemStyle={{
                color: colors.tooltip.text,
                padding: 0,
              }}
              formatter={(value) => {
                const count = value as number
                return [`${count} todo${count !== 1 ? 's' : ''}`, 'Created']
              }}
            />
            <Bar
              dataKey="count"
              fill={colors.bar}
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
