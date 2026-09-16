import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { RefreshQuotesUseCase } from '../application/refresh-quotes.use-case.js';

@Injectable()
export class QuotesScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QuotesScheduler.name);
  private isRefreshing = false;

  constructor(
    private readonly refreshQuotes: RefreshQuotesUseCase,
    private readonly config: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    const interval = setInterval(() => void this.refresh(), this.config.get<number>('QUOTE_POLL_INTERVAL_MS', 5_000));
    this.schedulerRegistry.addInterval('quotes-refresh', interval);
    await this.refresh();
  }

  onModuleDestroy() { this.schedulerRegistry.deleteInterval('quotes-refresh'); }

  private async refresh() {
    if (this.isRefreshing) return;
    this.isRefreshing = true;
    try {
      const result = await this.refreshQuotes.execute();
      if (result.received !== result.expected) this.logger.warn(`Expected ${result.expected} quotes but received ${result.received}.`);
      this.logger.debug(`Published ${result.received} quote updates.`);
    } catch (error) {
      this.logger.error('Unable to refresh quotes.', error);
    } finally {
      this.isRefreshing = false;
    }
  }
}
