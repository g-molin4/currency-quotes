import type { QuoteHistoryResponse, QuotesResponse } from '../quotes.types';
import { request } from '../../../shared/services/http.service';

export function fetchQuotes() { return request<QuotesResponse>('/quotes'); }

export function fetchQuoteHistory(pair: string) {
  return request<QuoteHistoryResponse>(`/quotes/${pair}/history?limit=60`);
}
