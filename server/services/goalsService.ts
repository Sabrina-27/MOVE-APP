import { db } from '../data/store.js';
import { CalculationService } from './calculationService.js';
import { Goal } from '../../src/types/index.js';

export class GoalsService {
  static getGoals(userId: string = 'user_mova_001'): (Goal & {
    progressPct: number;
    remainingAmount: number;
    monthsRemaining: number;
    monthlyRequired: number;
  })[] {
    const goals = db.getGoals(userId);

    return goals.map(g => {
      const progressPct = CalculationService.calculateGoalProgress(g.currentAmount, g.targetAmount);
      const metrics = CalculationService.calculateMonthlyGoalContribution(g);

      return {
        ...g,
        progressPct,
        ...metrics
      };
    });
  }

  static createGoal(
    userId: string = 'user_mova_001',
    data: {
      title: string;
      targetAmount: number;
      currentAmount?: number;
      deadline: string;
      category?: string;
      notes?: string;
      icon?: string;
    }
  ) {
    if (!data.title || data.title.trim() === '') {
      return { success: false, error: 'O título da meta é obrigatório.' };
    }
    const target = Number(data.targetAmount);
    if (!Number.isFinite(target) || target <= 0) {
      return { success: false, error: 'O valor da meta deve ser maior que zero.' };
    }
    if (!data.deadline) {
      return { success: false, error: 'O prazo da meta é obrigatório.' };
    }

    const current = Math.max(0, Number(data.currentAmount) || 0);

    const goal = db.createGoal(userId, {
      title: data.title.trim(),
      targetAmount: Number(target.toFixed(2)),
      currentAmount: Number(current.toFixed(2)),
      deadline: data.deadline,
      category: data.category || 'Geral',
      notes: data.notes || '',
      icon: data.icon || 'Target'
    });

    db.addNotification(userId, {
      title: `Meta Criada: ${goal.title}`,
      message: `Meta de R$ ${goal.targetAmount.toFixed(2)} cadastrada com sucesso! Vamos juntos nessa jornada!`,
      type: 'goal_progress',
      read: false
    });

    return { success: true, goal };
  }

  static updateGoal(userId: string = 'user_mova_001', id: string, updates: Partial<Goal>) {
    if (updates.targetAmount !== undefined) {
      updates.targetAmount = Number(Number(updates.targetAmount).toFixed(2));
    }
    if (updates.currentAmount !== undefined) {
      updates.currentAmount = Number(Number(updates.currentAmount).toFixed(2));
    }

    const updated = db.updateGoal(userId, id, updates);
    if (!updated) return { success: false, error: 'Meta não encontrada.' };

    return { success: true, goal: updated };
  }

  static addContribution(userId: string = 'user_mova_001', id: string, amount: number) {
    const goals = db.getGoals(userId);
    const goal = goals.find(g => g.id === id);
    if (!goal) return { success: false, error: 'Meta não encontrada.' };

    const deposit = Number(amount);
    if (!Number.isFinite(deposit) || deposit <= 0) {
      return { success: false, error: 'Valor da contribuição deve ser positivo.' };
    }

    const newAmount = Number((goal.currentAmount + deposit).toFixed(2));
    const isCompleted = newAmount >= goal.targetAmount;

    const updated = db.updateGoal(userId, id, {
      currentAmount: newAmount,
      completedAt: isCompleted ? new Date().toISOString() : undefined
    });

    if (isCompleted) {
      db.addNotification(userId, {
        title: `Meta Concluída! 🚀`,
        message: `Parabéns! Você alcançou o objetivo "${goal.title}" de R$ ${goal.targetAmount.toFixed(2)}!`,
        type: 'goal_progress',
        read: false
      });
    }

    return { success: true, goal: updated };
  }

  static deleteGoal(userId: string = 'user_mova_001', id: string) {
    const ok = db.deleteGoal(userId, id);
    if (!ok) return { success: false, error: 'Meta não encontrada.' };
    return { success: true };
  }
}
