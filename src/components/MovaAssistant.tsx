import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  BookOpen,
  Calculator,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { ChatMessage, Article } from '../types/index.js';
import { api } from '../services/api.js';

interface MovaAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  screenContext: string;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const MovaAssistant: React.FC<MovaAssistantProps> = ({
  isOpen,
  onClose,
  screenContext,
  initialPrompt,
  onClearInitialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on open
  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  // Handle initialPrompt triggered from other screens
  useEffect(() => {
    if (isOpen && initialPrompt) {
      handleSend(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadHistory = async () => {
    try {
      const history = await api.getAssistantHistory();
      if (history && history.length > 0) {
        setMessages(history);
      } else {
        // Initial friendly greeting message
        setMessages([
          {
            id: 'welcome_msg',
            role: 'assistant',
            content: 'Oi! Sou o assistente do MOVA. Vamos entender melhor seu dinheiro? 🌿\n\nEstou com acesso aos seus dados reais, cálculos de 12 meses e orçamentos. Como posso te ajudar hoje?',
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch {
      // Fallback
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const tempUserMsg: ChatMessage = {
      id: `temp_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await api.sendAssistantMessage(text, screenContext);
      setMessages(prev => [...prev.filter(m => m.id !== tempUserMsg.id), tempUserMsg, response]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'Desculpe, tive uma oscilação na resposta. Pode tentar me perguntar novamente?',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    await api.clearAssistantHistory();
    setMessages([
      {
        id: 'welcome_fresh',
        role: 'assistant',
        content: 'Conversa reiniciada! Como posso te ajudar a entender ou planejar seu dinheiro agora?',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  // Contextual smart suggestions based on active screen
  const getSuggestionsForContext = () => {
    switch (screenContext) {
      case 'ver-meu-mes':
        return [
          'Por que gastei mais este mês?',
          'Qual foi minha maior despesa?',
          'Compare este mês com o anterior'
        ];
      case 'evolucao-12m':
        return [
          'Como está minha evolução nos últimos 12 meses?',
          'Qual foi meu mês com maior economia?',
          'Minhas receitas estão crescendo?'
        ];
      case 'comparativos':
        return [
          'Compare alimentação e transporte',
          'Minhas despesas estão aumentando?',
          'Qual categoria teve maior impacto no ano?'
        ];
      case 'transactions':
        return [
          'Quanto gastei com alimentação nos últimos 30 dias?',
          'Calcule minhas maiores despesas',
          'Onde estou gastando mais no débito?'
        ];
      case 'goals':
        return [
          'Quanto preciso guardar por mês para minhas metas?',
          'O que acontece se eu guardar R$ 100 a mais?',
          'Minhas metas são realistas para minha renda?'
        ];
      case 'education':
        return [
          'Como funciona uma reserva de emergência?',
          'O que é taxa Selic e como afeta meus rendimentos?',
          'Qual a regra 50-30-20 para iniciantes?'
        ];
      default:
        return [
          'Como estão minhas finanças?',
          'Como está minha evolução em 12 meses?',
          'Onde posso economizar este mês?'
        ];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full sm:max-w-lg h-[92vh] sm:h-[82vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#0C6B58] to-[#08493c] text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm tracking-tight">MOVA Inteligência</h3>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-400/20 text-emerald-200">
                  Online
                </span>
              </div>
              <p className="text-[10px] text-emerald-100">Contexto ativo: {screenContext}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearHistory}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Limpar histórico da conversa"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Fechar assistente"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/60">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-[#0C6B58] text-white rounded-tr-none font-medium'
                    : 'bg-white text-stone-800 rounded-tl-none border border-stone-200'
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>

                {/* Highlighted Mathematical Calculations Badges */}
                {msg.calculations && msg.calculations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#0C6B58] uppercase">
                      <Calculator className="w-3 h-3" />
                      <span>Cálculo Oficial Verificado:</span>
                    </div>
                    {msg.calculations.map((calc, i) => (
                      <div key={i} className="p-2 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="flex items-center justify-between font-bold text-stone-900 text-[11px]">
                          <span>{calc.label}</span>
                          <span className="text-[#0C6B58]">{calc.value}</span>
                        </div>
                        {calc.detail && (
                          <p className="text-[10px] text-stone-400 mt-0.5">{calc.detail}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Related Articles from Web / Sources */}
                {msg.relatedArticles && msg.relatedArticles.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-stone-100 space-y-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-stone-500 uppercase">
                      <BookOpen className="w-3 h-3 text-[#0C6B58]" />
                      <span>Artigos Recomendados:</span>
                    </div>
                    {msg.relatedArticles.map(art => (
                      <a
                        key={art.id}
                        href={art.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2 rounded-xl bg-teal-50/70 border border-teal-100 hover:border-teal-300 transition-colors"
                      >
                        <p className="font-bold text-[11px] text-teal-950 truncate flex items-center justify-between">
                          <span>{art.title}</span>
                          <ExternalLink className="w-3 h-3 text-teal-700 shrink-0 ml-1" />
                        </p>
                        <p className="text-[10px] text-teal-800 line-clamp-1 mt-0.5">{art.summary}</p>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[9px] text-stone-400 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-stone-200 max-w-[160px] text-xs text-stone-500 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#0C6B58] animate-spin" />
              <span>Analisando dados...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Contextual Suggestions Carousel */}
        <div className="px-4 py-2 bg-white border-t border-stone-100 overflow-x-auto flex items-center gap-2">
          {getSuggestionsForContext().map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 hover:bg-[#0C6B58]/10 hover:text-[#0C6B58] whitespace-nowrap transition-colors shrink-0"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Pergunte sobre seus gastos, 12 meses, metas..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-stone-100 border border-transparent rounded-2xl text-xs text-stone-800 focus:outline-none focus:bg-white focus:border-[#0C6B58] transition-all"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-10 h-10 rounded-2xl bg-[#0C6B58] text-white flex items-center justify-center hover:bg-[#08493c] transition-colors disabled:opacity-40 disabled:hover:bg-[#0C6B58] shrink-0"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
