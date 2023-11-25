import { Command, CommandProps } from '@app/common/ddd/command.base';
import { AggregateID } from '@app/common/ddd/entity.base';

export class UpdateServiceCheckCommand extends Command {
  private constructor(props: CommandProps<UpdateServiceCheckCommand>) {
    super(props);
  }

  static create(
    props: CommandProps<UpdateServiceCheckCommand>,
  ): UpdateServiceCheckCommand {
    return new UpdateServiceCheckCommand(props);
  }
}
