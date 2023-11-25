import { Body, Controller, Logger, Put, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { WorkspaceMapper } from 'src/infrastructure/mappers/workspace.mapper';
import { UpdateWorkspaceCommand } from 'src/interface/commands/workspace/update-workspace.command';
import { UpdateWorkspaceRequestDto } from 'src/interface/dtos/workspace/update-workspace.request.dto';
import { WorkspaceResponseDto } from 'src/interface/dtos/workspace/workspace.response.dto';

@Controller('v1')
export class UpdateWorkspaceController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: WorkspaceMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Put('workspace')
  async update(
    @Body() body: UpdateWorkspaceRequestDto,
    @Req() request: any,
  ): Promise<WorkspaceResponseDto> {
    try {
      const command = UpdateWorkspaceCommand.create(body);
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'UpdateWorkspaceController.update encountered an error',
        error,
      );
    }
  }
}
