import { Command, CommandProps } from '@app/common/ddd/command.base';
import { AggregateID } from '@app/common/ddd/entity.base';

export class UpdateServiceCheckResultCommand extends Command {
  private constructor(props: CommandProps<UpdateServiceCheckResultCommand>) {
    super(props);
  }

  static create(
    props: CommandProps<UpdateServiceCheckResultCommand>,
  ): UpdateServiceCheckResultCommand {
    return new UpdateServiceCheckResultCommand(props);
  }
}
