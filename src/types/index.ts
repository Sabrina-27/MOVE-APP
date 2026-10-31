export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'debito' | 'credito' | 'pix' | 'dinheiro' | 'transferencia';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  categoryName: string;
  date: string; // YYYY-MM-DD
  description: string;
  paymentMethod: PaymentMethod;
  accountType?: 'corrente' | 'poupanca' | 'carteira';
  createdAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  budgetLimit?: number; // Limite mensal de gastos
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // YYYY-MM-DD
  category: string;
  icon?: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  monthlyLimit: number;
  spentAmount: number;
  month: string; // YYYY-MM
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  financialGoal?: string;
  isBankConnected: boolean;
  connectedBankName?: string;
  themePreference: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  createdAt: string;
}

export interface MonthlySummary {
  monthKey: string; // YYYY-MM
  monthName: string;
  year: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  incomeCommittedPct: number;
  prevMonthDiff: {
    incomeDiff: number;
    incomePctDiff: number;
    expenseDiff: number;
    expensePctDiff: number;
    balanceDiff: number;
  };
  topCategories: {
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
    color: string;
  }[];
}

export interface AnnualMonthData {
  monthKey: string; // e.g. "2026-05"
  monthName: string; // e.g. "Mai"
  fullMonthName: string; // e.g. "Maio de 2026"
  year: number;
  income: number;
  expense: number;
  balance: number; // income - expense
  cumulativeBalance: number;
  transactionCount: number;
  topCategoryName?: string;
  topCategoryAmount?: number;
}

export interface AnnualAnalysis {
  totalIncome: number;
  totalExpense: number;
  cumulativeBalance: number;
  monthlyAvgIncome: number;
  monthlyAvgExpense: number;
  monthlyAvgBalance: number;
  bestBalanceMonth: { monthName: string; balance: number; year: number } | null;
  worstBalanceMonth: { monthName: string; balance: number; year: number } | null;
  highestIncomeMonth: { monthName: string; income: number; year: number } | null;
  highestExpenseMonth: { monthName: string; expense: number; year: number } | null;
  topExpenseCategoryOverall: { name: string; totalAmount: number; percentage: number } | null;
  months: AnnualMonthData[];
  isPartial: boolean;
  totalMonthsCount: number;
}

export interface ComparisonResult {
  period1Label: string;
  period2Label: string;
  p1Income: number;
  p2Income: number;
  incomeDiff: number;
  incomeVarPct: number;
  p1Expense: number;
  p2Expense: number;
  expenseDiff: number;
  expenseVarPct: number;
  p1Balance: number;
  p2Balance: number;
  balanceDiff: number;
  balanceVarPct: number;
  categoryComparisons: {
    categoryName: string;
    p1Amount: number;
    p2Amount: number;
    diff: number;
    varPct: number;
  }[];
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  readTime: string;
  isExternal: boolean;
}

export interface EconomicIndicator {
  code: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
  source: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'budget_alert' | 'goal_progress' | 'monthly_summary' | 'tip' | 'transaction';
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  screenContext?: string;
  calculations?: {
    label: string;
    value: string;
    detail?: string;
  }[];
  relatedArticles?: Article[];
  timestamp: string;
}
