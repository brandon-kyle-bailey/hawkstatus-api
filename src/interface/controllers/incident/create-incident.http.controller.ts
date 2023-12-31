import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { IncidentMapper } from 'src/infrastructure/mappers/incident.mapper';
import { CreateIncidentCommand } from 'src/interface/commands/incident/create-incident.command';
import { CreateIncidentRequestDto } from 'src/interface/dtos/incident/create-incident.request.dto';
import { IncidentResponseDto } from 'src/interface/dtos/incident/incident.response.dto';

@Controller('v1')
export class CreateIncidentController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: IncidentMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Post('incident')
  async create(
    @Body() body: CreateIncidentRequestDto,
  ): Promise<IncidentResponseDto> {
    try {
      const command = CreateIncidentCommand.create({
        serviceCheckId: body.serviceCheckId,
        status: 'ACTIVE',
      });
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'CreateIncidentController.create encountered an error',
        error,
      );
    }
  }
}
