import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ScheduleMethod,
  ScheduleServiceCheckDomainEvent,
  ScheduleStatus,
  ScheduleType,
  ServiceCheckEntity,
} from 'src/core/domain/entities/service-check.entity';

@Injectable()
export class ScheduleServiceCheckService {
  constructor(
    protected readonly logger: Logger,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(ScheduleServiceCheckDomainEvent.name, {
    async: true,
    promisify: true,
  })
  async handle(event: ScheduleServiceCheckDomainEvent): Promise<void> {
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

    const serviceCheck = ServiceCheckEntity.create({
      ...event,
      method: event.method as ScheduleMethod,
      status: event.status as ScheduleStatus,
      type: event.type as ScheduleType,
    });

    switch (event.type as ScheduleType) {
      case ScheduleType.Cron:
        this.logger.debug('Cron type not supported yet');
        return;
      case ScheduleType.Interval:
        this.schedulerRegistry.addInterval(
          event.serviceCheckId,
          setInterval(async () => {
            this.logger.debug('executing interval', event.serviceCheckId);
            serviceCheck.execute();
            serviceCheck.publishEvents(this.logger, this.eventEmitter);
          }, event.interval),
        );
        return;
      case ScheduleType.Timeout:
        this.schedulerRegistry.addTimeout(
          event.serviceCheckId,
          setTimeout(() => {
            this.logger.debug('executing timeout', event.serviceCheckId);
            serviceCheck.execute();
            serviceCheck.publishEvents(this.logger, this.eventEmitter);
          }, event.interval),
        );
        return;
      default:
        this.logger.debug('not sure what to do with this event', event.type);
        return;
    }
  }
}
