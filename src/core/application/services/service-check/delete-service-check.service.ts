import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AggregateID } from '@app/common/ddd/entity.base';
import { DeleteServiceCheckCommand } from 'src/interface/commands/service-check/delete-service-check.command';
import { ServiceCheckRepository } from '../../ports/service-check/service-check.repository';
import { ServiceCheckRepositoryPort } from '../../ports/service-check/service-check.repository.port';

@CommandHandler(DeleteServiceCheckCommand)
export class DeleteServiceCheckService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ServiceCheckRepository)
    protected readonly repo: ServiceCheckRepositoryPort,
  ) {}
  async execute(command: DeleteServiceCheckCommand): Promise<AggregateID> {
    try {
      await this.repo.transaction(async () => {
        const serviceCheck = await this.repo.findOneById(command.id);
        serviceCheck.delete();
        await this.repo.delete(serviceCheck);
      });
      return command.id;
    } catch (error) {
      this.logger.error(
        'DeleteServiceCheckService.execute encountered an error',
        error,
      );
    }
  }
}
