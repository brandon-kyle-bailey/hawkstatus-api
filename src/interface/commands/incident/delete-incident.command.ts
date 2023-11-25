import { Command, CommandProps } from '@app/common/ddd/command.base';

export class DeleteIncidentCommand extends Command {
  readonly id: string;

  private constructor(props: CommandProps<DeleteIncidentCommand>) {
    super(props);
    this.id = props.id;
  }

  static create(
    props: CommandProps<DeleteIncidentCommand>,
  ): DeleteIncidentCommand {
    return new DeleteIncidentCommand(props);
  }
}
