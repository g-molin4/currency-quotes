import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CurrencyQuote, QuoteHistoryPoint } from '@currency/shared';
import { Redis } from 'ioredis';
import type { QuotesCache } from '../../application/ports/quotes-cache.port.js';

const LATEST_QUOTES_KEY = 'quotes:latest';
const LAST_QUOTE_UPDATE_KEY = 'quotes:last-updated-at';
const QUOTES_UPDATED_CHANNEL = 'quotes.updated';
const HISTORY_LIMIT = 360;

@Injectable()
export class RedisQuotesCacheAdapter implements QuotesCache, OnModuleDestroy {
  private readonly redis: Redis;

  constructor(config: ConfigService) {
    this.redis = new Redis({
      host: config.get<string>('REDIS_HOST', 'localhost'),
      port: config.get<number>('REDIS_PORT', 6379),
      maxRetriesPerRequest: 3,
    });
  }

  async storeAndPublish(quotes: CurrencyQuote[], collectedAt: string) {
    const pipeline = this.redis.multi()
      .set(LATEST_QUOTES_KEY, JSON.stringify(quotes))
      .set(LAST_QUOTE_UPDATE_KEY, collectedAt);

    for (const quote of quotes) {
      const point: QuoteHistoryPoint = { bid: quote.bid, recordedAt: collectedAt };
      pipeline.lpush(`quotes:history:${quote.code}-BRL`, JSON.stringify(point)).ltrim(`quotes:history:${quote.code}-BRL`, 0, HISTORY_LIMIT - 1);
    }
    pipeline.publish(QUOTES_UPDATED_CHANNEL, JSON.stringify({ data: quotes, updatedAt: collectedAt }));
    await pipeline.exec();
  }

  async onModuleDestroy() { await this.redis.quit(); }
}
