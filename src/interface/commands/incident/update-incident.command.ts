import { Command, CommandProps } from '@app/common/ddd/command.base';
import { AggregateID } from '@app/common/ddd/entity.base';

export class UpdateIncidentCommand extends Command {
  readonly incidentId: AggregateID;
  readonly status: string;
  private constructor(props: CommandProps<UpdateIncidentCommand>) {
    super(props);
    this.incidentId = props.incidentId;
    this.status = props.status;
  }

  static create(
    props: CommandProps<UpdateIncidentCommand>,
  ): UpdateIncidentCommand {
    return new UpdateIncidentCommand(props);
  }
}
