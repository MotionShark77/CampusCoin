import { totalIncome, totalExpenses, balance, savingsRate } from './calculations.js'

function dl(content, mime, filename) {
  const a = document.createElement('a')
  a.href = 'data:' + mime + ';charset=utf-8,' + encodeURIComponent(content)
  a.download = filename
  a.click()
}

function monthLabel(month, year) {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${MONTHS[month]}-${year}`
}

export function exportIncomeCSV(data, month, year) {
  let csv = 'Name,Amount (₹),Frequency,Date\n'
  ;(data.income || []).forEach(i => {
    csv += `"${i.name}",${i.amount},"${i.frequency || 'monthly'}","${i.date || ''}"\n`
  })
  dl(csv, 'text/csv', `income-${monthLabel(month, year)}.csv`)
}

export function exportExpensesCSV(data, month, year) {
  let csv = 'Name,Amount (₹),Category,Budget Limit (₹),Date\n'
  ;(data.expenses || []).forEach(e => {
    csv += `"${e.name}",${e.amount},"${e.category}",${e.budget || ''},"${e.date || ''}"\n`
  })
  dl(csv, 'text/csv', `expenses-${monthLabel(month, year)}.csv`)
}

export function exportFullReportCSV(data, goals, month, year) {
  const inc = totalIncome(data)
  const exp = totalExpenses(data)
  const bal = balance(data)
  const sr  = savingsRate(data)

  let csv = `AI Student Budget Planner — Report for ${monthLabel(month, year)}\n\n`
  csv += `=== SUMMARY ===\nTotal Income,₹${inc}\nTotal Expenses,₹${exp}\nBalance,₹${bal}\nSavings Rate,${sr}%\n\n`
  csv += `=== INCOME ===\nName,Amount,Frequency\n`
  ;(data.income || []).forEach(i => { csv += `"${i.name}",${i.amount},"${i.frequency || 'monthly'}"\n` })
  csv += `\n=== EXPENSES ===\nName,Amount,Category,Budget\n`
  ;(data.expenses || []).forEach(e => { csv += `"${e.name}",${e.amount},"${e.category}",${e.budget || ''}\n` })
  if (goals?.length) {
    csv += `\n=== GOALS ===\nName,Target,Saved,Progress\n`
    goals.forEach(g => {
      const saved = g.savedAmount || 0
      const pct = g.targetAmount > 0 ? Math.round((saved / g.targetAmount) * 100) : 0
      csv += `"${g.name}",${g.targetAmount},${saved},${pct}%\n`
    })
  }
  dl(csv, 'text/csv', `report-${monthLabel(month, year)}.csv`)
}

export function exportAllJSON(allData, goals) {
  const payload = JSON.stringify({ budget: allData, goals, exportedAt: new Date().toISOString() }, null, 2)
  dl(payload, 'application/json', `student-budget-backup-${Date.now()}.json`)
}

export async function importFromJSON(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result)
        if (parsed.budget) {
          localStorage.setItem('sbp-data', JSON.stringify(parsed.budget))
        }
        if (parsed.goals) {
          localStorage.setItem('sbp-goals', JSON.stringify(parsed.goals))
        }
        resolve(true)
      } catch {
        resolve(false)
      }
    }
    reader.onerror = () => resolve(false)
    reader.readAsText(file)
  })
}
