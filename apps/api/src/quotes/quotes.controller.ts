import { BadRequestException, Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NotFoundError, ValidationError } from '../application/errors/application-errors.js';
import { GetLatestQuotesUseCase } from '../application/quotes/get-latest-quotes.use-case.js';
import { GetQuoteHistoryUseCase } from '../application/quotes/get-quote-history.use-case.js';
import { HistoryQueryDto } from './dto/history-query.dto.js';

@ApiTags('quotes')
@Controller('quotes')
export class QuotesController {
  constructor(
    private readonly getLatestQuotes: GetLatestQuotesUseCase,
    private readonly getQuoteHistory: GetQuoteHistoryUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Consultar últimas cotações', description: 'Retorna do cache Redis a última cotação disponível para todos os pares BRL suportados.' })
  @ApiOkResponse({
    description: 'Cotações em cache e o instante em que foram atualizadas.',
    schema: {
      example: {
        data: [{ code: 'USD', codeIn: 'BRL', bid: 5.1, ask: 5.11, high: 5.14, low: 5.06, variation: 0.34, updatedAt: '2026-09-15T20:00:00.000Z' }],
        updatedAt: '2026-09-15T20:00:05.000Z',
      },
    },
  })
  getLatest() { return this.getLatestQuotes.execute(); }

  @Get(':pair/history')
  @ApiOperation({ summary: 'Consultar histórico de uma cotação', description: 'Retorna as observações armazenadas no Redis para alimentar o gráfico de uma moeda.' })
  @ApiParam({ name: 'pair', example: 'USD-BRL', description: 'Par suportado no formato MOEDA-BRL.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 60, description: 'Quantidade de pontos retornados, de 1 a 360. O padrão é 60.' })
  @ApiOkResponse({
    description: 'Histórico ordenado cronologicamente, do ponto mais antigo ao mais recente.',
    schema: { example: { pair: 'USD-BRL', data: [{ bid: 5.1, recordedAt: '2026-09-15T20:00:00.000Z' }] } },
  })
  @ApiBadRequestResponse({ description: 'Par em formato inválido ou moeda não suportada; também ocorre se `limit` estiver fora do intervalo permitido.' })
  @ApiNotFoundResponse({ description: 'Ainda não há observações para o par solicitado.' })
  async getHistory(@Param('pair') pair: string, @Query() query: HistoryQueryDto) {
    try {
      return await this.getQuoteHistory.execute(pair, query.limit);
    } catch (error) {
      if (error instanceof ValidationError) throw new BadRequestException(error.message);
      if (error instanceof NotFoundError) throw new NotFoundException(error.message);
      throw error;
    }
  }
}
