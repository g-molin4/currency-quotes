import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CurrencyQuote } from '@currency/shared';
import type { QuoteSource } from '../../application/ports/quote-source.port.js';

interface AwesomeApiQuote {
  code: string;
  codein: string;
  bid: string;
  ask: string;
  high: string;
  low: string;
  pctChange: string;
  timestamp: string;
}

@Injectable()
export class AwesomeApiQuoteSource implements QuoteSource {
  constructor(private readonly config: ConfigService) {}

  async fetchLatest(pairs: readonly string[]): Promise<CurrencyQuote[]> {
    const baseUrl = this.config.get<string>('AWESOME_API_URL', 'https://economia.awesomeapi.com.br');
    const apiKey = this.config.get<string>('AWESOME_API_KEY');
    const response = await fetch(new URL(`/json/last/${pairs.join(',')}`, baseUrl), {
      headers: apiKey ? { 'x-api-key': apiKey } : undefined,
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`AwesomeAPI responded with HTTP ${response.status}.`);

    const payload = (await response.json()) as Record<string, AwesomeApiQuote>;
    return Object.values(payload)
      .map((quote) => this.normalize(quote))
      .filter((quote): quote is CurrencyQuote => quote !== null);
  }

  private normalize(quote: AwesomeApiQuote): CurrencyQuote | null {
    const [bid, ask, high, low, variation] = [quote.bid, quote.ask, quote.high, quote.low, quote.pctChange].map(Number);
    if ([bid, ask, high, low, variation].some(Number.isNaN) || quote.codein !== 'BRL') return null;
    const timestamp = Number(quote.timestamp);
    return {
      code: quote.code, codeIn: 'BRL', bid, ask, high, low, variation,
      updatedAt: Number.isFinite(timestamp) ? new Date(timestamp * 1_000).toISOString() : new Date().toISOString(),
    };
  }
}
