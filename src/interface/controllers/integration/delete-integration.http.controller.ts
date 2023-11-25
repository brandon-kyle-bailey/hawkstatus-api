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
import { DeleteIntegrationRequestDto } from 'src/interface/dtos/integration/delete-integration.request.dto';
import { DeleteIntegrationCommand } from 'src/interface/commands/integration/delete-integration.command';

@Controller('v1')
export class DeleteIntegrationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthGuard)
  @Delete('Integration')
  async delete(
    @Body() body: DeleteIntegrationRequestDto,
    @Req() request: any,
  ): Promise<AggregateID> {
    try {
      const command = DeleteIntegrationCommand.create(body);
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'DeleteIntegrationController.delete encountered an error',
        error,
      );
    }
  }
}
