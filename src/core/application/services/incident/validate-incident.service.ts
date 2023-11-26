import { Inject, Injectable, Logger } from '@nestjs/common';
import { IncidentEntity } from 'src/core/domain/entities/incident.entity';
import { IncidentRepository } from '../../ports/incident/incident.repository';
import { IncidentRepositoryPort } from '../../ports/incident/incident.repository.port';
import { OnEvent } from '@nestjs/event-emitter';
import { ExecuteScheduleServiceCheckCompleteDomainEvent } from 'src/core/domain/entities/service-check.entity';
import { ServiceCheckResultRepository } from '../../ports/service-check-result/service-check-result.repository';
import { ServiceCheckResultRepositoryPort } from '../../ports/service-check-result/service-check-result.repository.port';

@Injectable()
export class ValidateIncidentService {
  constructor(
    private readonly logger: Logger,
    @Inject(ServiceCheckResultRepository)
    protected readonly serviceCheckRepo: ServiceCheckResultRepositoryPort,
    @Inject(IncidentRepository)
    protected readonly repo: IncidentRepositoryPort,
  ) {}

  @OnEvent(ExecuteScheduleServiceCheckCompleteDomainEvent.name, {
    async: true,
    promisify: true,
  })
  async handle(
    event: ExecuteScheduleServiceCheckCompleteDomainEvent,
  ): Promise<void> {
    this.logger.log(
      'ValidateIncidentService.handle invoked with event',
      JSON.stringify({ ...event, response: undefined }),
    );
    try {
      const existingIncident = await this.repo.findOneBy({
        serviceCheckId: event.serviceCheckId,
        status: 'ACTIVE',
      });
      const serviceCheckResults = await this.serviceCheckRepo.findAllPaginated({
        limit: event.alertCheckThreshold,
        page: 0,
        offset: 0,
        orderBy: {
          field: 'createdAt',
          param: 'desc',
        },
        filter: {
          serviceCheckId: event.serviceCheckId,
          incidentId: null,
        },
      });
      if (existingIncident) {
        this.logger.debug('Incident already exists. Returning');
        await this.serviceCheckRepo.transaction(async () => {
          serviceCheckResults.data.map((serviceCheck) => {
            serviceCheck.update({ incidentId: existingIncident.id });
            this.serviceCheckRepo.save(serviceCheck);
          });
        });
        return;
      }
      const statuses = serviceCheckResults.data.map((d) => d.getProps().status);
      if (!statuses.every((x) => x > 399)) {
        this.logger.debug('Validation check failed. Returning');
        return;
      }
      const incident = IncidentEntity.create({
        serviceCheckId: event.serviceCheckId,
        status: 'ACTIVE',
      });
      await this.repo.transaction(async () => {
        this.repo.insert(incident);
      });
      await this.serviceCheckRepo.transaction(async () => {
        serviceCheckResults.data.map((serviceCheck) => {
          serviceCheck.update({ incidentId: incident.id });
          this.serviceCheckRepo.save(serviceCheck);
        });
      });
      return;
    } catch (error) {
      this.logger.error(
        'ValidateIncidentService.execute encountered an error',
        error,
      );
    }
  }
}
