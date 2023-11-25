import { Command, CommandProps } from '@app/common/ddd/command.base';

export class DeleteWorkspaceMembershipCommand extends Command {
  readonly id: string;

  private constructor(props: CommandProps<DeleteWorkspaceMembershipCommand>) {
    super(props);
    this.id = props.id;
  }

  static create(
    props: CommandProps<DeleteWorkspaceMembershipCommand>,
  ): DeleteWorkspaceMembershipCommand {
    return new DeleteWorkspaceMembershipCommand(props);
  }
}
