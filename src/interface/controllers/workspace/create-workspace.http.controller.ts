import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { WorkspaceMapper } from 'src/infrastructure/mappers/workspace.mapper';
import { CreateWorkspaceCommand } from 'src/interface/commands/workspace/create-workspace.command';
import { CreateWorkspaceRequestDto } from 'src/interface/dtos/workspace/create-workspace.request.dto';
import { WorkspaceResponseDto } from 'src/interface/dtos/workspace/workspace.response.dto';

@Controller('v1')
export class CreateWorkspaceController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: WorkspaceMapper,
  ) {}

  @Post('workspace')
  async create(
    @Body() body: CreateWorkspaceRequestDto,
  ): Promise<WorkspaceResponseDto> {
    try {
      const command = CreateWorkspaceCommand.create(body);
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'CreateWorkspaceController.create encountered an error',
        error,
      );
    }
  }
}
