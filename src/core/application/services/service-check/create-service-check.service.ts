import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ScheduleMethod,
  ScheduleStatus,
  ScheduleType,
  ServiceCheckEntity,
} from 'src/core/domain/entities/service-check.entity';
import { CreateServiceCheckCommand } from 'src/interface/commands/service-check/create-service-check.command';
import { ServiceCheckRepository } from '../../ports/service-check/service-check.repository';
import { ServiceCheckRepositoryPort } from '../../ports/service-check/service-check.repository.port';

@CommandHandler(CreateServiceCheckCommand)
export class CreateServiceCheckService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ServiceCheckRepository)
    protected readonly repo: ServiceCheckRepositoryPort,
  ) {}
  async execute(
    command: CreateServiceCheckCommand,
  ): Promise<ServiceCheckEntity> {
    try {
      const serviceCheck = ServiceCheckEntity.create({
        ownerId: command.ownerId,
        name: command.name,
        url: command.url,
        interval: command.interval,
        timeout: command.timeout || 0,
        alertCheckThreshold: command.alertCheckThreshold,
        method: command.method as ScheduleMethod,
        body: command.body,
        headers: command.headers,
        status: command.status as ScheduleStatus,
        type: command.type as ScheduleType,
      });
      serviceCheck.schedule();
      await this.repo.transaction(async () => {
        this.repo.insert(serviceCheck);
      });
      return serviceCheck;
    } catch (error) {
      this.logger.error(
        'CreateServiceCheckService.execute encountered an error',
        error,
      );
    }
  }
}
