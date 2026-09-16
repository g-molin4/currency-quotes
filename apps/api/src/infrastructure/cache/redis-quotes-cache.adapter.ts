import { Inject, Injectable } from '@nestjs/common';
import type { CurrencyQuote, QuoteHistoryPoint } from '@currency/shared';
import type { Redis } from 'ioredis';
import type { QuotesCache } from '../../application/ports/quotes-cache.port.js';
import { LAST_QUOTE_UPDATE_KEY, LATEST_QUOTES_KEY, REDIS_CLIENT, quoteHistoryKey } from '../../redis/redis.constants.js';

@Injectable()
export class RedisQuotesCacheAdapter implements QuotesCache {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async getLatest(): Promise<CurrencyQuote[]> {
    const payload = await this.redis.get(LATEST_QUOTES_KEY);
    return payload ? (JSON.parse(payload) as CurrencyQuote[]) : [];
  }

  async getHistory(pair: string, limit: number): Promise<QuoteHistoryPoint[]> {
    const payload = await this.redis.lrange(quoteHistoryKey(pair), 0, limit - 1);
    return payload.map((entry) => JSON.parse(entry) as QuoteHistoryPoint).reverse();
  }

  getLastUpdate() { return this.redis.get(LAST_QUOTE_UPDATE_KEY); }
  async ping() { return (await this.redis.ping()) === 'PONG'; }
}
