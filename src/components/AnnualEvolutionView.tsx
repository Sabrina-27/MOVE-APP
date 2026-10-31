import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { AnnualAnalysis, AnnualMonthData, Transaction } from '../types/index.js';

interface AnnualEvolutionViewProps {
  annualData: AnnualAnalysis | null;
  allTransactions: Transaction[];
  onBackToDashboard: () => void;
  onOpenAssistantWithPrompt: (prompt: string) => void;
}

export const AnnualEvolutionView: React.FC<AnnualEvolutionViewProps> = ({
  annualData,
  allTransactions,
  onBackToDashboard,
  onOpenAssistantWithPrompt
}) => {
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>('2026-10');

  const formatBRL = (val: number | undefined) => {
    const num = Number(val) || 0;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (!annualData) {
    return (
      <div className="py-20 text-center">
        <p className="text-xs text-stone-500">Carregando análise financeira de 12 meses...</p>
      </div>
    );
  }

  const selectedMonthData = annualData.months.find(m => m.monthKey === selectedMonthKey) || annualData.months[annualData.months.length - 1];
  const selectedMonthTransactions = allTransactions.filter(t => t.date.startsWith(selectedMonthKey));

  // Find max value across months to scale bar charts
  const maxMonthValue = Math.max(
    ...annualData.months.map(m => Math.max(m.income, m.expense)),
    1000
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Top Navigation Bar */}
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
          Últimos 12 Meses
        </span>
      </div>

      {/* Title & History Status */}
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Minha Evolução Financeira</h1>
        <p className="text-xs text-stone-500">Histórico completo de 12 meses, médias mensais e tendências de poupança.</p>

        {annualData.isPartial ? (
          <div className="mt-2 flex items-center gap-2 p-2.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800">
            <Info className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Análise parcial: baseada nos {annualData.totalMonthsCount} meses com movimentações registradas.</span>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2 p-2 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Histórico completo de 12 meses consolidado.</span>
          </div>
        )}
      </div>

      {/* 1. Main Indicators Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-stone-200">
          <p className="text-[10px] uppercase font-bold text-stone-400">Total Receitas (12M)</p>
          <p className="text-lg font-extrabold text-emerald-700 mt-0.5">{formatBRL(annualData.totalIncome)}</p>
          <p className="text-[11px] text-stone-500 mt-1">Média: {formatBRL(annualData.monthlyAvgIncome)}/mês</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200">
          <p className="text-[10px] uppercase font-bold text-stone-400">Total Despesas (12M)</p>
          <p className="text-lg font-extrabold text-rose-600 mt-0.5">{formatBRL(annualData.totalExpense)}</p>
          <p className="text-[11px] text-stone-500 mt-1">Média: {formatBRL(annualData.monthlyAvgExpense)}/mês</p>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 bg-gradient-to-br from-[#0C6B58] to-[#08493c] text-white rounded-2xl shadow-md shadow-[#0C6B58]/20">
          <p className="text-[10px] uppercase font-bold text-emerald-200">Saldo Acumulado (12M)</p>
          <p className="text-xl font-extrabold text-white mt-0.5">{formatBRL(annualData.cumulativeBalance)}</p>
          <p className="text-[11px] text-emerald-100/90 mt-1">Soma de todos os saldos</p>
        </div>
      </div>

      {/* 2. Key Highlights (Best Month, Highest Expense, Top Category) */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="p-3 bg-white rounded-2xl border border-stone-200">
          <p className="text-[10px] font-bold text-stone-400 uppercase">Melhor Saldo</p>
          <p className="text-xs font-bold text-[#0C6B58] mt-1">{annualData.bestBalanceMonth?.monthName || '-'}</p>
          <p className="text-xs font-extrabold text-stone-900 mt-0.5">+{formatBRL(annualData.bestBalanceMonth?.balance)}</p>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-stone-200">
          <p className="text-[10px] font-bold text-stone-400 uppercase">Maior Gasto</p>
          <p className="text-xs font-bold text-rose-600 mt-1">{annualData.highestExpenseMonth?.monthName || '-'}</p>
          <p className="text-xs font-extrabold text-stone-900 mt-0.5">{formatBRL(annualData.highestExpenseMonth?.expense)}</p>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-stone-200">
          <p className="text-[10px] font-bold text-stone-400 uppercase">Categoria #1</p>
          <p className="text-xs font-bold text-amber-600 truncate mt-1">{annualData.topExpenseCategoryOverall?.name || '-'}</p>
          <p className="text-xs font-extrabold text-stone-900 mt-0.5">{annualData.topExpenseCategoryOverall?.percentage}% do total</p>
        </div>
      </div>

      {/* 3. Interactive Bar Chart: Receitas vs Despesas Mês a Mês */}
      <div className="p-5 bg-white rounded-3xl border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Receitas vs Despesas (12 Meses)</h3>
            <p className="text-[11px] text-stone-500">Toque em qualquer mês para analisar o detalhamento</p>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Receitas
            </span>
            <span className="flex items-center gap-1 font-semibold text-rose-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-400"></span> Despesas
            </span>
          </div>
        </div>

        {/* Scrollable Bar Graph */}
        <div className="overflow-x-auto pb-2">
          <div className="flex items-end gap-2.5 min-w-[580px] h-48 pt-6 px-2 border-b border-stone-200">
            {annualData.months.map((m: AnnualMonthData) => {
              const isSelected = m.monthKey === selectedMonthKey;
              const incomeHeight = Math.max(4, Math.round((m.income / maxMonthValue) * 100));
              const expenseHeight = Math.max(4, Math.round((m.expense / maxMonthValue) * 100));

              return (
                <button
                  key={m.monthKey}
                  onClick={() => setSelectedMonthKey(m.monthKey)}
                  className={`flex-1 flex flex-col items-center group transition-all relative ${
                    isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* Floating tooltip on selection */}
                  {isSelected && (
                    <div className="absolute -top-7 px-2 py-0.5 bg-stone-900 text-white rounded text-[9px] font-bold whitespace-nowrap z-10 shadow">
                      Saldo: {formatBRL(m.balance)}
                    </div>
                  )}

                  {/* Dual Bars */}
                  <div className="w-full flex items-end justify-center gap-1 h-36">
                    {/* Income Bar */}
                    <div
                      className="w-2.5 rounded-t bg-emerald-500 group-hover:bg-emerald-600 transition-all"
                      style={{ height: `${incomeHeight}%` }}
                      title={`Receitas: ${formatBRL(m.income)}`}
                    />
                    {/* Expense Bar */}
                    <div
                      className="w-2.5 rounded-t bg-rose-400 group-hover:bg-rose-500 transition-all"
                      style={{ height: `${expenseHeight}%` }}
                      title={`Despesas: ${formatBRL(m.expense)}`}
                    />
                  </div>

                  {/* Month Label */}
                  <span className={`text-[10px] mt-2 font-bold ${isSelected ? 'text-[#0C6B58] scale-110' : 'text-stone-500'}`}>
                    {m.monthName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Selected Month Drill-Down Details */}
      {selectedMonthData && (
        <div className="p-5 bg-white rounded-3xl border border-[#0C6B58]/30 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0C6B58]">Detalhamento Selecionado</span>
              <h3 className="text-base font-extrabold text-stone-900">{selectedMonthData.fullMonthName}</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-stone-400 uppercase font-semibold">Saldo do Mês</span>
              <p className={`text-base font-extrabold ${selectedMonthData.balance >= 0 ? 'text-[#0C6B58]' : 'text-rose-600'}`}>
                {selectedMonthData.balance >= 0 ? '+' : ''}{formatBRL(selectedMonthData.balance)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
            <div className="p-3 rounded-xl bg-stone-50">
              <span className="text-stone-500">Receitas do Mês:</span>
              <p className="font-extrabold text-stone-900 mt-0.5">{formatBRL(selectedMonthData.income)}</p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50">
              <span className="text-stone-500">Despesas do Mês:</span>
              <p className="font-extrabold text-stone-900 mt-0.5">{formatBRL(selectedMonthData.expense)}</p>
            </div>
          </div>

          {/* Transactions in selected month */}
          <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
            Movimentações ({selectedMonthTransactions.length})
          </h4>

          {selectedMonthTransactions.length > 0 ? (
            <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto pr-1">
              {selectedMonthTransactions.map(tx => (
                <div key={tx.id} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-stone-800">{tx.description}</p>
                    <p className="text-[10px] text-stone-400">{tx.categoryName} • {tx.date.split('-').reverse().join('/')}</p>
                  </div>
                  <span className={`font-bold ${tx.type === 'income' ? 'text-emerald-700' : 'text-stone-900'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatBRL(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-400 py-2">Nenhum registro para este mês.</p>
          )}
        </div>
      )}

      {/* 5. AI Annual Analysis Prompt Action */}
      <div className="p-5 rounded-3xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0C6B58] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">Diagnóstico Anual com a IA</h4>
            <p className="text-[11px] text-stone-600">Peça para a IA analisar seus padrões e oportunidades de economia.</p>
          </div>
        </div>

        <button
          onClick={() => onOpenAssistantWithPrompt('Como está minha evolução financeira nos últimos 12 meses?')}
          className="px-4 py-2 rounded-xl bg-[#0C6B58] text-white text-xs font-bold hover:bg-[#08493c] transition-colors self-start sm:self-center"
        >
          Pedir Análise Completa
        </button>
      </div>
    </div>
  );
};
