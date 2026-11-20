import { useBudget } from '../../context/BudgetContext.jsx'
import { totalIncome, totalExpenses, balance, savingsRate, calcBudgetScore, getScoreGrade } from '../../utils/calculations.js'
import { fmtINR } from '../../utils/calculations.js'
import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'
import { IncomeExpenseBar } from '../charts/BarChart.jsx'
import { ExpenseDonut } from '../charts/DonutChart.jsx'
import HealthBars from '../charts/HealthBars.jsx'
import Sparkline from '../charts/Sparkline.jsx'

function StatCard({ icon, label, value, valueColor, sub, badge }) {
  return (
    <Card className="fade-in">
      <div className="flex items-start justify-between mb-1">
        <span className="text-lg">{icon}</span>
        {badge}
      </div>
      <div className={`text-xl font-extrabold mt-1 ${valueColor || 'text-gray-900 dark:text-white'}`}>
        {value}
      </div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</div>}
    </Card>
  )
}

export default function OverviewTab() {
  const { curData, goals, setActiveTab } = useBudget()

  const inc   = totalIncome(curData)
  const exp   = totalExpenses(curData)
  const bal   = balance(curData)
  const sr    = savingsRate(curData)
  const score = calcBudgetScore(curData, goals)
  const grade = getScoreGrade(score)

  const scoreColor = score === null ? '' : score >= 75 ? 'text-green-600 dark:text-green-400' : score >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
  const balColor   = bal >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'

  return (
    <div className="space-y-5 fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon="💵" label="Total Income" value={fmtINR(inc)} valueColor="text-green-600 dark:text-green-400" sub={`${curData.income?.length || 0} source(s)`} />
        <StatCard icon="💸" label="Total Expenses" value={fmtINR(exp)} valueColor="text-red-600 dark:text-red-400" sub={`${[...new Set((curData.expenses||[]).map(e=>e.category))].length} categories`} />
        <StatCard icon="💰" label="Balance" value={(bal < 0 ? '-' : '') + fmtINR(bal)} valueColor={balColor} sub={bal >= 0 ? '🟢 Surplus' : '🔴 Deficit'} />
        <StatCard
          icon="🎯"
          label="Budget Score"
          value={score !== null ? `${score}/100` : '—'}
          valueColor={scoreColor}
          sub={`Grade ${grade}`}
          badge={score !== null
            ? <Badge variant={score>=75?'success':score>=50?'warning':'danger'}>{grade}</Badge>
            : null}
        />
      </div>

      {/* Savings rate banner */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Savings Rate</span>
          <span className={`text-sm font-bold ${sr>=20?'text-green-600 dark:text-green-400':sr>0?'text-amber-600 dark:text-amber-400':'text-red-600 dark:text-red-400'}`}>{sr}%</span>
        </div>
        <div className="pbar-track h-3">
          <div
            className={`pbar-fill ${sr>=20?'bg-green-500':sr>0?'bg-amber-500':'bg-red-500'}`}
            style={{ width: `${Math.min(100,sr)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span className="text-indigo-500 font-semibold">↑ 20% target</span>
          <span>100%</span>
        </div>
      </Card>

      {/* 6-month sparkline */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">📉 6-Month Trend</h3>
        <Sparkline />
      </Card>

      {/* Bar + Donut */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">📊 Income vs Expenses</h3>
          <IncomeExpenseBar />
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🥧 Expense Breakdown</h3>
          <ExpenseDonut />
        </Card>
      </div>

      {/* Health bars */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">❤️ Budget Health by Category</h3>
        <HealthBars />
      </Card>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => setActiveTab('income')}  className="btn-md btn-secondary text-xs">➕ Add Income</button>
        <button onClick={() => setActiveTab('expenses')} className="btn-md btn-secondary text-xs">➕ Add Expense</button>
        <button onClick={() => setActiveTab('goals')}   className="btn-md btn-secondary text-xs">🎯 Set a Goal</button>
        <button onClick={() => setActiveTab('ai')}      className="btn-md btn-secondary text-xs">🤖 AI Insights</button>
      </div>
    </div>
  )
}
