import { Command, CommandProps } from '@app/common/ddd/command.base';
import { AggregateID } from '@app/common/ddd/entity.base';

export class CreateIntegrationCommand extends Command {
  readonly ownerId: AggregateID;
  readonly type: string;
  readonly url?: string;
  private constructor(props: CommandProps<CreateIntegrationCommand>) {
    super(props);
    this.ownerId = props.ownerId;
    this.type = props.type;
    this.url = props.url;
  }

  static create(
    props: CommandProps<CreateIntegrationCommand>,
  ): CreateIntegrationCommand {
    return new CreateIntegrationCommand(props);
  }
}
