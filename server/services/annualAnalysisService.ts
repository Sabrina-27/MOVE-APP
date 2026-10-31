import { db } from '../data/store.js';
import { CalculationService } from './calculationService.js';
import { AnnualAnalysis, AnnualMonthData, Transaction } from '../../src/types/index.js';

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const MONTH_FULL_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export class AnnualAnalysisService {
  /**
   * Generates a 12-month evolution analysis for the user
   */
  static get12MonthEvolution(userId: string = 'user_mova_001'): AnnualAnalysis {
    const allTransactions = db.getTransactions(userId);

    // Build the list of last 12 months up to current (Nov 2025 - Oct 2026 based on 2026 reference)
    const now = new Date('2026-10-31T12:00:00Z');
    const monthsList: { year: number; month: number; key: string }[] = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-12
      const key = `${year}-${String(month).padStart(2, '0')}`;
      monthsList.push({ year, month, key });
    }

    // Group transactions by month
    const grouped = new Map<string, Transaction[]>();
    for (const m of monthsList) {
      grouped.set(m.key, []);
    }

    for (const tx of allTransactions) {
      const txMonthKey = tx.date.substring(0, 7); // YYYY-MM
      if (grouped.has(txMonthKey)) {
        grouped.get(txMonthKey)!.push(tx);
      }
    }

    const monthDataArray: AnnualMonthData[] = [];
    let runningCumulativeBalance = 0;
    let activeMonthsCount = 0;
    let sumIncome = 0;
    let sumExpense = 0;

    let bestBalanceMonth: { monthName: string; balance: number; year: number } | null = null;
    let worstBalanceMonth: { monthName: string; balance: number; year: number } | null = null;
    let highestIncomeMonth: { monthName: string; income: number; year: number } | null = null;
    let highestExpenseMonth: { monthName: string; expense: number; year: number } | null = null;

    // To calculate top overall category across the 12 months
    const allExpenses: Transaction[] = [];

    for (const m of monthsList) {
      const txs = grouped.get(m.key) || [];
      const totals = CalculationService.aggregateTotals(txs);

      if (txs.length > 0) {
        activeMonthsCount++;
        txs.forEach(t => {
          if (t.type === 'expense') allExpenses.push(t);
        });
      }

      runningCumulativeBalance += totals.balance;
      sumIncome += totals.totalIncome;
      sumExpense += totals.totalExpense;

      const monthName = MONTH_NAMES[m.month - 1];
      const fullMonthName = `${MONTH_FULL_NAMES[m.month - 1]} de ${m.year}`;

      const catDist = CalculationService.calculateCategoryDistribution(txs, 'expense');
      const topCat = catDist.length > 0 ? catDist[0] : undefined;

      const monthEntry: AnnualMonthData = {
        monthKey: m.key,
        monthName,
        fullMonthName,
        year: m.year,
        income: totals.totalIncome,
        expense: totals.totalExpense,
        balance: totals.balance,
        cumulativeBalance: Number(runningCumulativeBalance.toFixed(2)),
        transactionCount: txs.length,
        topCategoryName: topCat?.categoryName,
        topCategoryAmount: topCat?.amount
      };

      monthDataArray.push(monthEntry);

      // Compare best/worst only on months that have activity
      if (txs.length > 0) {
        if (!bestBalanceMonth || totals.balance > bestBalanceMonth.balance) {
          bestBalanceMonth = { monthName: `${monthName}/${m.year}`, balance: totals.balance, year: m.year };
        }
        if (!worstBalanceMonth || totals.balance < worstBalanceMonth.balance) {
          worstBalanceMonth = { monthName: `${monthName}/${m.year}`, balance: totals.balance, year: m.year };
        }
        if (!highestIncomeMonth || totals.totalIncome > highestIncomeMonth.income) {
          highestIncomeMonth = { monthName: `${monthName}/${m.year}`, income: totals.totalIncome, year: m.year };
        }
        if (!highestExpenseMonth || totals.totalExpense > highestExpenseMonth.expense) {
          highestExpenseMonth = { monthName: `${monthName}/${m.year}`, expense: totals.totalExpense, year: m.year };
        }
      }
    }

    const divisor = Math.max(1, activeMonthsCount);
    const monthlyAvgIncome = Number((sumIncome / divisor).toFixed(2));
    const monthlyAvgExpense = Number((sumExpense / divisor).toFixed(2));
    const monthlyAvgBalance = Number(((sumIncome - sumExpense) / divisor).toFixed(2));

    // Calculate top category over all 12 months
    const overallCatDist = CalculationService.calculateCategoryDistribution(allExpenses, 'expense');
    const topOverallCat = overallCatDist.length > 0
      ? {
          name: overallCatDist[0].categoryName,
          totalAmount: overallCatDist[0].amount,
          percentage: overallCatDist[0].percentage
        }
      : null;

    return {
      totalIncome: Number(sumIncome.toFixed(2)),
      totalExpense: Number(sumExpense.toFixed(2)),
      cumulativeBalance: Number(runningCumulativeBalance.toFixed(2)),
      monthlyAvgIncome,
      monthlyAvgExpense,
      monthlyAvgBalance,
      bestBalanceMonth,
      worstBalanceMonth,
      highestIncomeMonth,
      highestExpenseMonth,
      topExpenseCategoryOverall: topOverallCat,
      months: monthDataArray,
      isPartial: activeMonthsCount < 12,
      totalMonthsCount: activeMonthsCount
    };
  }
}
