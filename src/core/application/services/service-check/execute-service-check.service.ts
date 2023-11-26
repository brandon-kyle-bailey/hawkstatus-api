import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ExecuteScheduleServiceCheckCompleteDomainEvent,
  ExecuteScheduleServiceCheckDomainEvent,
} from 'src/core/domain/entities/service-check.entity';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';

axios.interceptors.request.use(
  function (config) {
    config.headers.requestStartTime = Date.now();
    return config;
  },
  null,
  { synchronous: true },
);

axios.interceptors.response.use(
  function (response) {
    response.headers.duration =
      Date.now() - response.config.headers.requestStartTime;
    return response;
  },
  null,
  { synchronous: true },
);

@Injectable()
export class ExecuteServiceCheckService {
  constructor(
    protected readonly logger: Logger,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly httpService: HttpService,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(ExecuteScheduleServiceCheckDomainEvent.name, {
    async: true,
    promisify: true,
  })
  async handle(event: ExecuteScheduleServiceCheckDomainEvent): Promise<void> {
    this.logger.log(
      'ExecuteServiceCheckService.handle invoked with event',
      JSON.stringify(event),
    );
    try {
      const response = await axios.request({
        url: event.url,
        method: event.method,
        headers: event.headers,
        data: event.body,
        timeout: event.timeout,
        validateStatus: () => true,
      });
      await this.eventEmitter.emitAsync(
        ExecuteScheduleServiceCheckCompleteDomainEvent.name,
        {
          serviceCheckId: event.serviceCheckId,
          response: response.data,
          status: response.status,
          duration: parseInt(response.headers.duration, 10),
          alertCheckThreshold: event.alertCheckThreshold,
        },
      );
      return;
    } catch (error) {
      this.logger.error(
        'ExecuteServiceCheckService.handle encountered an error',
        error,
      );
    }
  }
}
