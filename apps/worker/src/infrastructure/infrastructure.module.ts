import { Module } from '@nestjs/common';
import { QUOTES_CACHE } from '../application/ports/quotes-cache.port.js';
import { QUOTE_SOURCE } from '../application/ports/quote-source.port.js';
import { RedisQuotesCacheAdapter } from './cache/redis-quotes-cache.adapter.js';
import { AwesomeApiQuoteSource } from './providers/awesome-api-quote-source.js';

@Module({
  providers: [
    RedisQuotesCacheAdapter,
    AwesomeApiQuoteSource,
    { provide: QUOTES_CACHE, useExisting: RedisQuotesCacheAdapter },
    { provide: QUOTE_SOURCE, useExisting: AwesomeApiQuoteSource },
  ],
  exports: [QUOTES_CACHE, QUOTE_SOURCE],
})
export class InfrastructureModule {}
