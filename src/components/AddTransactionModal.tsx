import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, CheckCircle2, Calendar, CreditCard, Tag } from 'lucide-react';
import { Category, TransactionType, PaymentMethod } from '../types/index.js';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSave: (data: {
    type: TransactionType;
    amount: number;
    categoryId: string;
    date: string;
    description: string;
    paymentMethod: PaymentMethod;
  }) => Promise<{ success: boolean; error?: string }>;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSave
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [description, setDescription] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Filter categories by type
  const availableCategories = categories.filter(c => c.type === type);
  const currentCatId = categoryId || (availableCategories[0]?.id || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanVal = amountStr.replace(/\./g, '').replace(',', '.');
    const amount = parseFloat(cleanVal);

    if (isNaN(amount) || amount <= 0) {
      setError('Por favor, informe um valor válido maior que zero.');
      return;
    }

    if (!currentCatId) {
      setError('Selecione uma categoria.');
      return;
    }

    setIsSubmitting(true);
    const result = await onSave({
      type,
      amount,
      categoryId: currentCatId,
      date,
      description: description.trim(),
      paymentMethod
    });

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setAmountStr('');
        setDescription('');
        onClose();
      }, 1200);
    } else {
      setError(result.error || 'Erro ao registrar movimentação.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-stone-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-10">
            <CheckCircle2 className="w-16 h-16 text-[#0C6B58] mx-auto mb-3 animate-bounce" />
            <h3 className="text-xl font-bold text-stone-900 mb-1">Movimentação Registrada!</h3>
            <p className="text-xs text-stone-500">Seus saldos e indicadores já foram atualizados.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-bold text-stone-900 mb-2">Adicionar Movimentação</h3>

            {/* Step 1: Type Selection */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-2xl">
              <button
                type="button"
                onClick={() => { setType('expense'); setCategoryId(''); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  type === 'expense'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>Despesa (Gasto)</span>
              </button>

              <button
                type="button"
                onClick={() => { setType('income'); setCategoryId(''); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  type === 'income'
                    ? 'bg-[#0C6B58] text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Receita (Entrada)</span>
              </button>
            </div>

            {/* Step 2: Amount */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">Valor</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-lg">R$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={amountStr}
                  onChange={e => setAmountStr(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xl font-extrabold text-stone-900 focus:outline-none focus:border-[#0C6B58] focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            {/* Step 3: Category */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">Categoria</label>
              <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                {availableCategories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all ${
                      currentCatId === cat.id
                        ? 'border-[#0C6B58] bg-[#0C6B58]/10 text-[#0C6B58] font-bold ring-1 ring-[#0C6B58]'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <Tag className="w-4 h-4" style={{ color: cat.color }} />
                    <span className="text-[11px] truncate w-full text-center">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4 & 5: Date & Payment Method */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">Data</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full pl-9 pr-2 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:border-[#0C6B58]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">Pagamento</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full pl-9 pr-2 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:border-[#0C6B58]"
                  >
                    <option value="pix">Pix</option>
                    <option value="debito">Débito</option>
                    <option value="credito">Crédito</option>
                    <option value="dinheiro">Dinheiro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 6: Description */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">Descrição (opcional)</label>
              <input
                type="text"
                placeholder="Ex: Supermercado semanal, Bolsa de estágio..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#0C6B58]"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">{error}</p>
            )}

            {/* Confirm button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0C6B58] text-white font-semibold text-sm hover:bg-[#08493c] transition-all shadow-md shadow-[#0C6B58]/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Confirmar e Salvar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
