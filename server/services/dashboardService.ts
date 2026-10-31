import { db } from '../data/store.js';
import { TransactionService } from './transactionService.js';
import { GoalsService } from './goalsService.js';
import { EconomicService } from './economicService.js';

export class DashboardService {
  static getDashboardData(userId: string = 'user_mova_001') {
    const user = db.getUser(userId);
    const monthKey = '2026-10'; // Reference month
    const summary = TransactionService.getMonthlySummary(userId, monthKey);
    const recentTransactions = TransactionService.getTransactions(userId).slice(0, 5);
    const goals = GoalsService.getGoals(userId);
    const indicators = EconomicService.getIndicators();

    // Calculate smart tips
    const tips: { id: string; title: string; message: string; tag: string }[] = [];

    if (summary.incomeCommittedPct > 70) {
      tips.push({
        id: 'tip_comp',
        title: 'Atenção à renda comprometida',
        message: `Suas despesas consomem ${summary.incomeCommittedPct}% da sua receita este mês. Tente manter abaixo de 60% para acelerar suas metas.`,
        tag: 'Orçamento'
      });
    } else {
      tips.push({
        id: 'tip_good',
        title: 'Controle saudável de gastos',
        message: `Excelente! Você comprometeu apenas ${summary.incomeCommittedPct}% das receitas este mês, sobrando margem para poupar.`,
        tag: 'Equilíbrio'
      });
    }

    if (goals.length > 0) {
      const topGoal = goals[0];
      tips.push({
        id: 'tip_goal',
        title: `Progresso na Meta: ${topGoal.title}`,
        message: `Guardando R$ ${topGoal.monthlyRequired.toFixed(2)} por mês, você conclui essa meta no prazo estipulado.`,
        tag: 'Metas'
      });
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        financialGoal: user.financialGoal,
        isBankConnected: user.isBankConnected,
        connectedBankName: user.connectedBankName
      },
      summary,
      recentTransactions,
      goals,
      indicators,
      tips
    };
  }
}
