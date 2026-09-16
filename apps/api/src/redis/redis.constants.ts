export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
export const QUOTES_UPDATED_CHANNEL = 'quotes.updated';
export const LATEST_QUOTES_KEY = 'quotes:latest';
export const LAST_QUOTE_UPDATE_KEY = 'quotes:last-updated-at';

export const quoteHistoryKey = (pair: string) => `quotes:history:${pair}`;
