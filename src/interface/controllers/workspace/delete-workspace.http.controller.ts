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
import { DeleteWorkspaceRequestDto } from 'src/interface/dtos/workspace/delete-workspace.request.dto';
import { DeleteWorkspaceCommand } from 'src/interface/commands/workspace/delete-workspace.command';

@Controller('v1')
export class DeleteWorkspaceController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthGuard)
  @Delete('workspace')
  async delete(
    @Body() body: DeleteWorkspaceRequestDto,
    @Req() request: any,
  ): Promise<AggregateID> {
    try {
      const command = DeleteWorkspaceCommand.create(body);
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'DeleteWorkspaceController.delete encountered an error',
        error,
      );
    }
  }
}
