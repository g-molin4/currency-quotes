import { Inject, Injectable } from '@nestjs/common';
import { QUOTE_PAIRS } from '../domain/quotes/quote-pairs.js';
import { QUOTES_CACHE, type QuotesCache } from './ports/quotes-cache.port.js';
import { QUOTE_SOURCE, type QuoteSource } from './ports/quote-source.port.js';

@Injectable()
export class RefreshQuotesUseCase {
  constructor(
    @Inject(QUOTE_SOURCE) private readonly source: QuoteSource,
    @Inject(QUOTES_CACHE) private readonly cache: QuotesCache,
  ) {}

  async execute() {
    const quotes = await this.source.fetchLatest(QUOTE_PAIRS);
    // The provider timestamp may remain unchanged between its own refreshes.
    // History represents our collection timeline, while each quote keeps the
    // original provider timestamp in `updatedAt`.
    await this.cache.storeAndPublish(quotes, new Date().toISOString());
    return { received: quotes.length, expected: QUOTE_PAIRS.length };
  }
}
