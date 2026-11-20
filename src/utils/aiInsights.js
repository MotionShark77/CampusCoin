import {
  totalIncome, totalExpenses, balance, savingsRate,
  expensesByCategory, budgetByCategory, calcBudgetScore,
  categorize503020, getMonthOverMonthChange, fmtINR, daysPassedInMonth, daysLeftInMonth
} from './calculations.js'
import { BUDGET_TIPS } from './constants.js'

export function generateInsights(data, goals = [], prevData = null) {
  const inc  = totalIncome(data)
  const exp  = totalExpenses(data)
  const bal  = balance(data)
  const sr   = savingsRate(data)
  const cats = expensesByCategory(data)
  const buds = budgetByCategory(data)
  const score = calcBudgetScore(data, goals)
  const insights = []
  let id = 0
  const push = (icon, title, text, type, priority) =>
    insights.push({ id: ++id, icon, title, text, type, priority })

  // ── 1. No income ────────────────────────────────────────────────────────────
  if (!inc) {
    push('⚠️', 'No Income Recorded', 'Add your income sources for this month — scholarship, job, stipend, or family allowance — to unlock full analysis.', 'warning', 5)
  } else {
    // ── 2. Savings rate ──────────────────────────────────────────────────────
    if (sr >= 30) {
      push('🌟', `Excellent Savings Rate — ${sr}%!`, `Saving ${sr}% of income is well above the recommended 20%. Keep building that financial cushion — consider putting the surplus into a recurring deposit or liquid fund.`, 'success', 4)
    } else if (sr >= 20) {
      push('✅', `Good Savings Rate — ${sr}%`, `You're meeting the 20% rule. Try pushing to 25%+ by trimming one non-essential category next month.`, 'success', 3)
    } else if (sr > 0) {
      push('📉', `Low Savings Rate — ${sr}%`, `Only ${sr}% saved this month. The 20% rule recommends saving ₹${Math.round(inc * 0.2).toLocaleString('en-IN')} from your income. Consider cutting entertainment or subscriptions first.`, 'warning', 5)
    } else {
      push('🔴', 'Budget Deficit!', `You're spending ${fmtINR(exp - inc)} more than you earn. Cut at least one major expense category immediately to avoid debt.`, 'danger', 5)
    }
  }

  // ── 3. Category overruns ────────────────────────────────────────────────────
  Object.keys(buds).forEach(cat => {
    if (cats[cat] > buds[cat]) {
      push('🚨', `Over Budget: ${cat}`,
        `Spent ${fmtINR(cats[cat])} but limit is ${fmtINR(buds[cat])} — ${fmtINR(cats[cat] - buds[cat])} over. Adjust spending or raise the limit if it was set too low.`,
        'danger', 5)
    }
  })

  // ── 4. Food ratio ───────────────────────────────────────────────────────────
  const food = (cats.food || 0)
  if (inc && food / inc > 0.4) {
    push('🍔', 'High Food Spending', `Food is ${Math.round(food/inc*100)}% of income. Meal-prepping, using college canteen, or cooking at home can cut this by 30–40%.`, 'warning', 4)
  }

  // ── 5. Entertainment ────────────────────────────────────────────────────────
  const ent = cats.entertainment || 0
  if (inc && ent / inc > 0.15) {
    push('🎮', 'Entertainment Over 15%', `${Math.round(ent/inc*100)}% on entertainment. Look for free campus events, student discount movie nights, or cost-share plans with friends.`, 'warning', 3)
  }

  // ── 6. Subscriptions ────────────────────────────────────────────────────────
  const subs = cats.subscriptions || 0
  if (subs > 600) {
    push('📦', 'Subscription Audit Needed', `${fmtINR(subs)} on subscriptions. Check for unused ones. Many services have student tiers (Spotify, YouTube Premium, Notion) or family plan sharing.`, 'info', 3)
  }

  // ── 7. Rent ratio ───────────────────────────────────────────────────────────
  const rent = (cats.rent || cats.housing || 0)
  if (inc && rent / inc > 0.5) {
    push('🏠', 'Rent Exceeds 50% of Income', `Rent is ${Math.round(rent/inc*100)}% of income — dangerously high. Consider shared accommodation, on-campus housing, or negotiating with your landlord.`, 'danger', 4)
  }

  // ── 8. 50/30/20 rule ────────────────────────────────────────────────────────
  if (inc) {
    const { needsPct, wantsPct, savingsPct } = categorize503020(data)
    const ok = needsPct <= 50 && wantsPct <= 30 && savingsPct >= 20
    push('📐', '50/30/20 Rule Check',
      `Needs: ${needsPct}% (target ≤50) · Wants: ${wantsPct}% (target ≤30) · Savings: ${savingsPct}% (target ≥20). ${ok ? '✅ All within healthy limits!' : 'Adjust spending to bring each into range.'}`,
      ok ? 'success' : 'info', 3)
  }

  // ── 9. Goals ────────────────────────────────────────────────────────────────
  if (!goals.length && inc) {
    push('🎯', 'No Savings Goals Set', 'Goals keep you motivated. Try setting one: emergency fund (₹10,000), laptop, trip, or exam fee.', 'info', 2)
  } else if (goals.length && bal > 0) {
    const rem = goals.reduce((s, g) => s + Math.max(0, g.targetAmount - (g.savedAmount || 0)), 0)
    if (rem > 0) {
      push('💡', 'Goal Timeline Estimate', `You need ${fmtINR(rem)} more across ${goals.length} goal(s). At your ${fmtINR(bal)} monthly surplus that's ~${Math.ceil(rem/bal)} months.`, 'info', 2)
    }
  }

  // ── 10. Month-over-month ────────────────────────────────────────────────────
  if (prevData && inc) {
    const mom = getMonthOverMonthChange(data, prevData)
    if (mom.expenseChange !== null && mom.expenseChange > 20) {
      push('📈', `Expenses Up ${mom.expenseChange}% vs Last Month`, 'Your spending jumped significantly. Review which categories increased and whether it was planned.', 'warning', 4)
    }
    if (mom.incomeChange !== null && mom.incomeChange < -15) {
      push('📉', `Income Down ${Math.abs(mom.incomeChange)}% vs Last Month`, 'Your income dropped. Update your income sources and trim expenses accordingly.', 'warning', 4)
    }
  }

  // ── 11. Daily rate ──────────────────────────────────────────────────────────
  const daysPassed = daysPassedInMonth()
  if (inc && daysPassed > 5 && exp > 0) {
    const dailyRate = exp / daysPassed
    const projectedMonthly = dailyRate * 30
    if (projectedMonthly > inc) {
      push('⏱️', 'On Track to Overspend', `At ${fmtINR(Math.round(dailyRate))}/day you're projected to spend ${fmtINR(Math.round(projectedMonthly))} this month vs ${fmtINR(inc)} income. Slow down!`, 'danger', 5)
    }
  }

  // ── 12. Budget score ────────────────────────────────────────────────────────
  if (score !== null) {
    const grade = score >= 85 ? 'A+' : score >= 75 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : 'D'
    push('🏆', `Budget Score: ${score}/100 (Grade ${grade})`,
      `Breakdown — Savings rate: 40pts, Positive balance: 20pts, Within budgets: 20pts, Goal progress: 20pts. ${score >= 75 ? 'Excellent financial discipline!' : score >= 50 ? 'Good effort — focus on the weak areas.' : 'Build a surplus and stick to your limits.'}`,
      score >= 75 ? 'success' : score >= 50 ? 'warning' : 'danger', 2)
  }

  // ── 13. Rotating tip ────────────────────────────────────────────────────────
  const tip = BUDGET_TIPS[new Date().getDate() % BUDGET_TIPS.length]
  push(tip.icon, tip.title, tip.text, 'info', 1)

  // Sort by priority desc, limit to 10
  return insights.sort((a, b) => b.priority - a.priority).slice(0, 10)
}
