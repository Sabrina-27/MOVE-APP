import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Building2, ArrowRight } from 'lucide-react';

interface BankConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (bankName: string) => Promise<void>;
  onSkip: () => Promise<void>;
}

const AVAILABLE_BANKS = [
  { id: 'nubank', name: 'Nubank', color: '#820AD1' },
  { id: 'inter', name: 'Banco Inter', color: '#FF7A00' },
  { id: 'itau', name: 'Itaú Unibanco', color: '#EC7000' },
  { id: 'bradesco', name: 'Bradesco', color: '#CC092F' },
  { id: 'bb', name: 'Banco do Brasil', color: '#FEE000', textColor: '#003399' },
  { id: 'santander', name: 'Santander', color: '#CC0000' },
  { id: 'c6', name: 'C6 Bank', color: '#242424' }
];

export const BankConnectModal: React.FC<BankConnectModalProps> = ({
  isOpen,
  onClose,
  onConnect,
  onSkip
}) => {
  const [selectedBank, setSelectedBank] = useState<string>('Nubank');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'prompt' | 'chooseBank' | 'success'>('prompt');

  if (!isOpen) return null;

  const handleConfirmBank = async () => {
    setIsSubmitting(true);
    try {
      await onConnect(selectedBank);
      setStep('success');
      setTimeout(() => {
        setIsSubmitting(false);
        setStep('prompt');
        onClose();
      }, 1500);
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    await onSkip();
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-stone-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'prompt' && (
          <div className="text-center pt-2">
            <div className="w-16 h-16 rounded-2xl bg-[#0C6B58]/10 text-[#0C6B58] flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-stone-900 mb-2">
              Deseja conectar uma conta bancária?
            </h3>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              Com o <span className="font-semibold text-stone-800">Open Finance seguro</span>, o MOVA sincroniza suas movimentações automaticamente. Você também pode continuar manualmente se preferir!
            </p>

            <div className="flex items-center justify-center gap-2 text-xs text-stone-500 mb-6 bg-stone-50 py-2.5 px-4 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-[#0C6B58]" />
              <span>Conexão segura regulamentada pelo Banco Central</span>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setStep('chooseBank')}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#0C6B58] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#08493c] transition-all shadow-md shadow-[#0C6B58]/20"
              >
                <span>Sim, conectar com Open Finance</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleSkip}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-2xl bg-stone-100 text-stone-700 font-medium hover:bg-stone-200 transition-colors text-sm"
              >
                Continuar sem conexão bancária
              </button>
            </div>
          </div>
        )}

        {step === 'chooseBank' && (
          <div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">Escolha sua instituição</h3>
            <p className="text-xs text-stone-500 mb-4">Selecione seu banco para autorizar a leitura via Open Finance:</p>

            <div className="grid grid-cols-2 gap-2.5 mb-6 max-h-60 overflow-y-auto pr-1">
              {AVAILABLE_BANKS.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBank(b.name)}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    selectedBank === b.name
                      ? 'border-[#0C6B58] bg-[#0C6B58]/5 ring-2 ring-[#0C6B58]/20'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: b.color, color: b.textColor || '#FFFFFF' }}
                  >
                    {b.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-stone-800 truncate">{b.name}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <button
                onClick={handleConfirmBank}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-2xl bg-[#0C6B58] text-white font-semibold hover:bg-[#08493c] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Conectando...' : `Conectar ${selectedBank}`}
              </button>

              <button
                onClick={() => setStep('prompt')}
                className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800 transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-3 animate-bounce" />
            <h3 className="text-lg font-bold text-stone-900 mb-1">Conta Conectada!</h3>
            <p className="text-xs text-stone-600">Sua conta do {selectedBank} foi vinculada ao MOVA.</p>
          </div>
        )}
      </div>
    </div>
  );
};
