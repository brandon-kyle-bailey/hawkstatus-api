import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IncidentEntity } from 'src/core/domain/entities/incident.entity';
import { GetIncidentQuery } from 'src/interface/queries/incident/get-incident.query';
import { IncidentRepository } from '../../ports/incident/incident.repository';
import { IncidentRepositoryPort } from '../../ports/incident/incident.repository.port';

@QueryHandler(GetIncidentQuery)
export class GetIncidentService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(IncidentRepository)
    protected readonly repo: IncidentRepositoryPort,
  ) {}
  async execute(query: GetIncidentQuery): Promise<IncidentEntity> {
    try {
      return await this.repo.findOneById(query.id);
    } catch (error) {
      this.logger.error(
        'GetIncidentService.execute encountered an error',
        error,
      );
    }
  }
}
