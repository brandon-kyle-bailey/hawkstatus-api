import { Command, CommandProps } from '@app/common/ddd/command.base';
import { AggregateID } from '@app/common/ddd/entity.base';

export class UpdateWorkspaceMembershipCommand extends Command {
  readonly workspaceId: AggregateID;
  readonly userId: AggregateID;
  private constructor(props: CommandProps<UpdateWorkspaceMembershipCommand>) {
    super(props);
    this.workspaceId = props.workspaceId;
    this.userId = props.userId;
  }

  static create(
    props: CommandProps<UpdateWorkspaceMembershipCommand>,
  ): UpdateWorkspaceMembershipCommand {
    return new UpdateWorkspaceMembershipCommand(props);
  }
}
