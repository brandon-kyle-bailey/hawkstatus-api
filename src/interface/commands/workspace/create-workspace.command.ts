import { Command, CommandProps } from '@app/common/ddd/command.base';
import { AggregateID } from '@app/common/ddd/entity.base';

export class CreateWorkspaceCommand extends Command {
  readonly ownerId: AggregateID;
  readonly name: string;
  private constructor(props: CommandProps<CreateWorkspaceCommand>) {
    super(props);
    this.ownerId = props.ownerId;
    this.name = props.name;
  }

  static create(
    props: CommandProps<CreateWorkspaceCommand>,
  ): CreateWorkspaceCommand {
    return new CreateWorkspaceCommand(props);
  }
}
