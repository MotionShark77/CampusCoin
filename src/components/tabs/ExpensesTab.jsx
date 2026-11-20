import { useState, useMemo } from 'react'
import { useBudget } from '../../context/BudgetContext.jsx'
import { totalExpenses, expensesByCategory, budgetByCategory } from '../../utils/calculations.js'
import { fmtINR } from '../../utils/calculations.js'
import { EXPENSE_CATEGORIES } from '../../utils/constants.js'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import Input from '../ui/Input.jsx'
import Select from '../ui/Select.jsx'
import Badge from '../ui/Badge.jsx'
import EmptyState from '../ui/EmptyState.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'

const CAT_OPTIONS = EXPENSE_CATEGORIES.map(c => ({ value: c.value, label: c.icon + ' ' + c.label }))

const QUICK_ADDS = [
  { name: 'Chai', amount: 20, category: 'food' },
  { name: 'Zomato Order', amount: 150, category: 'food' },
  { name: 'Bus Fare', amount: 25, category: 'transport' },
  { name: 'Photocopy', amount: 30, category: 'education' },
  { name: 'OTT Subscription', amount: 199, category: 'subscriptions' },
  { name: 'Movie Ticket', amount: 250, category: 'entertainment' },
]

export default function ExpensesTab() {
  const { curData, addExpense, removeExpense } = useBudget()
  const [form, setForm]     = useState({ name: '', amount: '', category: 'food', budget: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')

  const validate = () => {
    const e = {}
    if (!form.name.trim())           e.name   = 'Description required'
    if (!form.amount || form.amount <= 0) e.amount = 'Enter a valid amount'
    setErrors(e); return !Object.keys(e).length
  }

  const handleSubmit = async e => {
    e.preventDefault(); if (!validate()) return
    setLoading(true); await new Promise(r => setTimeout(r, 250))
    addExpense({ name: form.name.trim(), amount: Number(form.amount), category: form.category, budget: Number(form.budget) || 0 })
    setForm({ name: '', amount: '', category: 'food', budget: '', notes: '' }); setErrors({}); setLoading(false)
  }

  const quickAdd = qa => {
    addExpense({ name: qa.name, amount: qa.amount, category: qa.category, budget: 0 })
  }

  const expenses = curData.expenses || []
  const filtered = useMemo(() => {
    return expenses.filter(e => {
      const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase())
      const matchCat = filterCat === 'all' || e.category === filterCat
      return matchSearch && matchCat
    })
  }, [expenses, search, filterCat])

  const cats    = expensesByCategory(curData)
  const buds    = budgetByCategory(curData)
  const total   = totalExpenses(curData)
  const activeCats = EXPENSE_CATEGORIES.filter(c => cats[c.value])

  return (
    <div className="space-y-5 fade-in">
      {/* Add form */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">➕ Add Expense</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Input label="Description" placeholder="e.g. Mess Food" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} error={errors.name} />
          <Input label="Amount (₹)" type="number" placeholder="500" min="0" value={form.amount} onChange={e => setForm(f=>({...f,amount:e.target.value}))} error={errors.amount} />
          <Select label="Category" options={CAT_OPTIONS} value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} />
          <Input label="Budget Limit (₹)" type="number" placeholder="Optional" min="0" value={form.budget} onChange={e => setForm(f=>({...f,budget:e.target.value}))} />
          <div className="flex items-end">
            <Button type="submit" variant="primary" size="md" loading={loading} className="w-full">Add</Button>
          </div>
        </form>
        {/* Quick adds */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 self-center">Quick add:</span>
          {QUICK_ADDS.map(qa => (
            <button key={qa.name} onClick={() => quickAdd(qa)}
              className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
              {qa.name} ₹{qa.amount}
            </button>
          ))}
        </div>
      </Card>

      {/* Category summary chips */}
      {activeCats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {activeCats.map(c => {
            const spent = cats[c.value]; const bud = buds[c.value]
            const pct = bud ? Math.round(spent/bud*100) : null
            return (
              <Card key={c.value} padding="sm" hoverable onClick={() => setFilterCat(filterCat === c.value ? 'all' : c.value)}
                className={filterCat === c.value ? 'border-indigo-400 dark:border-indigo-600' : ''}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span>{c.icon}</span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{c.label}</span>
                </div>
                <div className="text-sm font-bold text-red-500">{fmtINR(spent)}</div>
                {pct !== null && <ProgressBar value={pct} size="sm" className="mt-1" />}
              </Card>
            )
          })}
        </div>
      )}

      {/* Expense list */}
      <Card>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">💸 Expenses</h3>
          <div className="flex-1 min-w-32">
            <Input placeholder="🔍 Search expenses…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {total > 0 && <span className="text-sm font-bold text-red-500">Total: {fmtINR(total)}</span>}
        </div>

        {!filtered.length
          ? <EmptyState icon="💸" title="No expenses found" description={expenses.length ? 'Try a different search or category filter.' : 'Add your first expense above.'} action={search || filterCat !== 'all' ? { label: 'Clear filters', onClick: () => { setSearch(''); setFilterCat('all') } } : null} />
          : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map(item => {
                const cat = EXPENSE_CATEGORIES.find(c => c.value === item.category)
                return (
                  <div key={item.id} className="flex items-center gap-3 py-3 group">
                    <span className="text-lg">{cat?.icon || '📦'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{item.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="neutral" className="capitalize text-xs">{cat?.label || item.category}</Badge>
                        {item.budget > 0 && <span className="text-xs text-gray-400">Limit: {fmtINR(item.budget)}</span>}
                      </div>
                    </div>
                    <div className="text-base font-bold text-red-500">{fmtINR(item.amount)}</div>
                    <button
                      onClick={() => removeExpense(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">✕</button>
                  </div>
                )
              })}
            </div>
          )
        }
      </Card>
    </div>
  )
}
