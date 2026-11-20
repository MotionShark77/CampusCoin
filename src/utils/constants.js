// ─── Month labels ────────────────────────────────────────────────────────────
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

// ─── Expense categories ───────────────────────────────────────────────────────
export const EXPENSE_CATEGORIES = [
  { value: 'rent',          label: 'Rent',             icon: '🏠', color: '#6366f1' },
  { value: 'food',          label: 'Food',             icon: '🍔', color: '#22c55e' },
  { value: 'education',     label: 'Education',        icon: '📚', color: '#3b82f6' },
  { value: 'transport',     label: 'Transport',        icon: '🚌', color: '#f59e0b' },
  { value: 'phone',         label: 'Phone & Internet', icon: '📱', color: '#a855f7' },
  { value: 'entertainment', label: 'Entertainment',    icon: '🎮', color: '#ef4444' },
  { value: 'clothing',      label: 'Clothing',         icon: '👕', color: '#14b8a6' },
  { value: 'health',        label: 'Health',           icon: '💊', color: '#f97316' },
  { value: 'subscriptions', label: 'Subscriptions',    icon: '🔔', color: '#ec4899' },
  { value: 'misc',          label: 'Misc',             icon: '📦', color: '#6b7280' },
]

// ─── Income frequencies ───────────────────────────────────────────────────────
export const INCOME_FREQUENCIES = [
  { value: 'monthly',  label: 'Monthly' },
  { value: 'weekly',   label: 'Weekly'  },
  { value: 'one-time', label: 'One-time' },
]

// ─── Chart colors ─────────────────────────────────────────────────────────────
export const CHART_COLORS = [
  '#6366f1', // indigo
  '#22c55e', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#3b82f6', // blue
  '#a855f7', // purple
  '#14b8a6', // teal
  '#f97316', // orange
]

// ─── Category → Tailwind color string ────────────────────────────────────────
export const CAT_COLORS = {
  rent:          'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  food:          'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  education:     'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  transport:     'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  phone:         'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  entertainment: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  clothing:      'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  health:        'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  subscriptions: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  misc:          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

// ─── Budget tips ──────────────────────────────────────────────────────────────
export const BUDGET_TIPS = [
  {
    icon: '☕',
    title: 'Skip the daily café',
    text: 'Brewing your own coffee saves ₹1,500–₹3,000 per month. Invest that in a decent flask!',
  },
  {
    icon: '🛒',
    title: 'Meal prep on Sundays',
    text: 'Cooking in batches reduces food expenses by up to 40% compared to eating out daily.',
  },
  {
    icon: '📚',
    title: 'Use the library first',
    text: 'Before buying textbooks, check your college library or platforms like Z-Library and Libgen.',
  },
  {
    icon: '🎟️',
    title: 'Leverage student discounts',
    text: 'Show your student ID for discounts on software, streaming, public transport, and museums.',
  },
  {
    icon: '📱',
    title: 'Audit your subscriptions',
    text: 'Cancel streaming services you barely use. ₹300–₹600/month adds up to ₹7,200/year.',
  },
  {
    icon: '🤝',
    title: 'Share subscriptions',
    text: 'Split Netflix, Spotify, or YouTube Premium with friends to pay 25–50% of the cost.',
  },
  {
    icon: '🚶',
    title: 'Walk or cycle short distances',
    text: 'Saves on transport and keeps you fit. Even 3 trips saved per week = ₹600+/month.',
  },
  {
    icon: '💳',
    title: 'Use UPI and avoid ATM fees',
    text: 'Digital payments give you a clear record and avoid ₹20–₹50 ATM withdrawal fees.',
  },
  {
    icon: '📊',
    title: 'Set a daily spending cap',
    text: 'Divide your disposable income by days in the month. Treat it as a daily game to beat.',
  },
  {
    icon: '🎯',
    title: 'Save first, spend second',
    text: 'Transfer your savings target the moment income arrives. Treat savings as a fixed expense.',
  },
]

// ─── Default suggested budgets per category (in INR) ─────────────────────────
export const DEFAULT_BUDGETS = {
  rent:          6000,
  food:          3000,
  education:     1500,
  transport:      500,
  phone:          400,
  entertainment: 1000,
  clothing:       500,
  health:         500,
  subscriptions:  400,
  misc:           600,
}

// ─── Score thresholds ─────────────────────────────────────────────────────────
export const SCORE_THRESHOLDS = {
  excellent: 75,
  good:      50,
  poor:      25,
}
