import { Command, CommandProps } from '@app/common/ddd/command.base';

export class CreateIntegrationCommand extends Command {
  private constructor(props: CommandProps<CreateIntegrationCommand>) {
    super(props);
  }

  static create(
    props: CommandProps<CreateIntegrationCommand>,
  ): CreateIntegrationCommand {
    return new CreateIntegrationCommand(props);
  }
}
