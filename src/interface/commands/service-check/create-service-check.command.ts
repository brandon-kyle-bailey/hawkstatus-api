import { Command, CommandProps } from '@app/common/ddd/command.base';

export class CreateServiceCheckCommand extends Command {
  private constructor(props: CommandProps<CreateServiceCheckCommand>) {
    super(props);
  }

  static create(
    props: CommandProps<CreateServiceCheckCommand>,
  ): CreateServiceCheckCommand {
    return new CreateServiceCheckCommand(props);
  }
}
