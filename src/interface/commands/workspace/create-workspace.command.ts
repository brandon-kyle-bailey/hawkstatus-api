import { Command, CommandProps } from '@app/common/ddd/command.base';

export class CreateWorkspaceCommand extends Command {
  private constructor(props: CommandProps<CreateWorkspaceCommand>) {
    super(props);
  }

  static create(
    props: CommandProps<CreateWorkspaceCommand>,
  ): CreateWorkspaceCommand {
    return new CreateWorkspaceCommand(props);
  }
}
