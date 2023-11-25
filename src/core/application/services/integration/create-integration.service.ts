import { ArgumentInvalidException } from '@app/common/exceptions/exceptions';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IntegrationEntity } from 'src/core/domain/entities/integration.entity';
import { CreateIntegrationCommand } from 'src/interface/commands/integration/create-integration.command';
import { IntegrationRepository } from '../../ports/integration/integration.repository';
import { IntegrationRepositoryPort } from '../../ports/integration/integration.repository.port';

@CommandHandler(CreateIntegrationCommand)
export class CreateIntegrationService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(IntegrationRepository)
    protected readonly repo: IntegrationRepositoryPort,
  ) {}
  async execute(command: CreateIntegrationCommand): Promise<IntegrationEntity> {
    try {
      const integration = IntegrationEntity.create({
        ownerId: command.ownerId,
        type: command.type,
        url: command.url,
      });
      await this.repo.transaction(async () => {
        this.repo.insert(integration);
      });
      return integration;
    } catch (error) {
      this.logger.error(
        'CreateIntegrationService.execute encountered an error',
        error,
      );
    }
  }
}
