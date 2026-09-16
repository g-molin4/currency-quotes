import type { CurrencyQuote } from '@currency/shared';

export const QUOTE_SOURCE = Symbol('QUOTE_SOURCE');

export interface QuoteSource {
  fetchLatest(pairs: readonly string[]): Promise<CurrencyQuote[]>;
}
