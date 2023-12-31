import { Command, CommandProps } from '@app/common/ddd/command.base';

export class SendEmailCommand extends Command {
  readonly to: string;
  readonly subject: string;
  readonly text: string;

  private constructor(props: CommandProps<SendEmailCommand>) {
    super(props);
    this.to = props.to;
    this.subject = props.subject;
    this.text = props.text;
  }

  static create(props: CommandProps<SendEmailCommand>): SendEmailCommand {
    return new SendEmailCommand(props);
  }
}
