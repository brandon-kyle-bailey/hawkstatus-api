import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkspaceMembershipEntity } from 'src/core/domain/entities/workspace-membership.entity';
import { UpdateWorkspaceMembershipCommand } from 'src/interface/commands/workspace-membership/update-workspace-membership.command';
import { WorkspaceMembershipRepository } from '../../ports/workspace-membership/workspace-membership.repository';
import { WorkspaceMembershipRepositoryPort } from '../../ports/workspace-membership/workspace-membership.repository.port';

@CommandHandler(UpdateWorkspaceMembershipCommand)
export class UpdateWorkspaceMembershipService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(WorkspaceMembershipRepository)
    protected readonly repo: WorkspaceMembershipRepositoryPort,
  ) {}
  async execute(
    command: UpdateWorkspaceMembershipCommand,
  ): Promise<WorkspaceMembershipEntity> {
    try {
      let workspaceMembership: WorkspaceMembershipEntity;
      await this.repo.transaction(async () => {
        workspaceMembership = await this.repo.findOneById(command.workspaceId);
        workspaceMembership.update(command);
        this.repo.save(workspaceMembership);
      });
      return workspaceMembership;
    } catch (error) {
      this.logger.error(
        'UpdateWorkspaceMembershipService.execute encountered an error',
        error,
      );
    }
  }
}
