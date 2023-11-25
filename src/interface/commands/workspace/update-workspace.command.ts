import { Command, CommandProps } from '@app/common/ddd/command.base';
import { AggregateID } from '@app/common/ddd/entity.base';

export class UpdateWorkspaceCommand extends Command {
  private constructor(props: CommandProps<UpdateWorkspaceCommand>) {
    super(props);
  }

  static create(
    props: CommandProps<UpdateWorkspaceCommand>,
  ): UpdateWorkspaceCommand {
    return new UpdateWorkspaceCommand(props);
  }
}
