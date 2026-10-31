import {
  Transaction,
  Category,
  Goal,
  AnnualAnalysis,
  ComparisonResult,
  Article,
  EconomicIndicator,
  AppNotification,
  ChatMessage,
  UserProfile,
  MonthlySummary
} from '../types/index.js';

const API_BASE = '/api';

export const api = {
  // User Profile
  async getUser(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/user`);
    return res.json();
  },

  async updateUser(data: Partial<UserProfile>): Promise<{ success: boolean; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Auth
  async login(email: string, password: string):Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(name: string, email: string, password: string, financialGoal?: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, financialGoal })
    });
    return res.json();
  },

  async resetPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  // Bank connect
  async connectBank(bankName: string, action: 'connect' | 'skip' = 'connect'): Promise<{ success: boolean; connected: boolean; user?: UserProfile }> {
    const res = await fetch(`${API_BASE}/bank/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bankName, action })
    });
    return res.json();
  },

  // Dashboard
  async getDashboard(): Promise<{
    user: UserProfile;
    summary: MonthlySummary;
    recentTransactions: Transaction[];
    goals: (Goal & { progressPct: number; remainingAmount: number; monthsRemaining: number; monthlyRequired: number })[];
    indicators: EconomicIndicator[];
    tips: { id: string; title: string; message: string; tag: string }[];
  }> {
    const res = await fetch(`${API_BASE}/dashboard`);
    return res.json();
  },

  // Transactions
  async getTransactions(filters?: { type?: string; categoryId?: string; monthKey?: string; search?: string }): Promise<Transaction[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.monthKey) params.append('monthKey', filters.monthKey);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/transactions?${params.toString()}`);
    return res.json();
  },

  async createTransaction(data: {
    type: 'income' | 'expense';
    amount: number;
    categoryId: string;
    date: string;
    description: string;
    paymentMethod: string;
  }): Promise<{ success: boolean; transaction?: Transaction; error?: string }> {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<{ success: boolean; transaction?: Transaction; error?: string }> {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteTransaction(id: string): Promise<{ success: boolean; error?: string }> {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async getMonthlySummary(monthKey: string = '2026-10'): Promise<MonthlySummary> {
    const res = await fetch(`${API_BASE}/transactions/summary?monthKey=${monthKey}`);
    return res.json();
  },

  // 12-Month Annual Analysis
  async getAnnualAnalysis(): Promise<AnnualAnalysis> {
    const res = await fetch(`${API_BASE}/annual-analysis`);
    return res.json();
  },

  // Comparisons
  async getComparison(params: { mode?: 'months' | 'range' | 'categories'; m1?: string; m2?: string; count?: number; cat1?: string; cat2?: string }): Promise<ComparisonResult | any> {
    const q = new URLSearchParams();
    if (params.mode) q.append('mode', params.mode);
    if (params.m1) q.append('m1', params.m1);
    if (params.m2) q.append('m2', params.m2);
    if (params.count) q.append('count', String(params.count));
    if (params.cat1) q.append('cat1', params.cat1);
    if (params.cat2) q.append('cat2', params.cat2);

    const res = await fetch(`${API_BASE}/comparison?${q.toString()}`);
    return res.json();
  },

  // Goals
  async getGoals(): Promise<(Goal & { progressPct: number; remainingAmount: number; monthsRemaining: number; monthlyRequired: number })[]> {
    const res = await fetch(`${API_BASE}/goals`);
    return res.json();
  },

  async createGoal(data: { title: string; targetAmount: number; currentAmount?: number; deadline: string; category?: string; notes?: string }): Promise<{ success: boolean; goal?: Goal; error?: string }> {
    const res = await fetch(`${API_BASE}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async contributeToGoal(id: string, amount: number): Promise<{ success: boolean; goal?: Goal; error?: string }> {
    const res = await fetch(`${API_BASE}/goals/${id}/contribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    return res.json();
  },

  async deleteGoal(id: string): Promise<{ success: boolean; error?: string }> {
    const res = await fetch(`${API_BASE}/goals/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },

  async createCategory(data: { name: string; type: 'income' | 'expense'; color: string; icon: string; budgetLimit?: number }): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Articles & Economic Indicators
  async getArticles(search?: string): Promise<Article[]> {
    const url = search ? `${API_BASE}/articles?search=${encodeURIComponent(search)}` : `${API_BASE}/articles`;
    const res = await fetch(url);
    return res.json();
  },

  async getEconomicIndicators(): Promise<EconomicIndicator[]> {
    const res = await fetch(`${API_BASE}/economic-indicators`);
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<AppNotification[]> {
    const res = await fetch(`${API_BASE}/notifications`);
    return res.json();
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'POST'
    });
    return res.json();
  },

  // Assistant Chat
  async sendAssistantMessage(message: string, screenContext: string): Promise<ChatMessage> {
    const res = await fetch(`${API_BASE}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, screenContext })
    });
    return res.json();
  },

  async getAssistantHistory(): Promise<ChatMessage[]> {
    const res = await fetch(`${API_BASE}/assistant/history`);
    return res.json();
  },

  async clearAssistantHistory(): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/assistant/history`, {
      method: 'DELETE'
    });
    return res.json();
  }
};
