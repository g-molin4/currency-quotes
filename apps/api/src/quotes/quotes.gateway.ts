import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Server } from 'socket.io';
import { Redis } from 'ioredis';
import { QUOTES_UPDATED_CHANNEL } from '../redis/redis.constants.js';

@WebSocketGateway({
  namespace: '/quotes',
  cors: {
    origin: (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(','),
    credentials: true,
  },
})
export class QuotesGateway implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QuotesGateway.name);
  private readonly subscriber: Redis;

  @WebSocketServer()
  server!: Server;

  constructor(config: ConfigService) {
    this.subscriber = new Redis({
      host: config.get<string>('REDIS_HOST', 'localhost'),
      port: config.get<number>('REDIS_PORT', 6379),
      maxRetriesPerRequest: null,
    });
  }

  async onModuleInit() {
    this.subscriber.on('message', (channel, message) => {
      if (channel !== QUOTES_UPDATED_CHANNEL) return;

      try {
        this.server.emit('quotes:updated', JSON.parse(message));
      } catch {
        this.logger.warn('Discarded an invalid quote update message.');
      }
    });
    await this.subscriber.subscribe(QUOTES_UPDATED_CHANNEL);
  }

  async onModuleDestroy() {
    await this.subscriber.quit();
  }
}
