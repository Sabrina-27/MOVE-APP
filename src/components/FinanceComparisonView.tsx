import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Scale,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { ComparisonResult, Category } from '../types/index.js';
import { api } from '../services/api.js';

interface FinanceComparisonViewProps {
  categories: Category[];
  onBackToDashboard: () => void;
  onOpenAssistantWithPrompt: (prompt: string) => void;
}

export const FinanceComparisonView: React.FC<FinanceComparisonViewProps> = ({
  categories,
  onBackToDashboard,
  onOpenAssistantWithPrompt
}) => {
  const [mode, setMode] = useState<'months' | 'range' | 'categories'>('months');
  const [month1, setMonth1] = useState<string>('2026-10');
  const [month2, setMonth2] = useState<string>('2026-09');
  const [rangeCount, setRangeCount] = useState<number>(3);
  const [cat1, setCat1] = useState<string>('cat_alimentacao');
  const [cat2, setCat2] = useState<string>('cat_transporte');

  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [categoryComparisonResult, setCategoryComparisonResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const formatBRL = (val: number | undefined) => {
    const num = Number(val) || 0;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const loadComparison = async () => {
    setLoading(true);
    try {
      if (mode === 'categories') {
        const res = await api.getComparison({ mode: 'categories', cat1, cat2 });
        setCategoryComparisonResult(res);
        setComparisonResult(null);
      } else if (mode === 'range') {
        const res = await api.getComparison({ mode: 'range', count: rangeCount });
        setComparisonResult(res);
        setCategoryComparisonResult(null);
      } else {
        const res = await api.getComparison({ mode: 'months', m1: month1, m2: month2 });
        setComparisonResult(res);
        setCategoryComparisonResult(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComparison();
  }, [mode, month1, month2, rangeCount, cat1, cat2]);

  const monthOptions = [
    { value: '2026-10', label: 'Outubro / 2026 (Atual)' },
    { value: '2026-09', label: 'Setembro / 2026' },
    { value: '2026-08', label: 'Agosto / 2026' },
    { value: '2026-07', label: 'Julho / 2026' },
    { value: '2026-06', label: 'Junho / 2026' },
    { value: '2026-05', label: 'Maio / 2026' },
    { value: '2026-04', label: 'Abril / 2026' },
    { value: '2026-03', label: 'Março / 2026' }
  ];

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
          <Scale className="w-3.5 h-3.5 text-[#0C6B58]" />
          Comparativo Inteligente
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Comparar Minhas Finanças</h1>
        <p className="text-xs text-stone-500">Analise diferenças em reais e variações percentuais entre períodos e categorias.</p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-200/70 rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setMode('months')}
          className={`py-2 rounded-xl transition-all ${
            mode === 'months' ? 'bg-white text-[#0C6B58] shadow-sm font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Entre 2 Meses
        </button>
        <button
          onClick={() => setMode('range')}
          className={`py-2 rounded-xl transition-all ${
            mode === 'range' ? 'bg-white text-[#0C6B58] shadow-sm font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          3, 6 ou 12 Meses
        </button>
        <button
          onClick={() => setMode('categories')}
          className={`py-2 rounded-xl transition-all ${
            mode === 'categories' ? 'bg-white text-[#0C6B58] shadow-sm font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Categorias
        </button>
      </div>

      {/* Selectors Configuration Bar */}
      <div className="p-4 bg-white rounded-3xl border border-stone-200">
        {mode === 'months' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-500 mb-1">Período 1 (Referência)</label>
              <select
                value={month1}
                onChange={e => setMonth1(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800"
              >
                {monthOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-500 mb-1">Período 2 (Para comparar)</label>
              <select
                value={month2}
                onChange={e => setMonth2(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800"
              >
                {monthOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {mode === 'range' && (
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-2">Selecione o bloco de meses acumulados</label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 6, 12].map(num => (
                <button
                  key={num}
                  onClick={() => setRangeCount(num)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    rangeCount === num
                      ? 'border-[#0C6B58] bg-[#0C6B58]/10 text-[#0C6B58]'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  Últimos {num} meses
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'categories' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-500 mb-1">Categoria A</label>
              <select
                value={cat1}
                onChange={e => setCat1(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-500 mb-1">Categoria B</label>
              <select
                value={cat2}
                onChange={e => setCat2(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Results Card */}
      {loading ? (
        <div className="p-8 text-center text-xs text-stone-400">Calculando comparativo...</div>
      ) : mode === 'categories' && categoryComparisonResult ? (
        <div className="p-5 bg-white rounded-3xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-stone-900">Comparação entre Categorias (12 Meses)</h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-bold">
              {categoryComparisonResult.moreExpensive} teve maior gasto
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <span className="text-[11px] font-bold text-stone-500">{categoryComparisonResult.cat1.name}</span>
              <p className="text-lg font-extrabold text-stone-900 mt-1">{formatBRL(categoryComparisonResult.cat1.total)}</p>
              <p className="text-[10px] text-stone-400">{categoryComparisonResult.cat1.count} registros no ano</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <span className="text-[11px] font-bold text-stone-500">{categoryComparisonResult.cat2.name}</span>
              <p className="text-lg font-extrabold text-stone-900 mt-1">{formatBRL(categoryComparisonResult.cat2.total)}</p>
              <p className="text-[10px] text-stone-400">{categoryComparisonResult.cat2.count} registros no ano</p>
            </div>
          </div>

          <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
            <span>Diferença absoluta acumulada:</span>
            <span className="font-extrabold text-sm">{formatBRL(categoryComparisonResult.diff)} ({categoryComparisonResult.varPct}%)</span>
          </div>
        </div>
      ) : comparisonResult ? (
        <div className="space-y-4">
          {/* Main Variation Metrics */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-4 bg-white rounded-2xl border border-stone-200">
              <p className="text-[10px] font-bold text-stone-400 uppercase">Receitas</p>
              <p className="text-xs font-bold text-stone-800 mt-0.5">
                {formatBRL(comparisonResult.p1Income)} vs {formatBRL(comparisonResult.p2Income)}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs font-extrabold text-emerald-700">
                {comparisonResult.incomeVarPct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{comparisonResult.incomeVarPct >= 0 ? '+' : ''}{comparisonResult.incomeVarPct}%</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-stone-200">
              <p className="text-[10px] font-bold text-stone-400 uppercase">Despesas</p>
              <p className="text-xs font-bold text-stone-800 mt-0.5">
                {formatBRL(comparisonResult.p1Expense)} vs {formatBRL(comparisonResult.p2Expense)}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs font-extrabold text-rose-600">
                {comparisonResult.expenseVarPct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{comparisonResult.expenseVarPct >= 0 ? '+' : ''}{comparisonResult.expenseVarPct}%</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-stone-200">
              <p className="text-[10px] font-bold text-stone-400 uppercase">Saldo</p>
              <p className="text-xs font-bold text-stone-800 mt-0.5">
                {formatBRL(comparisonResult.p1Balance)} vs {formatBRL(comparisonResult.p2Balance)}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs font-extrabold text-[#0C6B58]">
                <span>{comparisonResult.balanceDiff >= 0 ? '+' : ''}{formatBRL(comparisonResult.balanceDiff)}</span>
              </div>
            </div>
          </div>

          {/* Categories Shift Breakdown */}
          <div className="p-5 bg-white rounded-3xl border border-stone-200">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
              Mudança por Categoria ({comparisonResult.period1Label} vs {comparisonResult.period2Label})
            </h3>

            <div className="space-y-3">
              {comparisonResult.categoryComparisons.map(cat => (
                <div key={cat.categoryName} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-50">
                  <div>
                    <p className="font-bold text-stone-800">{cat.categoryName}</p>
                    <p className="text-[10px] text-stone-400">
                      {formatBRL(cat.p1Amount)} vs {formatBRL(cat.p2Amount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`font-extrabold ${cat.diff > 0 ? 'text-rose-600' : cat.diff < 0 ? 'text-emerald-600' : 'text-stone-500'}`}>
                      {cat.diff > 0 ? '+' : ''}{formatBRL(cat.diff)}
                    </span>
                    <p className="text-[10px] text-stone-400">
                      ({cat.varPct > 0 ? '+' : ''}{cat.varPct}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* 1-Click Questions for AI */}
      <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>Perguntas Rápidas para a IA</span>
        </div>

        <p className="text-xs text-amber-800 mb-3">
          Clique para enviar diretamente para o assistente do MOVA:
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onOpenAssistantWithPrompt('Compare meus últimos 12 meses')}
            className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs font-semibold text-amber-950 hover:bg-amber-100 transition-colors"
          >
            "Compare meus últimos 12 meses"
          </button>
          <button
            onClick={() => onOpenAssistantWithPrompt('Qual foi meu mês de maior economia?')}
            className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs font-semibold text-amber-950 hover:bg-amber-100 transition-colors"
          >
            "Qual foi meu mês de maior economia?"
          </button>
          <button
            onClick={() => onOpenAssistantWithPrompt('Minhas despesas estão aumentando ao longo do tempo?')}
            className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs font-semibold text-amber-950 hover:bg-amber-100 transition-colors"
          >
            "Minhas despesas estão aumentando?"
          </button>
          <button
            onClick={() => onOpenAssistantWithPrompt('Compare meus gastos com alimentação e transporte')}
            className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs font-semibold text-amber-950 hover:bg-amber-100 transition-colors"
          >
            "Compare alimentação e transporte"
          </button>
        </div>
      </div>
    </div>
  );
};
