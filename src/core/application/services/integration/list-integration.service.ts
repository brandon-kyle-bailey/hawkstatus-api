import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';
import { ListIntegrationQuery } from 'src/interface/queries/integration/list-integration.query';

@QueryHandler(ListIntegrationQuery)
export class ListIntegrationService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(UserRepository)
    protected readonly repo: UserRepositoryPort,
  ) {}
  async execute(query: ListIntegrationQuery): Promise<UserEntity[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      this.logger.error(
        'ListIntegrationService.execute encountered an error',
        error,
      );
    }
  }
}
