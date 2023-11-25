import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IncidentEntity } from 'src/core/domain/entities/incident.entity';
import { CreateIncidentCommand } from 'src/interface/commands/incident/create-incident.command';
import { IncidentRepository } from '../../ports/incident/incident.repository';
import { IncidentRepositoryPort } from '../../ports/incident/incident.repository.port';

@CommandHandler(CreateIncidentCommand)
export class CreateIncidentService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(IncidentRepository)
    protected readonly repo: IncidentRepositoryPort,
  ) {}
  async execute(command: CreateIncidentCommand): Promise<IncidentEntity> {
    try {
      const incident = IncidentEntity.create({
        serviceCheckId: command.serviceCheckId,
        status: command.status,
      });
      await this.repo.transaction(async () => {
        this.repo.insert(incident);
      });
      return incident;
    } catch (error) {
      this.logger.error(
        'CreateIncidentService.execute encountered an error',
        error,
      );
    }
  }
}
