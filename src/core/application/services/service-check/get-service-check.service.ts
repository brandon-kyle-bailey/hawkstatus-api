import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ServiceCheckEntity } from 'src/core/domain/entities/service-check.entity';
import { GetServiceCheckQuery } from 'src/interface/queries/service-check/get-service-check.query';
import { ServiceCheckRepository } from '../../ports/service-check/service-check.repository';
import { ServiceCheckRepositoryPort } from '../../ports/service-check/service-check.repository.port';

@QueryHandler(GetServiceCheckQuery)
export class GetServiceCheckService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ServiceCheckRepository)
    protected readonly repo: ServiceCheckRepositoryPort,
  ) {}
  async execute(query: GetServiceCheckQuery): Promise<ServiceCheckEntity> {
    try {
      return await this.repo.findOneById(query.id);
    } catch (error) {
      this.logger.error(
        'GetServiceCheckService.execute encountered an error',
        error,
      );
    }
  }
}
