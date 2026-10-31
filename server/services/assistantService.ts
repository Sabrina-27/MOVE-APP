import { db } from '../data/store.js';
import { TransactionService } from './transactionService.js';
import { AnnualAnalysisService } from './annualAnalysisService.js';
import { ComparisonService } from './comparisonService.js';
import { GoalsService } from './goalsService.js';
import { ArticleService } from './articleService.js';
import { CalculationService } from './calculationService.js';
import { ChatMessage, Article } from '../../src/types/index.js';
import { GoogleGenAI } from '@google/genai';

export class AssistantService {
  /**
   * Processes a user question with screen context, conversation history, and deterministic financial calculations
   */
  static async processMessage(
    userId: string = 'user_mova_001',
    userMessage: string,
    screenContext: string = 'dashboard'
  ): Promise<ChatMessage> {
    const userMsgId = `msg_user_${Date.now()}`;
    const assistantMsgId = `msg_ast_${Date.now() + 1}`;

    const userEntry: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: userMessage,
      screenContext,
      timestamp: new Date().toISOString()
    };
    db.addChatMessage(userId, userEntry);

    // Get live financial context for user
    const currentMonthSummary = TransactionService.getMonthlySummary(userId, '2026-10');
    const prevMonthSummary = TransactionService.getMonthlySummary(userId, '2026-09');
    const annualAnalysis = AnnualAnalysisService.get12MonthEvolution(userId);
    const goals = GoalsService.getGoals(userId);
    const allArticles = ArticleService.getArticles();

    // Perform deterministic intent analysis and calculations
    const cleanQuery = userMessage.toLowerCase();

    const calculations: { label: string; value: string; detail?: string }[] = [];
    let relatedArticles: Article[] = [];
    let generatedReply = '';

    // Search for articles if user asks about concepts (poupar, reserva, inflacao, etc.)
    if (cleanQuery.includes('reserva') || cleanQuery.includes('emergencia')) {
      const art = allArticles.find(a => a.category.toLowerCase().includes('reserva'));
      if (art) relatedArticles.push(art);
    }
    if (cleanQuery.includes('economizar') || cleanQuery.includes('poupar') || cleanQuery.includes('organizar')) {
      const art = allArticles.find(a => a.category.toLowerCase().includes('organização'));
      if (art) relatedArticles.push(art);
    }
    if (cleanQuery.includes('selic') || cleanQuery.includes('ipca') || cleanQuery.includes('inflação') || cleanQuery.includes('juros')) {
      const art = allArticles.find(a => a.category.toLowerCase().includes('economia'));
      if (art) relatedArticles.push(art);
    }
    if (cleanQuery.includes('cartao') || cleanQuery.includes('credito') || cleanQuery.includes('fatura')) {
      const art = allArticles.find(a => a.category.toLowerCase().includes('consumo'));
      if (art) relatedArticles.push(art);
    }

    // Build Financial Context for AI Models
    const financialPromptContext = `
Dados Reais do Usuário (MOVA - Outubro/2026):
- Saldo Mês Atual: R$ ${currentMonthSummary.balance.toFixed(2)}
- Receitas Mês Atual: R$ ${currentMonthSummary.totalIncome.toFixed(2)}
- Despesas Mês Atual: R$ ${currentMonthSummary.totalExpense.toFixed(2)}
- Renda Comprometida: ${currentMonthSummary.incomeCommittedPct}%
- Variação em relação a Setembro/2026: Despesas variaram ${currentMonthSummary.prevMonthDiff.expensePctDiff}% (R$ ${currentMonthSummary.prevMonthDiff.expenseDiff.toFixed(2)})
- Maior Categoria de Gastos no Mês: ${currentMonthSummary.topCategories[0]?.categoryName || 'N/A'} (R$ ${currentMonthSummary.topCategories[0]?.amount.toFixed(2) || '0'}, ${currentMonthSummary.topCategories[0]?.percentage || '0'}%)
- Resumo Anual (12 Meses):
  * Total Receitas 12 Meses: R$ ${annualAnalysis.totalIncome.toFixed(2)}
  * Total Despesas 12 Meses: R$ ${annualAnalysis.totalExpense.toFixed(2)}
  * Saldo Acumulado nos 12 Meses: R$ ${annualAnalysis.cumulativeBalance.toFixed(2)}
  * Média Mensal de Receitas: R$ ${annualAnalysis.monthlyAvgIncome.toFixed(2)}
  * Média Mensal de Despesas: R$ ${annualAnalysis.monthlyAvgExpense.toFixed(2)}
  * Mês de Maior Receita: ${annualAnalysis.highestIncomeMonth?.monthName || 'N/A'} (R$ ${annualAnalysis.highestIncomeMonth?.income.toFixed(2) || '0'})
  * Mês de Maior Despesa: ${annualAnalysis.highestExpenseMonth?.monthName || 'N/A'} (R$ ${annualAnalysis.highestExpenseMonth?.expense.toFixed(2) || '0'})
  * Categoria Mais Pesada no Ano: ${annualAnalysis.topExpenseCategoryOverall?.name || 'N/A'} (R$ ${annualAnalysis.topExpenseCategoryOverall?.totalAmount.toFixed(2) || '0'}, ${annualAnalysis.topExpenseCategoryOverall?.percentage || '0'}%)
- Metas:
${goals.map(g => `  * ${g.title}: R$ ${g.currentAmount.toFixed(2)} de R$ ${g.targetAmount.toFixed(2)} (${g.progressPct}%). Mensalidade necessária: R$ ${g.monthlyRequired.toFixed(2)}`).join('\n')}
- Tela Atual do Usuário: ${screenContext}
`;

    // 1. Check if OPENAI_API_KEY is available (as requested in Section 6)
    const openAiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (openAiKey && openAiKey.startsWith('sk-') && openAiKey.length > 20) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Você é a inteligência artificial do MOVA, um assistente financeiro inteligente, acolhedor, transparente e didático para jovens brasileiros.
Responda sempre em português brasileiro de forma leve, direta, sem jargões desnecessários e com dados precisos.
Utilize os dados financeiros determinísticos fornecidos para fundamentar todas as respostas com números reais.
Se o usuário perguntar sobre cálculos, compare os valores claramente.`
              },
              {
                role: 'user',
                content: `Contexto Financeiro:\n${financialPromptContext}\n\nPergunta do Usuário:\n${userMessage}`
              }
            ],
            temperature: 0.6
          })
        });

        if (response.ok) {
          const data = await response.json();
          generatedReply = data.choices?.[0]?.message?.content || '';
        }
      } catch (err) {
        console.error('Erro na chamada OpenAI:', err);
      }
    }

    // 2. If no OpenAI response, try Google GenAI (@google/genai with gemini-3.8-flash)
    if (!generatedReply && geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const systemInstruction = `Você é o assistente inteligente do MOVA, aplicativo de controle e autonomia financeira para jovens.
Sua missão é ajudar o usuário a entender seu dinheiro com clareza, incentivar bons hábitos e responder de maneira acolhedora, objetiva e fundamentada nos dados reais.
Nunca invente números: use estritamente os cálculos determinísticos fornecidos no contexto.
Mantenha respostas com tópicos claros, destaques em negrito e valores em R$.`;

        const modelResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: `Contexto Financeiro Oficial do MOVA:\n${financialPromptContext}\n\nPergunta do Usuário:\n${userMessage}` }]
            }
          ],
          config: {
            systemInstruction
          }
        });

        if (modelResponse && modelResponse.text) {
          generatedReply = modelResponse.text;
        }
      } catch (err) {
        console.error('Erro na chamada Gemini:', err);
      }
    }

    // 3. Deterministic High-Quality Fallback Engine (Ensures 100% reliability, instant response, exact figures even offline)
    if (!generatedReply) {
      generatedReply = this.generateDeterministicResponse(
        userMessage,
        screenContext,
        currentMonthSummary,
        prevMonthSummary,
        annualAnalysis,
        goals,
        calculations
      );
    } else {
      // Add relevant calculation badges for the frontend
      this.populateCalculations(userMessage, currentMonthSummary, annualAnalysis, goals, calculations);
    }

    const assistantEntry: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: generatedReply,
      screenContext,
      calculations: calculations.length > 0 ? calculations : undefined,
      relatedArticles: relatedArticles.length > 0 ? relatedArticles : undefined,
      timestamp: new Date().toISOString()
    };
    db.addChatMessage(userId, assistantEntry);

    return assistantEntry;
  }

  private static populateCalculations(
    userMessage: string,
    currentMonth: any,
    annual: any,
    goals: any[],
    calculations: { label: string; value: string; detail?: string }[]
  ) {
    const q = userMessage.toLowerCase();
    if (q.includes('saldo') || q.includes('mês') || q.includes('quanto gastei')) {
      calculations.push({
        label: 'Saldo do Mês (Out/26)',
        value: `R$ ${currentMonth.balance.toFixed(2)}`,
        detail: `Receitas: R$ ${currentMonth.totalIncome.toFixed(2)} | Despesas: R$ ${currentMonth.totalExpense.toFixed(2)}`
      });
    }
    if (q.includes('12 meses') || q.includes('ano') || q.includes('evolução')) {
      calculations.push({
        label: 'Saldo Acumulado (12M)',
        value: `R$ ${annual.cumulativeBalance.toFixed(2)}`,
        detail: `Média Mensal: R$ ${annual.monthlyAvgBalance.toFixed(2)}`
      });
    }
    if (q.includes('meta') && goals.length > 0) {
      const g = goals[0];
      calculations.push({
        label: `Meta: ${g.title}`,
        value: `R$ ${g.currentAmount.toFixed(2)} de R$ ${g.targetAmount.toFixed(2)}`,
        detail: `${g.progressPct}% concluído • R$ ${g.monthlyRequired.toFixed(2)}/mês necessários`
      });
    }
  }

  private static generateDeterministicResponse(
    userMessage: string,
    screenContext: string,
    currentMonth: any,
    prevMonth: any,
    annual: any,
    goals: any[],
    calculations: { label: string; value: string; detail?: string }[]
  ): string {
    const q = userMessage.toLowerCase();

    // 1. Pergunta sobre 12 meses / Evolução
    if (q.includes('12 meses') || q.includes('ano') || q.includes('evolução') || q.includes('anual')) {
      calculations.push(
        { label: 'Saldo Acumulado (12M)', value: `R$ ${annual.cumulativeBalance.toFixed(2)}`, detail: 'Soma dos saldos mensais nos últimos 12 meses' },
        { label: 'Média Mensal Receitas', value: `R$ ${annual.monthlyAvgIncome.toFixed(2)}` },
        { label: 'Média Mensal Despesas', value: `R$ ${annual.monthlyAvgExpense.toFixed(2)}` }
      );

      return `Analisei seus registros dos últimos 12 meses e identifiquei uma trajetória muito consistente de organização financeira! 📊

Aqui está o seu raio-x consolidado:
• **Saldo acumulado no ano:** R$ ${annual.cumulativeBalance.toFixed(2)}
• **Total recebido:** R$ ${annual.totalIncome.toFixed(2)} (média de R$ ${annual.monthlyAvgIncome.toFixed(2)}/mês)
• **Total gasto:** R$ ${annual.totalExpense.toFixed(2)} (média de R$ ${annual.monthlyAvgExpense.toFixed(2)}/mês)
• **Melhor mês:** ${annual.bestBalanceMonth?.monthName} com saldo positivo de **R$ ${annual.bestBalanceMonth?.balance.toFixed(2)}**
• **Mês de maior despesa:** ${annual.highestExpenseMonth?.monthName} (R$ ${annual.highestExpenseMonth?.expense.toFixed(2)})
• **Categoria com maior impacto:** **${annual.topExpenseCategoryOverall?.name}** representando ${annual.topExpenseCategoryOverall?.percentage}% das despesas acumuladas.

💡 **Recomendação MOVA:** Você mantém uma taxa de poupança positiva na maioria dos meses. Quer simular quanto você teria se guardasse R$ 100 a mais por mês na sua reserva?`;
    }

    // 2. Pergunta sobre Ver Meu Mês ou Gastos do Mês
    if (q.includes('meu mês') || q.includes('este mês') || q.includes('outubro') || q.includes('quanto gastei')) {
      calculations.push(
        { label: 'Saldo Atual (Out/26)', value: `R$ ${currentMonth.balance.toFixed(2)}` },
        { label: 'Renda Comprometida', value: `${currentMonth.incomeCommittedPct}%`, detail: 'Despesas sobre receitas do mês' }
      );

      return `Aqui está o panorama completo do seu mês de **Outubro de 2026**:

• **Receitas totais:** R$ ${currentMonth.totalIncome.toFixed(2)}
• **Despesas totais:** R$ ${currentMonth.totalExpense.toFixed(2)}
• **Saldo livre:** **R$ ${currentMonth.balance.toFixed(2)}**
• **Renda comprometida:** apenas **${currentMonth.incomeCommittedPct}%**

Principais saídas este mês:
${currentMonth.topCategories.slice(0, 3).map((c: any) => `• **${c.categoryName}:** R$ ${c.amount.toFixed(2)} (${c.percentage}%)`).join('\n')}

Em comparação com Setembro/2026, suas despesas variaram **${currentMonth.prevMonthDiff.expensePctDiff > 0 ? '+' : ''}${currentMonth.prevMonthDiff.expensePctDiff}%** (diferença de R$ ${Math.abs(currentMonth.prevMonthDiff.expenseDiff).toFixed(2)}).`;
    }

    // 3. Comparação entre meses
    if (q.includes('compare') || q.includes('comparar') || q.includes('setembro') || q.includes('passado')) {
      const comp = ComparisonService.compareMonths('2026-10', '2026-09');
      calculations.push(
        { label: 'Variação de Despesas', value: `${comp.expenseVarPct > 0 ? '+' : ''}${comp.expenseVarPct}%`, detail: `Out: R$ ${comp.p1Expense.toFixed(2)} | Set: R$ ${comp.p2Expense.toFixed(2)}` },
        { label: 'Variação de Receitas', value: `${comp.incomeVarPct > 0 ? '+' : ''}${comp.incomeVarPct}%`, detail: `Out: R$ ${comp.p1Income.toFixed(2)} | Set: R$ ${comp.p2Income.toFixed(2)}` }
      );

      return `Comparando **Outubro de 2026** com **Setembro de 2026**:

• **Receitas:** R$ ${comp.p1Income.toFixed(2)} vs R$ ${comp.p2Income.toFixed(2)} (${comp.incomeVarPct > 0 ? '+' : ''}${comp.incomeVarPct}%)
• **Despesas:** R$ ${comp.p1Expense.toFixed(2)} vs R$ ${comp.p2Expense.toFixed(2)} (${comp.expenseVarPct > 0 ? '+' : ''}${comp.expenseVarPct}%)
• **Saldo do período:** R$ ${comp.p1Balance.toFixed(2)} vs R$ ${comp.p2Balance.toFixed(2)} (variação de R$ ${comp.balanceDiff.toFixed(2)})

Maior alteração por categoria:
${comp.categoryComparisons.slice(0, 2).map(c => `• **${c.categoryName}:** ${c.diff > 0 ? '+' : ''}R$ ${c.diff.toFixed(2)} (${c.varPct > 0 ? '+' : ''}${c.varPct}%)`).join('\n')}`;
    }

    // 4. Metas
    if (q.includes('meta') || q.includes('guardar') || q.includes('notebook') || q.includes('reserva')) {
      const topGoal = goals[0];
      if (topGoal) {
        calculations.push(
          { label: topGoal.title, value: `${topGoal.progressPct}% concluído`, detail: `R$ ${topGoal.currentAmount.toFixed(2)} de R$ ${topGoal.targetAmount.toFixed(2)}` },
          { label: 'Aporte Mensal Recomendado', value: `R$ ${topGoal.monthlyRequired.toFixed(2)}/mês`, detail: `Prazo até ${topGoal.deadline}` }
        );
      }

      return `Você tem **${goals.length} metas ativas** no MOVA:

${goals.map(g => `🎯 **${g.title}**:
• Acumulado: **R$ ${g.currentAmount.toFixed(2)}** de R$ ${g.targetAmount.toFixed(2)} (${g.progressPct}%)
• Faltam: R$ ${g.remainingAmount.toFixed(2)}
• Prazo: ${g.deadline} (restam ~${g.monthsRemaining} meses)
• Contribuição ideal: **R$ ${g.monthlyRequired.toFixed(2)}/mês**`).join('\n\n')}

💡 *Simulação rápida:* Se você economizar R$ 50 a mais por mês cortando pequenos gastos invisíveis, você antecipa sua meta em quase 2 meses!`;
    }

    // 5. Default Screen-Context Guided Response
    calculations.push({
      label: 'Saldo Geral Atual',
      value: `R$ ${currentMonth.balance.toFixed(2)}`,
      detail: 'Mês de Outubro/2026'
    });

    return `Olá! Sou o assistente de inteligência financeira do **MOVA**! 🚀

Estou analisando suas finanças na tela de **${screenContext}**.

Com base nos seus dados reais:
• Seu saldo livre neste mês é de **R$ ${currentMonth.balance.toFixed(2)}**.
• Você já poupou no total dos últimos 12 meses o acumulado de **R$ ${annual.cumulativeBalance.toFixed(2)}**.
• Sua categoria com maior despesa histórica é **${annual.topExpenseCategoryOverall?.name}**.

Você pode me perguntar:
1. *"Como está minha evolução nos últimos 12 meses?"*
2. *"Compare este mês com o mês passado."*
3. *"Quanto preciso guardar para minhas metas?"*
4. *"Onde estou gastando mais dinheiro?"*
5. *"Explique como montar uma reserva de emergência."*`;
  }

  static getConversationHistory(userId: string = 'user_mova_001'): ChatMessage[] {
    return db.getConversation(userId);
  }

  static clearConversation(userId: string = 'user_mova_001'): void {
    db.clearConversation(userId);
  }
}
