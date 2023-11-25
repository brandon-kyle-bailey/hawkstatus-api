import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ServiceCheckResultEntity } from 'src/core/domain/entities/service-check-result.entity';
import { ListServiceCheckResultQuery } from 'src/interface/queries/service-check-result/list-service-check-result.query';
import { ServiceCheckResultRepository } from '../../ports/service-check-result/service-check-result.repository';
import { ServiceCheckResultRepositoryPort } from '../../ports/service-check-result/service-check-result.repository.port';

@QueryHandler(ListServiceCheckResultQuery)
export class ListServiceCheckResultService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ServiceCheckResultRepository)
    protected readonly repo: ServiceCheckResultRepositoryPort,
  ) {}
  async execute(
    query: ListServiceCheckResultQuery,
  ): Promise<ServiceCheckResultEntity[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      this.logger.error(
        'ListServiceCheckResultService.execute encountered an error',
        error,
      );
    }
  }
}
