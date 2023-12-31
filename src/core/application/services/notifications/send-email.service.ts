import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendEmailCommand } from 'src/interface/commands/notifications/send-email.command';

@CommandHandler(SendEmailCommand)
export class SendEmailService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    protected readonly service: MailerService,
  ) {}

  async execute(command: SendEmailCommand): Promise<void> {
    try {
      await this.service.sendMail({
        to: command.to,
        subject: command.subject,
        text: command.text,
        html: `<body>${command.text}</body>`,
      });
    } catch (error) {
      this.logger.error('SendEmailService encountered an error', error);
    }
  }
}
