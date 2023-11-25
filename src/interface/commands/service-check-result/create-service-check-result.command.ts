import { Command, CommandProps } from '@app/common/ddd/command.base';

export class CreateServiceCheckResultCommand extends Command {
  private constructor(props: CommandProps<CreateServiceCheckResultCommand>) {
    super(props);
  }

  static create(
    props: CommandProps<CreateServiceCheckResultCommand>,
  ): CreateServiceCheckResultCommand {
    return new CreateServiceCheckResultCommand(props);
  }
}
