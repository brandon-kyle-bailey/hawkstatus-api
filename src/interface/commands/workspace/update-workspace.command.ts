import { Command, CommandProps } from '@app/common/ddd/command.base';
import { AggregateID } from '@app/common/ddd/entity.base';

export class UpdateWorkspaceCommand extends Command {
  readonly workspaceId: AggregateID;
  readonly name: string;
  private constructor(props: CommandProps<UpdateWorkspaceCommand>) {
    super(props);
    this.workspaceId = props.workspaceId;
    this.name = props.name;
  }

  static create(
    props: CommandProps<UpdateWorkspaceCommand>,
  ): UpdateWorkspaceCommand {
    return new UpdateWorkspaceCommand(props);
  }
}
