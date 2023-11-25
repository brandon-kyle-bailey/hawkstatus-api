import {
  Body,
  Controller,
  Delete,
  Logger,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AggregateID } from '@app/common/ddd/entity.base';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { DeleteIncidentRequestDto } from 'src/interface/dtos/incident/delete-incident.request.dto';
import { DeleteIncidentCommand } from 'src/interface/commands/incident/delete-incident.command';

@Controller('v1')
export class DeleteIncidentController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthGuard)
  @Delete('incident')
  async delete(
    @Body() body: DeleteIncidentRequestDto,
    @Req() request: any,
  ): Promise<AggregateID> {
    try {
      const command = DeleteIncidentCommand.create(body);
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'DeleteIncidentController.delete encountered an error',
        error,
      );
    }
  }
}
