import { Body, Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { IncidentMapper } from 'src/infrastructure/mappers/incident.mapper';
import { GetIncidentRequestDto } from 'src/interface/dtos/incident/get-incident.request.dto';
import { IncidentResponseDto } from 'src/interface/dtos/incident/incident.response.dto';
import { GetIncidentQuery } from 'src/interface/queries/incident/get-incident.query';

@Controller('v1')
export class GetIncidentController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: IncidentMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('incident')
  async get(
    @Body() body: GetIncidentRequestDto,
    @Req() request: any,
  ): Promise<IncidentResponseDto> {
    try {
      const query = GetIncidentQuery.create({
        id: body.id,
      });
      const result = await this.queryBus.execute(query);
      const response = this.mapper.toResponse(result);
      return response;
    } catch (error) {
      this.logger.error(
        'GetIncidentController.get encountered an error',
        error,
      );
    }
  }
}
