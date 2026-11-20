import { useBudget } from '../../context/BudgetContext.jsx'
import { expensesByCategory, budgetByCategory } from '../../utils/calculations.js'
import { fmtINR } from '../../utils/calculations.js'
import { EXPENSE_CATEGORIES } from '../../utils/constants.js'
import ProgressBar from '../ui/ProgressBar.jsx'

export default function HealthBars() {
  const { curData } = useBudget()
  const cats  = expensesByCategory(curData)
  const buds  = budgetByCategory(curData)
  const entries = EXPENSE_CATEGORIES.filter(c => cats[c.value])

  if (!entries.length) return (
    <p className="text-xs text-gray-400">Add expenses to see budget health metrics.</p>
  )

  return (
    <div className="flex flex-col gap-4">
      {entries.map(cat => {
        const spent  = cats[cat.value] || 0
        const budget = buds[cat.value] || 0
        const pct    = budget ? Math.round((spent / budget) * 100) : null
        return (
          <div key={cat.value}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {cat.icon} {cat.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {fmtINR(spent)}{budget ? ` / ${fmtINR(budget)}` : ''}
                </span>
                {pct !== null && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                    pct > 100 ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                    pct > 80  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' :
                                'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                  }`}>{pct}%</span>
                )}
                {pct === null && <span className="text-xs text-gray-400">No limit</span>}
              </div>
            </div>
            {budget
              ? <ProgressBar value={pct} variant={pct > 100 ? 'danger' : pct > 80 ? 'warning' : 'success'} />
              : <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full" />
            }
          </div>
        )
      })}
    </div>
  )
}
