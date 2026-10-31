import React from 'react';
import { Bell, Sparkles, Building2, UserCircle } from 'lucide-react';
import { UserProfile, AppNotification } from '../types/index.js';

interface NavbarProps {
  user: UserProfile | null;
  activeTab: string;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenAssistant: () => void;
  onOpenProfile: () => void;
  onOpenBankConnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  notifications,
  onOpenNotifications,
  onOpenAssistant,
  onOpenProfile,
  onOpenBankConnect
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0C6B58] flex items-center justify-center text-white font-extrabold text-lg shadow-sm shadow-[#0C6B58]/30 tracking-tight">
            M
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-stone-900 tracking-tight">MOVA</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-[#0C6B58]/10 text-[#0C6B58]">
                Beta
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">Autonomia Financeira</p>
          </div>
        </div>

        {/* Status / Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Bank Connect Badge */}
          <button
            onClick={onOpenBankConnect}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              user?.isBankConnected
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
            title="Conectar banco via Open Finance"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{user?.isBankConnected ? user.connectedBankName || 'Open Finance' : 'Conectar Banco'}</span>
          </button>

          {/* Assistant Trigger Button */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0C6B58]/10 text-[#0C6B58] hover:bg-[#0C6B58]/20 transition-colors text-xs font-semibold"
            aria-label="Abrir assistente MOVA IA"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">MOVA IA</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            className="p-1 rounded-full text-stone-600 hover:text-[#0C6B58] transition-colors"
            aria-label="Perfil do usuário"
          >
            <UserCircle className="w-7 h-7" />
          </button>
        </div>
      </div>
    </header>
  );
};
