import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  UnScheduleServiceCheckDomainEvent,
  ScheduleType,
} from 'src/core/domain/entities/service-check.entity';

@Injectable()
export class UnScheduleServiceCheckService {
  constructor(
    protected readonly logger: Logger,
    protected readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  @OnEvent(UnScheduleServiceCheckDomainEvent.name)
  handle(event: UnScheduleServiceCheckDomainEvent): void {
    this.logger.log(
      'UnScheduleServiceCheckService.handle invoked with event',
      JSON.stringify(event),
    );

    if (
      !this.schedulerRegistry.doesExist(
        event.type as ScheduleType,
        event.serviceCheckId,
      )
    ) {
      this.logger.debug(
        `Schedule does not exist for operation ${event.serviceCheckId}. Returning`,
      );
      return;
    }

    switch (event.type as ScheduleType) {
      case ScheduleType.Cron:
        this.logger.debug('Cron type not supported yet');
        return;
      case ScheduleType.Interval:
        this.schedulerRegistry.deleteInterval(event.serviceCheckId);
        return;
      case ScheduleType.Timeout:
        this.schedulerRegistry.deleteTimeout(event.serviceCheckId);
        return;
      default:
        this.logger.debug('not sure what to do with this event');
        return;
    }
  }
}
