import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IncidentEntity } from 'src/core/domain/entities/incident.entity';
import { IncidentRepository } from '../../ports/incident/incident.repository';
import { IncidentRepositoryPort } from '../../ports/incident/incident.repository.port';
import { ListIncidentQuery } from 'src/interface/queries/incident/list-incident.query';

@QueryHandler(ListIncidentQuery)
export class ListIncidentService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(IncidentRepository)
    protected readonly repo: IncidentRepositoryPort,
  ) {}
  async execute(query: ListIncidentQuery): Promise<IncidentEntity[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      this.logger.error(
        'ListIncidentService.execute encountered an error',
        error,
      );
    }
  }
}
