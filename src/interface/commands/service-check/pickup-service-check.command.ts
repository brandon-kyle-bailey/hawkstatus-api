import { Command, CommandProps } from '@app/common/ddd/command.base';

export class PickupServiceCheckCommand extends Command {
  private constructor(props: CommandProps<PickupServiceCheckCommand>) {
    super(props);
  }

  static create(
    props: CommandProps<PickupServiceCheckCommand>,
  ): PickupServiceCheckCommand {
    return new PickupServiceCheckCommand(props);
  }
}
