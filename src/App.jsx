import { useBudget, BudgetProvider } from './context/BudgetContext.jsx'
import { useTheme } from './hooks/useTheme.js'
import Header from './components/Header.jsx'
import OverviewTab from './components/tabs/OverviewTab.jsx'
import IncomeTab from './components/tabs/IncomeTab.jsx'
import ExpensesTab from './components/tabs/ExpensesTab.jsx'
import GoalsTab from './components/tabs/GoalsTab.jsx'
import AIInsightsTab from './components/tabs/AIInsightsTab.jsx'
import HistoryTab from './components/tabs/HistoryTab.jsx'

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'income', label: 'Income', icon: '💵' },
  { id: 'expenses', label: 'Expenses', icon: '💸' },
  { id: 'goals', label: 'Goals', icon: '🎯' },
  { id: 'ai', label: 'AI Coach', icon: '🤖' },
  { id: 'history', label: 'History', icon: '🗓' },
]

function BudgetApp() {
  const { activeTab, setActiveTab, theme, curData, goals } = useBudget()
  useTheme(theme)

  // Map 'dashboard' to 'overview' if needed
  const currentTab = activeTab === 'dashboard' ? 'overview' : activeTab

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-20 sm:pb-8">
        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1.5 p-1.5 mb-6 overflow-x-auto rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          {TABS.map((t) => {
            const isActive = currentTab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {t.id === 'goals' && goals?.length > 0 && (
                  <span
                    className={`text-2xs px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {goals.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab Content Display */}
        <div className="tab-pane">
          {currentTab === 'overview' && <OverviewTab />}
          {currentTab === 'income' && <IncomeTab />}
          {currentTab === 'expenses' && <ExpensesTab />}
          {currentTab === 'goals' && <GoalsTab />}
          {currentTab === 'ai' && <AIInsightsTab />}
          {currentTab === 'history' && <HistoryTab />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-xs text-gray-400 bg-white/50 dark:bg-gray-900/50 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🎓 AI Student Budget Planner · Designed for College & University Life</span>
          <span>Your data stays 100% private in local storage</span>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <BudgetProvider>
      <BudgetApp />
    </BudgetProvider>
  )
}
