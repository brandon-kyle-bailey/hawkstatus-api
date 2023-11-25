import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ServiceCheckResultEntity } from 'src/core/domain/entities/service-check-result.entity';
import { UpdateServiceCheckResultCommand } from 'src/interface/commands/service-check-result/update-service-check-result.command';
import { ServiceCheckResultRepository } from '../../ports/service-check-result/service-check-result.repository';
import { ServiceCheckResultRepositoryPort } from '../../ports/service-check-result/service-check-result.repository.port';

@CommandHandler(UpdateServiceCheckResultCommand)
export class UpdateServiceCheckResultService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ServiceCheckResultRepository)
    protected readonly repo: ServiceCheckResultRepositoryPort,
  ) {}
  async execute(
    command: UpdateServiceCheckResultCommand,
  ): Promise<ServiceCheckResultEntity> {
    try {
      let serviceCheckResult: ServiceCheckResultEntity;
      await this.repo.transaction(async () => {
        serviceCheckResult = await this.repo.findOneById(
          command.serviceCheckResultId,
        );
        serviceCheckResult.update(command);
        this.repo.save(serviceCheckResult);
      });
      return serviceCheckResult;
    } catch (error) {
      this.logger.error(
        'UpdateServiceCheckResultService.execute encountered an error',
        error,
      );
    }
  }
}
