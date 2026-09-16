import type { CurrencyQuote } from '@currency/shared';

export const QUOTES_CACHE = Symbol('QUOTES_CACHE');

export interface QuotesCache {
  storeAndPublish(quotes: CurrencyQuote[], collectedAt: string): Promise<void>;
}
