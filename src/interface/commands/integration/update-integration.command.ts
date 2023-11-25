import { Command, CommandProps } from '@app/common/ddd/command.base';
import { AggregateID } from '@app/common/ddd/entity.base';

export class UpdateIntegrationCommand extends Command {
  private constructor(props: CommandProps<UpdateIntegrationCommand>) {
    super(props);
  }

  static create(
    props: CommandProps<UpdateIntegrationCommand>,
  ): UpdateIntegrationCommand {
    return new UpdateIntegrationCommand(props);
  }
}
