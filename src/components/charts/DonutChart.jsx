import { useMemo } from 'react'
import { useBudget } from '../../context/BudgetContext.jsx'
import { expensesByCategory } from '../../utils/calculations.js'
import { EXPENSE_CATEGORIES, CHART_COLORS } from '../../utils/constants.js'
import { fmtINR } from '../../utils/calculations.js'

function DonutChart({ data, size = 140 }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const R = 44, cx = 60, cy = 60, sw = 16, circ = 2 * Math.PI * R

  const segments = useMemo(() => {
    let start = 0
    return data.map(d => {
      const pct = total > 0 ? d.value / total : 0
      const dash = pct * circ
      const offset = -(start * circ) + circ / 4
      start += pct
      return { ...d, pct, dash, offset }
    })
  }, [data, total, circ])

  if (!total) return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#e5e7eb" strokeWidth={sw} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={9} fill="#9ca3af">No data</text>
    </svg>
  )

  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#e5e7eb" strokeWidth={sw} />
      {segments.map((seg, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={R}
          fill="none"
          stroke={seg.color}
          strokeWidth={sw}
          strokeDasharray={`${seg.dash} ${circ - seg.dash}`}
          strokeDashoffset={seg.offset}
          style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }}
          onMouseEnter={e => e.target.setAttribute('stroke-width', sw + 4)}
          onMouseLeave={e => e.target.setAttribute('stroke-width', sw)}
        />
      ))}
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize={8} fill="#9ca3af">Total</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize={9} fontWeight="bold" fill="currentColor">
        {fmtINR(total)}
      </text>
    </svg>
  )
}

export function ExpenseDonut() {
  const { curData } = useBudget()
  const cats = expensesByCategory(curData)
  const data = EXPENSE_CATEGORIES
    .filter(c => cats[c.value])
    .map((c, i) => ({
      label: c.icon + ' ' + c.label,
      value: cats[c.value],
      color: c.color || CHART_COLORS[i % CHART_COLORS.length],
    }))
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="flex items-center gap-4">
      <DonutChart data={data} size={130} />
      <div className="flex flex-col gap-1.5 flex-1 text-xs overflow-y-auto max-h-32">
        {data.length === 0
          ? <span className="text-gray-400">No expenses yet</span>
          : data.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: d.color }} />
              <span className="truncate text-gray-700 dark:text-gray-300 flex-1">{d.label}</span>
              <span className="text-gray-400 tabular-nums">{total > 0 ? Math.round(d.value / total * 100) : 0}%</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DonutChart
