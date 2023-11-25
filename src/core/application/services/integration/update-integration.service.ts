import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IntegrationEntity } from 'src/core/domain/entities/integration.entity';
import { UpdateIntegrationCommand } from 'src/interface/commands/integration/update-integration.command';
import { IntegrationRepository } from '../../ports/integration/integration.repository';
import { IntegrationRepositoryPort } from '../../ports/integration/integration.repository.port';

@CommandHandler(UpdateIntegrationCommand)
export class UpdateIntegrationService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(IntegrationRepository)
    protected readonly repo: IntegrationRepositoryPort,
  ) {}
  async execute(command: UpdateIntegrationCommand): Promise<IntegrationEntity> {
    try {
      let integration: IntegrationEntity;
      await this.repo.transaction(async () => {
        integration = await this.repo.findOneById(command.integrationId);
        integration.update(command);
        this.repo.save(integration);
      });
      return integration;
    } catch (error) {
      this.logger.error(
        'UpdateIntegrationService.execute encountered an error',
        error,
      );
    }
  }
}
