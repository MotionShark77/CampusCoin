import { useState } from 'react'
import { useBudget } from '../../context/BudgetContext.jsx'
import { balance, fmtINR } from '../../utils/calculations.js'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import Input from '../ui/Input.jsx'
import Badge from '../ui/Badge.jsx'
import EmptyState from '../ui/EmptyState.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'

const GOAL_EMOJIS = ['💻', '📱', '✈️', '🏦', '🎓', '🚗', '🏠', '📷', '🎮', '🛍️']

export default function GoalsTab() {
  const { goals = [], addGoal, removeGoal, contributeToGoal, curData } = useBudget()
  const [form, setForm] = useState({ name: '', targetAmount: '', savedAmount: '', emoji: '🎯', deadline: '' })
  const [contribs, setContribs] = useState({})
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Goal name is required'
    if (!form.targetAmount || Number(form.targetAmount) <= 0) e.target = 'Enter a valid target amount'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 200))
    addGoal({
      name: form.name.trim(),
      targetAmount: Number(form.targetAmount),
      savedAmount: Number(form.savedAmount) || 0,
      icon: form.emoji,
      deadline: form.deadline || null,
    })
    setForm({ name: '', targetAmount: '', savedAmount: '', emoji: '🎯', deadline: '' })
    setErrors({})
    setLoading(false)
  }

  const monthlyBal = balance(curData)
  const totalSaved = goals.reduce((s, g) => s + (Number(g.savedAmount) || 0), 0)
  const totalTarget = goals.reduce((s, g) => s + (Number(g.targetAmount) || 0), 0)
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0

  return (
    <div className="space-y-5 fade-in">
      {/* Add form */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">🎯 New Savings Goal</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              label="Goal Name"
              placeholder="e.g. New Laptop"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              error={errors.name}
            />
            <Input
              label="Target Amount (₹)"
              type="number"
              placeholder="50000"
              min="1"
              value={form.targetAmount}
              onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))}
              error={errors.target}
            />
            <Input
              label="Already Saved (₹)"
              type="number"
              placeholder="0"
              min="0"
              value={form.savedAmount}
              onChange={(e) => setForm((f) => ({ ...f, savedAmount: e.target.value }))}
            />
            <Input
              label="Deadline (optional)"
              type="date"
              value={form.deadline}
              onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
            />
          </div>

          {/* Emoji picker */}
          <div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Choose Icon</div>
            <div className="flex gap-2 flex-wrap items-center">
              {GOAL_EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, emoji: em }))}
                  className={`text-xl p-1.5 rounded-xl transition-all ${
                    form.emoji === em
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 ring-2 ring-indigo-500'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {em}
                </button>
              ))}
              <input
                type="text"
                placeholder="Custom"
                maxLength={2}
                value={GOAL_EMOJIS.includes(form.emoji) ? '' : form.emoji}
                onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value || '🎯' }))}
                className="input w-20 text-center text-sm py-1.5"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" loading={loading}>
            Add Goal
          </Button>
        </form>
      </Card>

      {/* Goals summary */}
      {goals.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Overall Progress</span>
              <p className="text-xs text-gray-400">Total saved across all {goals.length} target(s)</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {fmtINR(totalSaved)} / {fmtINR(totalTarget)}
              </span>
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{overallPct}% achieved</div>
            </div>
          </div>
          <ProgressBar value={overallPct} size="md" />
        </Card>
      )}

      {/* Goal cards */}
      {!goals.length ? (
        <EmptyState
          icon="🎯"
          title="No goals yet"
          description="Set a savings target (laptop, emergency cushion, travel, course) to stay motivated!"
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const saved = Number(goal.savedAmount) || 0
            const target = Number(goal.targetAmount) || 1
            const pct = Math.min(100, Math.round((saved / target) * 100))
            const rem = Math.max(0, target - saved)
            const months = monthlyBal > 0 && rem > 0 ? Math.ceil(rem / monthlyBal) : null
            const done = pct >= 100

            return (
              <Card key={goal.id} className={done ? 'ring-2 ring-green-400 dark:ring-green-600' : ''}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{goal.icon || '🎯'}</span>
                    <div>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{goal.name}</span>
                      {goal.deadline && (
                        <div className="text-xs text-gray-400">Target date: {goal.deadline}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={done ? 'success' : pct >= 50 ? 'warning' : 'info'}>{pct}%</Badge>
                    <button
                      onClick={() => removeGoal(goal.id)}
                      className="text-gray-400 hover:text-red-500 text-xs px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete goal"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>
                    Saved: <strong className="text-green-600 dark:text-green-400">{fmtINR(saved)}</strong>
                  </span>
                  <span>
                    Target: <strong className="text-gray-700 dark:text-gray-300">{fmtINR(target)}</strong>
                  </span>
                </div>

                <ProgressBar
                  value={pct}
                  variant={done ? 'success' : pct >= 70 ? 'success' : pct >= 40 ? 'warning' : 'primary'}
                  size="md"
                />

                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>{done ? '🎉 Goal accomplished!' : `${fmtINR(rem)} to go`}</span>
                  <span>
                    {!done && months
                      ? `~${months} month${months !== 1 ? 's' : ''} at current savings`
                      : !done && monthlyBal <= 0
                      ? 'No monthly surplus'
                      : ''}
                  </span>
                </div>

                {!done && (
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <Input
                      type="number"
                      placeholder="Add savings (₹)"
                      min="1"
                      value={contribs[goal.id] || ''}
                      onChange={(e) => setContribs((c) => ({ ...c, [goal.id]: e.target.value }))}
                      className="text-xs"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        const amt = Number(contribs[goal.id])
                        if (amt > 0) {
                          contributeToGoal(goal.id, amt)
                          setContribs((c) => ({ ...c, [goal.id]: '' }))
                        }
                      }}
                    >
                      + Add
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
