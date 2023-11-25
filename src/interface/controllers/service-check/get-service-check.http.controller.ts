import { Body, Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { ServiceCheckMapper } from 'src/infrastructure/mappers/servce-check.mapper';
import { GetServiceCheckRequestDto } from 'src/interface/dtos/service-check/get-service-check.request.dto';
import { ServiceCheckResponseDto } from 'src/interface/dtos/service-check/service-check.response.dto';
import { GetServiceCheckQuery } from 'src/interface/queries/service-check/get-service-check.query';

@Controller('v1')
export class GetServiceCheckController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: ServiceCheckMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('service-check')
  async get(
    @Body() body: GetServiceCheckRequestDto,
    @Req() request: any,
  ): Promise<ServiceCheckResponseDto> {
    try {
      const query = GetServiceCheckQuery.create({
        id: body.id,
      });
      const result = await this.queryBus.execute(query);
      const response = this.mapper.toResponse(result);
      return response;
    } catch (error) {
      this.logger.error(
        'GetServiceCheckController.get encountered an error',
        error,
      );
    }
  }
}
