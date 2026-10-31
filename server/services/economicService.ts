import { db } from '../data/store.js';
import { EconomicIndicator } from '../../src/types/index.js';

export class EconomicService {
  /**
   * Fetches latest indicators from Banco Central do Brasil SGS API with safe fallback
   */
  static async refreshIndicators(): Promise<EconomicIndicator[]> {
    const current = db.getEconomicIndicators();

    // Map of series
    const series = [
      { code: 'SGS_432', sgsId: '432', name: 'Taxa Selic Meta', unit: '% a.a.', desc: 'Taxa básica de juros definida pelo Copom/Banco Central.' },
      { code: 'SGS_433', sgsId: '433', name: 'IPCA Mensal', unit: '%', desc: 'Índice Nacional de Preços ao Consumidor Amplo (inflação oficial).' },
      { code: 'SGS_1', sgsId: '1', name: 'Dólar Comercial', unit: 'R$', desc: 'Cotação de venda do dólar americano no mercado de câmbio brasileiro.' }
    ];

    const updatedIndicators: EconomicIndicator[] = [];

    for (const item of series) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s safe timeout

        const response = await fetch(
          `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${item.sgsId}/dados/ultimos/1?formato=json`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (response.ok) {
          const json = await response.json();
          if (Array.isArray(json) && json.length > 0 && json[0].valor) {
            const rawVal = parseFloat(String(json[0].valor).replace(',', '.'));
            if (!isNaN(rawVal)) {
              updatedIndicators.push({
                code: item.code,
                name: item.name,
                value: Number(rawVal.toFixed(2)),
                unit: item.unit,
                date: json[0].data || 'Recente',
                trend: rawVal > 5 ? 'up' : 'neutral',
                description: item.desc,
                source: `Banco Central do Brasil (SGS ${item.sgsId})`
              });
              continue;
            }
          }
        }
      } catch (err) {
        // Fallback to cached default
      }

      // If fetch failed or timed out, use existing cached indicator
      const existing = current.find(c => c.code === item.code);
      if (existing) {
        updatedIndicators.push(existing);
      }
    }

    if (updatedIndicators.length > 0) {
      db.updateEconomicIndicators(updatedIndicators);
      return updatedIndicators;
    }

    return current;
  }

  static getIndicators(): EconomicIndicator[] {
    return db.getEconomicIndicators();
  }
}
