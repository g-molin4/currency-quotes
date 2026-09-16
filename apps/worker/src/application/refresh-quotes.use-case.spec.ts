import { describe, expect, it, vi } from 'vitest';
import { RefreshQuotesUseCase } from './refresh-quotes.use-case.js';

describe('RefreshQuotesUseCase', () => {
  it('obtains every configured pair and publishes the normalized result', async () => {
    const quotes = [{ code: 'USD', codeIn: 'BRL' as const, bid: 5, ask: 5.1, high: 5.2, low: 4.9, variation: 1, updatedAt: '2026-01-01T00:00:00.000Z' }];
    const source = { fetchLatest: vi.fn().mockResolvedValue(quotes) };
    const cache = { storeAndPublish: vi.fn().mockResolvedValue(undefined) };

    const result = await new RefreshQuotesUseCase(source, cache).execute();

    expect(source.fetchLatest).toHaveBeenCalledWith(expect.arrayContaining(['USD-BRL', 'ETH-BRL']));
    expect(cache.storeAndPublish).toHaveBeenCalledWith(quotes, expect.any(String));
    expect(result).toEqual({ received: 1, expected: 10 });
  });
});
