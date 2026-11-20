import { useState, useRef } from 'react'
import { useBudget } from '../context/BudgetContext.jsx'
import { MONTHS } from '../utils/constants.js'
import { exportIncomeCSV, exportExpensesCSV, exportAllJSON } from '../utils/export.js'
import Button from './ui/Button.jsx'
import clsx from 'clsx'

const THEME_ICONS = { light: '☀️', dark: '🌙', auto: '🌓' }
const THEMES = ['auto', 'light', 'dark']

export default function Header() {
  const { curMonth, curYear, prevMonth, nextMonth, setMonth, theme, setTheme, curData, goals, allData } = useBudget()
  const [exportOpen, setExportOpen] = useState(false)
  const exportRef = useRef(null)

  const cycleTheme = () => {
    const idx = THEMES.indexOf(theme)
    setTheme(THEMES[(idx + 1) % THEMES.length])
  }

  const handleExport = (type) => {
    setExportOpen(false)
    if (type === 'income')   exportIncomeCSV(curData, curMonth, curYear)
    if (type === 'expenses') exportExpensesCSV(curData, curMonth, curYear)
    if (type === 'json')     exportAllJSON(allData, goals)
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-2">
          <span className="text-2xl">🎓</span>
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight">AI Student Budget</div>
            <div className="text-xs text-gray-400 leading-tight">Planner</div>
          </div>
        </div>

        {/* Month navigation */}
        <div className="flex items-center gap-1 ml-auto">
          <Button variant="ghost" size="sm" onClick={prevMonth}>◀</Button>
          <select
            value={curMonth}
            onChange={e => setMonth(parseInt(e.target.value), curYear)}
            className="input py-1.5 px-2 text-xs w-28"
          >
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select
            value={curYear}
            onChange={e => setMonth(curMonth, parseInt(e.target.value))}
            className="input py-1.5 px-2 text-xs w-20"
          >
            {Array.from({ length: 8 }, (_, i) => 2023 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <Button variant="ghost" size="sm" onClick={nextMonth}>▶</Button>
        </div>

        {/* Theme toggle */}
        <button
          onClick={cycleTheme}
          className="text-lg cursor-pointer hover:scale-110 transition-transform select-none"
          title={`Theme: ${theme}`}
        >
          {THEME_ICONS[theme]}
        </button>

        {/* Export dropdown */}
        <div className="relative" ref={exportRef}>
          <Button variant="ghost" size="sm" onClick={() => setExportOpen(o => !o)}>
            ⬇ Export
          </Button>
          {exportOpen && (
            <div className="absolute right-0 top-9 card shadow-lg min-w-44 py-1 z-50 fade-in">
              {[
                { label: '💵 Income CSV',  key: 'income'   },
                { label: '💸 Expenses CSV', key: 'expenses' },
                { label: '🗂 Full JSON Backup', key: 'json' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => handleExport(item.key)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
