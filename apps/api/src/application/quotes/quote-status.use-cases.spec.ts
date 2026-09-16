import { describe, expect, it, vi } from 'vitest';
import { CheckHealthUseCase } from './check-health.use-case.js';
import { GetLatestQuotesUseCase } from './get-latest-quotes.use-case.js';

describe('quote status use cases', () => {
  it('returns cached quotes with their update timestamp', async () => {
    const quotes = [{ code: 'USD', codeIn: 'BRL' as const, bid: 5.1, ask: 5.2, high: 5.3, low: 5, variation: 1, updatedAt: '2026-01-01T00:00:00.000Z' }];
    const cache = {
      getLatest: vi.fn().mockResolvedValue(quotes),
      getLastUpdate: vi.fn().mockResolvedValue('2026-01-01T00:00:05.000Z'),
      getHistory: vi.fn(),
      ping: vi.fn(),
    };

    await expect(new GetLatestQuotesUseCase(cache).execute()).resolves.toEqual({
      data: quotes,
      updatedAt: '2026-01-01T00:00:05.000Z',
    });
    expect(cache.getLatest).toHaveBeenCalledOnce();
    expect(cache.getLastUpdate).toHaveBeenCalledOnce();
  });

  it('reports Redis health together with the last quote update', async () => {
    const cache = {
      getLatest: vi.fn(),
      getLastUpdate: vi.fn().mockResolvedValue('2026-01-01T00:00:05.000Z'),
      getHistory: vi.fn(),
      ping: vi.fn().mockResolvedValue(true),
    };

    await expect(new CheckHealthUseCase(cache).execute()).resolves.toEqual({
      redis: true,
      lastQuoteUpdate: '2026-01-01T00:00:05.000Z',
    });
    expect(cache.ping).toHaveBeenCalledOnce();
  });
});
