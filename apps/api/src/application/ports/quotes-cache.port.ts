import type { CurrencyQuote, QuoteHistoryPoint } from '@currency/shared';

export const QUOTES_CACHE = Symbol('QUOTES_CACHE');

export interface QuotesCache {
  getLatest(): Promise<CurrencyQuote[]>;
  getHistory(pair: string, limit: number): Promise<QuoteHistoryPoint[]>;
  getLastUpdate(): Promise<string | null>;
  ping(): Promise<boolean>;
}
