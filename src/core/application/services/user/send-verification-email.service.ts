import { Inject, Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendVerificationEmailCommand } from 'src/interface/commands/user/send-verification-email.command';
import { SendEmailCommand } from 'src/interface/commands/notifications/send-email.command';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@app/common/enum/environment-variables.enum';

@CommandHandler(SendVerificationEmailCommand)
export class SendVerificationEmailService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    private readonly commandBus: CommandBus,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}
  async execute(command: SendVerificationEmailCommand): Promise<void> {
    try {
      const host = this.configService.get<string>(EnvironmentVariables.HOST);
      const port = this.configService.get<string>(EnvironmentVariables.PORT);
      await this.commandBus.execute(
        SendEmailCommand.create({
          to: command.email,
          subject: `Please verify your email!`,
          text: `Hey ${command.name}, Please verify your email address by clicking the link below. http://${host}:${port}/v1/user/verify?id=${command.userId}`,
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
