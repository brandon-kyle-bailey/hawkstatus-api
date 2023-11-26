import { Inject, Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotifyIncidentCommand } from 'src/interface/commands/incident/notify-incident.command';
import { ServiceCheckRepository } from '../../ports/service-check/service-check.repository';
import { ServiceCheckRepositoryPort } from '../../ports/service-check/service-check.repository.port';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';
import { SendEmailCommand } from 'src/interface/commands/notifications/send-email.command';

@CommandHandler(NotifyIncidentCommand)
export class NotifyIncidentService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ServiceCheckRepository)
    protected readonly repo: ServiceCheckRepositoryPort,
    @Inject(UserRepository)
    protected readonly userRepo: UserRepositoryPort,
    private readonly commandBus: CommandBus,
  ) {}
  async execute(command: NotifyIncidentCommand): Promise<void> {
    try {
      const serviceCheck = await this.repo.findOneById(command.serviceCheckId);
      const user = await this.userRepo.findOneById(serviceCheck.ownerId);
      await this.commandBus.execute(
        SendEmailCommand.create({
          to: user.email,
          subject: `Hawkstatus.com: ${serviceCheck.name} is offline.`,
          text: `Hey ${user.name}, Your check ${
            serviceCheck.name
          } is currently offline as of ${command.timestamp.toISOString()}. Please visit https://hawkstatus.com for more information.`,
        }),
      );
    } catch (error) {
      this.logger.error(
        'NotifyIncidentService.execute encountered an error',
        error,
      );
    }
  }
}
