import { Command, CommandProps } from '@app/common/ddd/command.base';

export class CreateUserCommand extends Command {
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly password: string;

  private constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
    this.password = props.password;
  }

  static create(props: CommandProps<CreateUserCommand>): CreateUserCommand {
    return new CreateUserCommand(props);
  }
}
