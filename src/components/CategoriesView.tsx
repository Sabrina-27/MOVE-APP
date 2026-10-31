import React, { useState } from 'react';
import { Tag, Plus, AlertTriangle, CheckCircle2, ArrowLeft, X } from 'lucide-react';
import { Category, Transaction } from '../types/index.js';

interface CategoriesViewProps {
  categories: Category[];
  transactions: Transaction[];
  onBackToDashboard: () => void;
  onCreateCategory: (data: { name: string; type: 'income' | 'expense'; color: string; icon: string; budgetLimit?: number }) => Promise<Category>;
  onUpdateCategory: (id: string, data: Partial<Category>) => Promise<Category>;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  transactions,
  onBackToDashboard,
  onCreateCategory,
  onUpdateCategory
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [limitStr, setLimitStr] = useState<string>('');

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [color, setColor] = useState('#0C6B58');
  const [budgetLimitStr, setBudgetLimitStr] = useState('');

  const formatBRL = (val: number | undefined) => {
    const num = Number(val) || 0;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Calculate current month's expenses per category
  const currentMonthTxs = transactions.filter(t => t.date.startsWith('2026-10') && t.type === 'expense');

  const getSpentForCategory = (catId: string) => {
    return currentMonthTxs
      .filter(t => t.categoryId === catId)
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const limit = budgetLimitStr ? parseFloat(budgetLimitStr.replace(/\./g, '').replace(',', '.')) : 0;
    await onCreateCategory({
      name,
      type,
      color,
      icon: 'Tag',
      budgetLimit: limit
    });
    setIsCreateOpen(false);
    setName('');
    setBudgetLimitStr('');
  };

  const handleSaveLimit = async (id: string) => {
    const limit = parseFloat(limitStr.replace(/\./g, '').replace(',', '.'));
    if (!isNaN(limit)) {
      await onUpdateCategory(id, { budgetLimit: limit });
    }
    setEditingCatId(null);
    setLimitStr('');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#0C6B58] p-1.5 -ml-1 rounded-xl hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Dashboard</span>
        </button>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#0C6B58] text-white text-xs font-bold hover:bg-[#08493c] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Categoria</span>
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Categorias & Orçamento</h1>
        <p className="text-xs text-stone-500">Defina tetos de gastos para o mês e acompanhe alertas em tempo real.</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {categories.map(cat => {
          const spent = getSpentForCategory(cat.id);
          const limit = cat.budgetLimit || 0;
          const hasLimit = limit > 0;
          const pct = hasLimit ? Math.round((spent / limit) * 100) : 0;
          const isOverLimit = hasLimit && spent > limit;
          const isNearLimit = hasLimit && pct >= 80 && !isOverLimit;

          return (
            <div
              key={cat.id}
              className={`p-5 rounded-3xl bg-white border transition-all ${
                isOverLimit
                  ? 'border-rose-300 ring-2 ring-rose-100'
                  : isNearLimit
                  ? 'border-amber-300 ring-2 ring-amber-50'
                  : 'border-stone-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: cat.color }}
                  >
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900">{cat.name}</h3>
                    <span className="text-[10px] text-stone-400 capitalize">{cat.type === 'expense' ? 'Despesa' : 'Receita'}</span>
                  </div>
                </div>

                {hasLimit && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isOverLimit
                        ? 'bg-rose-100 text-rose-700'
                        : isNearLimit
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isOverLimit && <AlertTriangle className="w-3 h-3" />}
                    {isOverLimit ? 'Teto Ultrapassado' : `${pct}% do teto`}
                  </span>
                )}
              </div>

              {cat.type === 'expense' && (
                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-stone-800">{formatBRL(spent)} gastos</span>
                    <span className="text-stone-500 font-medium">
                      {hasLimit ? `Teto: ${formatBRL(limit)}` : 'Sem teto definido'}
                    </span>
                  </div>

                  {hasLimit && (
                    <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOverLimit ? 'bg-rose-500' : isNearLimit ? 'bg-amber-500' : 'bg-[#0C6B58]'
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  )}

                  {/* Edit Limit Action */}
                  <div className="pt-2 flex items-center justify-between text-[11px]">
                    {editingCatId === cat.id ? (
                      <div className="flex items-center gap-1.5 w-full">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="Ex: 800"
                          value={limitStr}
                          onChange={e => setLimitStr(e.target.value)}
                          className="w-24 p-1 bg-stone-50 border rounded text-xs font-bold"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveLimit(cat.id)}
                          className="px-2 py-1 bg-[#0C6B58] text-white rounded font-bold text-[10px]"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditingCatId(null)}
                          className="px-2 py-1 text-stone-400 text-[10px]"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingCatId(cat.id); setLimitStr(String(cat.budgetLimit || '')); }}
                        className="text-[#0C6B58] font-semibold hover:underline"
                      >
                        {hasLimit ? 'Ajustar limite' : 'Definir limite mensal'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: New Category */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-stone-100">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleCreate} className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Nova Categoria</h3>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Nome da Categoria</label>
                <input
                  type="text"
                  placeholder="Ex: Pet, Assinaturas, Cursos..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Tipo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-2 rounded-xl text-xs font-bold border ${type === 'expense' ? 'bg-rose-50 border-rose-300 text-rose-700' : 'border-stone-200'}`}
                  >
                    Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-2 rounded-xl text-xs font-bold border ${type === 'income' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'border-stone-200'}`}
                  >
                    Receita
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Limite Mensal (R$)</label>
                <input
                  type="text"
                  placeholder="Ex: 500,00"
                  value={budgetLimitStr}
                  onChange={e => setBudgetLimitStr(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Cor</label>
                <div className="flex items-center gap-2">
                  {['#0C6B58', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6', '#10B981'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full border-2 ${color === c ? 'border-stone-900 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#0C6B58] text-white font-semibold text-xs hover:bg-[#08493c] transition-all"
              >
                Criar Categoria
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
