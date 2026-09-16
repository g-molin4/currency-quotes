import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class HistoryQueryDto {
  @ApiPropertyOptional({ example: 60, minimum: 1, maximum: 360, default: 60, description: 'Número de observações históricas a retornar.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(360)
  limit = 60;
}
