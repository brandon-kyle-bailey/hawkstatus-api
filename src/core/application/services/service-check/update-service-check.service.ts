import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ServiceCheckEntity } from 'src/core/domain/entities/service-check.entity';
import { ServiceCheckRepository } from '../../ports/service-check/service-check.repository';
import { ServiceCheckRepositoryPort } from '../../ports/service-check/service-check.repository.port';
import { UpdateServiceCheckCommand } from 'src/interface/commands/service-check/update-service-check.command';

@CommandHandler(UpdateServiceCheckCommand)
export class UpdateServiceCheckService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ServiceCheckRepository)
    protected readonly repo: ServiceCheckRepositoryPort,
  ) {}
  async execute(
    command: UpdateServiceCheckCommand,
  ): Promise<ServiceCheckEntity> {
    try {
      let serviceCheck: ServiceCheckEntity;
      await this.repo.transaction(async () => {
        serviceCheck = await this.repo.findOneById(command.serviceCheckId);
        serviceCheck.update(command);
        this.repo.save(serviceCheck);
      });
      return serviceCheck;
    } catch (error) {
      this.logger.error(
        'UpdateServiceCheckService.execute encountered an error',
        error,
      );
    }
  }
}
