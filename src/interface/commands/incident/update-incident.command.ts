import { Command, CommandProps } from '@app/common/ddd/command.base';
import { AggregateID } from '@app/common/ddd/entity.base';

export class UpdateIncidentCommand extends Command {
  private constructor(props: CommandProps<UpdateIncidentCommand>) {
    super(props);
  }

  static create(
    props: CommandProps<UpdateIncidentCommand>,
  ): UpdateIncidentCommand {
    return new UpdateIncidentCommand(props);
  }
}
