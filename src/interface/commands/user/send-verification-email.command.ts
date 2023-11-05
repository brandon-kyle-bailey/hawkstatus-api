import { Command, CommandProps } from '@app/common/ddd/command.base';
import { AggregateID } from '@app/common/ddd/entity.base';

export class SendVerificationEmailCommand extends Command {
  readonly userId: AggregateID;
  readonly name: string;
  readonly email: string;

  private constructor(props: CommandProps<SendVerificationEmailCommand>) {
    super(props);
    this.userId = props.userId;
    this.name = props.name;
    this.email = props.email;
  }

  static create(
    props: CommandProps<SendVerificationEmailCommand>,
  ): SendVerificationEmailCommand {
    return new SendVerificationEmailCommand(props);
  }
}
