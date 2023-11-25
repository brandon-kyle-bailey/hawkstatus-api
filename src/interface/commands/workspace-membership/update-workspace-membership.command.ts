import { Command, CommandProps } from '@app/common/ddd/command.base';

export class UpdateWorkspaceMembershipCommand extends Command {
  private constructor(props: CommandProps<UpdateWorkspaceMembershipCommand>) {
    super(props);
  }

  static create(
    props: CommandProps<UpdateWorkspaceMembershipCommand>,
  ): UpdateWorkspaceMembershipCommand {
    return new UpdateWorkspaceMembershipCommand(props);
  }
}
