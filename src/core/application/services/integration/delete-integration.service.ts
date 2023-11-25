import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AggregateID } from '@app/common/ddd/entity.base';
import { DeleteIntegrationCommand } from 'src/interface/commands/integration/delete-integration.command';
import { IntegrationRepository } from '../../ports/integration/integration.repository';
import { IntegrationRepositoryPort } from '../../ports/integration/integration.repository.port';

@CommandHandler(DeleteIntegrationCommand)
export class DeleteIntegrationService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(IntegrationRepository)
    protected readonly repo: IntegrationRepositoryPort,
  ) {}
  async execute(command: DeleteIntegrationCommand): Promise<AggregateID> {
    try {
      await this.repo.transaction(async () => {
        const integration = await this.repo.findOneById(command.id);
        integration.delete();
        await this.repo.delete(integration);
      });
      return command.id;
    } catch (error) {
      this.logger.error(
        'DeleteIntegrationService.execute encountered an error',
        error,
      );
    }
  }
}
