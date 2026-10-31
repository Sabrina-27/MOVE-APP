import React, { useState } from 'react';
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Trash2,
  Calendar,
  Tag
} from 'lucide-react';
import { Transaction, Category, TransactionType } from '../types/index.js';

interface TransactionsViewProps {
  transactions: Transaction[];
  categories: Category[];
  onOpenAddTransaction: () => void;
  onDeleteTransaction: (id: string) => Promise<void>;
  onOpenAssistantWithPrompt: (prompt: string) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  categories,
  onOpenAddTransaction,
  onDeleteTransaction,
  onOpenAssistantWithPrompt
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const formatBRL = (val: number | undefined) => {
    const num = Number(val) || 0;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Filter logic
  const filtered = transactions.filter(t => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && t.categoryId !== categoryFilter) return false;
    if (selectedMonth !== 'all' && !t.date.startsWith(selectedMonth)) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return (
        t.description.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalFilteredIncome = filtered.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalFilteredExpense = filtered.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-5 pb-20">
      {/* Title & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Minhas Movimentações</h1>
          <p className="text-xs text-stone-500">Histórico de débito, crédito, pix e transferências.</p>
        </div>

        <button
          onClick={onOpenAddTransaction}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#0C6B58] text-white text-xs font-bold hover:bg-[#08493c] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Registro</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-3xl border border-stone-200 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por descrição ou categoria..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-800 focus:outline-none focus:border-[#0C6B58]"
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-3 gap-2">
          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none"
            >
              <option value="all">Todos os Tipos</option>
              <option value="income">Receitas (+)</option>
              <option value="expense">Despesas (-)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none"
            >
              <option value="all">Todas Categorias</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none"
            >
              <option value="all">Todos os Meses</option>
              <option value="2026-10">Out/2026</option>
              <option value="2026-09">Set/2026</option>
              <option value="2026-08">Ago/2026</option>
              <option value="2026-07">Jul/2026</option>
            </select>
          </div>
        </div>

        {/* Dynamic Totals for Filtered View */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold">
          <span className="text-stone-500">{filtered.length} registro(s) encontrado(s)</span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700">+{formatBRL(totalFilteredIncome)}</span>
            <span className="text-rose-600">-{formatBRL(totalFilteredExpense)}</span>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-3xl border border-stone-200 p-2 divide-y divide-stone-100">
        {filtered.length > 0 ? (
          filtered.map(tx => (
            <div key={tx.id} className="p-3 flex items-center justify-between hover:bg-stone-50/80 rounded-2xl transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    tx.type === 'income'
                      ? 'bg-emerald-100 text-[#0C6B58]'
                      : 'bg-rose-100 text-rose-600'
                  }`}
                >
                  {tx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-stone-900">{tx.description}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-400">
                    <span className="flex items-center gap-0.5">
                      <Tag className="w-3 h-3 text-stone-400" />
                      {tx.categoryName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {tx.date.split('-').reverse().join('/')}
                    </span>
                    <span>•</span>
                    <span className="uppercase font-semibold text-stone-500">{tx.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`text-xs font-extrabold ${tx.type === 'income' ? 'text-[#0C6B58]' : 'text-stone-900'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatBRL(tx.amount)}
                  </p>
                </div>

                <button
                  onClick={() => onDeleteTransaction(tx.id)}
                  className="p-1.5 text-stone-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Excluir movimentação"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-xs text-stone-400">Nenhuma movimentação corresponde aos filtros selecionados.</p>
          </div>
        )}
      </div>

      {/* AI Query helper */}
      <div className="p-4 rounded-2xl bg-stone-100 flex items-center justify-between text-xs">
        <span className="text-stone-600 font-medium">Dúvida sobre estes registros?</span>
        <button
          onClick={() => onOpenAssistantWithPrompt('Quanto gastei com alimentação nos últimos meses?')}
          className="text-xs font-bold text-[#0C6B58] hover:underline"
        >
          Perguntar à IA do MOVA
        </button>
      </div>
    </div>
  );
};
