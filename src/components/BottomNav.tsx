import React from 'react';
import { Home, ArrowLeftRight, Plus, Target, BookOpen } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAddTransaction: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddTransaction
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'transactions', label: 'Movimentações', icon: ArrowLeftRight },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'education', label: 'Educação', icon: BookOpen }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200/90 pb-safe">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* First two items */}
        {navItems.slice(0, 2).map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
                isActive ? 'text-[#0C6B58] font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[11px] mt-1">{item.label}</span>
            </button>
          );
        })}

        {/* Central Add Transaction FAB */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={onOpenAddTransaction}
            className="w-12 h-12 -mt-5 rounded-full bg-[#0C6B58] text-white flex items-center justify-center shadow-lg shadow-[#0C6B58]/35 hover:bg-[#08493c] active:scale-95 transition-all"
            aria-label="Adicionar movimentação"
          >
            <Plus className="w-6 h-6 stroke-[2.5px]" />
          </button>
        </div>

        {/* Last two items */}
        {navItems.slice(2).map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
                isActive ? 'text-[#0C6B58] font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[11px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
