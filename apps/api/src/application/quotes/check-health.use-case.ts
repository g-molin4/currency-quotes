import { Inject, Injectable } from '@nestjs/common';
import { QUOTES_CACHE, type QuotesCache } from '../ports/quotes-cache.port.js';

@Injectable()
export class CheckHealthUseCase {
  constructor(@Inject(QUOTES_CACHE) private readonly cache: QuotesCache) {}

  async execute() {
    const redis = await this.cache.ping();
    return { redis, lastQuoteUpdate: await this.cache.getLastUpdate() };
  }
}
