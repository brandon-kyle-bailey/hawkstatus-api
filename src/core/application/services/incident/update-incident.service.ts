import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IncidentEntity } from 'src/core/domain/entities/incident.entity';
import { UpdateIncidentCommand } from 'src/interface/commands/incident/update-incident.command';
import { IncidentRepository } from '../../ports/incident/incident.repository';
import { IncidentRepositoryPort } from '../../ports/incident/incident.repository.port';

@CommandHandler(UpdateIncidentCommand)
export class UpdateIncidentService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(IncidentRepository)
    protected readonly repo: IncidentRepositoryPort,
  ) {}
  async execute(command: UpdateIncidentCommand): Promise<IncidentEntity> {
    try {
      let incident: IncidentEntity;
      await this.repo.transaction(async () => {
        incident = await this.repo.findOneById(command.incidentId);
        incident.update(command);
        this.repo.save(incident);
      });
      return incident;
    } catch (error) {
      this.logger.error(
        'UpdateIncidentService.execute encountered an error',
        error,
      );
    }
  }
}
