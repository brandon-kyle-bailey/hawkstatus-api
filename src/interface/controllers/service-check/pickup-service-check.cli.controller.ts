import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PickupServiceCheckCommand } from 'src/interface/commands/service-check/pickup-service-check.command';
import { v4 } from 'uuid';

@Controller()
export class PickupServiceCheckCliController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  async pickup(): Promise<void> {
    this.logger.debug('PickupServiceCheckCliController.pickup invoked');
    try {
      const command = PickupServiceCheckCommand.create({ id: v4() });
      await this.commandBus.execute(command);
      return;
    } catch (error) {
      this.logger.error(
        'PickupServiceCheckCliController.pickup encountered an error',
        error,
      );
    }
  }
}
