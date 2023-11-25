import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkspaceMembershipEntity } from 'src/core/domain/entities/workspace-membership.entity';
import { CreateWorkspaceMembershipCommand } from 'src/interface/commands/workspace-membership/create-workspace-membership.command';
import { WorkspaceMembershipRepository } from '../../ports/workspace-membership/workspace-membership.repository';
import { WorkspaceMembershipRepositoryPort } from '../../ports/workspace-membership/workspace-membership.repository.port';

@CommandHandler(CreateWorkspaceMembershipCommand)
export class CreateWorkspaceMembershipService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(WorkspaceMembershipRepository)
    protected readonly repo: WorkspaceMembershipRepositoryPort,
  ) {}
  async execute(
    command: CreateWorkspaceMembershipCommand,
  ): Promise<WorkspaceMembershipEntity> {
    try {
      const workspaceMembership = WorkspaceMembershipEntity.create({
        workspaceId: command.workspaceId,
        userId: command.userId,
      });
      await this.repo.transaction(async () => {
        this.repo.insert(workspaceMembership);
      });
      return workspaceMembership;
    } catch (error) {
      this.logger.error(
        'CreateWorkspaceMembershipService.execute encountered an error',
        error,
      );
    }
  }
}
