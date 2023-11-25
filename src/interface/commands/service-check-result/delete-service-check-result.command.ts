import { Command, CommandProps } from '@app/common/ddd/command.base';

export class DeleteServiceCheckResultCommand extends Command {
  readonly id: string;

  private constructor(props: CommandProps<DeleteServiceCheckResultCommand>) {
    super(props);
    this.id = props.id;
  }

  static create(
    props: CommandProps<DeleteServiceCheckResultCommand>,
  ): DeleteServiceCheckResultCommand {
    return new DeleteServiceCheckResultCommand(props);
  }
}
