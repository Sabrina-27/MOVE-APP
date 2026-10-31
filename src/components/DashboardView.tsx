import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  Calendar,
  Wallet,
  PiggyBank,
  LineChart,
  Scale
} from 'lucide-react';
import { UserProfile, MonthlySummary, Transaction, Goal, EconomicIndicator } from '../types/index.js';

interface DashboardViewProps {
  user: UserProfile | null;
  summary: MonthlySummary | null;
  recentTransactions: Transaction[];
  goals: (Goal & { progressPct: number; remainingAmount: number; monthsRemaining: number; monthlyRequired: number })[];
  indicators: EconomicIndicator[];
  tips: { id: string; title: string; message: string; tag: string }[];
  onOpenAddTransaction: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenAssistant: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  summary,
  recentTransactions,
  goals,
  indicators,
  tips,
  onOpenAddTransaction,
  onNavigateTab,
  onOpenAssistant
}) => {
  const formatBRL = (val: number | undefined) => {
    const num = Number(val) || 0;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const balance = summary?.balance ?? 0;
  const income = summary?.totalIncome ?? 0;
  const expense = summary?.totalExpense ?? 0;

  // Monthly comparison details
  const expensePctDiff = summary?.prevMonthDiff?.expensePctDiff ?? 0;
  const isExpenseLower = expensePctDiff <= 0;

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Header Greeting & Goal Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Olá, {user?.name?.split(' ')[0] || 'Marina'}! 👋
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            {user?.financialGoal || 'Foco em autonomia e evolução financeira'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0C6B58]/10 text-[#0C6B58]">
            <Calendar className="w-3.5 h-3.5" />
            Outubro de 2026
          </span>
        </div>
      </div>

      {/* 2. Main Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0C6B58] via-[#095747] to-[#063f33] text-white p-6 shadow-xl shadow-[#0C6B58]/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-emerald-200" />
            </div>
            <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Saldo Livre no Mês</span>
          </div>

          <button
            onClick={() => onNavigateTab('ver-meu-mes')}
            className="text-xs font-semibold text-emerald-200 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Ver meu mês</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {formatBRL(balance)}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                isExpenseLower
                  ? 'bg-emerald-400/20 text-emerald-200'
                  : 'bg-rose-400/20 text-rose-200'
              }`}
            >
              {isExpenseLower ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              {Math.abs(expensePctDiff)}% de gastos vs mês anterior
            </span>
            <span className="text-xs text-emerald-200/80">({summary?.incomeCommittedPct}% da renda comprometida)</span>
          </div>
        </div>

        {/* Incomes & Expenses Split */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/15">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-400/20 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-200 uppercase font-medium">Receitas</p>
              <p className="text-sm font-bold text-white">{formatBRL(income)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-400/20 flex items-center justify-center shrink-0">
              <ArrowDownRight className="w-4 h-4 text-rose-300" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-200 uppercase font-medium">Despesas</p>
              <p className="text-sm font-bold text-white">{formatBRL(expense)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Hubs (Minha Evolução 12 Meses & Comparar Finanças) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigateTab('evolucao-12m')}
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#0C6B58] hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0C6B58] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <LineChart className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#0C6B58] transition-colors">
            Minha Evolução (12M)
          </h4>
          <p className="text-[11px] text-stone-500 mt-0.5">Histórico completo de 12 meses</p>
        </button>

        <button
          onClick={() => onNavigateTab('comparativos')}
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#0C6B58] hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#0C6B58] transition-colors">
            Comparar Finanças
          </h4>
          <p className="text-[11px] text-stone-500 mt-0.5">Compare meses e categorias</p>
        </button>
      </div>

      {/* 4. Brazilian Economic Indicators (Banco Central do Brasil) */}
      {indicators && indicators.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-stone-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Economia Brasileira Hoje (Banco Central)</h3>
            </div>
            <button
              onClick={() => onNavigateTab('education')}
              className="text-[11px] font-semibold text-[#0C6B58] hover:underline"
            >
              Entenda
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {indicators.map(ind => (
              <div key={ind.code} className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <p className="text-[10px] text-stone-500 font-medium truncate">{ind.name}</p>
                <p className="text-sm font-extrabold text-stone-900 mt-0.5">
                  {ind.unit === 'R$' ? `R$ ${ind.value.toFixed(2)}` : `${ind.value}${ind.unit}`}
                </p>
                <p className="text-[9px] text-stone-400 mt-0.5">{ind.source.split(' ')[0]}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. AI Assistant Banner Card */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 border border-teal-200/70 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0C6B58] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#0C6B58]/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">Pergunte para a IA do MOVA</h4>
            <p className="text-[11px] text-stone-600">
              "Como está minha evolução financeira nos últimos 12 meses?"
            </p>
          </div>
        </div>
        <button
          onClick={onOpenAssistant}
          className="px-3.5 py-2 rounded-xl bg-[#0C6B58] text-white text-xs font-bold hover:bg-[#08493c] transition-all shrink-0"
        >
          Conversar
        </button>
      </div>

      {/* 6. Top Spending Categories in Month */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-stone-900">Maiores Gastos de Outubro</h3>
          <button
            onClick={() => onNavigateTab('ver-meu-mes')}
            className="text-xs font-semibold text-[#0C6B58] hover:underline"
          >
            Ver detalhes
          </button>
        </div>

        {summary?.topCategories && summary.topCategories.length > 0 ? (
          <div className="space-y-3.5">
            {summary.topCategories.slice(0, 4).map(cat => (
              <div key={cat.categoryId}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-800">{cat.categoryName}</span>
                  <span className="font-bold text-stone-900">{formatBRL(cat.amount)} ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(cat.percentage, 100)}%`,
                      backgroundColor: cat.color || '#0C6B58'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 py-4 text-center">Nenhuma despesa registrada este mês.</p>
        )}
      </div>

      {/* 7. Active Financial Goals Progress */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-4 h-4 text-[#0C6B58]" />
            <h3 className="text-sm font-bold text-stone-900">Progresso das Metas</h3>
          </div>
          <button
            onClick={() => onNavigateTab('goals')}
            className="text-xs font-semibold text-[#0C6B58] hover:underline"
          >
            Gerenciar metas
          </button>
        </div>

        {goals && goals.length > 0 ? (
          <div className="space-y-4">
            {goals.slice(0, 2).map(goal => (
              <div key={goal.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-800">{goal.title}</span>
                  <span className="text-xs font-extrabold text-[#0C6B58]">{goal.progressPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full bg-[#0C6B58] transition-all"
                    style={{ width: `${Math.min(goal.progressPct, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span>{formatBRL(goal.currentAmount)} de {formatBRL(goal.targetAmount)}</span>
                  <span>{formatBRL(goal.monthlyRequired)}/mês necessários</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 py-3 text-center">Nenhuma meta cadastrada.</p>
        )}
      </div>

      {/* 8. Recent Transactions */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-stone-900">Últimas Movimentações</h3>
          <button
            onClick={() => onNavigateTab('transactions')}
            className="text-xs font-semibold text-[#0C6B58] hover:underline"
          >
            Ver todas
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="divide-y divide-stone-100">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === 'income'
                        ? 'bg-emerald-100 text-[#0C6B58]'
                        : 'bg-rose-100 text-rose-600'
                    }`}
                  >
                    {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-800 truncate max-w-[180px]">{tx.description}</p>
                    <p className="text-[10px] text-stone-400">{tx.categoryName} • {tx.date.split('-').reverse().join('/')}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-xs font-extrabold ${tx.type === 'income' ? 'text-[#0C6B58]' : 'text-stone-900'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatBRL(tx.amount)}
                  </p>
                  <p className="text-[9px] uppercase font-semibold text-stone-400">{tx.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 py-4 text-center">Nenhuma movimentação recente.</p>
        )}
      </div>

      {/* 9. Smart Tips */}
      {tips && tips.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider px-1">Dicas MOVA para você</h3>
          {tips.map(tip => (
            <div key={tip.id} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-3">
              <span className="px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 text-[10px] font-bold uppercase mt-0.5">
                {tip.tag}
              </span>
              <div>
                <h5 className="text-xs font-bold text-amber-950">{tip.title}</h5>
                <p className="text-xs text-amber-800 mt-0.5">{tip.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
