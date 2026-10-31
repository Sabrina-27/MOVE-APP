import React from 'react';
import { X, Bell, Check, AlertTriangle, Target, Sparkles } from 'lucide-react';
import { AppNotification } from '../types/index.js';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => Promise<void>;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'budget_alert':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'goal_progress':
        return <Target className="w-4 h-4 text-[#0C6B58]" />;
      case 'tip':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-stone-100 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0C6B58] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Notificações Inteligentes</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {notifications.length > 0 ? (
            notifications.map(n => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border text-xs transition-colors flex items-start justify-between gap-3 ${
                  n.read ? 'bg-stone-50 border-stone-100 text-stone-600' : 'bg-emerald-50/40 border-emerald-100 text-stone-900'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white shadow-xs shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs">{n.title}</h5>
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">{n.message}</p>
                    <span className="text-[9px] text-stone-400 mt-1 block">
                      {new Date(n.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={() => onMarkRead(n.id)}
                    className="p-1 text-[#0C6B58] hover:bg-[#0C6B58]/10 rounded-lg shrink-0"
                    title="Marcar como lida"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-stone-400 py-8 text-center">Nenhuma notificação no momento.</p>
          )}
        </div>
      </div>
    </div>
  );
};
