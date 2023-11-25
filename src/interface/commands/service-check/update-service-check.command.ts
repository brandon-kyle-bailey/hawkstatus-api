import { Command, CommandProps } from '@app/common/ddd/command.base';
import { AggregateID } from '@app/common/ddd/entity.base';

export class UpdateServiceCheckCommand extends Command {
  readonly serviceCheckId: string;
  readonly name?: string;
  readonly url?: string;
  readonly interval?: number;
  readonly timeout?: number;
  readonly alertCheckThreshold?: number;
  readonly method?: string;
  readonly body?: string;
  readonly headers?: { [key: string]: string }[];
  readonly status?: string;
  readonly type?: string;
  private constructor(props: CommandProps<UpdateServiceCheckCommand>) {
    super(props);
    this.serviceCheckId = props.serviceCheckId;
    this.name = props.name;
    this.url = props.url;
    this.interval = props.interval;
    this.timeout = props.timeout;
    this.alertCheckThreshold = props.alertCheckThreshold;
    this.method = props.method;
    this.body = props.body;
    this.headers = props.headers;
    this.status = props.status;
    this.type = props.type;
  }

  static create(
    props: CommandProps<UpdateServiceCheckCommand>,
  ): UpdateServiceCheckCommand {
    return new UpdateServiceCheckCommand(props);
  }
}
