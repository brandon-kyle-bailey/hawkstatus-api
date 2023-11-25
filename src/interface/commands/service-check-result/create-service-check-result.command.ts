import { Command, CommandProps } from '@app/common/ddd/command.base';

export class CreateServiceCheckResultCommand extends Command {
  readonly serviceCheckId: string;
  readonly status: number;
  readonly duration: number;
  readonly response: string;
  private constructor(props: CommandProps<CreateServiceCheckResultCommand>) {
    super(props);
    this.serviceCheckId = props.serviceCheckId;
    this.status = props.status;
    this.duration = props.duration;
    this.response = props.response;
  }

  static create(
    props: CommandProps<CreateServiceCheckResultCommand>,
  ): CreateServiceCheckResultCommand {
    return new CreateServiceCheckResultCommand(props);
  }
}
