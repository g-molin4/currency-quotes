import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger';
import { CheckHealthUseCase } from '../application/quotes/check-health.use-case.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly checkHealth: CheckHealthUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Verificar saúde da API', description: 'Confirma a conectividade com o Redis e informa quando a última cotação foi recebida.' })
  @ApiOkResponse({
    description: 'API e Redis disponíveis.',
    schema: { example: { status: 'ok', redis: 'ok', lastQuoteUpdate: '2026-09-15T20:00:05.000Z' } },
  })
  @ApiServiceUnavailableResponse({ description: 'Redis está indisponível.' })
  async check() {
    const status = await this.checkHealth.execute();
    if (!status.redis) throw new ServiceUnavailableException('Redis is unavailable.');
    return { status: 'ok', redis: 'ok', lastQuoteUpdate: status.lastQuoteUpdate };
  }
}
