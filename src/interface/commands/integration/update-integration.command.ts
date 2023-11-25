import { Command, CommandProps } from '@app/common/ddd/command.base';
import { AggregateID } from '@app/common/ddd/entity.base';

export class UpdateIntegrationCommand extends Command {
  readonly integrationId: AggregateID;
  readonly type?: string;
  readonly url?: string;
  private constructor(props: CommandProps<UpdateIntegrationCommand>) {
    super(props);
    this.integrationId = props.integrationId;
    this.type = props.type;
    this.url = props.url;
  }

  static create(
    props: CommandProps<UpdateIntegrationCommand>,
  ): UpdateIntegrationCommand {
    return new UpdateIntegrationCommand(props);
  }
}
