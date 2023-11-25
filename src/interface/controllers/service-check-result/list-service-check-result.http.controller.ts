import { Body, Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { ServiceCheckResultMapper } from 'src/infrastructure/mappers/service-check-result.mapper';
import { ListServiceCheckResultRequestDto } from 'src/interface/dtos/service-check-result/list-service-check-result.request.dto';
import { ServiceCheckResultResponseDto } from 'src/interface/dtos/service-check-result/service-check-result.response.dto';
import { ListServiceCheckResultQuery } from 'src/interface/queries/service-check-result/list-service-check-result.query';

@Controller('v1')
export class ListServiceCheckResultController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: ServiceCheckResultMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('service-check-result/list')
  async get(
    @Body() body: ListServiceCheckResultRequestDto,
    @Req() request: any,
  ): Promise<ServiceCheckResultResponseDto[]> {
    try {
      const query = ListServiceCheckResultQuery.create({});
      const result = await this.queryBus.execute(query);
      const response = result.map((res) => this.mapper.toResponse(res));
      return response;
    } catch (error) {
      this.logger.error(
        'ListServiceCheckResultController.get encountered an error',
        error,
      );
    }
  }
}
