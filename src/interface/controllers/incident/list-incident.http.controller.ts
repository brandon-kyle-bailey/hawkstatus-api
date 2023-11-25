import { Body, Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { IncidentMapper } from 'src/infrastructure/mappers/incident.mapper';
import { IncidentResponseDto } from 'src/interface/dtos/incident/incident.response.dto';
import { ListIncidentRequestDto } from 'src/interface/dtos/incident/list-incident.request.dto';
import { ListIncidentQuery } from 'src/interface/queries/incident/list-incident.query';

@Controller('v1')
export class ListIncidentController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: IncidentMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('incident/list')
  async get(
    @Body() body: ListIncidentRequestDto,
    @Req() request: any,
  ): Promise<IncidentResponseDto> {
    try {
      const query = ListIncidentQuery.create({
        id: body.id,
      });
      const result = await this.queryBus.execute(query);
      const response = this.mapper.toResponse(result);
      return response;
    } catch (error) {
      this.logger.error(
        'ListIncidentController.get encountered an error',
        error,
      );
    }
  }
}
