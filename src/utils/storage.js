// ─── Key helpers ─────────────────────────────────────────────────────────────

/**
 * Build a consistent localStorage key for a given month/year.
 * @param {number} month  0-indexed month (0 = January)
 * @param {number} year   4-digit year
 * @returns {string}  e.g. "sbp-2024-11"
 */
export function mkKey(month, year) {
  const m = String(month + 1).padStart(2, '0')
  return `sbp-${year}-${m}`
}

// ─── Month data ───────────────────────────────────────────────────────────────

/**
 * Load month data from localStorage.
 * Returns a fresh default object if nothing is stored.
 * @returns {{ income: Array, expenses: Array }}
 */
export function getMonthData(month, year) {
  try {
    const raw = localStorage.getItem(mkKey(month, year))
    if (!raw) return { income: [], expenses: [] }
    const parsed = JSON.parse(raw)
    return {
      income:   Array.isArray(parsed.income)   ? parsed.income   : [],
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
    }
  } catch {
    return { income: [], expenses: [] }
  }
}

/**
 * Persist month data to localStorage.
 * @param {number} month  0-indexed
 * @param {number} year
 * @param {{ income: Array, expenses: Array }} data
 */
export function saveMonthData(month, year, data) {
  try {
    localStorage.setItem(mkKey(month, year), JSON.stringify(data))
  } catch (e) {
    console.error('[storage] saveMonthData failed:', e)
  }
}

// ─── Goals ───────────────────────────────────────────────────────────────────

const GOALS_KEY = 'sbp-goals'

/**
 * @returns {Array}
 */
export function getGoals() {
  try {
    const raw = localStorage.getItem(GOALS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * @param {Array} goals
 */
export function saveGoals(goals) {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
  } catch (e) {
    console.error('[storage] saveGoals failed:', e)
  }
}

// ─── All month keys ───────────────────────────────────────────────────────────

/**
 * Returns all stored sbp-YYYY-MM keys, sorted chronologically.
 * @returns {string[]}
 */
export function getAllMonthKeys() {
  const keys = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && /^sbp-\d{4}-\d{2}$/.test(key)) {
      keys.push(key)
    }
  }
  return keys.sort()
}

// ─── Clear / export / import ──────────────────────────────────────────────────

/**
 * Remove all sbp-* keys from localStorage.
 */
export function clearAllData() {
  const toRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('sbp-')) toRemove.push(key)
  }
  toRemove.forEach((k) => localStorage.removeItem(k))
}

/**
 * Serialise every sbp-* key into a single JSON string.
 * @returns {string}
 */
export function exportAllData() {
  const result = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('sbp-')) {
      try {
        result[key] = JSON.parse(localStorage.getItem(key))
      } catch {
        result[key] = localStorage.getItem(key)
      }
    }
  }
  return JSON.stringify(result, null, 2)
}

/**
 * Restore all data from a JSON string produced by exportAllData().
 * @param {string} jsonString
 * @returns {boolean}  true on success
 */
export function importAllData(jsonString) {
  try {
    const data = JSON.parse(jsonString)
    if (typeof data !== 'object' || data === null) return false
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith('sbp-')) {
        localStorage.setItem(key, JSON.stringify(value))
      }
    }
    return true
  } catch {
    return false
  }
}

// ─── Settings ─────────────────────────────────────────────────────────────────

const SETTINGS_KEY = 'sbp-settings'

const DEFAULT_SETTINGS = {
  theme:          'auto',
  currency:       'INR',
  currencySymbol: '₹',
  notifications:  true,
}

/**
 * @returns {{ theme: string, currency: string, currencySymbol: string, notifications: boolean }}
 */
export function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

/**
 * @param {{ theme?: string, currency?: string, currencySymbol?: string, notifications?: boolean }} settings
 */
export function saveSettings(settings) {
  try {
    const current = getSettings()
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }))
  } catch (e) {
    console.error('[storage] saveSettings failed:', e)
  }
}
