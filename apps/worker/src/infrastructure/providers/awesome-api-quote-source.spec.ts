import type { ConfigService } from '@nestjs/config';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AwesomeApiQuoteSource } from './awesome-api-quote-source.js';

describe('AwesomeApiQuoteSource', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('requests configured pairs and normalizes valid BRL quotes', async () => {
    const get = vi.fn((key: string, fallback?: string) => {
      if (key === 'AWESOME_API_URL') return 'https://quotes.example.test';
      if (key === 'AWESOME_API_KEY') return 'api-key';
      return fallback;
    });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        USDBRL: { code: 'USD', codein: 'BRL', bid: '5.10', ask: '5.20', high: '5.30', low: '5.00', pctChange: '1.5', timestamp: '1710000000' },
        EURUSD: { code: 'EUR', codein: 'USD', bid: '1', ask: '1', high: '1', low: '1', pctChange: '0', timestamp: '1710000000' },
        INVALID: { code: 'BTC', codein: 'BRL', bid: 'not-a-number', ask: '1', high: '1', low: '1', pctChange: '0', timestamp: '1710000000' },
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const source = new AwesomeApiQuoteSource({ get } as unknown as ConfigService);
    const result = await source.fetchLatest(['USD-BRL', 'EUR-BRL']);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0] as [URL, { headers?: Record<string, string> }];
    expect(url.toString()).toBe('https://quotes.example.test/json/last/USD-BRL,EUR-BRL');
    expect(options.headers).toEqual({ 'x-api-key': 'api-key' });
    expect(result).toEqual([{
      code: 'USD', codeIn: 'BRL', bid: 5.1, ask: 5.2, high: 5.3, low: 5,
      variation: 1.5, updatedAt: new Date(1_710_000_000_000).toISOString(),
    }]);
  });

  it('throws when AwesomeAPI responds with an error status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    const source = new AwesomeApiQuoteSource({ get: vi.fn((_key: string, fallback?: string) => fallback) } as unknown as ConfigService);

    await expect(source.fetchLatest(['USD-BRL'])).rejects.toThrow('AwesomeAPI responded with HTTP 503.');
  });
});
