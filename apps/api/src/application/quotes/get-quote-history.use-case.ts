import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError, ValidationError } from '../errors/application-errors.js';
import { QUOTES_CACHE, type QuotesCache } from '../ports/quotes-cache.port.js';
import { isSupportedPair } from '../../domain/quotes/supported-pairs.js';

const pairPattern = /^[A-Z]{2,8}-BRL$/;

@Injectable()
export class GetQuoteHistoryUseCase {
  constructor(@Inject(QUOTES_CACHE) private readonly cache: QuotesCache) {}

  async execute(pair: string, limit: number) {
    const normalizedPair = pair.toUpperCase();
    if (!pairPattern.test(normalizedPair) || !isSupportedPair(normalizedPair)) {
      throw new ValidationError('Unsupported currency pair.');
    }

    const data = await this.cache.getHistory(normalizedPair, limit);
    if (data.length === 0) throw new NotFoundError(`No quote history is available for ${normalizedPair}.`);
    return { data, pair: normalizedPair };
  }
}
