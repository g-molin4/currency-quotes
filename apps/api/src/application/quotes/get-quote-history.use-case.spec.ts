import { describe, expect, it } from 'vitest';
import { NotFoundError, ValidationError } from '../errors/application-errors.js';
import { GetQuoteHistoryUseCase } from './get-quote-history.use-case.js';

const cache = {
  getLatest: async () => [],
  getLastUpdate: async () => null,
  ping: async () => true,
  getHistory: async () => [
    { bid: 5.1, recordedAt: '2026-01-01T00:00:00.000Z' },
  ],
};

describe('GetQuoteHistoryUseCase', () => {
  it('normalizes and returns supported pairs', async () => {
    const result = await new GetQuoteHistoryUseCase(cache).execute('usd-brl', 60);
    expect(result.pair).toBe('USD-BRL');
    expect(result.data).toHaveLength(1);
  });

  it('rejects unsupported pairs at the application boundary', async () => {
    await expect(new GetQuoteHistoryUseCase(cache).execute('ABC-BRL', 60)).rejects.toBeInstanceOf(ValidationError);
  });

  it('signals a missing history without depending on Nest HTTP exceptions', async () => {
    const emptyCache = { ...cache, getHistory: async () => [] };
    await expect(new GetQuoteHistoryUseCase(emptyCache).execute('USD-BRL', 60)).rejects.toBeInstanceOf(NotFoundError);
  });
});
