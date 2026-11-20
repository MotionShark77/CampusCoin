# 🎓 AI Student Budget Planner

A responsive, feature-rich personal finance web application built specifically for college and university students. Track income, monitor expenses by category with budget limits, set savings goals, visualize trends, and receive smart, rule-based AI financial coaching tailored to student lifestyles.

---

## 🚀 Features

- **📊 Comprehensive Financial Overview**: Real-time snapshot of Total Income, Total Expenses, Net Balance, Savings Rate, and an algorithmic Budget Health Score (0–100 with Letter Grades).
- **📈 Visual Analytics**:
  - Interactive Income vs. Expense SVG bar comparisons.
  - Category-based breakdown donut chart.
  - Per-category budget utilization health meters.
  - 6-month historical trajectory sparklines.
- **💵 Income Management**: Multi-frequency income tracking (monthly, weekly with automatic 4x extrapolation, and one-off stipends/scholarships).
- **💸 Expense Tracking**: Categorization (Housing, Food, Education, Transit, Connectivity, Subscriptions, Leisure, Health, Misc) with live search and category filters.
- **🎯 Savings Goals**: Goal creation with target deadlines, visual progress gauges, dynamic month-to-completion projections, and direct incremental savings allocation.
- **🤖 AI Financial Coach**:
  - 50/30/20 budget framework analysis (Needs vs. Wants vs. Savings).
  - Spending ratio alerts (food, rent, entertainment thresholds).
  - Overspending warnings and subscription auditing.
  - Rotating student money-saving tips and best practices.
- **🗓 Multi-Month Archive & Data Portability**:
  - Discrete per-month ledger with historical browsing.
  - Full CSV export for income, expenses, and comprehensive summaries.
  - Complete JSON backup and restore capabilities.
- **🌓 Adaptive Interface**: System-aware auto, light, and dark mode styling powered by Tailwind CSS.

---

## 🛠 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & PostCSS
- **Icons**: Unicode & Lucide React
- **Persistence**: Browser `localStorage` (100% private, client-side only)

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd "/Users/shardulsharadtoley/Documents/Project/Student-Budget-Planner"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the local development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview the production build:
   ```bash
   npm run preview
   ```
