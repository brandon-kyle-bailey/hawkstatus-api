import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AggregateID } from '@app/common/ddd/entity.base';
import { DeleteIncidentCommand } from 'src/interface/commands/incident/delete-incident.command';
import { IncidentRepository } from '../../ports/incident/incident.repository';
import { IncidentRepositoryPort } from '../../ports/incident/incident.repository.port';

@CommandHandler(DeleteIncidentCommand)
export class DeleteIncidentService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(IncidentRepository)
    protected readonly repo: IncidentRepositoryPort,
  ) {}
  async execute(command: DeleteIncidentCommand): Promise<AggregateID> {
    try {
      await this.repo.transaction(async () => {
        const incident = await this.repo.findOneById(command.id);
        incident.delete();
        await this.repo.delete(incident);
      });
      return command.id;
    } catch (error) {
      this.logger.error(
        'DeleteIncidentService.execute encountered an error',
        error,
      );
    }
  }
}
