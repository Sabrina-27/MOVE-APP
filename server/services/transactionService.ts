import { db } from '../data/store.js';
import { CalculationService } from './calculationService.js';
import { Transaction, TransactionType } from '../../src/types/index.js';

export interface TransactionFilter {
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  monthKey?: string; // e.g. "2026-10"
  search?: string;
}

export class TransactionService {
  static getTransactions(userId: string = 'user_mova_001', filters?: TransactionFilter): Transaction[] {
    let list = db.getTransactions(userId);

    if (filters) {
      if (filters.type) {
        list = list.filter(t => t.type === filters.type);
      }
      if (filters.categoryId && filters.categoryId !== 'all') {
        list = list.filter(t => t.categoryId === filters.categoryId);
      }
      if (filters.monthKey) {
        list = list.filter(t => t.date.startsWith(filters.monthKey!));
      }
      if (filters.startDate) {
        list = list.filter(t => t.date >= filters.startDate!);
      }
      if (filters.endDate) {
        list = list.filter(t => t.date <= filters.endDate!);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        list = list.filter(t =>
          t.description.toLowerCase().includes(q) ||
          t.categoryName.toLowerCase().includes(q)
        );
      }
    }

    return list;
  }

  static createTransaction(
    userId: string = 'user_mova_001',
    data: {
      type: TransactionType;
      amount: number;
      categoryId: string;
      date: string;
      description: string;
      paymentMethod: any;
    }
  ): { success: boolean; transaction?: Transaction; error?: string } {
    // Validation
    if (!data.type || !['income', 'expense'].includes(data.type)) {
      return { success: false, error: 'Tipo de movimentação inválido (deve ser receita ou despesa).' };
    }
    const safeAmount = Number(data.amount);
    if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
      return { success: false, error: 'O valor deve ser maior que zero (R$ 0,00).' };
    }
    if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      return { success: false, error: 'Data em formato inválido. Use AAAA-MM-DD.' };
    }

    const category = db.getCategoryById(userId, data.categoryId);
    const categoryName = category ? category.name : 'Outros';

    const tx = db.createTransaction(userId, {
      type: data.type,
      amount: Number(safeAmount.toFixed(2)),
      categoryId: data.categoryId || 'cat_outros',
      categoryName,
      date: data.date,
      description: data.description ? data.description.trim() : (data.type === 'income' ? 'Receita' : 'Despesa'),
      paymentMethod: data.paymentMethod || 'pix',
      accountType: 'corrente'
    });

    // Check budget alert if expense
    if (data.type === 'expense' && category && category.budgetLimit && category.budgetLimit > 0) {
      const monthKey = data.date.substring(0, 7);
      const monthTxs = this.getTransactions(userId, { monthKey, categoryId: category.id, type: 'expense' });
      const totalCatSpent = monthTxs.reduce((acc, t) => acc + t.amount, 0);

      if (totalCatSpent >= category.budgetLimit) {
        db.addNotification(userId, {
          title: `Limite Ultrapassado: ${category.name}`,
          message: `Você atingiu R$ ${totalCatSpent.toFixed(2)} gastos na categoria ${category.name}, superando o limite de R$ ${category.budgetLimit.toFixed(2)}.`,
          type: 'budget_alert',
          read: false
        });
      } else if (totalCatSpent >= category.budgetLimit * 0.8) {
        db.addNotification(userId, {
          title: `Atenção ao Limite: ${category.name}`,
          message: `Você já utilizou ${Math.round((totalCatSpent / category.budgetLimit) * 100)}% do orçamento estipulado para ${category.name}.`,
          type: 'budget_alert',
          read: false
        });
      }
    }

    return { success: true, transaction: tx };
  }

  static updateTransaction(userId: string = 'user_mova_001', id: string, updates: Partial<Transaction>) {
    if (updates.categoryId) {
      const cat = db.getCategoryById(userId, updates.categoryId);
      if (cat) updates.categoryName = cat.name;
    }
    if (updates.amount !== undefined) {
      updates.amount = Number(Number(updates.amount).toFixed(2));
    }
    const updated = db.updateTransaction(userId, id, updates);
    if (!updated) return { success: false, error: 'Movimentação não encontrada.' };
    return { success: true, transaction: updated };
  }

  static deleteTransaction(userId: string = 'user_mova_001', id: string) {
    const ok = db.deleteTransaction(userId, id);
    if (!ok) return { success: false, error: 'Movimentação não encontrada.' };
    return { success: true };
  }

  static getMonthlySummary(userId: string = 'user_mova_001', monthKey: string = '2026-10') {
    const currentMonthTxs = this.getTransactions(userId, { monthKey });
    const currentTotals = CalculationService.aggregateTotals(currentMonthTxs);

    // Compute previous month key
    const [y, m] = monthKey.split('-').map(Number);
    const prevDate = new Date(y, m - 2, 1);
    const prevMonthKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
    const prevMonthTxs = this.getTransactions(userId, { monthKey: prevMonthKey });
    const prevTotals = CalculationService.aggregateTotals(prevMonthTxs);

    const incomeDiff = CalculationService.calculateAbsoluteDifference(currentTotals.totalIncome, prevTotals.totalIncome);
    const incomePctDiff = CalculationService.calculatePercentageVariation(currentTotals.totalIncome, prevTotals.totalIncome);
    const expenseDiff = CalculationService.calculateAbsoluteDifference(currentTotals.totalExpense, prevTotals.totalExpense);
    const expensePctDiff = CalculationService.calculatePercentageVariation(currentTotals.totalExpense, prevTotals.totalExpense);
    const balanceDiff = CalculationService.calculateAbsoluteDifference(currentTotals.balance, prevTotals.balance);

    const categories = db.getCategories(userId);
    const catDist = CalculationService.calculateCategoryDistribution(currentMonthTxs, 'expense');

    const topCategories = catDist.map(c => {
      const match = categories.find(cat => cat.id === c.categoryId);
      return {
        ...c,
        color: match?.color || '#0C6B58'
      };
    });

    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    return {
      monthKey,
      monthName: monthNames[m - 1] || 'Mês Atual',
      year: y,
      totalIncome: currentTotals.totalIncome,
      totalExpense: currentTotals.totalExpense,
      balance: currentTotals.balance,
      incomeCommittedPct: currentTotals.incomeCommittedPct,
      prevMonthDiff: {
        incomeDiff,
        incomePctDiff,
        expenseDiff,
        expensePctDiff,
        balanceDiff
      },
      topCategories,
      transactionCount: currentMonthTxs.length
    };
  }
}
