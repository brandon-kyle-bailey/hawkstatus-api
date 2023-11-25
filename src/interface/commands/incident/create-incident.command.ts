import { Command, CommandProps } from '@app/common/ddd/command.base';

export class CreateIncidentCommand extends Command {
  private constructor(props: CommandProps<CreateIncidentCommand>) {
    super(props);
  }

  static create(
    props: CommandProps<CreateIncidentCommand>,
  ): CreateIncidentCommand {
    return new CreateIncidentCommand(props);
  }
}
