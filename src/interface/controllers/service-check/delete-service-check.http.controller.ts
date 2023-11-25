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
import { DeleteServiceCheckRequestDto } from 'src/interface/dtos/service-check/delete-service-check.request.dto';
import { DeleteServiceCheckCommand } from 'src/interface/commands/service-check/delete-service-check.command';

@Controller('v1')
export class DeleteServiceCheckController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthGuard)
  @Delete('service-check')
  async delete(
    @Body() body: DeleteServiceCheckRequestDto,
    @Req() request: any,
  ): Promise<AggregateID> {
    try {
      const command = DeleteServiceCheckCommand.create(body);
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'DeleteServiceCheckController.delete encountered an error',
        error,
      );
    }
  }
}
