import React, { useState } from 'react';
import {
  UserCircle,
  Building2,
  Bell,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  X
} from 'lucide-react';
import { UserProfile } from '../types/index.js';

interface ProfileViewProps {
  user: UserProfile | null;
  onBackToDashboard: () => void;
  onOpenBankConnect: () => void;
  onOpenCategories: () => void;
  onUpdateUser: (data: Partial<UserProfile>) => Promise<void>;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onBackToDashboard,
  onOpenBankConnect,
  onOpenCategories,
  onUpdateUser,
  onLogout
}) => {
  const [name, setName] = useState(user?.name || '');
  const [financialGoal, setFinancialGoal] = useState(user?.financialGoal || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled ?? true);
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateUser({
      name,
      financialGoal,
      notificationsEnabled
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const openTerms = () => {
    setModalContent({
      title: 'Termos de Uso do MOVA',
      content: `O MOVA é um aplicativo de organização e educação financeira pessoal desenvolvido prioritariamente para apoiar jovens na conquista de sua autonomia.
As informações e análises fornecidas pelo aplicativo têm caráter exclusivamente educativo e organizacional, não constituindo recomendação personalizada de investimentos ou promessa de rentabilidade.
O usuário é o único responsável por suas decisões financeiras.`
    });
  };

  const openPrivacy = () => {
    setModalContent({
      title: 'Política de Privacidade & Segurança',
      content: `Sua privacidade é prioridade máxima no MOVA:
1. Seus dados financeiros são isolados e processados exclusivamente para fornecer seus relatórios, resumos e comparativos.
2. A inteligência artificial só acessa informações anonimizadas e determinísticas para responder suas dúvidas contextuais.
3. Não vendemos seus dados nem compartilhamos informações com terceiros sem seu consentimento expresso.`
    });
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

        <span className="text-xs font-semibold px-3 py-1 bg-stone-100 rounded-full text-stone-700">
          Minha Conta
        </span>
      </div>

      {/* User Hero Card */}
      <div className="p-6 bg-white rounded-3xl border border-stone-200 text-center relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-[#0C6B58]/10 text-[#0C6B58] flex items-center justify-center mx-auto mb-3">
          <UserCircle className="w-16 h-16" />
        </div>

        <h2 className="text-lg font-bold text-stone-900">{user?.name}</h2>
        <p className="text-xs text-stone-500">{user?.email}</p>

        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-stone-50 rounded-full text-xs font-medium text-stone-600 border border-stone-100">
          🎯 <span>{user?.financialGoal || 'Autonomia financeira'}</span>
        </div>

        <div className="mt-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-bold text-[#0C6B58] hover:underline"
          >
            {isEditing ? 'Cancelar edição' : 'Editar dados cadastrais'}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Dados atualizados com sucesso!</span>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="p-5 bg-white rounded-3xl border border-stone-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Editar Perfil</h3>

          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">Nome Completo</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border rounded-xl text-xs font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">Objetivo Financeiro Principal</label>
            <input
              type="text"
              value={financialGoal}
              onChange={e => setFinancialGoal(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border rounded-xl text-xs font-medium"
              placeholder="Ex: Montar reserva de emergência e viajar"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-semibold text-stone-700">Notificações Inteligentes</span>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={e => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#0C6B58]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#0C6B58] text-white font-bold text-xs hover:bg-[#08493c]"
          >
            Salvar Alterações
          </button>
        </form>
      )}

      {/* Settings Navigation Menu */}
      <div className="bg-white rounded-3xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
        {/* Open Finance */}
        <button
          onClick={onOpenBankConnect}
          className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0C6B58] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Conexão Bancária (Open Finance)</h4>
              <p className="text-[11px] text-stone-500">
                {user?.isBankConnected ? `Conectado ao ${user.connectedBankName}` : 'Sem banco conectado (Modo Manual)'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        {/* Categories and Budgets */}
        <button
          onClick={onOpenCategories}
          className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Categorias & Tetos Orçamentários</h4>
              <p className="text-[11px] text-stone-500">Defina limites mensais para cada área de gasto</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        {/* Terms of use */}
        <button
          onClick={openTerms}
          className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Termos de Uso</h4>
              <p className="text-[11px] text-stone-500">Condições de uso do MOVA</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        {/* Privacy Policy */}
        <button
          onClick={openPrivacy}
          className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Privacidade & Proteção de Dados</h4>
              <p className="text-[11px] text-stone-500">Transparência total com suas informações</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      {/* Logout Action */}
      <button
        onClick={onLogout}
        className="w-full p-4 rounded-3xl bg-rose-50 border border-rose-200/80 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Sair da Conta / Reiniciar Sessão</span>
      </button>

      {/* Terms / Privacy Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-stone-100">
            <button
              onClick={() => setModalContent(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-stone-900 mb-3">{modalContent.title}</h3>
            <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line mb-4">
              {modalContent.content}
            </p>
            <button
              onClick={() => setModalContent(null)}
              className="w-full py-2.5 rounded-xl bg-[#0C6B58] text-white font-bold text-xs"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
