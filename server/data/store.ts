import {
  Transaction,
  Category,
  Goal,
  Budget,
  UserProfile,
  Article,
  EconomicIndicator,
  AppNotification,
  ChatMessage
} from '../../src/types/index.js';

export interface DatabaseSchema {
  users: Record<string, UserProfile>;
  transactions: Record<string, Record<string, Transaction>>; // userId -> transactionId -> Transaction
  categories: Record<string, Record<string, Category>>; // userId -> categoryId -> Category
  goals: Record<string, Record<string, Goal>>; // userId -> goalId -> Goal
  budgets: Record<string, Record<string, Budget>>; // userId -> budgetId -> Budget
  settings: Record<string, { theme: string; notifications: boolean }>;
  conversations: Record<string, Record<string, ChatMessage>>; // userId -> messageId -> ChatMessage
  articleCache: Record<string, Article>;
  economicIndicators: EconomicIndicator[];
  notifications: Record<string, AppNotification[]>; // userId -> AppNotification[]
}

const DEFAULT_USER_ID = 'user_mova_001';

// Seed Initial Categories
const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_salario', userId: DEFAULT_USER_ID, name: 'Salário & Bolsa', type: 'income', color: '#0C6B58', icon: 'Briefcase', budgetLimit: 0 },
  { id: 'cat_freelance', userId: DEFAULT_USER_ID, name: 'Freelance & Bicos', type: 'income', color: '#10B981', icon: 'Laptop', budgetLimit: 0 },
  { id: 'cat_alimentacao', userId: DEFAULT_USER_ID, name: 'Alimentação', type: 'expense', color: '#F59E0B', icon: 'Utensils', budgetLimit: 750 },
  { id: 'cat_transporte', userId: DEFAULT_USER_ID, name: 'Transporte', type: 'expense', color: '#3B82F6', icon: 'Bus', budgetLimit: 320 },
  { id: 'cat_moradia', userId: DEFAULT_USER_ID, name: 'Moradia & Contas', type: 'expense', color: '#8B5CF6', icon: 'Home', budgetLimit: 600 },
  { id: 'cat_lazer', userId: DEFAULT_USER_ID, name: 'Lazer & Rolês', type: 'expense', color: '#EC4899', icon: 'Smile', budgetLimit: 350 },
  { id: 'cat_saude', userId: DEFAULT_USER_ID, name: 'Saúde & Autocuidado', type: 'expense', color: '#EF4444', icon: 'HeartPulse', budgetLimit: 200 },
  { id: 'cat_educacao', userId: DEFAULT_USER_ID, name: 'Educação & Cursos', type: 'expense', color: '#06B6D4', icon: 'GraduationCap', budgetLimit: 250 },
  { id: 'cat_outros', userId: DEFAULT_USER_ID, name: 'Outros', type: 'expense', color: '#64748B', icon: 'Tag', budgetLimit: 150 },
];

// Seed 12 full months of transactions (from Nov 2025 to Oct 2026) for young adult profile (Lucas, 22y)
const INITIAL_TRANSACTIONS: Transaction[] = [
  // Mês 1: Nov/2025
  { id: 'tx_101', userId: DEFAULT_USER_ID, type: 'income', amount: 2200, categoryId: 'cat_salario', categoryName: 'Salário & Bolsa', date: '2025-11-05', description: 'Bolsa de estágio de desenvolvimento', paymentMethod: 'pix', createdAt: '2025-11-05T10:00:00Z' },
  { id: 'tx_102', userId: DEFAULT_USER_ID, type: 'income', amount: 450, categoryId: 'cat_freelance', categoryName: 'Freelance & Bicos', date: '2025-11-18', description: 'Design de landing page para cliente', paymentMethod: 'pix', createdAt: '2025-11-18T14:30:00Z' },
  { id: 'tx_103', userId: DEFAULT_USER_ID, type: 'expense', amount: 580, categoryId: 'cat_alimentacao', categoryName: 'Alimentação', date: '2025-11-06', description: 'Supermercado e feira do mês', paymentMethod: 'debito', createdAt: '2025-11-06T18:00:00Z' },
  { id: 'tx_104', userId: DEFAULT_USER_ID, type: 'expense', amount: 240, categoryId: 'cat_transporte', categoryName: 'Transporte', date: '2025-11-07', description: 'Recarga Bilhete Único', paymentMethod: 'debito', createdAt: '2025-11-07T08:15:00Z' },
  { id: 'tx_105', userId: DEFAULT_USER_ID, type: 'expense', amount: 480, categoryId: 'cat_moradia', categoryName: 'Moradia & Contas', date: '2025-11-10', description: 'Divisão de aluguel e internet', paymentMethod: 'pix', createdAt: '2025-11-10T12:00:00Z' },
  { id: 'tx_106', userId: DEFAULT_USER_ID, type: 'expense', amount: 210, categoryId: 'cat_lazer', categoryName: 'Lazer & Rolês', date: '2025-11-15', description: 'Cinema e lanche com amigos', paymentMethod: 'credito', createdAt: '2025-11-15T21:00:00Z' },

  // Mês 2: Dez/2025
  { id: 'tx_201', userId: DEFAULT_USER_ID, type: 'income', amount: 2200, categoryId: 'cat_salario', categoryName: 'Salário & Bolsa', date: '2025-12-05', description: 'Bolsa de estágio', paymentMethod: 'pix', createdAt: '2025-12-05T10:00:00Z' },
  { id: 'tx_202', userId: DEFAULT_USER_ID, type: 'income', amount: 700, categoryId: 'cat_freelance', categoryName: 'Freelance & Bicos', date: '2025-12-20', description: 'Desenvolvimento de site para cafeteria', paymentMethod: 'pix', createdAt: '2025-12-20T16:00:00Z' },
  { id: 'tx_203', userId: DEFAULT_USER_ID, type: 'expense', amount: 690, categoryId: 'cat_alimentacao', categoryName: 'Alimentação', date: '2025-12-08', description: 'Supermercado e compras de fim de ano', paymentMethod: 'debito', createdAt: '2025-12-08T17:00:00Z' },
  { id: 'tx_204', userId: DEFAULT_USER_ID, type: 'expense', amount: 260, categoryId: 'cat_transporte', categoryName: 'Transporte', date: '2025-12-10', description: 'Uber e transporte intermunicipal', paymentMethod: 'credito', createdAt: '2025-12-10T20:00:00Z' },
  { id: 'tx_205', userId: DEFAULT_USER_ID, type: 'expense', amount: 480, categoryId: 'cat_moradia', categoryName: 'Moradia & Contas', date: '2025-12-10', description: 'Divisão de moradia', paymentMethod: 'pix', createdAt: '2025-12-10T11:00:00Z' },
  { id: 'tx_206', userId: DEFAULT_USER_ID, type: 'expense', amount: 380, categoryId: 'cat_lazer', categoryName: 'Lazer & Rolês', date: '2025-12-24', description: 'Confraternização e amigo secreto', paymentMethod: 'credito', createdAt: '2025-12-24T22:00:00Z' },

  // Mês 3: Jan/2026
  { id: 'tx_301', userId: DEFAULT_USER_ID, type: 'income', amount: 2400, categoryId: 'cat_salario', categoryName: 'Salário & Bolsa', date: '2026-01-05', description: 'Estágio com reajuste anual', paymentMethod: 'pix', createdAt: '2026-01-05T10:00:00Z' },
  { id: 'tx_302', userId: DEFAULT_USER_ID, type: 'expense', amount: 610, categoryId: 'cat_alimentacao', categoryName: 'Alimentação', date: '2026-01-08', description: 'Mercado e marmitas semanais', paymentMethod: 'debito', createdAt: '2026-01-08T15:00:00Z' },
  { id: 'tx_303', userId: DEFAULT_USER_ID, type: 'expense', amount: 230, categoryId: 'cat_transporte', categoryName: 'Transporte', date: '2026-01-12', description: 'Passe de metrô e ônibus', paymentMethod: 'debito', createdAt: '2026-01-12T09:00:00Z' },
  { id: 'tx_304', userId: DEFAULT_USER_ID, type: 'expense', amount: 500, categoryId: 'cat_moradia', categoryName: 'Moradia & Contas', date: '2026-01-10', description: 'Contas de luz, água e internet', paymentMethod: 'pix', createdAt: '2026-01-10T10:00:00Z' },
  { id: 'tx_305', userId: DEFAULT_USER_ID, type: 'expense', amount: 180, categoryId: 'cat_educacao', categoryName: 'Educação & Cursos', date: '2026-01-15', description: 'Livros técnicos e curso de UI/UX', paymentMethod: 'credito', createdAt: '2026-01-15T14:00:00Z' },

  // Mês 4: Fev/2026
  { id: 'tx_401', userId: DEFAULT_USER_ID, type: 'income', amount: 2400, categoryId: 'cat_salario', categoryName: 'Salário & Bolsa', date: '2026-02-05', description: 'Estágio', paymentMethod: 'pix', createdAt: '2026-02-05T10:00:00Z' },
  { id: 'tx_402', userId: DEFAULT_USER_ID, type: 'income', amount: 500, categoryId: 'cat_freelance', categoryName: 'Freelance & Bicos', date: '2026-02-22', description: 'Projeto freelance de identidade visual', paymentMethod: 'pix', createdAt: '2026-02-22T18:00:00Z' },
  { id: 'tx_403', userId: DEFAULT_USER_ID, type: 'expense', amount: 640, categoryId: 'cat_alimentacao', categoryName: 'Alimentação', date: '2026-02-08', description: 'Supermercado e hortifruti', paymentMethod: 'debito', createdAt: '2026-02-08T16:00:00Z' },
  { id: 'tx_404', userId: DEFAULT_USER_ID, type: 'expense', amount: 250, categoryId: 'cat_transporte', categoryName: 'Transporte', date: '2026-02-12', description: 'Transporte coletivo e viagens urbanas', paymentMethod: 'debito', createdAt: '2026-02-12T08:00:00Z' },
  { id: 'tx_405', userId: DEFAULT_USER_ID, type: 'expense', amount: 500, categoryId: 'cat_moradia', categoryName: 'Moradia & Contas', date: '2026-02-10', description: 'Aluguel proporcional e condomínio', paymentMethod: 'pix', createdAt: '2026-02-10T11:00:00Z' },
  { id: 'tx_406', userId: DEFAULT_USER_ID, type: 'expense', amount: 280, categoryId: 'cat_lazer', categoryName: 'Lazer & Rolês', date: '2026-02-17', description: 'Feriado de carnaval e passeios', paymentMethod: 'credito', createdAt: '2026-02-17T20:00:00Z' },

  // Mês 5: Mar/2026
  { id: 'tx_501', userId: DEFAULT_USER_ID, type: 'income', amount: 2400, categoryId: 'cat_salario', categoryName: 'Salário & Bolsa', date: '2026-03-05', description: 'Estágio', paymentMethod: 'pix', createdAt: '2026-03-05T10:00:00Z' },
  { id: 'tx_502', userId: DEFAULT_USER_ID, type: 'expense', amount: 590, categoryId: 'cat_alimentacao', categoryName: 'Alimentação', date: '2026-03-08', description: 'Supermercado', paymentMethod: 'debito', createdAt: '2026-03-08T18:00:00Z' },
  { id: 'tx_503', userId: DEFAULT_USER_ID, type: 'expense', amount: 240, categoryId: 'cat_transporte', categoryName: 'Transporte', date: '2026-03-11', description: 'Transporte', paymentMethod: 'debito', createdAt: '2026-03-11T08:30:00Z' },
  { id: 'tx_504', userId: DEFAULT_USER_ID, type: 'expense', amount: 520, categoryId: 'cat_moradia', categoryName: 'Moradia & Contas', date: '2026-03-10', description: 'Moradia e internet rápida', paymentMethod: 'pix', createdAt: '2026-03-10T12:00:00Z' },
  { id: 'tx_505', userId: DEFAULT_USER_ID, type: 'expense', amount: 150, categoryId: 'cat_saude', categoryName: 'Saúde & Autocuidado', date: '2026-03-18', description: 'Farmácia e vitaminas', paymentMethod: 'debito', createdAt: '2026-03-18T15:00:00Z' },

  // Mês 6: Abr/2026
  { id: 'tx_601', userId: DEFAULT_USER_ID, type: 'income', amount: 2600, categoryId: 'cat_salario', categoryName: 'Salário & Bolsa', date: '2026-04-05', description: 'Promovido a Júnior!', paymentMethod: 'pix', createdAt: '2026-04-05T10:00:00Z' },
  { id: 'tx_602', userId: DEFAULT_USER_ID, type: 'expense', amount: 620, categoryId: 'cat_alimentacao', categoryName: 'Alimentação', date: '2026-04-07', description: 'Supermercado do mês', paymentMethod: 'debito', createdAt: '2026-04-07T17:00:00Z' },
  { id: 'tx_603', userId: DEFAULT_USER_ID, type: 'expense', amount: 230, categoryId: 'cat_transporte', categoryName: 'Transporte', date: '2026-04-10', description: 'Passagens', paymentMethod: 'debito', createdAt: '2026-04-10T09:00:00Z' },
  { id: 'tx_604', userId: DEFAULT_USER_ID, type: 'expense', amount: 520, categoryId: 'cat_moradia', categoryName: 'Moradia & Contas', date: '2026-04-10', description: 'Moradia compartilhada', paymentMethod: 'pix', createdAt: '2026-04-10T11:00:00Z' },
  { id: 'tx_605', userId: DEFAULT_USER_ID, type: 'expense', amount: 190, categoryId: 'cat_lazer', categoryName: 'Lazer & Rolês', date: '2026-04-21', description: 'Show cultural e parque', paymentMethod: 'credito', createdAt: '2026-04-21T19:00:00Z' },

  // Mês 7: Mai/2026
  { id: 'tx_701', userId: DEFAULT_USER_ID, type: 'income', amount: 2600, categoryId: 'cat_salario', categoryName: 'Salário & Bolsa', date: '2026-05-05', description: 'Salário mensal', paymentMethod: 'pix', createdAt: '2026-05-05T10:00:00Z' },
  { id: 'tx_702', userId: DEFAULT_USER_ID, type: 'income', amount: 650, categoryId: 'cat_freelance', categoryName: 'Freelance & Bicos', date: '2026-05-18', description: 'Criação de e-commerce simples', paymentMethod: 'pix', createdAt: '2026-05-18T14:00:00Z' },
  { id: 'tx_703', userId: DEFAULT_USER_ID, type: 'expense', amount: 630, categoryId: 'cat_alimentacao', categoryName: 'Alimentação', date: '2026-05-08', description: 'Supermercado e pedidos esporádicos', paymentMethod: 'debito', createdAt: '2026-05-08T18:00:00Z' },
  { id: 'tx_704', userId: DEFAULT_USER_ID, type: 'expense', amount: 240, categoryId: 'cat_transporte', categoryName: 'Transporte', date: '2026-05-12', description: 'Transporte', paymentMethod: 'debito', createdAt: '2026-05-12T08:30:00Z' },
  { id: 'tx_705', userId: DEFAULT_USER_ID, type: 'expense', amount: 530, categoryId: 'cat_moradia', categoryName: 'Moradia & Contas', date: '2026-05-10', description: 'Moradia', paymentMethod: 'pix', createdAt: '2026-05-10T12:00:00Z' },

  // Mês 8: Jun/2026
  { id: 'tx_801', userId: DEFAULT_USER_ID, type: 'income', amount: 2600, categoryId: 'cat_salario', categoryName: 'Salário & Bolsa', date: '2026-06-05', description: 'Salário mensal', paymentMethod: 'pix', createdAt: '2026-06-05T10:00:00Z' },
  { id: 'tx_802', userId: DEFAULT_USER_ID, type: 'expense', amount: 670, categoryId: 'cat_alimentacao', categoryName: 'Alimentação', date: '2026-06-09', description: 'Compras do mês', paymentMethod: 'debito', createdAt: '2026-06-09T17:00:00Z' },
  { id: 'tx_803', userId: DEFAULT_USER_ID, type: 'expense', amount: 250, categoryId: 'cat_transporte', categoryName: 'Transporte', date: '2026-06-11', description: 'Transporte e combustível compartilhado', paymentMethod: 'debito', createdAt: '2026-06-11T09:00:00Z' },
  { id: 'tx_804', userId: DEFAULT_USER_ID, type: 'expense', amount: 530, categoryId: 'cat_moradia', categoryName: 'Moradia & Contas', date: '2026-06-10', description: 'Moradia', paymentMethod: 'pix', createdAt: '2026-06-10T12:00:00Z' },
  { id: 'tx_805', userId: DEFAULT_USER_ID, type: 'expense', amount: 260, categoryId: 'cat_lazer', categoryName: 'Lazer & Rolês', date: '2026-06-20', description: 'Festa junina e cinema', paymentMethod: 'credito', createdAt: '2026-06-20T21:00:00Z' },

  // Mês 9: Jul/2026
  { id: 'tx_901', userId: DEFAULT_USER_ID, type: 'income', amount: 2600, categoryId: 'cat_salario', categoryName: 'Salário & Bolsa', date: '2026-07-05', description: 'Salário mensal', paymentMethod: 'pix', createdAt: '2026-07-05T10:00:00Z' },
  { id: 'tx_902', userId: DEFAULT_USER_ID, type: 'income', amount: 800, categoryId: 'cat_freelance', categoryName: 'Freelance & Bicos', date: '2026-07-23', description: 'Consultoria e setup de servidor', paymentMethod: 'pix', createdAt: '2026-07-23T15:00:00Z' },
  { id: 'tx_903', userId: DEFAULT_USER_ID, type: 'expense', amount: 650, categoryId: 'cat_alimentacao', categoryName: 'Alimentação', date: '2026-07-08', description: 'Supermercado', paymentMethod: 'debito', createdAt: '2026-07-08T18:00:00Z' },
  { id: 'tx_904', userId: DEFAULT_USER_ID, type: 'expense', amount: 240, categoryId: 'cat_transporte', categoryName: 'Transporte', date: '2026-07-12', description: 'Transporte', paymentMethod: 'debito', createdAt: '2026-07-12T08:30:00Z' },
  { id: 'tx_905', userId: DEFAULT_USER_ID, type: 'expense', amount: 530, categoryId: 'cat_moradia', categoryName: 'Moradia & Contas', date: '2026-07-10', description: 'Moradia', paymentMethod: 'pix', createdAt: '2026-07-10T12:00:00Z' },
  { id: 'tx_906', userId: DEFAULT_USER_ID, type: 'expense', amount: 220, categoryId: 'cat_educacao', categoryName: 'Educação & Cursos', date: '2026-07-16', description: 'Assinatura plataforma de tecnologia', paymentMethod: 'credito', createdAt: '2026-07-16T10:00:00Z' },

  // Mês 10: Ago/2026
  { id: 'tx_1001', userId: DEFAULT_USER_ID, type: 'income', amount: 2800, categoryId: 'cat_salario', categoryName: 'Salário & Bolsa', date: '2026-08-05', description: 'Salário com bônus de metas', paymentMethod: 'pix', createdAt: '2026-08-05T10:00:00Z' },
  { id: 'tx_1002', userId: DEFAULT_USER_ID, type: 'expense', amount: 680, categoryId: 'cat_alimentacao', categoryName: 'Alimentação', date: '2026-08-08', description: 'Supermercado e café', paymentMethod: 'debito', createdAt: '2026-08-08T17:30:00Z' },
  { id: 'tx_1003', userId: DEFAULT_USER_ID, type: 'expense', amount: 250, categoryId: 'cat_transporte', categoryName: 'Transporte', date: '2026-08-11', description: 'Transporte', paymentMethod: 'debito', createdAt: '2026-08-11T09:00:00Z' },
  { id: 'tx_1004', userId: DEFAULT_USER_ID, type: 'expense', amount: 540, categoryId: 'cat_moradia', categoryName: 'Moradia & Contas', date: '2026-08-10', description: 'Moradia e luz', paymentMethod: 'pix', createdAt: '2026-08-10T11:00:00Z' },
  { id: 'tx_1005', userId: DEFAULT_USER_ID, type: 'expense', amount: 210, categoryId: 'cat_lazer', categoryName: 'Lazer & Rolês', date: '2026-08-22', description: 'Pizzaria e jogos de tabuleiro', paymentMethod: 'credito', createdAt: '2026-08-22T21:30:00Z' },

  // Mês 11: Set/2026 (Mês anterior)
  { id: 'tx_1101', userId: DEFAULT_USER_ID, type: 'income', amount: 2800, categoryId: 'cat_salario', categoryName: 'Salário & Bolsa', date: '2026-09-05', description: 'Salário mensal', paymentMethod: 'pix', createdAt: '2026-09-05T10:00:00Z' },
  { id: 'tx_1102', userId: DEFAULT_USER_ID, type: 'income', amount: 400, categoryId: 'cat_freelance', categoryName: 'Freelance & Bicos', date: '2026-09-19', description: 'Ajuste de SEO para cliente', paymentMethod: 'pix', createdAt: '2026-09-19T16:00:00Z' },
  { id: 'tx_1103', userId: DEFAULT_USER_ID, type: 'expense', amount: 690, categoryId: 'cat_alimentacao', categoryName: 'Alimentação', date: '2026-09-08', description: 'Supermercado e feira', paymentMethod: 'debito', createdAt: '2026-09-08T18:00:00Z' },
  { id: 'tx_1104', userId: DEFAULT_USER_ID, type: 'expense', amount: 260, categoryId: 'cat_transporte', categoryName: 'Transporte', date: '2026-09-12', description: 'Transporte público e aplicativo', paymentMethod: 'debito', createdAt: '2026-09-12T08:30:00Z' },
  { id: 'tx_1105', userId: DEFAULT_USER_ID, type: 'expense', amount: 550, categoryId: 'cat_moradia', categoryName: 'Moradia & Contas', date: '2026-09-10', description: 'Aluguel proporcional e internet', paymentMethod: 'pix', createdAt: '2026-09-10T12:00:00Z' },
  { id: 'tx_1106', userId: DEFAULT_USER_ID, type: 'expense', amount: 180, categoryId: 'cat_lazer', categoryName: 'Lazer & Rolês', date: '2026-09-20', description: 'Cinema e açaí', paymentMethod: 'credito', createdAt: '2026-09-20T19:30:00Z' },

  // Mês 12: Out/2026 (Mês atual)
  { id: 'tx_1201', userId: DEFAULT_USER_ID, type: 'income', amount: 2800, categoryId: 'cat_salario', categoryName: 'Salário & Bolsa', date: '2026-10-05', description: 'Salário mensal de desenvolvimento', paymentMethod: 'pix', createdAt: '2026-10-05T10:00:00Z' },
  { id: 'tx_1202', userId: DEFAULT_USER_ID, type: 'income', amount: 600, categoryId: 'cat_freelance', categoryName: 'Freelance & Bicos', date: '2026-10-15', description: 'Criação de bot e automação', paymentMethod: 'pix', createdAt: '2026-10-15T15:00:00Z' },
  { id: 'tx_1203', userId: DEFAULT_USER_ID, type: 'expense', amount: 620, categoryId: 'cat_alimentacao', categoryName: 'Alimentação', date: '2026-10-07', description: 'Supermercado do mês', paymentMethod: 'debito', createdAt: '2026-10-07T17:30:00Z' },
  { id: 'tx_1204', userId: DEFAULT_USER_ID, type: 'expense', amount: 95, categoryId: 'cat_alimentacao', categoryName: 'Alimentação', date: '2026-10-18', description: 'Almoço no trabalho', paymentMethod: 'debito', createdAt: '2026-10-18T12:30:00Z' },
  { id: 'tx_1205', userId: DEFAULT_USER_ID, type: 'expense', amount: 245, categoryId: 'cat_transporte', categoryName: 'Transporte', date: '2026-10-09', description: 'Recarga mensal transporte', paymentMethod: 'debito', createdAt: '2026-10-09T08:00:00Z' },
  { id: 'tx_1206', userId: DEFAULT_USER_ID, type: 'expense', amount: 550, categoryId: 'cat_moradia', categoryName: 'Moradia & Contas', date: '2026-10-10', description: 'Aluguel e internet fibra', paymentMethod: 'pix', createdAt: '2026-10-10T11:00:00Z' },
  { id: 'tx_1207', userId: DEFAULT_USER_ID, type: 'expense', amount: 160, categoryId: 'cat_lazer', categoryName: 'Lazer & Rolês', date: '2026-10-24', description: 'Rolê com amigos no parque', paymentMethod: 'credito', createdAt: '2026-10-24T20:00:00Z' },
  { id: 'tx_1208', userId: DEFAULT_USER_ID, type: 'expense', amount: 120, categoryId: 'cat_saude', categoryName: 'Saúde & Autocuidado', date: '2026-10-28', description: 'Mensalidade academia', paymentMethod: 'debito', createdAt: '2026-10-28T09:00:00Z' }
];

// Seed Initial Goals
const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal_01',
    userId: DEFAULT_USER_ID,
    title: 'Reserva de Emergência (6 meses)',
    targetAmount: 9000,
    currentAmount: 5400,
    deadline: '2027-04-30',
    category: 'Segurança',
    icon: 'ShieldCheck',
    notes: 'Reserva para segurança profissional e autonomia',
    createdAt: '2025-11-01T00:00:00Z'
  },
  {
    id: 'goal_02',
    userId: DEFAULT_USER_ID,
    title: 'Notebook para Trabalho & Estudos',
    targetAmount: 4500,
    currentAmount: 3150,
    deadline: '2027-01-31',
    category: 'Tecnologia',
    icon: 'Laptop',
    notes: 'Upgrade para rodar projetos mais pesados e renderizar',
    createdAt: '2026-02-01T00:00:00Z'
  },
  {
    id: 'goal_03',
    userId: DEFAULT_USER_ID,
    title: 'Viagem de Férias com Amigos',
    targetAmount: 1800,
    currentAmount: 950,
    deadline: '2027-07-20',
    category: 'Viagem',
    icon: 'Plane',
    notes: 'Praia no litoral norte no recesso de meio de ano',
    createdAt: '2026-05-15T00:00:00Z'
  }
];

// Seed Real Articles on Financial Education with verifiable public sources
const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art_01',
    title: 'Como organizar o primeiro salário ou bolsa de estudos sem passar aperto',
    summary: 'Aprenda a regra 50-30-20 adaptada para jovens: 50% para necessidades, 30% para estilo de vida e 20% para metas e reserva de segurança.',
    source: 'Banco Central do Brasil - Cidadania Financeira',
    url: 'https://www.bcb.gov.br/cidadaniafinanceira',
    publishedAt: '2026-03-12',
    category: 'Organização Financeira',
    readTime: '4 min',
    isExternal: true
  },
  {
    id: 'art_02',
    title: 'Reserva de Emergência: Onde guardar e por que não deixar parada na poupança',
    summary: 'Entenda como Tesouro Selic e CDBs com liquidez diária oferecem rentabilidade de 100% do CDI com a mesma segurança e saque imediato.',
    source: 'Tesouro Direto / CVM Educacional',
    url: 'https://www.tesourodireto.com.br',
    publishedAt: '2026-04-05',
    category: 'Reserva de Emergência',
    readTime: '5 min',
    isExternal: true
  },
  {
    id: 'art_03',
    title: 'Controle de Gastos Invisíveis: Assinaturas, delivery e pequenos boletos',
    summary: 'Pequenos gastos diários podem representar mais de 25% da sua renda sem você notar. Veja passos simples para identificar e controlar vazamentos.',
    source: 'Sebrae Educação Financeira',
    url: 'https://sebrae.com.br',
    publishedAt: '2026-05-19',
    category: 'Controle de Gastos',
    readTime: '3 min',
    isExternal: true
  },
  {
    id: 'art_04',
    title: 'Como a taxa Selic e o IPCA impactam diretamente o seu poder de compra',
    summary: 'Uma explicação sem termos difíceis sobre como a inflação oficial (IPCA) corrói o dinheiro e como os juros básicos ajudam quem poupa.',
    source: 'Banco Central do Brasil (SGS)',
    url: 'https://api.bcb.gov.br',
    publishedAt: '2026-06-10',
    category: 'Economia Básica',
    readTime: '6 min',
    isExternal: true
  },
  {
    id: 'art_05',
    title: 'Cartão de Crédito: Aliado para organizar ou armadilha com juros rotativos?',
    summary: 'Descubra a melhor data de compra, como concentrar despesas para ter benefícios e por que jamais pagar o mínimo da fatura.',
    source: 'Procon & Febraban Jovens',
    url: 'https://febraban.org.br',
    publishedAt: '2026-07-02',
    category: 'Consumo Consciente',
    readTime: '5 min',
    isExternal: true
  },
  {
    id: 'art_06',
    title: 'Primeiros passos em investimentos para jovens: Renda Fixa sem complicação',
    summary: 'Guia direto para quem quer começar com R$ 30 a R$ 100 por mês em títulos públicos e renda fixa antes de se arriscar em renda variável.',
    source: 'B3 Educação & CVM',
    url: 'https://edu.b3.com.br',
    publishedAt: '2026-08-14',
    category: 'Introdução aos Investimentos',
    readTime: '7 min',
    isExternal: true
  }
];

// Seed Economic Indicators (reflecting Brazilian economic rates from Banco Central do Brasil SGS)
const INITIAL_ECONOMIC_INDICATORS: EconomicIndicator[] = [
  {
    code: 'SGS_432',
    name: 'Taxa Selic Meta',
    value: 10.75,
    unit: '% a.a.',
    date: '2026-10-30',
    trend: 'neutral',
    description: 'Taxa básica de juros da economia brasileira definida pelo Copom/Banco Central.',
    source: 'Banco Central do Brasil (SGS 432)'
  },
  {
    code: 'SGS_433',
    name: 'IPCA Mensal',
    value: 0.44,
    unit: '%',
    date: '2026-09-30',
    trend: 'down',
    description: 'Índice Nacional de Preços ao Consumidor Amplo (inflação oficial no Brasil).',
    source: 'IBGE / Banco Central (SGS 433)'
  },
  {
    code: 'SGS_1',
    name: 'Dólar Comercial',
    value: 5.42,
    unit: 'R$',
    date: '2026-10-31',
    trend: 'down',
    description: 'Cotação de venda do dólar americano no mercado de câmbio brasileiro.',
    source: 'Banco Central do Brasil (SGS 1)'
  }
];

export class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = {
      users: {
        [DEFAULT_USER_ID]: {
          id: DEFAULT_USER_ID,
          name: 'Marina Soares',
          email: 'soaresbina02@gmail.com',
          financialGoal: 'Construir reserva de emergência e comprar meu computador',
          isBankConnected: false,
          connectedBankName: '',
          themePreference: 'light',
          notificationsEnabled: true,
          createdAt: '2025-11-01T00:00:00Z'
        }
      },
      transactions: {
        [DEFAULT_USER_ID]: {}
      },
      categories: {
        [DEFAULT_USER_ID]: {}
      },
      goals: {
        [DEFAULT_USER_ID]: {}
      },
      budgets: {
        [DEFAULT_USER_ID]: {}
      },
      settings: {
        [DEFAULT_USER_ID]: {
          theme: 'light',
          notifications: true
        }
      },
      conversations: {
        [DEFAULT_USER_ID]: {}
      },
      articleCache: {},
      economicIndicators: [...INITIAL_ECONOMIC_INDICATORS],
      notifications: {
        [DEFAULT_USER_ID]: [
          {
            id: 'notif_01',
            userId: DEFAULT_USER_ID,
            title: 'Parabéns pela evolução!',
            message: 'Você manteve suas despesas dentro do orçamento nos últimos 3 meses!',
            type: 'monthly_summary',
            read: false,
            createdAt: '2026-10-25T10:00:00Z'
          },
          {
            id: 'notif_02',
            userId: DEFAULT_USER_ID,
            title: 'Meta Notebook: 70% atingida',
            message: 'Faltam apenas R$ 1.350,00 para concluir seu objetivo.',
            type: 'goal_progress',
            read: true,
            createdAt: '2026-10-20T14:00:00Z'
          }
        ]
      }
    };

    // Populate categories
    INITIAL_CATEGORIES.forEach(c => {
      this.data.categories[DEFAULT_USER_ID][c.id] = { ...c };
    });

    // Populate transactions
    INITIAL_TRANSACTIONS.forEach(t => {
      this.data.transactions[DEFAULT_USER_ID][t.id] = { ...t };
    });

    // Populate goals
    INITIAL_GOALS.forEach(g => {
      this.data.goals[DEFAULT_USER_ID][g.id] = { ...g };
    });

    // Populate articles
    INITIAL_ARTICLES.forEach(a => {
      this.data.articleCache[a.id] = { ...a };
    });
  }

  // User
  getUser(userId: string = DEFAULT_USER_ID): UserProfile {
    return this.data.users[userId] || this.data.users[DEFAULT_USER_ID];
  }

  updateUser(userId: string, updates: Partial<UserProfile>): UserProfile {
    const user = this.getUser(userId);
    const updated = { ...user, ...updates };
    this.data.users[userId] = updated;
    return updated;
  }

  // Transactions
  getTransactions(userId: string = DEFAULT_USER_ID): Transaction[] {
    const userTx = this.data.transactions[userId] || {};
    return Object.values(userTx).sort((a, b) => b.date.localeCompare(a.date));
  }

  getTransactionById(userId: string, id: string): Transaction | undefined {
    return this.data.transactions[userId]?.[id];
  }

  createTransaction(userId: string = DEFAULT_USER_ID, tx: Omit<Transaction, 'id' | 'userId' | 'createdAt'>): Transaction {
    if (!this.data.transactions[userId]) {
      this.data.transactions[userId] = {};
    }
    const id = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newTx: Transaction = {
      ...tx,
      id,
      userId,
      createdAt: new Date().toISOString()
    };
    this.data.transactions[userId][id] = newTx;
    return newTx;
  }

  updateTransaction(userId: string, id: string, updates: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt'>>): Transaction | null {
    const existing = this.getTransactionById(userId, id);
    if (!existing) return null;
    const updated: Transaction = { ...existing, ...updates };
    this.data.transactions[userId][id] = updated;
    return updated;
  }

  deleteTransaction(userId: string, id: string): boolean {
    if (this.data.transactions[userId]?.[id]) {
      delete this.data.transactions[userId][id];
      return true;
    }
    return false;
  }

  // Categories
  getCategories(userId: string = DEFAULT_USER_ID): Category[] {
    const userCats = this.data.categories[userId] || {};
    return Object.values(userCats);
  }

  getCategoryById(userId: string, id: string): Category | undefined {
    return this.data.categories[userId]?.[id];
  }

  createCategory(userId: string = DEFAULT_USER_ID, cat: Omit<Category, 'id' | 'userId'>): Category {
    if (!this.data.categories[userId]) {
      this.data.categories[userId] = {};
    }
    const id = `cat_${Date.now()}`;
    const newCat: Category = { ...cat, id, userId };
    this.data.categories[userId][id] = newCat;
    return newCat;
  }

  updateCategory(userId: string, id: string, updates: Partial<Omit<Category, 'id' | 'userId'>>): Category | null {
    const existing = this.getCategoryById(userId, id);
    if (!existing) return null;
    const updated: Category = { ...existing, ...updates };
    this.data.categories[userId][id] = updated;
    return updated;
  }

  // Goals
  getGoals(userId: string = DEFAULT_USER_ID): Goal[] {
    const userGoals = this.data.goals[userId] || {};
    return Object.values(userGoals);
  }

  createGoal(userId: string = DEFAULT_USER_ID, goal: Omit<Goal, 'id' | 'userId' | 'createdAt'>): Goal {
    if (!this.data.goals[userId]) {
      this.data.goals[userId] = {};
    }
    const id = `goal_${Date.now()}`;
    const newGoal: Goal = {
      ...goal,
      id,
      userId,
      createdAt: new Date().toISOString()
    };
    this.data.goals[userId][id] = newGoal;
    return newGoal;
  }

  updateGoal(userId: string, id: string, updates: Partial<Omit<Goal, 'id' | 'userId' | 'createdAt'>>): Goal | null {
    const existing = this.data.goals[userId]?.[id];
    if (!existing) return null;
    const updated: Goal = { ...existing, ...updates };
    this.data.goals[userId][id] = updated;
    return updated;
  }

  deleteGoal(userId: string, id: string): boolean {
    if (this.data.goals[userId]?.[id]) {
      delete this.data.goals[userId][id];
      return true;
    }
    return false;
  }

  // Articles & Cache
  getArticles(): Article[] {
    return Object.values(this.data.articleCache);
  }

  searchArticles(query: string): Article[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getArticles();
    return this.getArticles().filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }

  // Economic Indicators
  getEconomicIndicators(): EconomicIndicator[] {
    return this.data.economicIndicators;
  }

  updateEconomicIndicators(indicators: EconomicIndicator[]): void {
    this.data.economicIndicators = indicators;
  }

  // Notifications
  getNotifications(userId: string = DEFAULT_USER_ID): AppNotification[] {
    return this.data.notifications[userId] || [];
  }

  addNotification(userId: string, notif: Omit<AppNotification, 'id' | 'userId' | 'createdAt'>): AppNotification {
    if (!this.data.notifications[userId]) {
      this.data.notifications[userId] = [];
    }
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      userId,
      createdAt: new Date().toISOString()
    };
    this.data.notifications[userId].unshift(newNotif);
    return newNotif;
  }

  markNotificationAsRead(userId: string, notifId: string): void {
    const list = this.data.notifications[userId];
    if (list) {
      const target = list.find(n => n.id === notifId);
      if (target) target.read = true;
    }
  }

  // Chat Conversations
  getConversation(userId: string = DEFAULT_USER_ID): ChatMessage[] {
    const userConvo = this.data.conversations[userId] || {};
    return Object.values(userConvo).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }

  addChatMessage(userId: string, message: ChatMessage): void {
    if (!this.data.conversations[userId]) {
      this.data.conversations[userId] = {};
    }
    this.data.conversations[userId][message.id] = message;
  }

  clearConversation(userId: string = DEFAULT_USER_ID): void {
    this.data.conversations[userId] = {};
  }
}

export const db = new DatabaseStore();
