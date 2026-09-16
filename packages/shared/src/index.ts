export interface CurrencyQuote {
  code: string;
  codeIn: 'BRL';
  bid: number;
  ask: number;
  high: number;
  low: number;
  variation: number;
  updatedAt: string;
}

export interface QuoteHistoryPoint {
  bid: number;
  recordedAt: string;
}
