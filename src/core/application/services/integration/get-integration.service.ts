import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IntegrationEntity } from 'src/core/domain/entities/integration.entity';
import { GetIntegrationQuery } from 'src/interface/queries/integration/get-integration.query';
import { IntegrationRepository } from '../../ports/integration/integration.repository';
import { IntegrationRepositoryPort } from '../../ports/integration/integration.repository.port';

@QueryHandler(GetIntegrationQuery)
export class GetIntegrationService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(IntegrationRepository)
    protected readonly repo: IntegrationRepositoryPort,
  ) {}
  async execute(query: GetIntegrationQuery): Promise<IntegrationEntity> {
    try {
      return await this.repo.findOneById(query.id);
    } catch (error) {
      this.logger.error(
        'GetIntegrationService.execute encountered an error',
        error,
      );
    }
  }
}
