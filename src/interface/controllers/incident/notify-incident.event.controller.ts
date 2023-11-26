import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import { IncidentCreatedDomainEvent } from 'src/core/domain/entities/incident.entity';
import { NotifyIncidentCommand } from 'src/interface/commands/incident/notify-incident.command';

@Controller()
export class NotifyIncidentEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @OnEvent(IncidentCreatedDomainEvent.name, {
    async: true,
    promisify: true,
  })
  async handle(event: IncidentCreatedDomainEvent): Promise<void> {
    this.logger.log(
      'NotifyIncidentEventController.handle invoked with event',
      JSON.stringify({ ...event, response: undefined }),
    );
    try {
      const command = NotifyIncidentCommand.create({
        serviceCheckId: event.serviceCheckId,
        status: event.status,
        timestamp: event.createdAt,
      });
      await this.commandBus.execute(command);
    } catch (error) {
      this.logger.error(
        'NotifyIncidentEventController.handle encountered an error',
        error,
      );
    }
  }
}
