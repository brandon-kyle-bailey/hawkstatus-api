import { Body, Controller, Logger, Put, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { IncidentMapper } from 'src/infrastructure/mappers/incident.mapper';
import { UpdateIncidentCommand } from 'src/interface/commands/incident/update-incident.command';
import { IncidentResponseDto } from 'src/interface/dtos/incident/incident.response.dto';
import { UpdateIncidentRequestDto } from 'src/interface/dtos/incident/update-incident.request.dto';

@Controller('v1')
export class UpdateIncidentController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: IncidentMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Put('incident')
  async update(
    @Body() body: UpdateIncidentRequestDto,
    @Req() request: any,
  ): Promise<IncidentResponseDto> {
    try {
      const command = UpdateIncidentCommand.create(body);
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'UpdateIncidentController.update encountered an error',
        error,
      );
    }
  }
}
