import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Clock,
  Landmark,
  ShieldCheck
} from 'lucide-react';
import { Article, EconomicIndicator } from '../types/index.js';

interface EducationViewProps {
  articles: Article[];
  indicators: EconomicIndicator[];
  onOpenAssistantWithPrompt: (prompt: string) => void;
}

export const EducationView: React.FC<EducationViewProps> = ({
  articles,
  indicators,
  onOpenAssistantWithPrompt
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categoriesList = [
    'all',
    'Organização Financeira',
    'Reserva de Emergência',
    'Controle de Gastos',
    'Economia Básica',
    'Consumo Consciente',
    'Introdução aos Investimentos'
  ];

  const filteredArticles = articles.filter(art => {
    if (selectedCategory !== 'all' && art.category !== selectedCategory) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.source.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Educação Financeira</h1>
        <p className="text-xs text-stone-500">Conteúdos práticos, fontes oficiais e conceitos sem complicação.</p>
      </div>

      {/* 1. Banco Central Economic Indicators Banner */}
      {indicators.length > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-br from-stone-900 to-stone-800 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Landmark className="w-4 h-4" />
            <span>Indicadores Oficiais do Banco Central do Brasil</span>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed mb-4">
            Acompanhe as taxas que influenciam o rendimento do seu dinheiro guardado e a inflação dos preços no supermercado:
          </p>

          <div className="grid grid-cols-3 gap-2.5">
            {indicators.map(ind => (
              <div key={ind.code} className="p-3 rounded-2xl bg-white/10 border border-white/10">
                <p className="text-[10px] text-stone-300 font-medium truncate">{ind.name}</p>
                <p className="text-base font-extrabold text-emerald-300 mt-0.5">
                  {ind.unit === 'R$' ? `R$ ${ind.value.toFixed(2)}` : `${ind.value}${ind.unit}`}
                </p>
                <p className="text-[9px] text-stone-400 mt-1">{ind.source}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Search & Category Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar artigos por tema ou palavra-chave..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl text-xs text-stone-800 focus:outline-none focus:border-[#0C6B58]"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categoriesList.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0C6B58] text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {cat === 'all' ? 'Todos os Temas' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Articles Feed */}
      <div className="space-y-3.5">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
            <article
              key={article.id}
              className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-[#0C6B58] transition-all group"
            >
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="font-bold text-[#0C6B58] bg-[#0C6B58]/10 px-2.5 py-0.5 rounded-full">
                  {article.category}
                </span>

                <div className="flex items-center gap-2 text-stone-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                  <span>•</span>
                  <span>{article.publishedAt.split('-').reverse().join('/')}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#0C6B58] transition-colors leading-snug mb-1.5">
                {article.title}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                {article.summary}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-[11px]">
                <span className="font-semibold text-stone-500">
                  Fonte: <span className="text-stone-800">{article.source}</span>
                </span>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#0C6B58] font-bold hover:underline"
                >
                  <span>Acessar Publicação</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </article>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-stone-400">
            Nenhum artigo encontrado com estes termos.
          </div>
        )}
      </div>

      {/* 4. AI Ask Box */}
      <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200">
        <div className="flex items-center gap-2 text-[#0C6B58] font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Ficou com dúvida em algum conceito?</span>
        </div>

        <p className="text-xs text-stone-700 mb-3">
          A IA do MOVA explica qualquer termo em linguagem simples e adaptada para você:
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onOpenAssistantWithPrompt('Explique como funciona uma reserva de emergência e onde investir')}
            className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-[#0C6B58] hover:bg-emerald-100 transition-colors"
          >
            "Como funciona uma reserva de emergência?"
          </button>
          <button
            onClick={() => onOpenAssistantWithPrompt('O que é taxa Selic e como ela afeta minhas finanças?')}
            className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-[#0C6B58] hover:bg-emerald-100 transition-colors"
          >
            "Como a taxa Selic afeta minhas finanças?"
          </button>
        </div>
      </div>
    </div>
  );
};
