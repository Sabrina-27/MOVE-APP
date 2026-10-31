import { Transaction, Goal } from '../../src/types/index.js';

export class CalculationService {
  /**
   * Safely calculates balance = income - expense
   */
  static calculateBalance(income: number, expense: number): number {
    const safeIncome = Number.isFinite(income) ? income : 0;
    const safeExpense = Number.isFinite(expense) ? expense : 0;
    return Number((safeIncome - safeExpense).toFixed(2));
  }

  /**
   * Percentage of committed income: (expense / income) * 100
   * If income <= 0, returns 0 or 100 based on expenses
   */
  static calculateCommittedIncomePct(expense: number, income: number): number {
    if (!Number.isFinite(income) || income <= 0) {
      return expense > 0 ? 100 : 0;
    }
    const pct = (expense / income) * 100;
    return Number(Math.min(pct, 999).toFixed(1));
  }

  /**
   * Percentage variation: ((current - previous) / previous) * 100
   * Treats zero division properly
   */
  static calculatePercentageVariation(current: number, previous: number): number {
    if (!Number.isFinite(previous) || previous === 0) {
      if (current > 0) return 100;
      if (current < 0) return -100;
      return 0;
    }
    const varPct = ((current - previous) / Math.abs(previous)) * 100;
    return Number(varPct.toFixed(1));
  }

  /**
   * Difference in R$
   */
  static calculateAbsoluteDifference(current: number, previous: number): number {
    const safeCurrent = Number.isFinite(current) ? current : 0;
    const safePrev = Number.isFinite(previous) ? previous : 0;
    return Number((safeCurrent - safePrev).toFixed(2));
  }

  /**
   * Goal progress percentage: (current / target) * 100
   */
  static calculateGoalProgress(currentAmount: number, targetAmount: number): number {
    if (!Number.isFinite(targetAmount) || targetAmount <= 0) return 0;
    const pct = (currentAmount / targetAmount) * 100;
    return Number(Math.min(pct, 100).toFixed(1));
  }

  /**
   * Calculates monthly contribution required for a goal
   * value = remaining / monthsLeft
   */
  static calculateMonthlyGoalContribution(goal: Goal): {
    remainingAmount: number;
    monthsRemaining: number;
    monthlyRequired: number;
  } {
    const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
    if (remaining <= 0) {
      return { remainingAmount: 0, monthsRemaining: 0, monthlyRequired: 0 };
    }

    const today = new Date();
    const deadline = new Date(goal.deadline);
    const diffMonths = (deadline.getFullYear() - today.getFullYear()) * 12 + (deadline.getMonth() - today.getMonth());
    const safeMonths = Math.max(1, diffMonths);

    const monthlyRequired = Number((remaining / safeMonths).toFixed(2));
    return {
      remainingAmount: Number(remaining.toFixed(2)),
      monthsRemaining: safeMonths,
      monthlyRequired
    };
  }

  /**
   * Aggregates totals from an array of transactions
   */
  static aggregateTotals(transactions: Transaction[]): {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    incomeCommittedPct: number;
    count: number;
  } {
    let totalIncome = 0;
    let totalExpense = 0;

    for (const t of transactions) {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') {
        totalIncome += amt;
      } else if (t.type === 'expense') {
        totalExpense += amt;
      }
    }

    totalIncome = Number(totalIncome.toFixed(2));
    totalExpense = Number(totalExpense.toFixed(2));
    const balance = this.calculateBalance(totalIncome, totalExpense);
    const incomeCommittedPct = this.calculateCommittedIncomePct(totalExpense, totalIncome);

    return {
      totalIncome,
      totalExpense,
      balance,
      incomeCommittedPct,
      count: transactions.length
    };
  }

  /**
   * Breakdown by category with exact percentages
   */
  static calculateCategoryDistribution(transactions: Transaction[], type: 'expense' | 'income' = 'expense'): {
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
  }[] {
    const filtered = transactions.filter(t => t.type === type);
    const map = new Map<string, { name: string; amount: number }>();

    let total = 0;
    for (const t of filtered) {
      const amt = Number(t.amount) || 0;
      total += amt;
      const existing = map.get(t.categoryId) || { name: t.categoryName || 'Outros', amount: 0 };
      existing.amount += amt;
      map.set(t.categoryId, existing);
    }

    const results: { categoryId: string; categoryName: string; amount: number; percentage: number }[] = [];
    map.forEach((val, id) => {
      const amount = Number(val.amount.toFixed(2));
      const percentage = total > 0 ? Number(((amount / total) * 100).toFixed(1)) : 0;
      results.push({
        categoryId: id,
        categoryName: val.name,
        amount,
        percentage
      });
    });

    return results.sort((a, b) => b.amount - a.amount);
  }

  /**
   * Simulates savings scenario
   */
  static simulateSavings(currentSavings: number, monthlyDeposit: number, months: number): {
    month: number;
    totalAccumulated: number;
    totalDeposited: number;
  }[] {
    const results = [];
    let acc = currentSavings;
    for (let m = 1; m <= months; m++) {
      acc += monthlyDeposit;
      results.push({
        month: m,
        totalAccumulated: Number(acc.toFixed(2)),
        totalDeposited: Number((monthlyDeposit * m).toFixed(2))
      });
    }
    return results;
  }
}
