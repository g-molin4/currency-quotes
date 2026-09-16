import { Inject, Injectable } from '@nestjs/common';
import { QUOTES_CACHE, type QuotesCache } from '../ports/quotes-cache.port.js';

@Injectable()
export class GetLatestQuotesUseCase {
  constructor(@Inject(QUOTES_CACHE) private readonly cache: QuotesCache) {}

  async execute() {
    const [data, updatedAt] = await Promise.all([
      this.cache.getLatest(),
      this.cache.getLastUpdate(),
    ]);
    return { data, updatedAt };
  }
}
