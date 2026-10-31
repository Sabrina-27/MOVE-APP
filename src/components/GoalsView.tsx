import React, { useState } from 'react';
import {
  Target,
  Plus,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
  X,
  Coins
} from 'lucide-react';
import { Goal } from '../types/index.js';

interface GoalsViewProps {
  goals: (Goal & { progressPct: number; remainingAmount: number; monthsRemaining: number; monthlyRequired: number })[];
  onCreateGoal: (data: { title: string; targetAmount: number; currentAmount?: number; deadline: string; category?: string; notes?: string }) => Promise<{ success: boolean; error?: string }>;
  onContributeGoal: (id: string, amount: number) => Promise<{ success: boolean; error?: string }>;
  onDeleteGoal: (id: string) => Promise<{ success: boolean; error?: string }>;
  onOpenAssistantWithPrompt: (prompt: string) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  onCreateGoal,
  onContributeGoal,
  onDeleteGoal,
  onOpenAssistantWithPrompt
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmountStr, setDepositAmountStr] = useState<string>('');

  // Form states for creating goal
  const [title, setTitle] = useState('');
  const [targetAmountStr, setTargetAmountStr] = useState('');
  const [currentAmountStr, setCurrentAmountStr] = useState('');
  const [deadline, setDeadline] = useState('2027-06-30');
  const [category, setCategory] = useState('Reserva');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatBRL = (val: number | undefined) => {
    const num = Number(val) || 0;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const target = parseFloat(targetAmountStr.replace(/\./g, '').replace(',', '.'));
    const current = currentAmountStr ? parseFloat(currentAmountStr.replace(/\./g, '').replace(',', '.')) : 0;

    if (isNaN(target) || target <= 0) {
      setError('Informe um valor desejado válido.');
      return;
    }

    setIsSubmitting(true);
    const res = await onCreateGoal({
      title,
      targetAmount: target,
      currentAmount: current,
      deadline,
      category,
      notes
    });
    setIsSubmitting(false);

    if (res.success) {
      setIsCreateOpen(false);
      setTitle('');
      setTargetAmountStr('');
      setCurrentAmountStr('');
    } else {
      setError(res.error || 'Erro ao criar meta.');
    }
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositGoalId) return;
    const amount = parseFloat(depositAmountStr.replace(/\./g, '').replace(',', '.'));
    if (isNaN(amount) || amount <= 0) return;

    await onContributeGoal(depositGoalId, amount);
    setDepositGoalId(null);
    setDepositAmountStr('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Title & Add Goal Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Metas Financeiras</h1>
          <p className="text-xs text-stone-500">Planeje conquistas, acompanhe o progresso e calcule aportes mensais.</p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#0C6B58] text-white text-xs font-bold hover:bg-[#08493c] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Meta</span>
        </button>
      </div>

      {/* Goals Cards List */}
      <div className="space-y-4">
        {goals.map(goal => {
          const isCompleted = goal.progressPct >= 100;

          return (
            <div
              key={goal.id}
              className={`p-5 rounded-3xl bg-white border transition-all ${
                isCompleted ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-stone-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#0C6B58]/10 text-[#0C6B58] flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <span>{goal.title}</span>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Concluída!
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-stone-500">{goal.category} • Prazo: {goal.deadline.split('-').reverse().join('/')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDepositGoalId(goal.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 text-[#0C6B58] text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Guardar</span>
                  </button>

                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-1.5 text-stone-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 my-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-stone-800">{formatBRL(goal.currentAmount)}</span>
                  <span className="text-[#0C6B58]">{goal.progressPct}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0C6B58] to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.min(goal.progressPct, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span>Alvo: {formatBRL(goal.targetAmount)}</span>
                  <span>Faltam: {formatBRL(goal.remainingAmount)}</span>
                </div>
              </div>

              {/* Monthly Contribution Metric */}
              {!isCompleted && (
                <div className="p-3 bg-stone-50 rounded-2xl flex items-center justify-between text-xs mt-3">
                  <span className="text-stone-600 font-medium">Aporte mensal recomendado:</span>
                  <span className="font-extrabold text-[#0C6B58]">{formatBRL(goal.monthlyRequired)}/mês (~{goal.monthsRemaining} meses)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Simulation Box */}
      <div className="p-5 rounded-3xl bg-teal-50 border border-teal-200">
        <div className="flex items-center gap-2 text-[#0C6B58] font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Simulador de Metas com a IA</span>
        </div>
        <p className="text-xs text-stone-700 mb-3">
          Descubra como pequenos ajustes de gastos podem acelerar a conclusão dos seus sonhos:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onOpenAssistantWithPrompt('O que acontece se eu guardar R$ 100 a mais por mês?')}
            className="px-3 py-1.5 rounded-xl bg-white border border-teal-200 text-xs font-semibold text-[#0C6B58] hover:bg-teal-100 transition-colors"
          >
            "Se eu guardar R$ 100 a mais por mês?"
          </button>
          <button
            onClick={() => onOpenAssistantWithPrompt('Minhas metas estão compatíveis com meu orçamento mensal?')}
            className="px-3 py-1.5 rounded-xl bg-white border border-teal-200 text-xs font-semibold text-[#0C6B58] hover:bg-teal-100 transition-colors"
          >
            "Minha meta é compatível com meu salário?"
          </button>
        </div>
      </div>

      {/* Modal: Create Goal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-stone-100">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <h3 className="text-lg font-bold text-stone-900">Nova Meta Financeira</h3>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Título da Meta</label>
                <input
                  type="text"
                  placeholder="Ex: Reserva de emergência, Viagem, Computador..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Valor Alvo (R$)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ex: 5000,00"
                    value={targetAmountStr}
                    onChange={e => setTargetAmountStr(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Já tenho guardado</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ex: 500,00"
                    value={currentAmountStr}
                    onChange={e => setCurrentAmountStr(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Prazo desejado</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                  >
                    <option value="Reserva">Reserva</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Viagem">Viagem</option>
                    <option value="Educação">Educação</option>
                    <option value="Carro/Moto">Transporte</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-xs text-rose-600">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-[#0C6B58] text-white font-semibold text-sm hover:bg-[#08493c] transition-all"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Meta'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Deposit/Contribution */}
      {depositGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-stone-100">
            <button
              onClick={() => setDepositGoalId(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Guardar Dinheiro na Meta</h3>
              <p className="text-xs text-stone-500">Quanto você deseja destinar hoje para esta conquista?</p>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">R$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={depositAmountStr}
                  onChange={e => setDepositAmountStr(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-base font-extrabold text-stone-900"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#0C6B58] text-white font-semibold text-xs hover:bg-[#08493c] transition-all"
              >
                Confirmar Aporte
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
