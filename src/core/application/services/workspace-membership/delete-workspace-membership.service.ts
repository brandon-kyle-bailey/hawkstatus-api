import { AggregateID } from '@app/common/ddd/entity.base';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteWorkspaceMembershipCommand } from 'src/interface/commands/workspace-membership/delete-workspace-membership.command';
import { WorkspaceMembershipRepository } from '../../ports/workspace-membership/workspace-membership.repository';
import { WorkspaceMembershipRepositoryPort } from '../../ports/workspace-membership/workspace-membership.repository.port';

@CommandHandler(DeleteWorkspaceMembershipCommand)
export class DeleteWorkspaceMembershipService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(WorkspaceMembershipRepository)
    protected readonly repo: WorkspaceMembershipRepositoryPort,
  ) {}
  async execute(
    command: DeleteWorkspaceMembershipCommand,
  ): Promise<AggregateID> {
    try {
      await this.repo.transaction(async () => {
        const workspaceMembership = await this.repo.findOneById(command.id);
        workspaceMembership.delete();
        await this.repo.delete(workspaceMembership);
      });
      return command.id;
    } catch (error) {
      this.logger.error(
        'DeleteWorkspaceMembershipService.execute encountered an error',
        error,
      );
    }
  }
}
