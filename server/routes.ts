import { Router, Request, Response } from 'express';
import { db } from './data/store.js';
import { TransactionService } from './services/transactionService.js';
import { AnnualAnalysisService } from './services/annualAnalysisService.js';
import { ComparisonService } from './services/comparisonService.js';
import { GoalsService } from './services/goalsService.js';
import { DashboardService } from './services/dashboardService.js';
import { EconomicService } from './services/economicService.js';
import { ArticleService } from './services/articleService.js';
import { AssistantService } from './services/assistantService.js';

export const apiRouter = Router();

// Health check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'MOVA Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// User & Profile
apiRouter.get('/user', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_mova_001';
  const user = db.getUser(userId);
  res.json(user);
});

apiRouter.put('/user', (req: Request, res: Response) => {
  const userId = (req.body.userId as string) || 'user_mova_001';
  const updated = db.updateUser(userId, req.body);
  res.json({ success: true, user: updated });
});

// Auth Routes (Login, Register, Password Reset)
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'E-mail e senha são obrigatórios.' });
  }
  const user = db.getUser('user_mova_001');
  return res.json({
    success: true,
    user,
    token: `mova_token_${Date.now()}`
  });
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, password, financialGoal } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Nome, e-mail e senha são obrigatórios.' });
  }
  const user = db.updateUser('user_mova_001', {
    name,
    email,
    financialGoal: financialGoal || 'Construir autonomia financeira'
  });
  return res.json({
    success: true,
    user,
    token: `mova_token_${Date.now()}`
  });
});

apiRouter.post('/auth/reset-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Informe seu e-mail cadastrado.' });
  }
  return res.json({
    success: true,
    message: `Instruções de recuperação de senha enviadas com sucesso para ${email}.`
  });
});

// Bank Connect (Open Finance Simulation as requested in User Flow)
apiRouter.post('/bank/connect', (req: Request, res: Response) => {
  const { bankName, action } = req.body; // action: 'connect' | 'skip'
  const userId = 'user_mova_001';

  if (action === 'skip') {
    db.updateUser(userId, { isBankConnected: false, connectedBankName: '' });
    return res.json({ success: true, connected: false });
  }

  const updated = db.updateUser(userId, {
    isBankConnected: true,
    connectedBankName: bankName || 'Nubank (Open Finance)'
  });

  db.addNotification(userId, {
    title: 'Conta Conectada via Open Finance',
    message: `Sua conta do ${bankName || 'Nubank'} foi conectada com sucesso em modo seguro.`,
    type: 'tip',
    read: false
  });

  return res.json({ success: true, connected: true, user: updated });
});

// Dashboard
apiRouter.get('/dashboard', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_mova_001';
  const data = DashboardService.getDashboardData(userId);
  res.json(data);
});

// Transactions CRUD
apiRouter.get('/transactions', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_mova_001';
  const filters = {
    type: req.query.type as any,
    categoryId: req.query.categoryId as string,
    monthKey: req.query.monthKey as string,
    search: req.query.search as string
  };
  const list = TransactionService.getTransactions(userId, filters);
  res.json(list);
});

apiRouter.post('/transactions', (req: Request, res: Response) => {
  const userId = (req.body.userId as string) || 'user_mova_001';
  const result = TransactionService.createTransaction(userId, req.body);
  if (!result.success) {
    return res.status(400).json(result);
  }
  return res.status(201).json(result);
});

apiRouter.put('/transactions/:id', (req: Request, res: Response) => {
  const userId = (req.body.userId as string) || 'user_mova_001';
  const id = req.params.id;
  const result = TransactionService.updateTransaction(userId, id, req.body);
  if (!result.success) {
    return res.status(404).json(result);
  }
  return res.json(result);
});

apiRouter.delete('/transactions/:id', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_mova_001';
  const id = req.params.id;
  const result = TransactionService.deleteTransaction(userId, id);
  if (!result.success) {
    return res.status(404).json(result);
  }
  return res.json(result);
});

apiRouter.get('/transactions/summary', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_mova_001';
  const monthKey = (req.query.monthKey as string) || '2026-10';
  const summary = TransactionService.getMonthlySummary(userId, monthKey);
  res.json(summary);
});

// 12-Month Financial Evolution ("Minha Evolução Financeira")
apiRouter.get('/annual-analysis', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_mova_001';
  const analysis = AnnualAnalysisService.get12MonthEvolution(userId);
  res.json(analysis);
});

// Comparisons ("Comparar Minhas Finanças")
apiRouter.get('/comparison', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_mova_001';
  const mode = (req.query.mode as string) || 'months'; // 'months' | 'range' | 'categories'

  if (mode === 'range') {
    const count = parseInt(req.query.count as string, 10) || 3;
    const result = ComparisonService.compareMultiMonthRanges(count, userId);
    return res.json(result);
  }

  if (mode === 'categories') {
    const cat1 = req.query.cat1 as string;
    const cat2 = req.query.cat2 as string;
    if (!cat1 || !cat2) {
      return res.status(400).json({ error: 'Informe as categorias cat1 e cat2' });
    }
    const result = ComparisonService.compareTwoCategories(cat1, cat2, userId);
    return res.json(result);
  }

  const m1 = (req.query.m1 as string) || '2026-10';
  const m2 = (req.query.m2 as string) || '2026-09';
  const result = ComparisonService.compareMonths(m1, m2, userId);
  return res.json(result);
});

// Goals CRUD
apiRouter.get('/goals', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_mova_001';
  const goals = GoalsService.getGoals(userId);
  res.json(goals);
});

apiRouter.post('/goals', (req: Request, res: Response) => {
  const userId = (req.body.userId as string) || 'user_mova_001';
  const result = GoalsService.createGoal(userId, req.body);
  if (!result.success) {
    return res.status(400).json(result);
  }
  return res.status(201).json(result);
});

apiRouter.put('/goals/:id', (req: Request, res: Response) => {
  const userId = (req.body.userId as string) || 'user_mova_001';
  const result = GoalsService.updateGoal(userId, req.params.id, req.body);
  if (!result.success) {
    return res.status(404).json(result);
  }
  return res.json(result);
});

apiRouter.post('/goals/:id/contribute', (req: Request, res: Response) => {
  const userId = (req.body.userId as string) || 'user_mova_001';
  const amount = Number(req.body.amount);
  const result = GoalsService.addContribution(userId, req.params.id, amount);
  if (!result.success) {
    return res.status(400).json(result);
  }
  return res.json(result);
});

apiRouter.delete('/goals/:id', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_mova_001';
  const result = GoalsService.deleteGoal(userId, req.params.id);
  if (!result.success) {
    return res.status(404).json(result);
  }
  return res.json(result);
});

// Categories CRUD & Limits
apiRouter.get('/categories', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_mova_001';
  const categories = db.getCategories(userId);
  res.json(categories);
});

apiRouter.post('/categories', (req: Request, res: Response) => {
  const userId = (req.body.userId as string) || 'user_mova_001';
  const { name, type, color, icon, budgetLimit } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });
  }
  const created = db.createCategory(userId, {
    name,
    type: type || 'expense',
    color: color || '#0C6B58',
    icon: icon || 'Tag',
    budgetLimit: Number(budgetLimit) || 0
  });
  return res.status(201).json(created);
});

apiRouter.put('/categories/:id', (req: Request, res: Response) => {
  const userId = (req.body.userId as string) || 'user_mova_001';
  const updated = db.updateCategory(userId, req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Categoria não encontrada.' });
  }
  return res.json(updated);
});

// Financial Education Articles & Web Search
apiRouter.get('/articles', (req: Request, res: Response) => {
  const q = req.query.search as string;
  if (q) {
    return res.json(ArticleService.searchArticles(q));
  }
  return res.json(ArticleService.getArticles());
});

// Economic Indicators (Banco Central do Brasil SGS)
apiRouter.get('/economic-indicators', async (_req: Request, res: Response) => {
  const indicators = await EconomicService.refreshIndicators();
  res.json(indicators);
});

// Notifications
apiRouter.get('/notifications', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_mova_001';
  const list = db.getNotifications(userId);
  res.json(list);
});

apiRouter.post('/notifications/:id/read', (req: Request, res: Response) => {
  const userId = (req.body.userId as string) || 'user_mova_001';
  db.markNotificationAsRead(userId, req.params.id);
  res.json({ success: true });
});

// MOVA AI Assistant
apiRouter.post('/assistant/chat', async (req: Request, res: Response) => {
  const { message, screenContext, userId } = req.body;
  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Mensagem não pode ser vazia.' });
  }

  try {
    const responseMessage = await AssistantService.processMessage(
      userId || 'user_mova_001',
      message.trim(),
      screenContext || 'dashboard'
    );
    return res.json(responseMessage);
  } catch (err: any) {
    console.error('Erro no assistantService:', err);
    return res.status(500).json({ error: 'Erro ao processar mensagem com a IA.' });
  }
});

apiRouter.get('/assistant/history', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_mova_001';
  const history = AssistantService.getConversationHistory(userId);
  res.json(history);
});

apiRouter.delete('/assistant/history', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_mova_001';
  AssistantService.clearConversation(userId);
  res.json({ success: true });
});
