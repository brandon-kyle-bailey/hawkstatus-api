import { Command, CommandProps } from '@app/common/ddd/command.base';
import { AggregateID } from '@app/common/ddd/entity.base';

export class NotifyIncidentCommand extends Command {
  readonly serviceCheckId: AggregateID;
  readonly status: string;
  readonly timestamp: Date;
  private constructor(props: CommandProps<NotifyIncidentCommand>) {
    super(props);
    this.serviceCheckId = props.serviceCheckId;
    this.status = props.status;
    this.timestamp = props.timestamp;
  }

  static create(
    props: CommandProps<NotifyIncidentCommand>,
  ): NotifyIncidentCommand {
    return new NotifyIncidentCommand(props);
  }
}
