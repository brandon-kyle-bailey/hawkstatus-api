import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ScheduleServiceCheckDomainEvent,
  ScheduleType,
} from 'src/core/domain/entities/service-check.entity';

@Injectable()
export class ScheduleServiceCheckService {
  constructor(
    protected readonly logger: Logger,
    protected readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  @OnEvent(ScheduleServiceCheckDomainEvent.name)
  handle(event: ScheduleServiceCheckDomainEvent): void {
    this.logger.log(
      'ScheduleServiceCheckService.handle invoked with event',
      JSON.stringify(event),
    );

    if (
      this.schedulerRegistry.doesExist(
        event.type as ScheduleType,
        event.serviceCheckId,
      )
    ) {
      this.logger.debug(
        `Schedule already exists for operation ${event.serviceCheckId}. Returning`,
      );
      return;
    }

    switch (event.type as ScheduleType) {
      case ScheduleType.Cron:
        this.logger.debug('Cron type not supported yet');
        return;
      case ScheduleType.Interval:
        this.schedulerRegistry.addInterval(
          event.serviceCheckId,
          setInterval(() => {
            this.logger.debug('executing interval', event.serviceCheckId);
            // emit domain event to execute service check
            // this.service.emit(ScheduledTaskIntegrationEvents.RunTask, payload);
          }, event.interval),
        );
        return;
      case ScheduleType.Timeout:
        this.schedulerRegistry.addTimeout(
          event.serviceCheckId,
          setTimeout(() => {
            this.logger.debug('executing timeout', event.serviceCheckId);
            // emit domain event to execute service check
            // this.service.emit(ScheduledTaskIntegrationEvents.RunTask, payload);
          }, event.interval),
        );
        return;
      default:
        this.logger.debug('not sure what to do with this event', event.type);
        return;
    }
  }
}
