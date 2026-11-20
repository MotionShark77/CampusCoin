import { useState } from 'react'
import { useBudget } from '../../context/BudgetContext.jsx'
import { totalIncome } from '../../utils/calculations.js'
import { fmtINR } from '../../utils/calculations.js'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import Input from '../ui/Input.jsx'
import Select from '../ui/Select.jsx'
import EmptyState from '../ui/EmptyState.jsx'
import Badge from '../ui/Badge.jsx'

const FREQ_OPTIONS = [
  { value: 'monthly',  label: 'Monthly' },
  { value: 'weekly',   label: 'Weekly (×4)' },
  { value: 'one-time', label: 'One-time' },
]
const FREQ_BADGE = { monthly: 'info', weekly: 'success', 'one-time': 'neutral' }

export default function IncomeTab() {
  const { curData, addIncome, removeIncome } = useBudget()
  const [form, setForm]     = useState({ name: '', amount: '', frequency: 'monthly', notes: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())           e.name   = 'Name is required'
    if (!form.amount || form.amount <= 0) e.amount = 'Enter a valid amount'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 300))
    addIncome({ name: form.name.trim(), amount: Number(form.amount), frequency: form.frequency, notes: form.notes })
    setForm({ name: '', amount: '', frequency: 'monthly', notes: '' })
    setErrors({})
    setLoading(false)
  }

  const inc = curData.income || []
  const totalInc = inc.reduce((s, i) => s + (i.frequency === 'weekly' ? i.amount * 4 : i.amount), 0)

  return (
    <div className="space-y-5 fade-in">
      {/* Add form */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">➕ Add Income Source</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input label="Source Name" placeholder="e.g. Scholarship" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} error={errors.name} />
          <Input label="Amount (₹)" type="number" placeholder="12000" min="0" value={form.amount} onChange={e => setForm(f => ({...f, amount: e.target.value}))} error={errors.amount} />
          <Select label="Frequency" options={FREQ_OPTIONS} value={form.frequency} onChange={e => setForm(f => ({...f, frequency: e.target.value}))} />
          <div className="flex items-end">
            <Button type="submit" variant="primary" size="md" loading={loading} className="w-full">Add Income</Button>
          </div>
        </form>
      </Card>

      {/* List */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">💵 Income Sources</h3>
          {inc.length > 0 && (
            <span className="text-sm font-bold text-green-600 dark:text-green-400">Total: {fmtINR(totalInc)}</span>
          )}
        </div>

        {!inc.length
          ? <EmptyState icon="💵" title="No income sources yet" description="Add your scholarship, job, stipend or allowance above." />
          : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {inc.map(item => (
                <div key={item.id} className="flex items-center gap-3 py-3 group">
                  <span className="text-xl">💵</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{item.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant={FREQ_BADGE[item.frequency] || 'neutral'} className="capitalize">{item.frequency}</Badge>
                      {item.frequency === 'weekly' && (
                        <span className="text-xs text-gray-400">Monthly equiv: {fmtINR(item.amount * 4)}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-base font-bold text-green-600 dark:text-green-400">{fmtINR(item.amount)}</div>
                  <button
                    onClick={() => removeIncome(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 text-sm px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >✕</button>
                </div>
              ))}
            </div>
          )
        }
      </Card>
    </div>
  )
}
