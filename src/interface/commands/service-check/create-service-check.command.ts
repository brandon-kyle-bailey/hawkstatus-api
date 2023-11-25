import { Command, CommandProps } from '@app/common/ddd/command.base';

export class CreateServiceCheckCommand extends Command {
  readonly ownerId: string;
  readonly name: string;
  readonly url: string;
  readonly interval: number;
  readonly timeout: number;
  readonly alertCheckThreshold: number;
  readonly method: string;
  readonly body: string;
  readonly headers: { [key: string]: string }[];
  readonly status: string;
  readonly type: string;
  private constructor(props: CommandProps<CreateServiceCheckCommand>) {
    super(props);
    this.ownerId = props.ownerId;
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
    props: CommandProps<CreateServiceCheckCommand>,
  ): CreateServiceCheckCommand {
    return new CreateServiceCheckCommand(props);
  }
}
