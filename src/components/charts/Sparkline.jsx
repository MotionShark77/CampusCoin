import { useBudget } from '../../context/BudgetContext.jsx'
import { SHORT_MONTHS } from '../../utils/constants.js'
import { fmtCompact } from '../../utils/calculations.js'

export default function Sparkline() {
  const { getHistoricalData, curMonth, curYear } = useBudget()
  const history = getHistoricalData(6)
  const maxV = Math.max(...history.map(h => Math.max(h.income, h.expenses)), 1)
  const H = 56

  return (
    <div>
      <div className="flex items-end gap-1" style={{ height: H }}>
        {history.map((h, i) => {
          const isCurrent = h.month === curMonth && h.year === curYear
          const hInc = Math.max(3, Math.round((h.income / maxV) * H))
          const hExp = Math.max(3, Math.round((h.expenses / maxV) * H))
          return (
            <div
              key={i}
              className={`flex items-end gap-0.5 flex-1 group relative cursor-default ${isCurrent ? 'ring-2 ring-indigo-400 ring-offset-1 rounded' : ''}`}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                {SHORT_MONTHS[h.month]} {h.year}<br />
                In: {fmtCompact(h.income)} · Out: {fmtCompact(h.expenses)}
              </div>
              <div className="flex-1 rounded-t-sm bg-green-500" style={{ height: hInc }} />
              <div className="flex-1 rounded-t-sm bg-red-400" style={{ height: hExp }} />
            </div>
          )
        })}
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        {history.map((h, i) => <span key={i}>{SHORT_MONTHS[h.month]}</span>)}
      </div>
      <div className="flex gap-3 mt-1 text-xs text-gray-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500 inline-block" />Income</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-400 inline-block" />Expenses</span>
      </div>
    </div>
  )
}
