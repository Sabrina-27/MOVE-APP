import { db } from '../data/store.js';
import { CalculationService } from './calculationService.js';
import { ComparisonResult, Transaction } from '../../src/types/index.js';

export class ComparisonService {
  /**
   * Compares two arbitrary sets of transactions or two months
   */
  static compareMonths(
    monthKey1: string, // e.g. "2026-10"
    monthKey2: string, // e.g. "2026-09"
    userId: string = 'user_mova_001'
  ): ComparisonResult {
    const all = db.getTransactions(userId);
    const txs1 = all.filter(t => t.date.startsWith(monthKey1));
    const txs2 = all.filter(t => t.date.startsWith(monthKey2));

    const t1 = CalculationService.aggregateTotals(txs1);
    const t2 = CalculationService.aggregateTotals(txs2);

    const incomeDiff = CalculationService.calculateAbsoluteDifference(t1.totalIncome, t2.totalIncome);
    const incomeVarPct = CalculationService.calculatePercentageVariation(t1.totalIncome, t2.totalIncome);

    const expenseDiff = CalculationService.calculateAbsoluteDifference(t1.totalExpense, t2.totalExpense);
    const expenseVarPct = CalculationService.calculatePercentageVariation(t1.totalExpense, t2.totalExpense);

    const balanceDiff = CalculationService.calculateAbsoluteDifference(t1.balance, t2.balance);
    const balanceVarPct = CalculationService.calculatePercentageVariation(t1.balance, t2.balance);

    // Compare categories breakdown
    const catDist1 = CalculationService.calculateCategoryDistribution(txs1, 'expense');
    const catDist2 = CalculationService.calculateCategoryDistribution(txs2, 'expense');

    const catMap = new Map<string, { p1: number; p2: number }>();
    catDist1.forEach(c => {
      catMap.set(c.categoryName, { p1: c.amount, p2: 0 });
    });
    catDist2.forEach(c => {
      const existing = catMap.get(c.categoryName) || { p1: 0, p2: 0 };
      existing.p2 = c.amount;
      catMap.set(c.categoryName, existing);
    });

    const categoryComparisons: {
      categoryName: string;
      p1Amount: number;
      p2Amount: number;
      diff: number;
      varPct: number;
    }[] = [];

    catMap.forEach((val, catName) => {
      const diff = CalculationService.calculateAbsoluteDifference(val.p1, val.p2);
      const varPct = CalculationService.calculatePercentageVariation(val.p1, val.p2);
      categoryComparisons.push({
        categoryName: catName,
        p1Amount: val.p1,
        p2Amount: val.p2,
        diff,
        varPct
      });
    });

    categoryComparisons.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

    const formatLabel = (key: string) => {
      const [y, m] = key.split('-');
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const mIdx = parseInt(m, 10) - 1;
      return `${monthNames[mIdx] || m}/${y}`;
    };

    return {
      period1Label: formatLabel(monthKey1),
      period2Label: formatLabel(monthKey2),
      p1Income: t1.totalIncome,
      p2Income: t2.totalIncome,
      incomeDiff,
      incomeVarPct,
      p1Expense: t1.totalExpense,
      p2Expense: t2.totalExpense,
      expenseDiff,
      expenseVarPct,
      p1Balance: t1.balance,
      p2Balance: t2.balance,
      balanceDiff,
      balanceVarPct,
      categoryComparisons
    };
  }

  /**
   * Compares aggregate range (e.g. Last 3 Months vs Previous 3 Months)
   */
  static compareMultiMonthRanges(
    rangeMonthsCount: number, // 3, 6, or 12
    userId: string = 'user_mova_001'
  ): ComparisonResult {
    const all = db.getTransactions(userId);
    const now = new Date('2026-10-31T12:00:00Z');

    const getMonthsKeys = (offsetStart: number, count: number) => {
      const keys = new Set<string>();
      for (let i = 0; i < count; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - offsetStart - i, 1);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        keys.add(`${y}-${m}`);
      }
      return keys;
    };

    const period1Keys = getMonthsKeys(0, rangeMonthsCount);
    const period2Keys = getMonthsKeys(rangeMonthsCount, rangeMonthsCount);

    const txs1 = all.filter(t => period1Keys.has(t.date.substring(0, 7)));
    const txs2 = all.filter(t => period2Keys.has(t.date.substring(0, 7)));

    const t1 = CalculationService.aggregateTotals(txs1);
    const t2 = CalculationService.aggregateTotals(txs2);

    const incomeDiff = CalculationService.calculateAbsoluteDifference(t1.totalIncome, t2.totalIncome);
    const incomeVarPct = CalculationService.calculatePercentageVariation(t1.totalIncome, t2.totalIncome);

    const expenseDiff = CalculationService.calculateAbsoluteDifference(t1.totalExpense, t2.totalExpense);
    const expenseVarPct = CalculationService.calculatePercentageVariation(t1.totalExpense, t2.totalExpense);

    const balanceDiff = CalculationService.calculateAbsoluteDifference(t1.balance, t2.balance);
    const balanceVarPct = CalculationService.calculatePercentageVariation(t1.balance, t2.balance);

    const catDist1 = CalculationService.calculateCategoryDistribution(txs1, 'expense');
    const catDist2 = CalculationService.calculateCategoryDistribution(txs2, 'expense');

    const catMap = new Map<string, { p1: number; p2: number }>();
    catDist1.forEach(c => catMap.set(c.categoryName, { p1: c.amount, p2: 0 }));
    catDist2.forEach(c => {
      const existing = catMap.get(c.categoryName) || { p1: 0, p2: 0 };
      existing.p2 = c.amount;
      catMap.set(c.categoryName, existing);
    });

    const categoryComparisons: {
      categoryName: string;
      p1Amount: number;
      p2Amount: number;
      diff: number;
      varPct: number;
    }[] = [];

    catMap.forEach((val, catName) => {
      categoryComparisons.push({
        categoryName: catName,
        p1Amount: val.p1,
        p2Amount: val.p2,
        diff: CalculationService.calculateAbsoluteDifference(val.p1, val.p2),
        varPct: CalculationService.calculatePercentageVariation(val.p1, val.p2)
      });
    });

    categoryComparisons.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

    return {
      period1Label: `Últimos ${rangeMonthsCount} meses`,
      period2Label: `${rangeMonthsCount} meses anteriores`,
      p1Income: t1.totalIncome,
      p2Income: t2.totalIncome,
      incomeDiff,
      incomeVarPct,
      p1Expense: t1.totalExpense,
      p2Expense: t2.totalExpense,
      expenseDiff,
      expenseVarPct,
      p1Balance: t1.balance,
      p2Balance: t2.balance,
      balanceDiff,
      balanceVarPct,
      categoryComparisons
    };
  }

  /**
   * Compares two specific categories over the last 12 months
   */
  static compareTwoCategories(catId1: string, catId2: string, userId: string = 'user_mova_001') {
    const all = db.getTransactions(userId);
    const txs1 = all.filter(t => t.categoryId === catId1 && t.type === 'expense');
    const txs2 = all.filter(t => t.categoryId === catId2 && t.type === 'expense');

    const total1 = txs1.reduce((acc, t) => acc + (t.amount || 0), 0);
    const total2 = txs2.reduce((acc, t) => acc + (t.amount || 0), 0);

    const cat1 = db.getCategoryById(userId, catId1);
    const cat2 = db.getCategoryById(userId, catId2);

    const name1 = cat1?.name || catId1;
    const name2 = cat2?.name || catId2;

    const diff = CalculationService.calculateAbsoluteDifference(total1, total2);
    const varPct = CalculationService.calculatePercentageVariation(total1, total2);

    return {
      cat1: { id: catId1, name: name1, total: Number(total1.toFixed(2)), count: txs1.length },
      cat2: { id: catId2, name: name2, total: Number(total2.toFixed(2)), count: txs2.length },
      diff,
      varPct,
      moreExpensive: total1 >= total2 ? name1 : name2
    };
  }
}
