import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'sbp-data';
const GOALS_KEY = 'sbp-goals';
const INITIALIZED_KEY = 'sbp-initialized';

// ─── Sample / seed data ───────────────────────────────────────────────────────

function buildMonthKey(month, year) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function generateSampleData() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const allData = {};

  // 5 prior months – realistic random variation
  for (let offset = 5; offset >= 1; offset--) {
    const d = new Date(currentYear, currentMonth - offset, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    const key = buildMonthKey(m, y);

    const scholarship = 12000;
    const partTime = Math.round(2500 + Math.random() * 1500);

    const rentAmt = Math.round(4300 + Math.random() * 400);
    const foodAmt = Math.round(2400 + Math.random() * 800);
    const booksAmt = Math.round(500 + Math.random() * 600);
    const busAmt = Math.round(300 + Math.random() * 250);
    const phoneAmt = 299;
    const subsAmt = Math.round(199 + Math.random() * 250);
    const entAmt = Math.round(800 + Math.random() * 800);

    allData[key] = {
      income: [
        { id: `inc-${key}-1`, name: 'Scholarship', amount: scholarship, category: 'scholarship', date: `${y}-${String(m + 1).padStart(2, '0')}-01` },
        { id: `inc-${key}-2`, name: 'Part-time Job', amount: partTime, category: 'job', date: `${y}-${String(m + 1).padStart(2, '0')}-15` },
      ],
      expenses: [
        { id: `exp-${key}-1`, name: 'Rent', amount: rentAmt, budget: 5000, category: 'housing', date: `${y}-${String(m + 1).padStart(2, '0')}-01` },
        { id: `exp-${key}-2`, name: 'Food & Groceries', amount: foodAmt, budget: 3000, category: 'food', date: `${y}-${String(m + 1).padStart(2, '0')}-05` },
        { id: `exp-${key}-3`, name: 'Books & Supplies', amount: booksAmt, budget: 1000, category: 'education', date: `${y}-${String(m + 1).padStart(2, '0')}-03` },
        { id: `exp-${key}-4`, name: 'Bus Pass', amount: busAmt, budget: 500, category: 'transport', date: `${y}-${String(m + 1).padStart(2, '0')}-02` },
        { id: `exp-${key}-5`, name: 'Phone Bill', amount: phoneAmt, budget: 400, category: 'utilities', date: `${y}-${String(m + 1).padStart(2, '0')}-10` },
        { id: `exp-${key}-6`, name: 'Subscriptions', amount: subsAmt, budget: 300, category: 'subscriptions', date: `${y}-${String(m + 1).padStart(2, '0')}-12` },
        { id: `exp-${key}-7`, name: 'Entertainment', amount: entAmt, budget: 1000, category: 'entertainment', date: `${y}-${String(m + 1).padStart(2, '0')}-20` },
      ],
    };
  }

  // Current month
  const curKey = buildMonthKey(currentMonth, currentYear);
  allData[curKey] = {
    income: [
      { id: 'inc-cur-1', name: 'Scholarship', amount: 12000, category: 'scholarship', date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01` },
      { id: 'inc-cur-2', name: 'Part-time Job', amount: 3000, category: 'job', date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15` },
    ],
    expenses: [
      { id: 'exp-cur-1', name: 'Rent', amount: 4500, budget: 5000, category: 'housing', date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01` },
      { id: 'exp-cur-2', name: 'Food & Groceries', amount: 2800, budget: 3000, category: 'food', date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-05` },
      { id: 'exp-cur-3', name: 'Books & Supplies', amount: 800, budget: 1000, category: 'education', date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-03` },
      { id: 'exp-cur-4', name: 'Bus Pass', amount: 400, budget: 500, category: 'transport', date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-02` },
      { id: 'exp-cur-5', name: 'Phone Bill', amount: 299, budget: 400, category: 'utilities', date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-10` },
      { id: 'exp-cur-6', name: 'Subscriptions', amount: 349, budget: 300, category: 'subscriptions', date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-12` },
      { id: 'exp-cur-7', name: 'Entertainment', amount: 1200, budget: 1000, category: 'entertainment', date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-20` },
    ],
  };

  return allData;
}

function generateSampleGoals() {
  return [
    {
      id: 'goal-1',
      name: 'Laptop',
      targetAmount: 50000,
      savedAmount: 12000,
      deadline: null,
      icon: '💻',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'goal-2',
      name: 'Emergency Fund',
      targetAmount: 15000,
      savedAmount: 5000,
      deadline: null,
      icon: '🛡️',
      createdAt: new Date().toISOString(),
    },
  ];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readAllData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAllData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('BudgetContext: failed to persist data', e);
  }
}

function readGoals() {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeGoals(goals) {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch (e) {
    console.error('BudgetContext: failed to persist goals', e);
  }
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const BudgetContext = createContext(null);

export function BudgetProvider({ children }) {
  const now = new Date();

  const [curMonth, setCurMonth] = useState(now.getMonth());
  const [curYear, setCurYear] = useState(now.getFullYear());
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem('sbp-theme') || 'auto'; } catch { return 'auto'; }
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  // All monthly data lives as a single object { 'YYYY-MM': { income, expenses } }
  const [allData, setAllData] = useState(() => {
    const initialized = localStorage.getItem(INITIALIZED_KEY);
    if (!initialized) {
      const sample = generateSampleData();
      writeAllData(sample);
      localStorage.setItem(INITIALIZED_KEY, '1');
      return sample;
    }
    return readAllData();
  });

  const [goals, setGoalsState] = useState(() => {
    const initialized = localStorage.getItem(INITIALIZED_KEY);
    // Note: initialized was just set above in allData init; check raw storage
    const existing = readGoals();
    if (existing.length === 0) {
      const sample = generateSampleGoals();
      writeGoals(sample);
      return sample;
    }
    return existing;
  });

  // Derived: current month's data
  const curKey = buildMonthKey(curMonth, curYear);
  const curData = allData[curKey] || { income: [], expenses: [] };

  // ── Month navigation ────────────────────────────────────────────────────────

  const prevMonth = useCallback(() => {
    setCurMonth(m => {
      if (m === 0) { setCurYear(y => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setCurMonth(m => {
      if (m === 11) { setCurYear(y => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  const setMonth = useCallback((m, y) => {
    setCurMonth(m);
    setCurYear(y);
  }, []);

  // ── Theme ───────────────────────────────────────────────────────────────────

  const setTheme = useCallback((t) => {
    setThemeState(t);
    try { localStorage.setItem('sbp-theme', t); } catch {}
  }, []);

  // ── Income CRUD ─────────────────────────────────────────────────────────────

  const addIncome = useCallback((item) => {
    setAllData(prev => {
      const key = buildMonthKey(curMonth, curYear);
      const monthData = prev[key] || { income: [], expenses: [] };
      const updated = {
        ...prev,
        [key]: {
          ...monthData,
          income: [...monthData.income, { ...item, id: uid() }],
        },
      };
      writeAllData(updated);
      return updated;
    });
  }, [curMonth, curYear]);

  const removeIncome = useCallback((id) => {
    setAllData(prev => {
      const key = buildMonthKey(curMonth, curYear);
      const monthData = prev[key] || { income: [], expenses: [] };
      const updated = {
        ...prev,
        [key]: {
          ...monthData,
          income: monthData.income.filter(i => i.id !== id),
        },
      };
      writeAllData(updated);
      return updated;
    });
  }, [curMonth, curYear]);

  // ── Expense CRUD ────────────────────────────────────────────────────────────

  const addExpense = useCallback((item) => {
    setAllData(prev => {
      const key = buildMonthKey(curMonth, curYear);
      const monthData = prev[key] || { income: [], expenses: [] };
      const updated = {
        ...prev,
        [key]: {
          ...monthData,
          expenses: [...monthData.expenses, { ...item, id: uid() }],
        },
      };
      writeAllData(updated);
      return updated;
    });
  }, [curMonth, curYear]);

  const removeExpense = useCallback((id) => {
    setAllData(prev => {
      const key = buildMonthKey(curMonth, curYear);
      const monthData = prev[key] || { income: [], expenses: [] };
      const updated = {
        ...prev,
        [key]: {
          ...monthData,
          expenses: monthData.expenses.filter(e => e.id !== id),
        },
      };
      writeAllData(updated);
      return updated;
    });
  }, [curMonth, curYear]);

  // ── Goals CRUD ──────────────────────────────────────────────────────────────

  const addGoal = useCallback((item) => {
    setGoalsState(prev => {
      const updated = [...prev, { ...item, id: uid(), savedAmount: 0, createdAt: new Date().toISOString() }];
      writeGoals(updated);
      return updated;
    });
  }, []);

  const removeGoal = useCallback((id) => {
    setGoalsState(prev => {
      const updated = prev.filter(g => g.id !== id);
      writeGoals(updated);
      return updated;
    });
  }, []);

  const contributeToGoal = useCallback((id, amount) => {
    setGoalsState(prev => {
      const updated = prev.map(g =>
        g.id === id
          ? { ...g, savedAmount: Math.min(g.targetAmount, (g.savedAmount || 0) + Number(amount)) }
          : g
      );
      writeGoals(updated);
      return updated;
    });
  }, []);

  // ── Historical data for sparkline ───────────────────────────────────────────

  const getHistoricalData = useCallback((months = 6) => {
    const result = [];
    for (let offset = months - 1; offset >= 0; offset--) {
      const d = new Date(curYear, curMonth - offset, 1);
      const key = buildMonthKey(d.getMonth(), d.getFullYear());
      const data = allData[key] || { income: [], expenses: [] };
      const totalIncome = data.income.reduce((s, i) => s + Number(i.amount), 0);
      const totalExpenses = data.expenses.reduce((s, e) => s + Number(e.amount), 0);
      result.push({
        key,
        month: d.getMonth(),
        year: d.getFullYear(),
        income: totalIncome,
        expenses: totalExpenses,
        savings: totalIncome - totalExpenses,
      });
    }
    return result;
  }, [allData, curMonth, curYear]);

  const value = {
    // State
    curMonth,
    curYear,
    curKey,
    theme,
    activeTab,
    // Derived
    curData,
    goals,
    allData,
    // Navigation
    prevMonth,
    nextMonth,
    setMonth,
    // Theme
    setTheme,
    // Tab
    setActiveTab,
    // Income
    addIncome,
    removeIncome,
    // Expense
    addExpense,
    removeExpense,
    // Goals
    addGoal,
    removeGoal,
    contributeToGoal,
    // History
    getHistoricalData,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be used inside BudgetProvider');
  return ctx;
}

export default BudgetContext;
