import { Command, CommandProps } from '@app/common/ddd/command.base';

export class CreateWorkspaceMembershipCommand extends Command {
  private constructor(props: CommandProps<CreateWorkspaceMembershipCommand>) {
    super(props);
  }

  static create(
    props: CommandProps<CreateWorkspaceMembershipCommand>,
  ): CreateWorkspaceMembershipCommand {
    return new CreateWorkspaceMembershipCommand(props);
  }
}
