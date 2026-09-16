import type { CurrencyQuote, QuoteHistoryPoint } from '@currency/shared';

export type QuotesResponse = { data: CurrencyQuote[]; updatedAt: string | null };
export type QuoteHistoryResponse = { data: QuoteHistoryPoint[]; pair: string };
export type RealtimeStatus = 'connecting' | 'live' | 'offline';
