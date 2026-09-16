import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module.js';
import { QuotesController } from './quotes.controller.js';
import { QuotesGateway } from './quotes.gateway.js';

@Module({
  imports: [ApplicationModule],
  controllers: [QuotesController],
  providers: [QuotesGateway],
})
export class QuotesModule {}
