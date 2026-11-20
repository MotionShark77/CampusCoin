import { useRef, useState } from 'react'
import { useBudget } from '../../context/BudgetContext.jsx'
import { MONTHS } from '../../utils/constants.js'
import { fmtINR } from '../../utils/calculations.js'
import { exportAllJSON, importFromJSON } from '../../utils/export.js'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import Badge from '../ui/Badge.jsx'
import Sparkline from '../charts/Sparkline.jsx'

export default function HistoryTab() {
  const { allData = {}, goals = [], curMonth, curYear, setMonth, setActiveTab } = useBudget()
  const fileInputRef = useRef(null)
  const [importStatus, setImportStatus] = useState(null)

  // Extract all keys and sort descending
  const monthKeys = Object.keys(allData).sort().reverse()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const success = await importFromJSON(file)
    if (success) {
      setImportStatus('Data imported successfully! Refreshing view...')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      setImportStatus('Failed to import JSON file. Please check format.')
    }
  }

  return (
    <div className="space-y-5 fade-in">
      {/* 6-Month Visual Overview */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">📊 Multi-Month Trajectory</h3>
          <span className="text-xs text-gray-400">Green = Income, Red = Expenses</span>
        </div>
        <Sparkline />
      </Card>

      {/* Backup and Data Portability Card */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Data Management & Backup</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Export your data to JSON or import from a previous backup file</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => exportAllJSON(allData, goals)}>
              ⬇ Download Backup
            </Button>
            <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
              ⬆ Restore Backup
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
        {importStatus && (
          <div className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {importStatus}
          </div>
        )}
      </Card>

      {/* Recorded Months List */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🗓 Recorded Months</h3>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {monthKeys.map((key) => {
            const [yStr, mStr] = key.split('-')
            const y = parseInt(yStr, 10)
            const m = parseInt(mStr, 10) - 1 // 0-based
            const data = allData[key] || { income: [], expenses: [] }

            const inc = (data.income || []).reduce((s, i) => s + Number(i.amount || 0), 0)
            const exp = (data.expenses || []).reduce((s, e) => s + Number(e.amount || 0), 0)
            const bal = inc - exp
            const sr = inc > 0 ? Math.round((bal / inc) * 100) : 0
            const isCurrent = m === curMonth && y === curYear

            return (
              <div
                key={key}
                onClick={() => {
                  setMonth(m, y)
                  setActiveTab('overview')
                }}
                className={`py-3.5 px-3 rounded-xl flex flex-wrap items-center justify-between gap-3 cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {MONTHS[m]} {y}
                      </span>
                      {isCurrent && <Badge variant="info">Active Month</Badge>}
                    </div>
                    <div className="text-xs text-gray-400">
                      {data.income?.length || 0} income · {data.expenses?.length || 0} expenses
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-gray-400 block">Income</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{fmtINR(inc)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Expenses</span>
                    <span className="font-bold text-red-500">{fmtINR(exp)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Balance</span>
                    <span className={`font-bold ${bal >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                      {bal < 0 ? '-' : ''}{fmtINR(bal)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Saved</span>
                    <Badge variant={sr >= 20 ? 'success' : sr > 0 ? 'warning' : 'danger'}>
                      {sr}%
                    </Badge>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
