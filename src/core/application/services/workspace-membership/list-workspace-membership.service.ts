import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WorkspaceMembershipEntity } from 'src/core/domain/entities/workspace-membership.entity';
import { ListWorkspaceMembershipQuery } from 'src/interface/queries/workspace-membership/list-workspace-membership.query';
import { WorkspaceMembershipRepository } from '../../ports/workspace-membership/workspace-membership.repository';
import { WorkspaceMembershipRepositoryPort } from '../../ports/workspace-membership/workspace-membership.repository.port';

@QueryHandler(ListWorkspaceMembershipQuery)
export class ListWorkspaceMembershipService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(WorkspaceMembershipRepository)
    protected readonly repo: WorkspaceMembershipRepositoryPort,
  ) {}
  async execute(
    query: ListWorkspaceMembershipQuery,
  ): Promise<WorkspaceMembershipEntity[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      this.logger.error(
        'ListWorkspaceMembershipService.execute encountered an error',
        error,
      );
    }
  }
}
