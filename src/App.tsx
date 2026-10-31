import React, { useState, useEffect } from 'react';
import { api } from './services/api.js';
import {
  UserProfile,
  MonthlySummary,
  Transaction,
  Goal,
  Category,
  Article,
  EconomicIndicator,
  AppNotification
} from './types/index.js';

import { Navbar } from './components/Navbar.js';
import { BottomNav } from './components/BottomNav.js';
import { DashboardView } from './components/DashboardView.js';
import { MonthlyOverviewView } from './components/MonthlyOverviewView.js';
import { AnnualEvolutionView } from './components/AnnualEvolutionView.js';
import { FinanceComparisonView } from './components/FinanceComparisonView.js';
import { TransactionsView } from './components/TransactionsView.js';
import { GoalsView } from './components/GoalsView.js';
import { CategoriesView } from './components/CategoriesView.js';
import { EducationView } from './components/EducationView.js';
import { ProfileView } from './components/ProfileView.js';
import { AddTransactionModal } from './components/AddTransactionModal.js';
import { BankConnectModal } from './components/BankConnectModal.js';
import { MovaAssistant } from './components/MovaAssistant.js';
import { NotificationsModal } from './components/NotificationsModal.js';
import { OnboardingModal } from './components/OnboardingModal.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Core Data States
  const [user, setUser] = useState<UserProfile | null>(null);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [indicators, setIndicators] = useState<EconomicIndicator[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [annualData, setAnnualData] = useState<any | null>(null);
  const [tips, setTips] = useState<any[]>([]);

  // Modals & UI Controls
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isBankConnectOpen, setIsBankConnectOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState<string | undefined>(undefined);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Initialize and load data from backend
  const refreshAllData = async () => {
    try {
      const [dash, txs, cats, arts, notifs, annual] = await Promise.all([
        api.getDashboard(),
        api.getTransactions(),
        api.getCategories(),
        api.getArticles(),
        api.getNotifications(),
        api.getAnnualAnalysis()
      ]);

      setUser(dash.user);
      setSummary(dash.summary);
      setGoals(dash.goals);
      setIndicators(dash.indicators);
      setTips(dash.tips);

      setTransactions(txs);
      setCategories(cats);
      setArticles(arts);
      setNotifications(notifs);
      setAnnualData(annual);
    } catch (err) {
      console.error('Erro ao carregar dados do MOVA:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Handlers
  const handleCreateTransaction = async (data: any) => {
    const res = await api.createTransaction(data);
    if (res.success) {
      await refreshAllData();
    }
    return res;
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Deseja excluir esta movimentação?')) {
      await api.deleteTransaction(id);
      await refreshAllData();
    }
  };

  const handleBankConnect = async (bankName: string) => {
    await api.connectBank(bankName, 'connect');
    await refreshAllData();
  };

  const handleBankSkip = async () => {
    await api.connectBank('', 'skip');
    await refreshAllData();
  };

  const handleCreateGoal = async (data: any) => {
    const res = await api.createGoal(data);
    if (res.success) {
      await refreshAllData();
    }
    return res;
  };

  const handleContributeGoal = async (id: string, amount: number) => {
    const res = await api.contributeToGoal(id, amount);
    if (res.success) {
      await refreshAllData();
    }
    return res;
  };

  const handleDeleteGoal = async (id: string) => {
    if (window.confirm('Deseja excluir esta meta?')) {
      const res = await api.deleteGoal(id);
      await refreshAllData();
      return res;
    }
    return { success: false };
  };

  const handleCreateCategory = async (data: any) => {
    const res = await api.createCategory(data);
    await refreshAllData();
    return res;
  };

  const handleUpdateCategory = async (id: string, data: any) => {
    const res = await api.updateCategory(id, data);
    await refreshAllData();
    return res;
  };

  const handleUpdateUser = async (data: any) => {
    await api.updateUser(data);
    await refreshAllData();
  };

  const handleMarkNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleOpenAssistantWithPrompt = (prompt: string) => {
    setAssistantPrompt(prompt);
    setIsAssistantOpen(true);
  };

  const handleOnboardingFinish = async (selectedGoal: string) => {
    await api.updateUser({ financialGoal: selectedGoal });
    setIsOnboardingOpen(false);
    setIsBankConnectOpen(true); // Ask if user wants to connect bank as per user flow
    await refreshAllData();
  };

  const handleLogout = () => {
    setIsOnboardingOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-3xl bg-[#0C6B58] text-white flex items-center justify-center font-extrabold text-2xl shadow-xl shadow-[#0C6B58]/30 animate-pulse mb-4">
          M
        </div>
        <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">MOVA</h2>
        <p className="text-xs text-stone-500 mt-1">Carregando seu controle financeiro inteligente...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Top Navbar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenBankConnect={() => setIsBankConnectOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-4">
        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            summary={summary}
            recentTransactions={transactions.slice(0, 5)}
            goals={goals}
            indicators={indicators}
            tips={tips}
            onOpenAddTransaction={() => setIsAddTxOpen(true)}
            onNavigateTab={tab => setActiveTab(tab)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        )}

        {activeTab === 'ver-meu-mes' && (
          <MonthlyOverviewView
            summary={summary}
            transactions={transactions}
            onBackToDashboard={() => setActiveTab('dashboard')}
            onOpenAssistantWithPrompt={handleOpenAssistantWithPrompt}
          />
        )}

        {activeTab === 'evolucao-12m' && (
          <AnnualEvolutionView
            annualData={annualData}
            allTransactions={transactions}
            onBackToDashboard={() => setActiveTab('dashboard')}
            onOpenAssistantWithPrompt={handleOpenAssistantWithPrompt}
          />
        )}

        {activeTab === 'comparativos' && (
          <FinanceComparisonView
            categories={categories}
            onBackToDashboard={() => setActiveTab('dashboard')}
            onOpenAssistantWithPrompt={handleOpenAssistantWithPrompt}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView
            transactions={transactions}
            categories={categories}
            onOpenAddTransaction={() => setIsAddTxOpen(true)}
            onDeleteTransaction={handleDeleteTransaction}
            onOpenAssistantWithPrompt={handleOpenAssistantWithPrompt}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsView
            goals={goals}
            onCreateGoal={handleCreateGoal}
            onContributeGoal={handleContributeGoal}
            onDeleteGoal={handleDeleteGoal}
            onOpenAssistantWithPrompt={handleOpenAssistantWithPrompt}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesView
            categories={categories}
            transactions={transactions}
            onBackToDashboard={() => setActiveTab('dashboard')}
            onCreateCategory={handleCreateCategory}
            onUpdateCategory={handleUpdateCategory}
          />
        )}

        {activeTab === 'education' && (
          <EducationView
            articles={articles}
            indicators={indicators}
            onOpenAssistantWithPrompt={handleOpenAssistantWithPrompt}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            onBackToDashboard={() => setActiveTab('dashboard')}
            onOpenBankConnect={() => setIsBankConnectOpen(true)}
            onOpenCategories={() => setActiveTab('categories')}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={tab => setActiveTab(tab)}
        onOpenAddTransaction={() => setIsAddTxOpen(true)}
      />

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        categories={categories}
        onSave={handleCreateTransaction}
      />

      <BankConnectModal
        isOpen={isBankConnectOpen}
        onClose={() => setIsBankConnectOpen(false)}
        onConnect={handleBankConnect}
        onSkip={handleBankSkip}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onFinish={handleOnboardingFinish}
      />

      <MovaAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        screenContext={activeTab}
        initialPrompt={assistantPrompt}
        onClearInitialPrompt={() => setAssistantPrompt(undefined)}
      />
    </div>
  );
}
