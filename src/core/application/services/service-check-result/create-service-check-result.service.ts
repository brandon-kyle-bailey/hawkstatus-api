import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServiceCheckResultEntity } from 'src/core/domain/entities/service-check-result.entity';
import { ServiceCheckResultRepository } from '../../ports/service-check-result/service-check-result.repository';
import { ServiceCheckResultRepositoryPort } from '../../ports/service-check-result/service-check-result.repository.port';
import { OnEvent } from '@nestjs/event-emitter';
import { ExecuteScheduleServiceCheckCompleteDomainEvent } from 'src/core/domain/entities/service-check.entity';

@Injectable()
export class CreateServiceCheckResultService {
  constructor(
    private readonly logger: Logger,
    @Inject(ServiceCheckResultRepository)
    protected readonly repo: ServiceCheckResultRepositoryPort,
  ) {}
  @OnEvent(ExecuteScheduleServiceCheckCompleteDomainEvent.name, {
    async: true,
    promisify: true,
  })
  async handle(
    event: ExecuteScheduleServiceCheckCompleteDomainEvent,
  ): Promise<ServiceCheckResultEntity> {
    try {
      const serviceCheckResult = ServiceCheckResultEntity.create({
        serviceCheckId: event.serviceCheckId,
        status: event.status,
        duration: event.duration,
        response: event.response,
      });
      await this.repo.transaction(async () => {
        this.repo.insert(serviceCheckResult);
      });
      return serviceCheckResult;
    } catch (error) {
      this.logger.error(
        'CreateServiceCheckResultService.execute encountered an error',
        error,
      );
    }
  }
}
