import React from 'react';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Sparkles, PieChart, Calendar } from 'lucide-react';
import { MonthlySummary, Transaction } from '../types/index.js';

interface MonthlyOverviewViewProps {
  summary: MonthlySummary | null;
  transactions: Transaction[];
  onBackToDashboard: () => void;
  onOpenAssistantWithPrompt: (prompt: string) => void;
}

export const MonthlyOverviewView: React.FC<MonthlyOverviewViewProps> = ({
  summary,
  transactions,
  onBackToDashboard,
  onOpenAssistantWithPrompt
}) => {
  const formatBRL = (val: number | undefined) => {
    const num = Number(val) || 0;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const income = summary?.totalIncome ?? 0;
  const expense = summary?.totalExpense ?? 0;
  const balance = summary?.balance ?? 0;
  const committedPct = summary?.incomeCommittedPct ?? 0;

  const currentMonthTxs = transactions.filter(t => t.date.startsWith('2026-10'));

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#0C6B58] p-1.5 -ml-1 rounded-xl hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Dashboard</span>
        </button>

        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-stone-100 rounded-full text-stone-700">
          <Calendar className="w-3.5 h-3.5 text-[#0C6B58]" />
          Outubro de 2026
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Ver Meu Mês</h1>
        <p className="text-xs text-stone-500">Acompanhamento detalhado das entradas, saídas e proporção orçamentária.</p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500 uppercase mb-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>Receitas</span>
          </div>
          <p className="text-base font-extrabold text-stone-900">{formatBRL(income)}</p>
          <p className="text-[10px] text-stone-400 mt-0.5">Entradas totais</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500 uppercase mb-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
            <span>Despesas</span>
          </div>
          <p className="text-base font-extrabold text-stone-900">{formatBRL(expense)}</p>
          <p className="text-[10px] text-stone-400 mt-0.5">Saídas totais</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200">
          <div className="text-[11px] font-bold text-stone-500 uppercase mb-1">Saldo</div>
          <p className="text-base font-extrabold text-[#0C6B58]">{formatBRL(balance)}</p>
          <p className="text-[10px] text-stone-400 mt-0.5">{committedPct}% comprometido</p>
        </div>
      </div>

      {/* Comparison against Previous Month */}
      {summary?.prevMonthDiff && (
        <div className="p-4 rounded-3xl bg-stone-50 border border-stone-200/90">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
            Comparativo com Setembro/2026
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-2xl border border-stone-100">
              <span className="text-stone-500 text-[11px]">Variação de Gastos:</span>
              <div className="flex items-center gap-1.5 font-bold mt-1">
                {summary.prevMonthDiff.expensePctDiff <= 0 ? (
                  <>
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">{summary.prevMonthDiff.expensePctDiff}%</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-rose-600" />
                    <span className="text-rose-700">+{summary.prevMonthDiff.expensePctDiff}%</span>
                  </>
                )}
                <span className="text-stone-400 font-normal text-[10px]">({formatBRL(summary.prevMonthDiff.expenseDiff)})</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-stone-100">
              <span className="text-stone-500 text-[11px]">Variação de Receitas:</span>
              <div className="flex items-center gap-1.5 font-bold mt-1">
                {summary.prevMonthDiff.incomePctDiff >= 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">+{summary.prevMonthDiff.incomePctDiff}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-rose-600" />
                    <span className="text-rose-700">{summary.prevMonthDiff.incomePctDiff}%</span>
                  </>
                )}
                <span className="text-stone-400 font-normal text-[10px]">({formatBRL(summary.prevMonthDiff.incomeDiff)})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Category Distribution */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-4 h-4 text-[#0C6B58]" />
          <h3 className="text-sm font-bold text-stone-900">Distribuição dos Gastos por Categoria</h3>
        </div>

        {summary?.topCategories && summary.topCategories.length > 0 ? (
          <div className="space-y-3.5">
            {summary.topCategories.map(cat => (
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
          <p className="text-xs text-stone-400 py-3 text-center">Nenhum gasto cadastrado.</p>
        )}
      </div>

      {/* AI Contextual Recommendations for the Month */}
      <div className="p-5 rounded-3xl bg-[#0C6B58]/5 border border-[#0C6B58]/20">
        <div className="flex items-center gap-2 text-[#0C6B58] font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Diagnóstico da IA do MOVA para este mês</span>
        </div>

        <p className="text-xs text-stone-700 leading-relaxed mb-4">
          {committedPct < 60
            ? 'Excelente controle! Suas despesas representam menos de 60% da sua renda este mês, o que libera uma margem saudável de economia.'
            : 'Seus gastos essenciais com moradia e alimentação somaram a maior parte das saídas. Veja como distribuir melhor suas sobras para suas metas.'}
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onOpenAssistantWithPrompt('Por que gastei mais este mês?')}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#0C6B58]/30 text-xs font-semibold text-[#0C6B58] hover:bg-[#0C6B58]/10 transition-colors"
          >
            "Por que gastei mais este mês?"
          </button>
          <button
            onClick={() => onOpenAssistantWithPrompt('Quanto minhas despesas representam das minhas receitas?')}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#0C6B58]/30 text-xs font-semibold text-[#0C6B58] hover:bg-[#0C6B58]/10 transition-colors"
          >
            "Qual foi minha maior despesa?"
          </button>
          <button
            onClick={() => onOpenAssistantWithPrompt('Compare este mês com o anterior')}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#0C6B58]/30 text-xs font-semibold text-[#0C6B58] hover:bg-[#0C6B58]/10 transition-colors"
          >
            "Compare este mês com o anterior"
          </button>
        </div>
      </div>

      {/* Month Transactions List */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200">
        <h3 className="text-sm font-bold text-stone-900 mb-3">Movimentações de Outubro</h3>
        <div className="divide-y divide-stone-100">
          {currentMonthTxs.map(tx => (
            <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-stone-800">{tx.description}</p>
                <p className="text-[10px] text-stone-400">{tx.categoryName} • {tx.date.split('-').reverse().join('/')}</p>
              </div>
              <div className="text-right">
                <span className={`font-extrabold ${tx.type === 'income' ? 'text-[#0C6B58]' : 'text-stone-900'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatBRL(tx.amount)}
                </span>
                <p className="text-[9px] uppercase font-semibold text-stone-400">{tx.paymentMethod}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
