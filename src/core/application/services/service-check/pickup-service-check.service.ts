import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ScheduleStatus,
  ServiceCheckEntity,
} from 'src/core/domain/entities/service-check.entity';
import { ServiceCheckRepository } from '../../ports/service-check/service-check.repository';
import { ServiceCheckRepositoryPort } from '../../ports/service-check/service-check.repository.port';
import { PickupServiceCheckCommand } from 'src/interface/commands/service-check/pickup-service-check.command';
import { EventEmitter2 } from '@nestjs/event-emitter';

@CommandHandler(PickupServiceCheckCommand)
export class PickupServiceCheckService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ServiceCheckRepository)
    protected readonly repo: ServiceCheckRepositoryPort,
    protected readonly eventEmitter: EventEmitter2,
  ) {}
  async execute(command: PickupServiceCheckCommand): Promise<void> {
    try {
      this.logger.debug('PickupSchedulesService.execute called');
      const schedules = await this.repo.findAllByStatus(ScheduleStatus.ACTIVE);
      schedules.map(async (serviceCheck: ServiceCheckEntity) => {
        serviceCheck.schedule();
        await serviceCheck.publishEvents(this.logger, this.eventEmitter);
      });
      return;
    } catch (error) {
      this.logger.error(
        'PickupServiceCheckService.execute encountered an error',
        error,
      );
    }
  }
}
