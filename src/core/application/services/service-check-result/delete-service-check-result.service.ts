import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AggregateID } from '@app/common/ddd/entity.base';
import { DeleteServiceCheckResultCommand } from 'src/interface/commands/service-check-result/delete-service-check-result.command';
import { ServiceCheckResultRepository } from '../../ports/service-check-result/service-check-result.repository';
import { ServiceCheckResultRepositoryPort } from '../../ports/service-check-result/service-check-result.repository.port';

@CommandHandler(DeleteServiceCheckResultCommand)
export class DeleteServiceCheckResultService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ServiceCheckResultRepository)
    protected readonly repo: ServiceCheckResultRepositoryPort,
  ) {}
  async execute(
    command: DeleteServiceCheckResultCommand,
  ): Promise<AggregateID> {
    try {
      await this.repo.transaction(async () => {
        const serviceCheckResult = await this.repo.findOneById(command.id);
        serviceCheckResult.delete();
        await this.repo.delete(serviceCheckResult);
      });
      return command.id;
    } catch (error) {
      this.logger.error(
        'DeleteServiceCheckResultService.execute encountered an error',
        error,
      );
    }
  }
}
