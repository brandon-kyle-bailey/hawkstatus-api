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
import { DeleteServiceCheckResultRequestDto } from 'src/interface/dtos/service-check-result/delete-service-check-result.request.dto';
import { DeleteServiceCheckResultCommand } from 'src/interface/commands/service-check-result/delete-service-check-result.command';

@Controller('v1')
export class DeleteServiceCheckResultController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthGuard)
  @Delete('service-check-result')
  async delete(
    @Body() body: DeleteServiceCheckResultRequestDto,
    @Req() request: any,
  ): Promise<AggregateID> {
    try {
      const command = DeleteServiceCheckResultCommand.create(body);
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'DeleteServiceCheckResultController.delete encountered an error',
        error,
      );
    }
  }
}
