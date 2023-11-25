import { Body, Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { ServiceCheckResultMapper } from 'src/infrastructure/mappers/service-check-result.mapper';
import { GetServiceCheckResultRequestDto } from 'src/interface/dtos/service-check-result/get-service-check-result.request.dto';
import { ServiceCheckResultResponseDto } from 'src/interface/dtos/service-check-result/service-check-result.response.dto';
import { GetServiceCheckResultQuery } from 'src/interface/queries/service-check-result/get-service-check-result.query';

@Controller('v1')
export class GetServiceCheckResultController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: ServiceCheckResultMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('service-check-result')
  async get(
    @Body() body: GetServiceCheckResultRequestDto,
    @Req() request: any,
  ): Promise<ServiceCheckResultResponseDto> {
    try {
      const query = GetServiceCheckResultQuery.create({
        id: body.id,
      });
      const result = await this.queryBus.execute(query);
      const response = this.mapper.toResponse(result);
      return response;
    } catch (error) {
      this.logger.error(
        'GetServiceCheckResultController.get encountered an error',
        error,
      );
    }
  }
}
