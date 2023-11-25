import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WorkspaceEntity } from 'src/core/domain/entities/workspace.entity';
import { ListWorkspaceQuery } from 'src/interface/queries/workspace/list-workspace.query';
import { WorkspaceRepository } from '../../ports/workspace/workspace.repository';
import { WorkspaceRepositoryPort } from '../../ports/workspace/workspace.repository.port';

@QueryHandler(ListWorkspaceQuery)
export class ListWorkspaceService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(WorkspaceRepository)
    protected readonly repo: WorkspaceRepositoryPort,
  ) {}
  async execute(query: ListWorkspaceQuery): Promise<WorkspaceEntity[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      this.logger.error(
        'ListWorkspaceService.execute encountered an error',
        error,
      );
    }
  }
}
