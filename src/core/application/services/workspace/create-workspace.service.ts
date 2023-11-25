import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkspaceEntity } from 'src/core/domain/entities/workspace.entity';
import { CreateWorkspaceCommand } from 'src/interface/commands/workspace/create-workspace.command';
import { WorkspaceRepository } from '../../ports/workspace/workspace.repository';
import { WorkspaceRepositoryPort } from '../../ports/workspace/workspace.repository.port';

@CommandHandler(CreateWorkspaceCommand)
export class CreateWorkspaceService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(WorkspaceRepository)
    protected readonly repo: WorkspaceRepositoryPort,
  ) {}
  async execute(command: CreateWorkspaceCommand): Promise<WorkspaceEntity> {
    try {
      const workspace = WorkspaceEntity.create({
        ownerId: command.ownerId,
        name: command.name,
      });
      await this.repo.transaction(async () => {
        this.repo.insert(workspace);
      });
      return workspace;
    } catch (error) {
      this.logger.error(
        'CreateWorkspaceService.execute encountered an error',
        error,
      );
    }
  }
}
