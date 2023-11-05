import { Inject, Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendVerificationEmailCommand } from 'src/interface/commands/user/send-verification-email.command';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';
import { SendEmailCommand } from 'src/interface/commands/notifications/send-email.command';

@CommandHandler(SendVerificationEmailCommand)
export class SendVerificationEmailService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(UserRepository)
    private readonly repo: UserRepositoryPort,
    private readonly commandBus: CommandBus,
  ) {}
  async execute(command: SendVerificationEmailCommand): Promise<void> {
    try {
      await this.commandBus.execute(
        SendEmailCommand.create({
          to: command.email,
          subject: `Please verify your email!`,
          text: `Hey ${command.name}, Please verify your email address by clicking the link below. http://localhost:3000/v1/user/verify?id=${command.userId}`,
        }),
      );
    } catch (error) {
      this.logger.error(
        'SendVerificationEmailService.execute encountered an error',
        error,
      );
    }
  }
}
