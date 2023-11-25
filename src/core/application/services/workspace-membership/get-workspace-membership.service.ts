import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WorkspaceMembershipEntity } from 'src/core/domain/entities/workspace-membership.entity';
import { GetWorkspaceMembershipQuery } from 'src/interface/queries/workspace-membership/get-workspace-membership.query';
import { WorkspaceMembershipRepository } from '../../ports/workspace-membership/workspace-membership.repository';
import { WorkspaceMembershipRepositoryPort } from '../../ports/workspace-membership/workspace-membership.repository.port';

@QueryHandler(GetWorkspaceMembershipQuery)
export class GetWorkspaceMembershipService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(WorkspaceMembershipRepository)
    protected readonly repo: WorkspaceMembershipRepositoryPort,
  ) {}
  async execute(
    query: GetWorkspaceMembershipQuery,
  ): Promise<WorkspaceMembershipEntity> {
    try {
      return await this.repo.findOneById(query.id);
    } catch (error) {
      this.logger.error(
        'GetWorkspaceMembershipService.execute encountered an error',
        error,
      );
    }
  }
}
