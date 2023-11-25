import { Command, CommandProps } from '@app/common/ddd/command.base';
import { AggregateID } from '@app/common/ddd/entity.base';

export class UpdateServiceCheckResultCommand extends Command {
  readonly serviceCheckResultId: string;
  readonly status?: number;
  readonly duration?: number;
  readonly response?: string;
  private constructor(props: CommandProps<UpdateServiceCheckResultCommand>) {
    super(props);
    this.serviceCheckResultId = props.serviceCheckResultId;
    this.status = props.status;
    this.duration = props.duration;
    this.response = props.response;
  }

  static create(
    props: CommandProps<UpdateServiceCheckResultCommand>,
  ): UpdateServiceCheckResultCommand {
    return new UpdateServiceCheckResultCommand(props);
  }
}
