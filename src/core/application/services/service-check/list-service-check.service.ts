/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ServiceCheckEntity } from 'src/core/domain/entities/service-check.entity';
import { ListServiceCheckQuery } from 'src/interface/queries/service-check/list-service-check.query';
import { ServiceCheckRepository } from '../../ports/service-check/service-check.repository';
import { ServiceCheckRepositoryPort } from '../../ports/service-check/service-check.repository.port';
import { Paginated } from '@app/common/ports/repository.port';

@QueryHandler(ListServiceCheckQuery)
export class ListServiceCheckService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ServiceCheckRepository)
    protected readonly repo: ServiceCheckRepositoryPort,
  ) {}
  async execute(
    query: ListServiceCheckQuery,
  ): Promise<Paginated<ServiceCheckEntity>> {
    try {
      return await this.repo.findAllPaginated({
        limit: 10,
        page: 0,
        offset: 0,
        orderBy: {
          field: 'createdAt',
          param: 'desc',
        },
        filter: {
          ownerId: query.ownerId,
        },
      });
    } catch (error) {
      this.logger.error(
        'ListServiceCheckService.execute encountered an error',
        error,
      );
    }
  }
}
