import React, { useState } from 'react';
import { ArrowRight, Sparkles, TrendingUp, Target, Check } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onFinish: (selectedGoal: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onFinish
}) => {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState('Reserva de emergência e autonomia');

  if (!isOpen) return null;

  const goalsOptions = [
    'Construir reserva de emergência',
    'Comprar meu computador de trabalho',
    'Fazer uma viagem com amigos',
    'Pagar cursos e faculdade',
    'Aprender a controlar o primeiro salário'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-stone-100 text-center">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                step === s ? 'w-8 bg-[#0C6B58]' : 'w-2 bg-stone-200'
              }`}
            />
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0C6B58]/10 text-[#0C6B58] flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
              Bem-vindo ao MOVA!
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto">
              O controle financeiro feito especialmente para jovens que querem autonomia, organização e inteligência sem formalidades bancárias.
            </p>
            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3 rounded-2xl bg-[#0C6B58] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#08493c]"
            >
              <span>Avançar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#0C6B58] flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
              Evolução e Comparativos
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto">
              Acompanhe seu histórico financeiro de 12 meses, compare categorias e conte com nossa IA para tirar dúvidas e sugerir cortes inteligentes.
            </p>
            <button
              onClick={() => setStep(3)}
              className="w-full mt-4 py-3 rounded-2xl bg-[#0C6B58] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#08493c]"
            >
              <span>Definir Meu Objetivo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-2">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
              Qual é seu foco agora?
            </h2>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Selecione sua prioridade para personalizarmos suas dicas e alertas:
            </p>

            <div className="space-y-2 text-left max-h-52 overflow-y-auto pr-1">
              {goalsOptions.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGoal(g)}
                  className={`w-full p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    selectedGoal === g
                      ? 'border-[#0C6B58] bg-[#0C6B58]/5 text-[#0C6B58]'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{g}</span>
                  {selectedGoal === g && <Check className="w-4 h-4 text-[#0C6B58]" />}
                </button>
              ))}
            </div>

            <button
              onClick={() => onFinish(selectedGoal)}
              className="w-full mt-4 py-3 rounded-2xl bg-[#0C6B58] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#08493c]"
            >
              <span>Começar a Usar o MOVA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
