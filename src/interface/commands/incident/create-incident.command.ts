import { Command, CommandProps } from '@app/common/ddd/command.base';
import { AggregateID } from '@app/common/ddd/entity.base';

export class CreateIncidentCommand extends Command {
  readonly serviceCheckId: AggregateID;
  readonly status: string;
  private constructor(props: CommandProps<CreateIncidentCommand>) {
    super(props);
    this.serviceCheckId = props.serviceCheckId;
    this.status = props.status;
  }

  static create(
    props: CommandProps<CreateIncidentCommand>,
  ): CreateIncidentCommand {
    return new CreateIncidentCommand(props);
  }
}
