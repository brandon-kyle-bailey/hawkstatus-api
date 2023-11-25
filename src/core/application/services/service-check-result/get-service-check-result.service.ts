import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ServiceCheckResultEntity } from 'src/core/domain/entities/service-check-result.entity';
import { GetServiceCheckResultQuery } from 'src/interface/queries/service-check-result/get-service-check-result.query';
import { ServiceCheckResultRepository } from '../../ports/service-check-result/service-check-result.repository';
import { ServiceCheckResultRepositoryPort } from '../../ports/service-check-result/service-check-result.repository.port';

@QueryHandler(GetServiceCheckResultQuery)
export class GetServiceCheckResultService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ServiceCheckResultRepository)
    protected readonly repo: ServiceCheckResultRepositoryPort,
  ) {}
  async execute(
    query: GetServiceCheckResultQuery,
  ): Promise<ServiceCheckResultEntity> {
    try {
      return await this.repo.findOneById(query.id);
    } catch (error) {
      this.logger.error(
        'GetServiceCheckResultService.execute encountered an error',
        error,
      );
    }
  }
}
