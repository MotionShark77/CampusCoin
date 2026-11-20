import { useState, useMemo } from 'react'
import { useBudget } from '../../context/BudgetContext.jsx'
import { generateInsights } from '../../utils/aiInsights.js'
import { categorize503020, calcBudgetScore, getScoreGrade, totalIncome, balance, fmtINR } from '../../utils/calculations.js'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import Badge from '../ui/Badge.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'

const TYPE_STYLES = {
  success: {
    border: 'border-l-4 border-green-500 bg-green-50/50 dark:bg-green-950/20',
    badge: 'success',
  },
  warning: {
    border: 'border-l-4 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
    badge: 'warning',
  },
  danger: {
    border: 'border-l-4 border-red-500 bg-red-50/50 dark:bg-red-950/20',
    badge: 'danger',
  },
  info: {
    border: 'border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20',
    badge: 'info',
  },
}

export default function AIInsightsTab() {
  const { curData, goals = [], curMonth, curYear, allData } = useBudget()
  const [refreshKey, setRefreshKey] = useState(0)

  // Previous month data for comparison
  const prevData = useMemo(() => {
    let m = curMonth - 1
    let y = curYear
    if (m < 0) {
      m = 11
      y -= 1
    }
    const key = `${y}-${String(m + 1).padStart(2, '0')}`
    return allData[key] || null
  }, [curMonth, curYear, allData])

  const insights = useMemo(() => {
    return generateInsights(curData, goals, prevData)
  }, [curData, goals, prevData, refreshKey])

  const rule5030 = categorize503020(curData)
  const score = calcBudgetScore(curData, goals)
  const grade = getScoreGrade(score)
  const inc = totalIncome(curData)
  const bal = balance(curData)

  return (
    <div className="space-y-5 fade-in">
      {/* Header Banner */}
      <div className="card p-5 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-200 dark:border-indigo-900/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">AI Financial Coach</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Analyzed {curData.income?.length || 0} income stream(s) and {curData.expenses?.length || 0} expense item(s)
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
            🔄 Refresh Analysis
          </Button>
        </div>
      </div>

      {/* 50/30/20 Rule Breakdown Card */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📐</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">50 / 30 / 20 Framework</span>
          </div>
          <span className="text-xs text-gray-400">Standard Financial Health Guideline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Needs */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Needs (Essentials)</span>
              <span className={`font-bold ${rule5030.needsPct <= 50 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                {rule5030.needsPct}% / 50%
              </span>
            </div>
            <ProgressBar value={Math.min(100, (rule5030.needsPct / 50) * 100)} variant={rule5030.needsPct <= 50 ? 'success' : 'danger'} size="sm" />
            <div className="text-xs text-gray-400 mt-2">Rent, food, travel, phone & health: {fmtINR(rule5030.needs)}</div>
          </div>

          {/* Wants */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Wants (Lifestyle)</span>
              <span className={`font-bold ${rule5030.wantsPct <= 30 ? 'text-green-600 dark:text-green-400' : 'text-amber-500'}`}>
                {rule5030.wantsPct}% / 30%
              </span>
            </div>
            <ProgressBar value={Math.min(100, (rule5030.wantsPct / 30) * 100)} variant={rule5030.wantsPct <= 30 ? 'success' : 'warning'} size="sm" />
            <div className="text-xs text-gray-400 mt-2">Entertainment, shopping, OTT: {fmtINR(rule5030.wants)}</div>
          </div>

          {/* Savings */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Savings & Goals</span>
              <span className={`font-bold ${rule5030.savingsPct >= 20 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                {rule5030.savingsPct}% / 20%
              </span>
            </div>
            <ProgressBar value={Math.min(100, (rule5030.savingsPct / 20) * 100)} variant={rule5030.savingsPct >= 20 ? 'success' : 'danger'} size="sm" />
            <div className="text-xs text-gray-400 mt-2">Monthly surplus saved: {fmtINR(rule5030.savings)}</div>
          </div>
        </div>
      </Card>

      {/* Actionable Insights List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Prioritized Insights & Alerts</h4>

        {insights.map((item) => {
          const style = TYPE_STYLES[item.type] || TYPE_STYLES.info
          return (
            <Card key={item.id} padding="md" className={`${style.border} transition-transform hover:-translate-y-0.5 duration-150`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</span>
                    <Badge variant={style.badge} className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{item.text}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
