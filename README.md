# MOVA — Controle Financeiro Inteligente & Autonomia Jovem

O **MOVA** é um aplicativo de controle e autonomia financeira pessoal voltado para jovens, integrando organização financeira, gráficos determinísticos, comparativos de múltiplos períodos, histórico de 12 meses e um assistente com inteligência artificial contextual.

---

## 1. Identidade Visual e Princípios de Design

- **Cor Principal:** `#0C6B58` (Verde esmeralda contemporâneo)
- **Tons Complementares:** `#F8F9FA` (fundo claro), `#E6F4F1` (verde suave), bege, cinza suave e toques sutis para status (verde esmeralda para entradas, coral para saídas).
- **Tipografia:** Plus Jakarta Sans.
- **Linguagem & Padrões:** Português do Brasil (pt-BR), valores em Reais (R$) e datas no formato brasileiro (DD/MM/AAAA).
- **Mobile-First:** Totalmente responsivo para telas móveis e desktop.

---

## 2. Arquitetura do Sistema

O projeto adota uma arquitetura Full-Stack com separação clara de responsabilidades:

```
├── server.ts                       # Entrypoint Express + montagem do middleware Vite em dev
├── server/
│   ├── routes.ts                   # Rotas da API REST (/api/*)
│   ├── data/
│   │   └── store.ts                # Repositório de dados em memória preparado para Firebase
│   └── services/
│       ├── calculationService.ts   # Motor determinístico de cálculos financeiros
│       ├── transactionService.ts   # CRUD de transações, validações e limites
│       ├── annualAnalysisService.ts# Análise de 12 meses ("Minha Evolução Financeira")
│       ├── comparisonService.ts    # Comparativos entre meses e categorias
│       ├── goalsService.ts         # Metas financeiras e cálculo de aportes
│       ├── dashboardService.ts     # Agregação do dashboard inicial e dicas
│       ├── economicService.ts      # Integração com API pública SGS do Banco Central
│       ├── articleService.ts       # Artigos reais de educação financeira
│       └── assistantService.ts     # Assistente MOVA IA (OpenAI + Gemini + Determinístico)
├── src/
│   ├── types/index.ts              # Definições completas TypeScript
│   ├── services/api.ts             # Cliente HTTP desacoplado
│   └── components/
│       ├── Navbar.tsx              # Barra superior com status Open Finance e alertas
│       ├── BottomNav.tsx           # Navegação inferior e botão central de ação
│       ├── DashboardView.tsx       # Tela inicial completa com indicadores do Banco Central
│       ├── MonthlyOverviewView.tsx # "Ver Meu Mês" (resumo, distribuição e comparativo)
│       ├── AnnualEvolutionView.tsx # "Minha Evolução Financeira" (12 meses com gráficos)
│       ├── FinanceComparisonView.tsx # "Comparar Minhas Finanças" (meses e categorias)
│       ├── TransactionsView.tsx    # "Minhas Movimentações" com filtros e busca
│       ├── GoalsView.tsx           # Metas financeiras, aportes e simulação
│       ├── CategoriesView.tsx      # Tetos orçamentários e alertas visuais
│       ├── EducationView.tsx       # Educação financeira e artigos oficiais
│       ├── ProfileView.tsx         # Configurações, segurança, termos e logout
│       ├── AddTransactionModal.tsx # Fluxo de adicionar movimentação (receita/despesa)
│       ├── BankConnectModal.tsx    # Fluxo Open Finance (conectar banco ou continuar manual)
│       ├── NotificationsModal.tsx  # Central de notificações e alertas
│       ├── OnboardingModal.tsx     # Onboarding em 3 etapas e definição de objetivo
│       └── MovaAssistant.tsx       # Chat com IA do MOVA (contextual, persistente e rápido)
```

---

## 3. Serviços Implementados no Backend

1. **`calculationService`**:
   - Saldo do período (`receitas - despesas`).
   - Renda comprometida (`(despesas / receitas) * 100`).
   - Variação percentual (`((atual - anterior) / anterior) * 100`).
   - Aporte mensal para metas (`valor restante / meses restantes`).
   - Distribuição de despesas por categoria com percentuais determinísticos.
   - Tratamento de divisão por zero e períodos incompletos.

2. **`annualAnalysisService`**:
   - Consolidação dos últimos 12 meses (mês a mês).
   - Separação rigorosa entre saldo acumulado e saldos mensais.
   - Cálculo das médias mensais de receitas e despesas.
   - Identificação do melhor saldo, maior receita, maior despesa e categoria mais impactante.
   - Detecção de histórico parcial vs 12 meses completos.

3. **`comparisonService`**:
   - Comparação mês atual vs mês anterior.
   - Comparação customizada entre quaisquer 2 meses.
   - Comparação em blocos (últimos 3, 6 ou 12 meses).
   - Comparação entre categorias (ex.: Alimentação vs Transporte).

4. **`assistantService`**:
   - Compreensão do contexto da tela do usuário (`screenContext`).
   - Integração com **OpenAI API** (`OPENAI_API_KEY`) no servidor.
   - Suporte nativo a **Google GenAI** (`GEMINI_API_KEY`) via `@google/genai` (`gemini-3.8-flash`).
   - Mecanismo determinístico integrado que garante respostas imediatas e números matematicamente exatos.
   - Exibição de cartões matemáticos verificados e artigos educativos sugeridos.

5. **`economicService`**:
   - Integração com o webservice do Banco Central do Brasil (SGS):
     - Selic Meta (SGS 432)
     - IPCA Mensal (SGS 433)
     - Dólar Comercial (SGS 1)
   - Fallback resiliente com cache local caso o serviço público esteja indisponível.

6. **`articleService`**:
   - Artigos de educação financeira de fontes oficiais e verificáveis (Banco Central Cidadania Financeira, CVM Educacional, Tesouro Direto, B3 Educação, Sebrae).

7. **`transactionService`, `goalsService` & `dashboardService`**:
   - Operações completas de CRUD com validação de dados, limites orçamentários automáticos e geração de notificações.

---

## 4. Endpoints da API REST

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/health` | Status de saúde da API |
| `GET` | `/api/dashboard` | Indicadores consolidados do dashboard |
| `GET` | `/api/transactions` | Lista movimentações com filtros de tipo, categoria, mês e busca |
| `POST` | `/api/transactions` | Cria nova movimentação (receita ou despesa) |
| `PUT` | `/api/transactions/:id` | Atualiza movimentação existente |
| `DELETE` | `/api/transactions/:id` | Remove movimentação |
| `GET` | `/api/transactions/summary` | Resumo mensal e comparativo com mês anterior |
| `GET` | `/api/annual-analysis` | Histórico financeiro consolidado dos últimos 12 meses |
| `GET` | `/api/comparison` | Comparativos entre períodos e entre categorias |
| `GET` | `/api/goals` | Lista metas com cálculo de aporte mensal |
| `POST` | `/api/goals` | Cria nova meta |
| `POST` | `/api/goals/:id/contribute` | Registra aporte financeiro na meta |
| `DELETE` | `/api/goals/:id` | Exclui meta |
| `GET` | `/api/categories` | Lista categorias e limites de gastos |
| `POST` | `/api/categories` | Cria nova categoria |
| `PUT` | `/api/categories/:id` | Atualiza categoria e limite orçamentário |
| `GET` | `/api/articles` | Pesquisa e lista artigos de educação financeira |
| `GET` | `/api/economic-indicators` | Cotações e taxas reais do Banco Central (SGS) |
| `GET` | `/api/notifications` | Lista alertas e notificações |
| `POST` | `/api/notifications/:id/read` | Marca notificação como lida |
| `POST` | `/api/bank/connect` | Simulação segura de conexão Open Finance |
| `POST` | `/api/assistant/chat` | Envia mensagem para o assistente IA |
| `GET` | `/api/assistant/history` | Recupera histórico de conversa da IA |
| `DELETE` | `/api/assistant/history` | Limpa histórico de conversa da IA |

---

## 5. Variáveis de Ambiente (`.env.example`)

As seguintes variáveis configuram o backend:

- `OPENAI_API_KEY`: Chave da OpenAI para o assistente (opcional; usada se fornecida).
- `GEMINI_API_KEY`: Chave da API Gemini (injetada automaticamente pelo ambiente).
- `PORT`: Porta do servidor HTTP Express (padrão `3000`).
- `APP_URL`: URL base da aplicação.

*Aviso de Segurança:* Credenciais nunca são expostas no código público ou frontend. Todas as chamadas para OpenAI ou Gemini passam exclusivamente pelas rotas protegidas do backend (`/api/assistant/chat`).

---

## 6. Preparação para Futura Integração com o Firebase

A camada de dados (`server/data/store.ts`) foi estruturada de forma idêntica à árvore do **Firebase Realtime Database**:

```
users/{userId}
transactions/{userId}/{transactionId}
categories/{userId}/{categoryId}
goals/{userId}/{goalId}
budgets/{userId}/{budgetId}
settings/{userId}
conversations/{userId}/{conversationId}
articleCache/{articleId}
```

Quando o protótipo for aprovado para integração com o Firebase em produção:
1. Bastará substituir os métodos do `DatabaseStore` por referências da SDK Firebase (`ref(db, 'transactions/' + userId)`).
2. As assinaturas dos métodos em `transactionService`, `goalsService` e `annualAnalysisService` já estão 100% preparadas.

---

## 7. Como Executar

### Pré-requisitos
- Node.js LTS instalado

### Execução em Desenvolvimento
```bash
npm install
npm run dev
```
O servidor Express Full-Stack iniciará na porta `3000` servindo simultaneamente a API REST em `/api/*` e o frontend React/Vite com Tailwind CSS.

### Compilação e Produção
```bash
npm run build
npm start
```
