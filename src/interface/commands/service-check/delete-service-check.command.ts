import { Command, CommandProps } from '@app/common/ddd/command.base';

export class DeleteServiceCheckCommand extends Command {
  readonly id: string;

  private constructor(props: CommandProps<DeleteServiceCheckCommand>) {
    super(props);
    this.id = props.id;
  }

  static create(
    props: CommandProps<DeleteServiceCheckCommand>,
  ): DeleteServiceCheckCommand {
    return new DeleteServiceCheckCommand(props);
  }
}
