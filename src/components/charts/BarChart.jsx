import { useBudget } from '../../context/BudgetContext.jsx'
import { CHART_COLORS, EXPENSE_CATEGORIES } from '../../utils/constants.js'
import { expensesByCategory, fmtCompact, totalIncome, totalExpenses, balance } from '../../utils/calculations.js'

function Bar({ value, maxValue, color, label, tip }) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0
  const H = 120
  const h = Math.max(4, Math.round((pct / 100) * H))
  return (
    <div className="flex flex-col items-center gap-2 flex-1 group relative">
      <div
        className="rounded-t-md w-full cursor-pointer transition-opacity duration-150 group-hover:opacity-80"
        style={{ height: h, background: color, minWidth: 20 }}
      />
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-md">
        {tip}: {fmtCompact(value)}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 text-center leading-tight">{label}</span>
    </div>
  )
}

export function IncomeExpenseBar() {
  const { curData } = useBudget()

  const inc = totalIncome(curData)
  const exp = totalExpenses(curData)
  const bal = balance(curData)
  const maxV = Math.max(inc, exp, 1)

  const bars = [
    { value: inc, label: 'Income', color: '#22c55e', tip: 'Income' },
    { value: exp, label: 'Expenses', color: '#6366f1', tip: 'Expenses' },
    { value: Math.abs(bal), label: 'Balance', color: bal >= 0 ? '#22c55e' : '#ef4444', tip: 'Balance' },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-end gap-2 flex-1" style={{ minHeight: 130 }}>
        {bars.map(b => <Bar key={b.label} {...b} maxValue={maxV} />)}
      </div>
      <div className="flex gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500 inline-block" />Income</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-indigo-500 inline-block" />Expenses</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" />Balance</span>
      </div>
    </div>
  )
}

export default IncomeExpenseBar
