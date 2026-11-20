// Pure calculation helpers — no side-effects, no imports from react

/**
 * Returns total monthly income (weekly × 4).
 */
export function totalIncome(data) {
  if (!data?.income?.length) return 0
  return data.income.reduce((sum, item) => {
    const amt = Number(item.amount) || 0
    return sum + (item.frequency === 'weekly' ? amt * 4 : amt)
  }, 0)
}

export function totalExpenses(data) {
  if (!data?.expenses?.length) return 0
  return data.expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
}

export function balance(data) {
  return totalIncome(data) - totalExpenses(data)
}

export function savingsRate(data) {
  const inc = totalIncome(data)
  if (!inc) return 0
  return Math.max(0, Math.min(100, Math.round((balance(data) / inc) * 100)))
}

export function expensesByCategory(data) {
  const map = {}
  ;(data?.expenses || []).forEach(e => {
    map[e.category] = (map[e.category] || 0) + (Number(e.amount) || 0)
  })
  return map
}

export function budgetByCategory(data) {
  const map = {}
  ;(data?.expenses || []).forEach(e => {
    if (e.budget && !map[e.category]) map[e.category] = Number(e.budget)
  })
  return map
}

export function calcBudgetScore(data, goals = []) {
  const inc = totalIncome(data)
  if (!inc) return null

  const sr = savingsRate(data)
  const bal = balance(data)
  const cats = expensesByCategory(data)
  const buds = budgetByCategory(data)

  // Savings rate: up to 40 pts (20% rate = full marks)
  const srPts = Math.min(40, Math.round(sr * 2))
  // Positive balance: 20 pts
  const balPts = bal >= 0 ? 20 : 0
  // Within budget: 20 pts (penalise per category over budget)
  const budKeys = Object.keys(buds)
  const overruns = budKeys.filter(c => cats[c] > buds[c]).length
  const budPts = budKeys.length
    ? Math.round(20 * (1 - overruns / budKeys.length))
    : 10
  // Goals progress: up to 20 pts
  const goalPts = goals.length
    ? Math.min(20, Math.round((goals.filter(g => g.savedAmount >= g.targetAmount).length / goals.length) * 20))
    : 10

  return Math.min(100, srPts + balPts + budPts + goalPts)
}

export function getScoreGrade(score) {
  if (score === null) return '—'
  if (score >= 85) return 'A+'
  if (score >= 75) return 'A'
  if (score >= 65) return 'B'
  if (score >= 50) return 'C'
  if (score >= 35) return 'D'
  return 'F'
}

/**
 * 50/30/20 rule split.
 * Needs: housing, food, transport, phone, health
 * Wants: entertainment, clothing, subscriptions, misc
 * Savings: balance
 */
export function categorize503020(data) {
  const cats = expensesByCategory(data)
  const inc = totalIncome(data)
  const needs =
    (cats.housing || 0) +
    (cats.rent || 0) +
    (cats.food || 0) +
    (cats.transport || 0) +
    (cats.utilities || 0) +
    (cats.phone || 0) +
    (cats.health || 0)
  const wants =
    (cats.entertainment || 0) +
    (cats.clothing || 0) +
    (cats.subscriptions || 0) +
    (cats.misc || 0)
  const savings = Math.max(0, balance(data))
  const pct = v => (inc > 0 ? Math.round((v / inc) * 100) : 0)
  return { needs, wants, savings, needsPct: pct(needs), wantsPct: pct(wants), savingsPct: pct(savings) }
}

export function getTopSpendingCategory(data) {
  const cats = expensesByCategory(data)
  const entries = Object.entries(cats)
  if (!entries.length) return null
  const [cat, amount] = entries.reduce((a, b) => (b[1] > a[1] ? b : a))
  const inc = totalIncome(data)
  return { category: cat, amount, pct: inc > 0 ? Math.round((amount / inc) * 100) : 0 }
}

export function getMonthOverMonthChange(cur, prev) {
  const curInc = totalIncome(cur), prevInc = totalIncome(prev)
  const curExp = totalExpenses(cur), prevExp = totalExpenses(prev)
  const curBal = balance(cur),     prevBal = balance(prev)
  const pctChange = (a, b) => (b === 0 ? null : Math.round(((a - b) / Math.abs(b)) * 100))
  return {
    incomeChange:  pctChange(curInc, prevInc),
    expenseChange: pctChange(curExp, prevExp),
    balanceChange: pctChange(curBal, prevBal),
  }
}

export function fmtINR(n) {
  const abs = Math.abs(Number(n) || 0)
  return (n < 0 ? '-' : '') + '₹' + abs.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

export function fmtCompact(n) {
  const abs = Math.abs(Number(n) || 0)
  const prefix = n < 0 ? '-' : ''
  if (abs >= 1_00_000) return prefix + '₹' + (abs / 1_00_000).toFixed(1) + 'L'
  if (abs >= 1_000)   return prefix + '₹' + (abs / 1_000).toFixed(1) + 'K'
  return prefix + '₹' + abs
}

export function daysLeftInMonth() {
  const now = new Date()
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return last.getDate() - now.getDate()
}

export function daysPassedInMonth() {
  return new Date().getDate()
}
