/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { ServiceCheckMapper } from 'src/infrastructure/mappers/servce-check.mapper';
import { ListServiceCheckRequestDto } from 'src/interface/dtos/service-check/list-service-check.request.dto';
import { ServiceCheckResponseDto } from 'src/interface/dtos/service-check/service-check.response.dto';
import { ListServiceCheckQuery } from 'src/interface/queries/service-check/list-service-check.query';

@Controller('v1')
export class ListServiceCheckController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: ServiceCheckMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('service-check/list')
  async get(@Req() request: any): Promise<ServiceCheckResponseDto[]> {
    try {
      const query = ListServiceCheckQuery.create({
        ownerId: request.user.sub,
      });
      const result = await this.queryBus.execute(query);
      this.logger.debug('paginated list service checks result', result);
      const response = result.data.map((res) => this.mapper.toResponse(res));
      return response;
    } catch (error) {
      this.logger.error(
        'ListServiceCheckController.get encountered an error',
        error,
      );
    }
  }
}
