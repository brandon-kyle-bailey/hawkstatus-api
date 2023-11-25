import { Command, CommandProps } from '@app/common/ddd/command.base';

export class DeleteIntegrationCommand extends Command {
  readonly id: string;

  private constructor(props: CommandProps<DeleteIntegrationCommand>) {
    super(props);
    this.id = props.id;
  }

  static create(
    props: CommandProps<DeleteIntegrationCommand>,
  ): DeleteIntegrationCommand {
    return new DeleteIntegrationCommand(props);
  }
}
