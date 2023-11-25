import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ServiceCheckResultEntity } from 'src/core/domain/entities/service-check-result.entity';
import { CreateServiceCheckResultCommand } from 'src/interface/commands/service-check-result/create-service-check-result.command';
import { ServiceCheckResultRepository } from '../../ports/service-check-result/service-check-result.repository';
import { ServiceCheckResultRepositoryPort } from '../../ports/service-check-result/service-check-result.repository.port';

@CommandHandler(CreateServiceCheckResultCommand)
export class CreateServiceCheckResultService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ServiceCheckResultRepository)
    protected readonly repo: ServiceCheckResultRepositoryPort,
  ) {}
  async execute(
    command: CreateServiceCheckResultCommand,
  ): Promise<ServiceCheckResultEntity> {
    try {
      const serviceCheckResult = ServiceCheckResultEntity.create({
        serviceCheckId: command.serviceCheckId,
        status: command.status,
        duration: command.duration,
        response: command.response,
      });
      await this.repo.transaction(async () => {
        this.repo.insert(serviceCheckResult);
      });
      return serviceCheckResult;
    } catch (error) {
      this.logger.error(
        'CreateServiceCheckResultService.execute encountered an error',
        error,
      );
    }
  }
}
